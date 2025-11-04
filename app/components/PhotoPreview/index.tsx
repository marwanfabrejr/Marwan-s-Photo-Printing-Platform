'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo, PrintSize } from '@/types';
import { useAOSRefresh } from '@/app/hooks/useAOSInit';

interface PhotoPreviewProps {
  photos: Photo[];
  selectedSizes: { [key: string]: PrintSize };
  onSizeChange: (photoId: string, size: PrintSize) => void;
  onRename: (photoId: string, newName: string) => void;
  onImageClick: (photo: Photo) => void;
  printSizes: PrintSize[];
}

export default function PhotoPreview({
  photos,
  selectedSizes,
  onSizeChange,
  onRename,
  onImageClick,
  printSizes,
}: PhotoPreviewProps) {
  useAOSRefresh();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (photo: Photo) => {
    setEditingId(photo.id);
    setEditName(photo.name);
  };

  const saveEdit = (photoId: string) => {
    if (editName.trim()) {
      onRename(photoId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  if (photos.length === 0) return null;

  return (
    <div
      className='w-full max-w-2xl mx-auto px-2 sm:px-0 mt-6 sm:mt-8'
      data-aos='fade-up'
    >
      <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6'>
        Select Print Sizes
      </h3>
      <div className='space-y-3 sm:space-y-4'>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300'
            data-aos='fade-right'
            data-aos-delay={index * 100}
          >
            <div
              className='w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0 rounded-lg overflow-hidden shadow-md bg-gray-100 mx-auto sm:mx-0 cursor-pointer'
              onClick={() => onImageClick(photo)}
            >
              {photo.url.startsWith('blob:') ? (
                <img
                  src={photo.url}
                  alt={photo.name}
                  className='w-full h-full object-cover transition-transform duration-200 hover:scale-110'
                />
              ) : (
                <Image
                  src={photo.url}
                  alt={photo.name}
                  fill
                  sizes='(max-width: 640px) 64px, 80px'
                  className='object-cover transition-transform duration-200 hover:scale-110'
                />
              )}
            </div>
            <div className='flex-1 min-w-0 w-full text-center sm:text-left'>
              {editingId === photo.id ? (
                <div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
                  <input
                    type='text'
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className='flex-1 w-full px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(photo.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <div className='flex gap-2'>
                    <button
                      onClick={() => saveEdit(photo.id)}
                      className='text-green-600 hover:text-green-800 cursor-pointer p-1'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className='text-red-600 hover:text-red-800 cursor-pointer p-1'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18-6M6 6l12 12'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col sm:flex-row items-center gap-2 group'>
                  <p className='font-semibold text-gray-800 truncate text-sm sm:text-base'>
                    {photo.name}
                  </p>
                  <button
                    onClick={() => startEditing(photo)}
                    className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity duration-200 cursor-pointer p-1'
                    title='Rename photo'
                  >
                    <svg
                      className='w-3 h-3 sm:w-4 sm:h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                  </button>
                </div>
              )}
              <p className='text-xs sm:text-sm text-gray-500 mt-1'>
                {photo.size}
              </p>
            </div>
            <select
              value={selectedSizes[photo.id]?.id || ''}
              onChange={(e) => {
                const size = printSizes.find((s) => s.id === e.target.value);
                if (size) onSizeChange(photo.id, size);
              }}
              className='w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm cursor-pointer transition-all duration-200 hover:border-gray-400 text-sm'
            >
              <option value=''>Choose size</option>
              {printSizes.map((size) => (
                <option key={size.id} value={size.id} className='py-2'>
                  {size.dimensions} - AED {size.price}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
