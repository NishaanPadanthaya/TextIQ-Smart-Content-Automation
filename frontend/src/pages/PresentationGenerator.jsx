import React, { useState } from 'react';
import { Presentation, Download, RefreshCw, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { presentationAPI } from '../services/api';

const PresentationGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPresentation, setGeneratedPresentation] = useState(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter content for the presentation');
      return;
    }

    setIsLoading(true);
    try {
      const response = await presentationAPI.generatePresentation(
        inputText,
        title || null,
        slideCount,
        includeSpeakerNotes
      );

      setGeneratedPresentation(response);
      toast.success('Presentation generated successfully!');
    } catch (error) {
      console.error('Presentation generation failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate presentation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedPresentation) return;

    try {
      // Extract filename from file_path (handle both forward and backward slashes)
      const filename = generatedPresentation.file_path.split(/[/\\]/).pop();
      console.log('Downloading file:', filename);

      const blob = await presentationAPI.downloadPresentation(filename);

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Presentation downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to download presentation');
    }
  };

  const handleReset = () => {
    setInputText('');
    setTitle('');
    setSlideCount(5);
    setIncludeSpeakerNotes(true);
    setGeneratedPresentation(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Presentation className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Presentation Generator</h1>
        </div>
        <p className="text-gray-600">
          Convert your text into polished PowerPoint presentations with professional layouts and speaker notes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Input</h2>
            
            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presentation Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter presentation title..."
                className="input-field"
                disabled={isLoading}
              />
            </div>

            {/* Content Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter the content you want to convert into a presentation..."
                className="input-field h-64 resize-none"
                disabled={isLoading}
              />
              <div className="mt-2 text-sm text-gray-500">
                {inputText.length} characters
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Presentation Settings</h3>
            
            {/* Slide Count */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Slides
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isLoading}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1</span>
                <span className="font-medium">{slideCount} slides</span>
                <span>20</span>
              </div>
            </div>

            {/* Speaker Notes */}
            <div className="mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeSpeakerNotes}
                  onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-gray-700">
                  Include Speaker Notes
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-7">
                Add detailed speaker notes for each slide
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !inputText.trim()}
                className="btn-primary flex items-center space-x-2 flex-1"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Presentation className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Generating...' : 'Generate Presentation'}</span>
              </button>
              
              <button
                onClick={handleReset}
                className="btn-secondary"
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Presentation</h2>
            
            {generatedPresentation ? (
              <div className="space-y-4">
                {/* Presentation Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Presentation Ready!
                    </span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Title:</strong> {generatedPresentation.title}</p>
                    <p><strong>Slides:</strong> {generatedPresentation.slide_count}</p>
                    <p><strong>Speaker Notes:</strong> {includeSpeakerNotes ? 'Included' : 'Not included'}</p>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PowerPoint (.pptx)</span>
                </button>

                {/* Preview Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">What's Included:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Professional slide layouts</li>
                    <li>• Title slide with branding</li>
                    <li>• Content slides with bullet points</li>
                    {includeSpeakerNotes && <li>• Detailed speaker notes</li>}
                    <li>• Consistent formatting and styling</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <Presentation className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">No presentation generated yet</p>
                <p className="text-sm">
                  Enter your content and click "Generate Presentation" to create a PowerPoint file
                </p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Presentations</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Provide well-structured content with clear main points</span>
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Include examples and supporting details for richer slides</span>
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Use 5-10 slides for optimal presentation length</span>
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Enable speaker notes for detailed presentation guidance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationGenerator;
