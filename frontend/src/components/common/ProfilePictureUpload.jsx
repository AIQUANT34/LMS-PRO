import React, { useState, useRef } from 'react';
import { CameraIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

const ProfilePictureUpload = ({ 
  currentImage, 
  onImageUpdate, 
  size = 'medium', 
  showUploadButton = true,
  className = '',
  userId 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40'
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload image
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await apiService.post(
        API_ENDPOINTS.USERS.UPLOAD_PROFILE_PICTURE(userId), 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Profile picture updated successfully!');
      if (onImageUpdate) {
        onImageUpdate(response.profilePictureUrl);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
      // Reset to original image on error
      setPreviewImage(currentImage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (showUploadButton) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer group transition-all duration-200 ${showUploadButton ? 'hover:opacity-80' : ''}`}
        onClick={handleClick}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <UserCircleIcon className="w-full h-full text-gray-400" />
          </div>
        )}
        
        {showUploadButton && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <CameraIcon className="w-8 h-8 text-white" />
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {showUploadButton && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      )}

      {showUploadButton && (
        <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-white">
          <CameraIcon className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
