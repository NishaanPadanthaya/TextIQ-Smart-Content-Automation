from fastapi import APIRouter, HTTPException
from app.models.schemas import TextTransformRequest, TextTransformResponse, ErrorResponse
from app.services.gemini_service import gemini_service
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/transform-text", response_model=TextTransformResponse)
async def transform_text(request: TextTransformRequest):
    """Transform text to specified tone and style"""
    try:
        logger.info(f"Transforming text to {request.tone} tone")
        
        # Validate input
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Transform text using Gemini
        transformed_text = await gemini_service.transform_text(
            text=request.text,
            tone=request.tone.value,
            additional_instructions=request.additional_instructions
        )
        
        return TextTransformResponse(
            original_text=request.text,
            transformed_text=transformed_text,
            tone=request.tone,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Error in text transformation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text transformation failed: {str(e)}")

@router.get("/supported-tones")
async def get_supported_tones():
    """Get list of supported tone transformations"""
    return {
        "tones": [
            {
                "value": "formal",
                "label": "Formal",
                "description": "Professional, business-appropriate tone"
            },
            {
                "value": "casual",
                "label": "Casual",
                "description": "Conversational, friendly tone"
            },
            {
                "value": "persuasive",
                "label": "Persuasive",
                "description": "Convincing, motivational tone"
            },
            {
                "value": "academic",
                "label": "Academic",
                "description": "Scholarly, research-oriented tone"
            },
            {
                "value": "friendly",
                "label": "Friendly",
                "description": "Warm, approachable tone"
            }
        ]
    }
