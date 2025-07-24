import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://textiq-smart-content-automation.onrender.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Text transformation API
export const textTransformAPI = {
  transformText: async (text, tone, additionalInstructions = null) => {
    const response = await api.post('/transform-text', {
      text,
      tone,
      additional_instructions: additionalInstructions,
    });
    return response.data;
  },

  getSupportedTones: async () => {
    const response = await api.get('/supported-tones');
    return response.data;
  },
};

// Q&A API
export const qaAPI = {
  askQuestion: async (text, question, fileId = null) => {
    const response = await api.post('/ask-question', {
      text,
      question,
      file_id: fileId,
    });
    return response.data;
  },

  getFileContent: async (fileId) => {
    const response = await api.get(`/file-content/${fileId}`);
    return response.data;
  },
};

// Presentation API
export const presentationAPI = {
  generatePresentation: async (text, title = null, slideCount = 5, includeSpeakerNotes = true) => {
    const response = await api.post('/generate-presentation', {
      text,
      title,
      slide_count: slideCount,
      include_speaker_notes: includeSpeakerNotes,
    });
    return response.data;
  },

  downloadPresentation: async (filename) => {
    const response = await api.get(`/download-presentation/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getPresentationInfo: async (filename) => {
    const response = await api.get(`/presentation-info/${filename}`);
    return response.data;
  },
};

// File upload API
export const fileUploadAPI = {
  uploadFile: async (file, onUploadProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  getFileInfo: async (fileId) => {
    const response = await api.get(`/file-info/${fileId}`);
    return response.data;
  },

  deleteFile: async (fileId) => {
    const response = await api.delete(`/delete-file/${fileId}`);
    return response.data;
  },

  getSupportedFileTypes: async () => {
    const response = await api.get('/supported-file-types');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
