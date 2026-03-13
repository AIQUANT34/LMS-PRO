import apiService from './apiService';
import { API_ENDPOINTS } from '../config/api';

class UploadService {
  // Generate signed upload URL for S3
  async generateUploadUrl(fileName, fileType, fileSize, folder = 'uploads') {
    try {
      const response = await apiService.post(API_ENDPOINTS.UPLOAD.GENERATE_S3_URL, {
        fileName,
        fileType,
        fileSize,
        folder,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to generate upload URL: ${error.response?.data?.message || error.message}`);
    }
  }

  // Upload file directly to S3 using signed URL
  async uploadToS3(uploadUrl, file, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress && typeof onProgress === 'function') {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      // Handle timeout
      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'));
      });

      // Configure and send request
      xhr.timeout = 5 * 60 * 1000; // 5 minutes timeout
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  // Complete upload process: get signed URL and upload to S3
  async uploadFile(file, folder = 'uploads', onProgress) {
    try {
      // Step 1: Generate signed upload URL
      const { uploadUrl, fileUrl, key } = await this.generateUploadUrl(
        file.name,
        file.type,
        file.size,
        folder
      );

      // Step 2: Upload file to S3
      await this.uploadToS3(uploadUrl, file, onProgress);

      // Step 3: Return the public URL
      return {
        success: true,
        fileUrl,
        key,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, folder = 'uploads', onProgress) {
    const results = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await this.uploadFile(
          file, 
          folder, 
          (progress) => {
            // Calculate overall progress
            const overallProgress = ((i * 100) + progress) / totalFiles;
            if (onProgress) onProgress(Math.round(overallProgress));
          }
        );
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          fileName: file.name,
          error: error.message,
        });
      }
    }

    return results;
  }

  // Validate file before upload
  validateFile(file, allowedTypes = [], maxSize = 100 * 1024 * 1024) {
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.startsWith(type))) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
    }

    return true;
  }

  // Get file size in human readable format
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file extension
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  // Check if file is video
  isVideoFile(file) {
    return file.type.startsWith('video/');
  }

  // Check if file is image
  isImageFile(file) {
    return file.type.startsWith('image/');
  }

  // Check if file is PDF
  isPdfFile(file) {
    return file.type === 'application/pdf';
  }

  // Create preview for image files
  createImagePreview(file) {
    return new Promise((resolve, reject) => {
      if (!this.isImageFile(file)) {
        reject(new Error('File is not an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Create preview for video files
  createVideoPreview(file) {
    return new Promise((resolve, reject) => {
      if (!this.isVideoFile(file)) {
        reject(new Error('File is not a video'));
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        resolve(canvas.toDataURL());
      };
      
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  }
}

export default new UploadService();
