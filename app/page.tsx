'use client';

import { useState } from 'react';
import { Photo, PrintSize } from '@/types';
import PhotoUpload from './components/PhotoUpload';
import PhotoPreview from './components/PhotoPreview';
import OrderSummary from './components/OrderSummary';
import ImageModal from './components/ImageModal';
import 'aos/dist/aos.css';
import { useAOSInit } from './hooks/useAOSInit';

const PRINT_SIZES: PrintSize[] = [
  { id: '4x6', name: '4x6', dimensions: '4×6 inches', price: 1.5 },
  { id: '5x7', name: '5x7', dimensions: '5×7 inches', price: 3 },
  { id: '8x10', name: '8x10', dimensions: '8×10 inches', price: 5 },
];

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<{
    [key: string]: PrintSize;
  }>({});
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useAOSInit();

  const handlePhotosChange = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    // Remove sizes for photos that are no longer in the list
    const updatedSizes = { ...selectedSizes };
    Object.keys(updatedSizes).forEach((photoId) => {
      if (!newPhotos.find((p) => p.id === photoId)) {
        delete updatedSizes[photoId];
      }
    });
    setSelectedSizes(updatedSizes);
  };

  const handleSizeChange = (photoId: string, size: PrintSize) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [photoId]: size,
    }));
  };

  const handleRename = (photoId: string, newName: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, name: newName } : photo
      )
    );
  };

  const handleOrderComplete = () => {
    // Clean up blob URLs before clearing
    photos.forEach((photo) => {
      if (photo.url.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url);
      }
    });
    setPhotos([]);
    setSelectedSizes({});
  };

  const handleImageClick = (photo: Photo) => {
    setSelectedImage(photo);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-4 sm:py-6 md:py-8'>
      <div className='container mx-auto px-3 sm:px-4 md:px-6'>
        <header className='text-center mb-8 sm:mb-12 md:mb-16'>
          <div
            className='w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg'
            data-aos='zoom-in'
          >
            <svg
              className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white'
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
          <h1
            className='text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight'
            data-aos='fade-up'
          >
            Photo Printing
            <br className='sm:hidden' /> Service
          </h1>
          <p
            className='text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2'
            data-aos='fade-up'
            data-aos-delay='200'
          >
            Upload your photos, choose print sizes, and get them delivered to
            your home in the UAE
          </p>
        </header>

        <main className='max-w-6xl mx-auto space-y-8 sm:space-y-10 md:space-y-12'>
          <PhotoUpload
            photos={photos}
            onPhotosChange={handlePhotosChange}
            onImageClick={handleImageClick}
            maxPhotos={5}
          />

          <PhotoPreview
            photos={photos}
            selectedSizes={selectedSizes}
            onSizeChange={handleSizeChange}
            onRename={handleRename}
            onImageClick={handleImageClick}
            printSizes={PRINT_SIZES}
          />

          <OrderSummary
            photos={photos}
            selectedSizes={selectedSizes}
            onOrderComplete={handleOrderComplete}
            onImageClick={handleImageClick}
          />
        </main>

        <footer className='text-center mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-7 md:pt-8 border-t border-gray-200'>
          <p className='text-sm sm:text-base text-gray-500 px-2'>
            <strong>Marwan`s Photo Printing</strong> Built with Next.js,
            TypeScript & Tailwind CSS.
          </p>
        </footer>

        {/* Image Modal */}
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={closeImageModal}
          photo={selectedImage}
        />
      </div>
    </div>
  );
}
