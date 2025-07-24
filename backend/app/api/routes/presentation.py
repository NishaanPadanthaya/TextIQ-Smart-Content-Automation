from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.models.schemas import PresentationRequest, PresentationResponse
from app.services.gemini_service import gemini_service
from app.services.presentation_service import presentation_service
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate-presentation", response_model=PresentationResponse)
async def generate_presentation(request: PresentationRequest):
    """Generate PowerPoint presentation from text"""
    try:
        logger.info(f"Generating presentation with {request.slide_count} slides")
        
        # Validate input
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if request.slide_count < 1 or request.slide_count > 20:
            raise HTTPException(status_code=400, detail="Slide count must be between 1 and 20")
        
        # Generate presentation content using Gemini
        presentation_data = await gemini_service.generate_presentation_content(
            text=request.text,
            title=request.title,
            slide_count=request.slide_count
        )
        
        # Create PowerPoint file
        filename = f"{request.title or 'presentation'}_{presentation_data.get('title', 'generated').replace(' ', '_').lower()}"
        file_path = presentation_service.create_presentation(
            presentation_data=presentation_data,
            filename=filename
        )
        
        # Get presentation info
        pres_info = presentation_service.get_presentation_info(file_path)
        
        return PresentationResponse(
            file_path=file_path,
            slide_count=pres_info.get("slide_count", request.slide_count),
            title=presentation_data.get("title", request.title or "Generated Presentation"),
            success=True
        )
        
    except Exception as e:
        logger.error(f"Error generating presentation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Presentation generation failed: {str(e)}")

@router.get("/download-presentation/{filename}")
async def download_presentation(filename: str):
    """Download generated presentation file"""
    try:
        # Construct file path
        presentations_dir = os.path.join("uploads", "presentations")
        file_path = os.path.join(presentations_dir, filename)
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Presentation file not found")
        
        # Return file for download
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading presentation: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to download presentation")

@router.get("/presentation-info/{filename}")
async def get_presentation_info(filename: str):
    """Get information about a generated presentation"""
    try:
        presentations_dir = os.path.join("uploads", "presentations")
        file_path = os.path.join(presentations_dir, filename)
        
        info = presentation_service.get_presentation_info(file_path)
        
        if not info.get("exists"):
            raise HTTPException(status_code=404, detail="Presentation not found")
        
        return info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting presentation info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get presentation info")
