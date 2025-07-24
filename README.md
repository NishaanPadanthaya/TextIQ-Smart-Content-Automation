# TextIQ - AI-Driven Text Enhancement Platform

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

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Getting Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## 🌐 API Endpoints

### Text Transformation
- `POST /api/v1/transform-text` - Transform text tone/style
- `GET /api/v1/supported-tones` - Get available tones

### Q&A System
- `POST /api/v1/ask-question` - Ask questions about content
- `POST /api/v1/store-file-content/{file_id}` - Store file content
- `GET /api/v1/file-content/{file_id}` - Get stored file content

### Presentation Generation
- `POST /api/v1/generate-presentation` - Generate PowerPoint
- `GET /api/v1/download-presentation/{filename}` - Download presentation
- `GET /api/v1/presentation-info/{filename}` - Get presentation info

### File Upload
- `POST /api/v1/upload-file` - Upload and process files
- `GET /api/v1/supported-file-types` - Get supported formats
- `DELETE /api/v1/delete-file/{file_id}` - Delete uploaded file

## 🎨 Features Overview

### Dashboard
- Feature overview with interactive cards
- Usage statistics and quick start guide
- Navigation to all main features

### Text Transform
- Real-time text transformation interface
- Multiple tone options with descriptions
- Character count and comparison tools
- Copy and download functionality

### Q&A Assistant
- File upload with drag & drop support
- Text input for direct content
- Conversation history with timestamps
- Visual indicators for response sources

### Presentation Generator
- Content input with title customization
- Slide count slider (1-20 slides)
- Speaker notes toggle option
- Professional PowerPoint output

## 🧪 Testing

### Backend Testing
```bash
cd backend
python test_api.py
```

### Manual Testing Checklist
- [ ] Text transformation with different tones
- [ ] File upload (PDF, DOCX) in Q&A
- [ ] Question answering with uploaded files
- [ ] Presentation generation and download
- [ ] Navigation between all pages

## 🚀 Deployment

### Backend Deployment
- Use `uvicorn main:app --host 0.0.0.0 --port 8000` for production
- Set environment variables in production environment
- Consider using Docker for containerization

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🔍 Troubleshooting

### Common Issues

**Gemini API Key Error**
- Ensure API key is correctly set in `backend/.env`
- Verify key has proper permissions in Google AI Studio

**File Upload Issues**
- Check file size limits (default 10MB)
- Ensure supported file types (.pdf, .docx, .txt)
- Verify backend is running and accessible

**CORS Errors**
- Update `CORS_ORIGINS` in `.env` if using different ports
- Restart backend after changing environment variables

**Dependencies Issues**
- Delete `node_modules` and run `npm install` again
- Recreate Python virtual environment if needed

### Logs and Debugging
- Backend logs appear in uvicorn terminal
- Frontend logs in browser console (F12)
- Check Network tab for API request/response details

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the API documentation at `http://localhost:8000/docs`
3. Check browser console and backend logs for error details

---

**Built with ❤️ using React, FastAPI, and Gemini AI**
