'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import classes from './ImagePreview.module.scss';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';
import default_avatar from "@/../public/common/default-avatar.png";

interface ImagePreviewProps {
  imageFile?: File | null;
  currentImage?: string | null;
  onFileSelect: (file: File | null) => void;
}

export const ImagePreview = ({ imageFile, currentImage, onFileSelect }: ImagePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create preview URL when file is selected
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    } else {
      setPreviewUrl(null);
      onFileSelect(null);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Determine which image to show
  const displayImage = previewUrl || (imageFile ? URL.createObjectURL(imageFile) : null) || getImageUrl(currentImage);

  return (
    <div className={classes.image_preview}>
      <div className={classes.image_preview_container}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={classes.image_preview_hidden_input}
        />

        {displayImage ? (
          <>
            <div className={classes.image_preview_image}>
              <Image
                src={displayImage ?? default_avatar.src}
                alt="Profile preview"
                width={120}
                height={120}
                className={classes.image_preview_img}
              />
              {/* Overlay for better UX */}
              <div
                className={classes.image_preview_overlay}
                onClick={handleClick}
              >
                <Upload size={24} />
                <span>Change</span>
              </div>
            </div>
            <button
              type="button"
              className={classes.image_preview_remove_button}
              onClick={handleRemoveImage}
              title="Remove image"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div
            className={classes.image_preview_placeholder}
            onClick={handleClick}
          >
            <Camera size={32} />
            <span>Upload Photo</span>
          </div>
        )}
      </div>
    </div>
  );
};
