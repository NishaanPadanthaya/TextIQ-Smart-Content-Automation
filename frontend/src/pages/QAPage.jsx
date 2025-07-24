import React, { useState, useCallback } from 'react';
import { MessageCircle, Send, Copy, RefreshCw, FileText, Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { qaAPI, fileUploadAPI } from '../services/api';

const QAPage = () => {
  const [contextText, setContextText] = useState('');
  const [question, setQuestion] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (!contextText.trim() && !selectedFileId) {
      toast.error('Please provide context text or select an uploaded file');
      return;
    }

    console.log('Q&A Debug:', {
      question: question.trim(),
      contextText: contextText.trim(),
      selectedFileId,
      hasContext: !!(contextText.trim() || selectedFileId)
    });

    setIsLoading(true);
    const currentQuestion = question;
    setQuestion(''); // Clear input immediately

    try {
      // If a file is selected, use empty string for text and pass the file ID
      // The backend will use the file content stored for that ID
      const textToSend = selectedFileId ? '' : contextText;

      const response = await qaAPI.askQuestion(
        textToSend,
        currentQuestion,
        selectedFileId || null
      );

      const newConversation = {
        id: Date.now(),
        question: currentQuestion,
        answer: response.answer,
        context_used: response.context_used,
        timestamp: new Date().toLocaleTimeString(),
        source: selectedFileId ? 'file' : 'text'
      };

      setConversations(prev => [newConversation, ...prev]);
      toast.success('Question answered successfully!');
    } catch (error) {
      console.error('Q&A failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to get answer');
      setQuestion(currentQuestion); // Restore question on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const clearConversations = () => {
    setConversations([]);
    toast.success('Conversation history cleared');
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  }, []);

  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      const response = await fileUploadAPI.uploadFile(file);
      const newFile = {
        ...response,
        originalName: file.name,
        uploadTime: new Date().toLocaleString(),
      };
      setUploadedFiles(prev => [newFile, ...prev]);

      // Store the extracted text for Q&A
      if (response.extracted_text && response.file_id) {
        try {
          await fetch('http://localhost:8000/api/v1/store-file-content/' + response.file_id, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: response.extracted_text })
          });
        } catch (storeError) {
          console.warn('Failed to store file content for Q&A:', storeError);
        }
      }

      toast.success(`${file.name} uploaded and ready for Q&A!`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.detail || `Failed to upload ${file.name}`);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await fileUploadAPI.deleteFile(fileId);
      setUploadedFiles(prev => prev.filter(f => f.file_id !== fileId));
      if (selectedFileId === fileId) {
        setSelectedFileId('');
      }
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete file');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    disabled: isUploading,
  });

  const suggestedQuestions = [
    "What is the main argument or thesis?",
    "Can you summarize the key points?",
    "What are the most important takeaways?",
    "Are there any specific examples mentioned?",
    "What conclusions can be drawn from this?",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Interactive Q&A Assistant</h1>
        </div>
        <p className="text-gray-600">
          Ask questions about your content and get intelligent, contextual answers powered by AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Context Input */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Context</h2>
            
            {/* File Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Uploaded File (Optional)
              </label>
              <select
                value={selectedFileId}
                onChange={(e) => setSelectedFileId(e.target.value)}
                className="input-field"
                disabled={isLoading}
              >
                <option value="">Select a file or use text below</option>
                {uploadedFiles.map((file) => (
                  <option key={file.file_id} value={file.file_id}>
                    {file.originalName || file.filename}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Context Text
              </label>
              <textarea
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                placeholder="Paste your content here for Q&A analysis..."
                className="input-field h-64 resize-none"
                disabled={isLoading}
              />
              <div className="mt-2 text-sm text-gray-500">
                {contextText.length} characters
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload PDF/DOCX Files</h3>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-4 ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />

              {isUploading ? (
                <div className="space-y-2">
                  <RefreshCw className="h-8 w-8 text-primary-600 mx-auto animate-spin" />
                  <p className="text-sm font-medium text-gray-900">Uploading...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  {isDragActive ? (
                    <p className="text-sm font-medium text-primary-600">
                      Drop the files here...
                    </p>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports PDF, DOCX, and TXT files
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                {uploadedFiles.map((file) => (
                  <div key={file.file_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.originalName || file.filename}</span>
                    </div>
                    <button
                      onClick={() => deleteFile(file.file_id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Questions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Questions</h3>
            <div className="space-y-2">
              {suggestedQuestions.map((suggestedQ, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(suggestedQ)}
                  className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {suggestedQ}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Q&A Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Input */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Ask a Question</h2>
              {selectedFileId && (
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  📄 File Selected - Ready for Q&A
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What would you like to know about the content?"
                className="input-field flex-1 h-20 resize-none"
                disabled={isLoading}
              />
              <button
                onClick={handleAskQuestion}
                disabled={isLoading || !question.trim() || (!contextText.trim() && !selectedFileId)}
                className="btn-primary px-6 h-20 flex items-center justify-center"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Conversation History */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Conversation History</h2>
              {conversations.length > 0 && (
                <button
                  onClick={clearConversations}
                  className="btn-secondary text-sm"
                >
                  Clear History
                </button>
              )}
            </div>

            <div className="space-y-6">
              {conversations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No questions asked yet. Start by asking a question about your content!</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div key={conv.id} className="border-l-4 border-primary-200 pl-4 py-2">
                    {/* Question */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-primary-600">Question</span>
                          {conv.source === 'file' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              📄 From File
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{conv.timestamp}</span>
                      </div>
                      <p className="text-gray-900 bg-primary-50 p-3 rounded-lg">
                        {conv.question}
                      </p>
                    </div>

                    {/* Answer */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-600">Answer</span>
                        <button
                          onClick={() => handleCopy(conv.answer)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          title="Copy answer"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-gray-900 bg-green-50 p-3 rounded-lg whitespace-pre-wrap">
                        {conv.answer}
                      </div>
                    </div>

                    {/* Context Preview */}
                    {conv.context_used && (
                      <div className="mt-3">
                        <span className="text-xs font-medium text-gray-500">Context used:</span>
                        <p className="text-xs text-gray-400 mt-1 italic">
                          "{conv.context_used}"
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAPage;
