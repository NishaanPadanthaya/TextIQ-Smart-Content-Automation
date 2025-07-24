from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class ToneType(str, Enum):
    FORMAL = "formal"
    CASUAL = "casual"
    PERSUASIVE = "persuasive"
    ACADEMIC = "academic"
    FRIENDLY = "friendly"

class TextTransformRequest(BaseModel):
    text: str = Field(..., description="Text to transform")
    tone: ToneType = Field(..., description="Target tone for transformation")
    additional_instructions: Optional[str] = Field(None, description="Additional transformation instructions")

class TextTransformResponse(BaseModel):
    original_text: str
    transformed_text: str
    tone: ToneType
    success: bool = True
    message: Optional[str] = None

class QARequest(BaseModel):
    text: str = Field(..., description="Context text for Q&A")
    question: str = Field(..., description="Question to ask about the text")
    file_id: Optional[str] = Field(None, description="Optional file ID if question is about uploaded file")

class QAResponse(BaseModel):
    question: str
    answer: str
    context_used: str
    success: bool = True
    message: Optional[str] = None

class PresentationRequest(BaseModel):
    text: str = Field(..., description="Text to convert to presentation")
    title: Optional[str] = Field(None, description="Presentation title")
    slide_count: Optional[int] = Field(5, description="Target number of slides", ge=1, le=20)
    include_speaker_notes: bool = Field(True, description="Include speaker notes")

class PresentationResponse(BaseModel):
    file_path: str
    slide_count: int
    title: str
    success: bool = True
    message: Optional[str] = None

class FileUploadResponse(BaseModel):
    file_id: str
    filename: str
    file_type: str
    file_size: int
    extracted_text: Optional[str] = None
    success: bool = True
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None
