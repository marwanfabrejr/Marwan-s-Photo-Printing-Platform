'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { Photo } from '@/types';
import toast from 'react-hot-toast';
import { useAOSRefresh } from '@/app/hooks/useAOSInit';

interface PhotoUploadProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  onImageClick: (photo: Photo) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({
  photos,
  onPhotosChange,
  onImageClick,
  maxPhotos = 5,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useAOSRefresh();

  const handleFileUpload = useCallback(
    (files: File[]) => {
      // Check for duplicates by name and size
      const existingFiles = new Set(
        photos.map((p) => `${p.name.toLowerCase()}-${p.size}`)
      );

      const uniqueFiles = files.filter((file) => {
        const fileKey = `${file.name.toLowerCase()}-${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`;
        return !existingFiles.has(fileKey);
      });

      const duplicateCount = files.length - uniqueFiles.length;
      if (duplicateCount > 0) {
        toast.error(
          `${duplicateCount} duplicate photo${
            duplicateCount > 1 ? 's' : ''
          } skipped`
        );
      }

      if (uniqueFiles.length + photos.length > maxPhotos) {
        toast.error(`You can only upload up to ${maxPhotos} photos`);
        return;
      }

      const newPhotos: Photo[] = uniqueFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        file: file,
        isExternal: false, // Mark as local file
      }));

      const updatedPhotos = [...photos, ...newPhotos].slice(0, maxPhotos);
      onPhotosChange(updatedPhotos);

      if (newPhotos.length > 0) {
        toast.success(
          `Added ${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''}`
        );
      }
    },
    [photos, onPhotosChange, maxPhotos]
  );

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFileUpload(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    handleFileUpload(files);
  };

  const removePhoto = (id: string) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== id);
    onPhotosChange(updatedPhotos);
    toast.success('Photo removed');
  };

  return (
    <div
      className='w-full max-w-sm sm:max-w-md mx-auto px-2'
      data-aos='fade-up'
    >
      <div
        className={`
          border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center transition-all duration-300 ease-in-out
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : photos.length >= maxPhotos
              ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() =>
          photos.length < maxPhotos && fileInputRef.current?.click()
        }
      >
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='image/*'
          onChange={handleFileInput}
          className='hidden'
          disabled={photos.length >= maxPhotos}
        />

        <div className='flex flex-col items-center justify-center space-y-3 sm:space-y-4'>
          <div className='w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white'>
            <svg
              className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          </div>

          <div className='space-y-1 sm:space-y-2'>
            <p className='text-base sm:text-lg font-semibold text-gray-700'>
              {photos.length === 0 ? 'Upload Your Photos' : 'Add More Photos'}
            </p>
            <p className='text-xs sm:text-sm text-gray-500'>
              {photos.length}/{maxPhotos} photos selected
            </p>
            <p className='text-xs text-gray-400'>
              Drag & drop or click to browse
            </p>
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className='mt-4 sm:mt-6' data-aos='fade-up' data-aos-delay='100'>
          <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3'>
            Uploaded Photos
          </h3>
          <div className='grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3'>
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className='relative group transform hover:scale-105 transition-transform duration-200'
                data-aos='zoom-in'
                data-aos-delay={index * 100}
              >
                <div
                  className='w-full aspect-square relative rounded-lg overflow-hidden shadow-md bg-gray-100 cursor-pointer'
                  onClick={() => onImageClick(photo)}
                >
                  {photo.url.startsWith('blob:') ? (
                    // For blob URLs, use regular img with proper styling
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className='w-full h-full object-cover transition-transform duration-200 group-hover:scale-110'
                    />
                  ) : (
                    // For external URLs, use Next.js Image
                    <Image
                      src={photo.url}
                      alt={photo.name}
                      fill
                      sizes='(max-width: 475px) 33vw, (max-width: 640px) 25vw, 20vw'
                      className='object-cover transition-transform duration-200 group-hover:scale-110'
                    />
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(photo.id);
                  }}
                  className='absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 cursor-pointer z-10'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
