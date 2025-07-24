from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.models.schemas import FileUploadResponse
from app.services.file_service import file_service
from app.core.config import settings
import logging
import os
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

async def validate_file(file: UploadFile = File(...)):
    """Validate uploaded file"""
    # Check file size
    if file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
        )
    
    # Check file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in settings.SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Supported types: {', '.join(settings.SUPPORTED_FILE_TYPES)}"
        )
    
    return file

@router.post("/upload-file", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = Depends(validate_file)):
    """Upload and process a file for text extraction"""
    try:
        logger.info(f"Processing file upload: {file.filename}")
        
        # Save uploaded file
        file_id, file_path = await file_service.save_uploaded_file(file)
        
        # Extract text from file
        try:
            extracted_text = file_service.extract_text(file_path)
        except Exception as e:
            logger.error(f"Text extraction failed: {str(e)}")
            # Clean up file if text extraction fails
            file_service.delete_file(file_path)
            raise HTTPException(status_code=422, detail=f"Failed to extract text: {str(e)}")
        
        # Get file info
        file_info = file_service.get_file_info(file_path)
        
        # Store extracted text for Q&A (call internal endpoint)
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"http://localhost:8000/api/v1/store-file-content/{file_id}",
                    json={"text": extracted_text}
                )
        except Exception as e:
            logger.warning(f"Failed to store file content for Q&A: {str(e)}")
        
        return FileUploadResponse(
            file_id=file_id,
            filename=file.filename,
            file_type=file_info["extension"],
            file_size=file_info["size"],
            extracted_text=extracted_text[:1000] + "..." if len(extracted_text) > 1000 else extracted_text,
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in file upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@router.get("/file-info/{file_id}")
async def get_file_info(file_id: str):
    """Get information about an uploaded file"""
    try:
        # Find file by ID (in a real app, you'd store this mapping in a database)
        upload_dir = settings.UPLOAD_DIR
        
        # Look for file with this ID
        for filename in os.listdir(upload_dir):
            if filename.startswith(file_id):
                file_path = os.path.join(upload_dir, filename)
                file_info = file_service.get_file_info(file_path)
                
                if file_info["exists"]:
                    return {
                        "file_id": file_id,
                        "filename": filename,
                        "file_type": file_info["extension"],
                        "file_size": file_info["size"],
                        "exists": True
                    }
        
        raise HTTPException(status_code=404, detail="File not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting file info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get file info")

@router.delete("/delete-file/{file_id}")
async def delete_file(file_id: str):
    """Delete an uploaded file"""
    try:
        upload_dir = settings.UPLOAD_DIR
        
        # Find and delete file
        for filename in os.listdir(upload_dir):
            if filename.startswith(file_id):
                file_path = os.path.join(upload_dir, filename)
                success = file_service.delete_file(file_path)
                
                if success:
                    return {"success": True, "message": "File deleted successfully"}
                else:
                    raise HTTPException(status_code=500, detail="Failed to delete file")
        
        raise HTTPException(status_code=404, detail="File not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete file")

@router.get("/supported-file-types")
async def get_supported_file_types():
    """Get list of supported file types"""
    return {
        "supported_types": [
            {
                "extension": ".pdf",
                "description": "PDF documents",
                "mime_type": "application/pdf"
            },
            {
                "extension": ".docx",
                "description": "Microsoft Word documents",
                "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            },
            {
                "extension": ".txt",
                "description": "Plain text files",
                "mime_type": "text/plain"
            }
        ],
        "max_file_size": settings.MAX_FILE_SIZE,
        "max_file_size_mb": settings.MAX_FILE_SIZE / 1024 / 1024
    }
