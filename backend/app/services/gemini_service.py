import google.generativeai as genai
from typing import Optional
import logging
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is required")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def transform_text(self, text: str, tone: str, additional_instructions: Optional[str] = None) -> str:
        """Transform text to specified tone"""
        try:
            tone_prompts = {
                "formal": "Rewrite the following text in a formal, professional tone suitable for business communication:",
                "casual": "Rewrite the following text in a casual, conversational tone that's friendly and approachable:",
                "persuasive": "Rewrite the following text in a persuasive tone that convinces and motivates the reader:",
                "academic": "Rewrite the following text in an academic tone suitable for scholarly writing:",
                "friendly": "Rewrite the following text in a warm, friendly tone that builds rapport:"
            }
            
            base_prompt = tone_prompts.get(tone, tone_prompts["formal"])
            
            if additional_instructions:
                prompt = f"{base_prompt}\n\nAdditional instructions: {additional_instructions}\n\nText to transform:\n{text}"
            else:
                prompt = f"{base_prompt}\n\nText to transform:\n{text}"
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error in text transformation: {str(e)}")
            raise Exception(f"Failed to transform text: {str(e)}")
    
    async def answer_question(self, context: str, question: str) -> str:
        """Answer question based on provided context"""
        try:
            prompt = f"""Based on the following context, please answer the question clearly and accurately.

Context:
{context}

Question: {question}

Please provide a comprehensive answer based only on the information provided in the context. If the context doesn't contain enough information to answer the question, please state that clearly."""

            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error in Q&A: {str(e)}")
            raise Exception(f"Failed to answer question: {str(e)}")
    
    async def generate_presentation_content(self, text: str, title: Optional[str] = None, slide_count: int = 5) -> dict:
        """Generate presentation content structure"""
        try:
            prompt = f"""Convert the following text into a structured presentation with {slide_count} slides.

Text to convert:
{text}

Please provide the output in the following JSON format:
{{
    "title": "Presentation Title",
    "slides": [
        {{
            "slide_number": 1,
            "title": "Slide Title",
            "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
            "speaker_notes": "Detailed speaker notes for this slide"
        }}
    ]
}}

Make sure each slide has:
- A clear, descriptive title
- 3-5 bullet points with key information
- Comprehensive speaker notes

{f'Use this title for the presentation: {title}' if title else 'Create an appropriate title based on the content.'}"""

            response = self.model.generate_content(prompt)
            
            # Try to extract JSON from response
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            import json
            try:
                return json.loads(response_text)
            except json.JSONDecodeError:
                # Fallback: create a simple structure
                return {
                    "title": title or "Generated Presentation",
                    "slides": [
                        {
                            "slide_number": 1,
                            "title": "Overview",
                            "content": [text[:200] + "..." if len(text) > 200 else text],
                            "speaker_notes": "This slide provides an overview of the main content."
                        }
                    ]
                }
            
        except Exception as e:
            logger.error(f"Error in presentation generation: {str(e)}")
            raise Exception(f"Failed to generate presentation: {str(e)}")

# Global service instance
gemini_service = GeminiService()
