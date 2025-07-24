import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Trash2, Eye, MessageCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { fileUploadAPI } from '../services/api';

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadSupportedTypes();
  }, []);

  const loadSupportedTypes = async () => {
    try {
      const response = await fileUploadAPI.getSupportedFileTypes();
      setSupportedTypes(response.supported_types);
    } catch (error) {
      console.error('Failed to load supported types:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  }, []);

  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      const response = await fileUploadAPI.uploadFile(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // You could update a progress bar here
      });

      const newFile = {
        ...response,
        originalName: file.name,
        uploadTime: new Date().toLocaleString(),
      };

      setUploadedFiles(prev => [newFile, ...prev]);
      toast.success(`${file.name} uploaded successfully!`);
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
      if (selectedFile?.file_id === fileId) {
        setSelectedFile(null);
      }
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete file');
    }
  };

  const viewFileContent = (file) => {
    setSelectedFile(file);
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Smart File Processing</h1>
        </div>
        <p className="text-gray-600">
          Upload PDF, DOCX, or TXT files to extract text and interact with content using AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Dropzone */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              
              {isUploading ? (
                <div className="space-y-4">
                  <RefreshCw className="h-12 w-12 text-primary-600 mx-auto animate-spin" />
                  <p className="text-lg font-medium text-gray-900">Uploading...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  {isDragActive ? (
                    <p className="text-lg font-medium text-primary-600">
                      Drop the files here...
                    </p>
                  ) : (
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supports PDF, DOCX, and TXT files
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Supported File Types */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported File Types</h3>
            <div className="space-y-3">
              {supportedTypes.map((type, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <File className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{type.extension.toUpperCase()}</p>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {supportedTypes.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                Maximum file size: {(supportedTypes[0]?.max_file_size_mb || 10)} MB
              </div>
            )}
          </div>
        </div>

        {/* Files List and Preview */}
        <div className="space-y-6">
          {/* Uploaded Files */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Files</h2>
            
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No files uploaded yet</p>
                <p className="text-sm mt-1">Upload files to see them here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.file_id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedFile?.file_id === file.file_id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {file.originalName || file.filename}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.file_size)} • {file.uploadTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewFileContent(file)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                          title="View content"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.file_id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Content Preview */}
          {selectedFile && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Content Preview
                </h3>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-primary-600" />
                  <span className="text-sm text-primary-600">
                    Use in Q&A
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedFile.extracted_text || 'No text content available'}
                </p>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                File ID: {selectedFile.file_id} • 
                Type: {selectedFile.file_type} • 
                Size: {formatFileSize(selectedFile.file_size)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
