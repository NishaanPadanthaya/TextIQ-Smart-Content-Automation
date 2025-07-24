# TextIQ - AI-Driven Content Enhancement Platform

A versatile AI-driven platform designed to enhance your productivity with intuitive text transformation, interactive Q&A, and smart content exports—all in one place.

## ✨ Core Features

### 🎯 Tone & Style Rewriter
- Transform input text into the tone you need—formal, casual, persuasive, academic, or friendly
- Great for enhancing emails, essays, and business communication
- Additional instructions support for custom transformations

### 💬 Interactive Q&A Assistant
- Upload PDF/DOCX files or paste content directly
- Ask targeted questions like "What's the main argument?" or "Can you explain this point?"
- Provides clear, contextual answers with conversation history
- Visual indicators for file-based vs text-based responses

### 📊 AI-Powered Presentation Generator
- Convert input text directly into polished PowerPoint presentations (PPTX)
- Customizable slide count (1-20 slides) with professional layouts
- Includes speaker notes and consistent formatting
- Direct download functionality

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications
- React Dropzone for file uploads
- Lucide React for icons

**Backend:**
- FastAPI with async support
- Gemini Flash 2.5 integration
- File processing (PDF, DOCX, TXT)
- PowerPoint generation with python-pptx
- CORS middleware and comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+
- **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd TextIQ
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your Gemini API key
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start Backend** (Terminal 1)
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

2. **Start Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```

3. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
TextIQ/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components (Header, Sidebar)
│   │   ├── pages/          # Feature pages (Dashboard, TextTransform, etc.)
│   │   ├── services/       # API integration services
│   │   └── App.jsx         # Main application component
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # TailwindCSS configuration
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/routes/     # API endpoint modules
│   │   ├── core/           # Configuration and settings
│   │   ├── models/         # Pydantic data models
│   │   └── services/       # Business logic (Gemini, File, Presentation)
│   ├── uploads/            # File upload directory (auto-created)
│   ├── main.py            # FastAPI application entry point
│   └── requirements.txt   # Python dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```






