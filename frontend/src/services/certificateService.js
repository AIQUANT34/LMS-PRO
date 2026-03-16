import { apiService } from './apiService';

export const certificateService = {
  // Get user certificates
  getMyCertificates: async () => {
    return await apiService.get('/certificates/my');
  },

  // Get certificate by ID
  getCertificate: async (certificateId) => {
    return await apiService.get(`/certificates/${certificateId}`);
  },

  // Generate certificate for completed course
  generateCertificate: async (courseId) => {
    return await apiService.post(`/learning/certificate/${courseId}`);
  },

  // Verify certificate
  verifyCertificate: async (reference) => {
    return await apiService.get(`/certificates/verify/${reference}`);
  },

  // Download certificate
  downloadCertificate: async (certificateId) => {
    return await apiService.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob'
    });
  },

  // Share certificate
  shareCertificate: async (certificateId, shareData) => {
    return await apiService.post(`/certificates/${certificateId}/share`, shareData);
  },

  // Approve certificate (for trainers/admins)
  approveCertificate: async (certificateId) => {
    return await apiService.patch(`/certificates/approve/${certificateId}`);
  },

  // Get certificate analytics
  getCertificateAnalytics: async () => {
    return await apiService.get('/certificates/analytics');
  }
};
