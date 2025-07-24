import React, { useState, useEffect } from 'react';
import { Type, Wand2, Copy, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { textTransformAPI } from '../services/api';

const TextTransform = () => {
  const [inputText, setInputText] = useState('');
  const [transformedText, setTransformedText] = useState('');
  const [selectedTone, setSelectedTone] = useState('formal');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [supportedTones, setSupportedTones] = useState([]);

  useEffect(() => {
    loadSupportedTones();
  }, []);

  const loadSupportedTones = async () => {
    try {
      const response = await textTransformAPI.getSupportedTones();
      setSupportedTones(response.tones);
    } catch (error) {
      console.error('Failed to load supported tones:', error);
      toast.error('Failed to load tone options');
    }
  };

  const handleTransform = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to transform');
      return;
    }

    setIsLoading(true);
    try {
      const response = await textTransformAPI.transformText(
        inputText,
        selectedTone,
        additionalInstructions || null
      );
      
      setTransformedText(response.transformed_text);
      toast.success('Text transformed successfully!');
    } catch (error) {
      console.error('Transformation failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to transform text');
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

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const handleReset = () => {
    setInputText('');
    setTransformedText('');
    setAdditionalInstructions('');
    setSelectedTone('formal');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Type className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Tone & Style Rewriter</h1>
        </div>
        <p className="text-gray-600">
          Transform your text into any tone or style. Perfect for emails, essays, and business communication.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Input Text</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter the text you want to transform..."
              className="input-field h-64 resize-none"
              disabled={isLoading}
            />
            <div className="mt-2 text-sm text-gray-500">
              {inputText.length} characters
            </div>
          </div>

          {/* Controls */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transformation Settings</h3>
            
            {/* Tone Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Tone
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="input-field"
                disabled={isLoading}
              >
                {supportedTones.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label} - {tone.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Instructions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Instructions (Optional)
              </label>
              <textarea
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="Any specific requirements or style preferences..."
                className="input-field h-20 resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleTransform}
                disabled={isLoading || !inputText.trim()}
                className="btn-primary flex items-center space-x-2 flex-1"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Transforming...' : 'Transform Text'}</span>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Transformed Text</h2>
              {transformedText && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopy(transformedText)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(transformedText, 'transformed-text.txt')}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download as file"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="min-h-64 p-4 bg-gray-50 rounded-lg border">
              {transformedText ? (
                <div className="whitespace-pre-wrap text-gray-900">
                  {transformedText}
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-20">
                  Transformed text will appear here...
                </div>
              )}
            </div>
            
            {transformedText && (
              <div className="mt-2 text-sm text-gray-500">
                {transformedText.length} characters
              </div>
            )}
          </div>

          {/* Comparison */}
          {transformedText && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Original:</span>
                  <span className="ml-2 text-gray-600">{inputText.length} chars</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Transformed:</span>
                  <span className="ml-2 text-gray-600">{transformedText.length} chars</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tone:</span>
                  <span className="ml-2 text-gray-600 capitalize">{selectedTone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Change:</span>
                  <span className={`ml-2 ${transformedText.length > inputText.length ? 'text-green-600' : 'text-red-600'}`}>
                    {transformedText.length > inputText.length ? '+' : ''}{transformedText.length - inputText.length} chars
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextTransform;
