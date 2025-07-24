from fastapi import APIRouter, HTTPException
from app.models.schemas import QARequest, QAResponse
from app.services.gemini_service import gemini_service
from app.services.file_service import file_service
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage for uploaded file content (in production, use a database)
file_content_cache = {}

@router.post("/ask-question", response_model=QAResponse)
async def ask_question(request: QARequest):
    """Ask a question about provided text or uploaded file"""
    try:
        logger.info(f"Processing Q&A request: {request.question[:50]}...")
        
        # Validate input
        if not request.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        context_text = ""
        
        # If file_id is provided, get text from uploaded file
        if request.file_id:
            if request.file_id in file_content_cache:
                context_text = file_content_cache[request.file_id]
            else:
                raise HTTPException(status_code=404, detail="File not found or text not extracted")
        else:
            # Use provided text as context
            if not request.text.strip():
                raise HTTPException(status_code=400, detail="Either text or file_id must be provided")
            context_text = request.text
        
        # Get answer from Gemini
        answer = await gemini_service.answer_question(
            context=context_text,
            question=request.question
        )
        
        return QAResponse(
            question=request.question,
            answer=answer,
            context_used=context_text[:200] + "..." if len(context_text) > 200 else context_text,
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in Q&A: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Q&A processing failed: {str(e)}")

@router.post("/store-file-content/{file_id}")
async def store_file_content(file_id: str, content: dict):
    """Store extracted file content for Q&A (internal endpoint)"""
    try:
        file_content_cache[file_id] = content.get("text", "")
        return {"success": True, "message": "Content stored successfully"}
    except Exception as e:
        logger.error(f"Error storing file content: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to store file content")

@router.get("/file-content/{file_id}")
async def get_file_content(file_id: str):
    """Get stored file content"""
    if file_id not in file_content_cache:
        raise HTTPException(status_code=404, detail="File content not found")
    
    return {
        "file_id": file_id,
        "content": file_content_cache[file_id][:500] + "..." if len(file_content_cache[file_id]) > 500 else file_content_cache[file_id],
        "full_length": len(file_content_cache[file_id])
    }
