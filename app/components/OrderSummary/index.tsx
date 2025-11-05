'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo, PrintSize } from '@/types';
import toast from 'react-hot-toast';
import ConfirmationModal from '../ConfirmationModal';

interface OrderSummaryProps {
  photos: Photo[];
  selectedSizes: { [key: string]: PrintSize };
  onOrderComplete: () => void;
  onImageClick: (photo: Photo) => void;
}

export default function OrderSummary({
  photos,
  selectedSizes,
  onOrderComplete,
  onImageClick,
}: OrderSummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedPhotos = photos.filter((photo) => selectedSizes[photo.id]);

  const total = selectedPhotos.reduce((sum, photo) => {
    const size = selectedSizes[photo.id];
    return sum + (size?.price || 0);
  }, 0);

  const handlePayNow = () => {
    if (selectedPhotos.length === 0) {
      toast.error('Please select sizes for at least one photo');
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmOrder = () => {
    setIsModalOpen(false);

    // Simulate payment processing
    toast.success(
      <div>
        <p className='font-semibold'>Order Confirmed.</p>
        <p className='text-sm'>
          Your {selectedPhotos.length} photo
          {selectedPhotos.length !== 1 ? 's' : ''} will be delivered soon.
        </p>
      </div>,
      { duration: 5000 }
    );

    // Reset the state
    onOrderComplete();
  };

  if (photos.length === 0) return null;

  return (
    <>
      <div
        className='w-full max-w-full sm:max-w-2xl mx-auto mt-6 sm:mt-8 px-2 sm:px-0'
        data-aos='fade-up'
      >
        <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6'>
          Order Summary
        </h3>
        <div className='bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6'>
          {selectedPhotos.length > 0 ? (
            <>
              <div className='space-y-3 mb-4 sm:mb-6'>
                {selectedPhotos.map((photo, index) => {
                  const size = selectedSizes[photo.id];
                  return (
                    <div
                      key={photo.id}
                      className='flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0'
                      data-aos='fade-left'
                      data-aos-delay={index * 100}
                    >
                      <div className='flex items-center gap-2 sm:gap-3'>
                        <div
                          className='w-10 h-10 sm:w-12 sm:h-12 relative rounded-lg overflow-hidden shadow-sm bg-gray-100 flex-shrink-0 cursor-pointer'
                          onClick={() => onImageClick(photo)}
                        >
                          {photo.url.startsWith('blob:') ? (
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className='w-full h-full object-cover transition-transform duration-200 '
                            />
                          ) : (
                            <Image
                              src={photo.url}
                              alt={photo.name}
                              fill
                              sizes='(max-width: 640px) 40px, 48px'
                              className='object-cover transition-transform duration-200 '
                            />
                          )}
                        </div>
                        <div className='min-w-0'>
                          <p className='font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[120px]'>
                            {photo.name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {size.dimensions}
                          </p>
                        </div>
                      </div>
                      <p className='font-semibold text-gray-800 text-sm'>
                        AED {size.price}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className='border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6'>
                <div className='flex justify-between items-center'>
                  <p className='text-base sm:text-lg font-bold text-gray-900'>
                    Total Amount
                  </p>
                  <p className='text-base sm:text-lg font-bold text-blue-600'>
                    AED {total}
                  </p>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl cursor-pointer transform  active:scale-95'
                data-aos='zoom-in'
              >
                Pay Now - AED {total}
              </button>
            </>
          ) : (
            <div className='text-center py-6 sm:py-8' data-aos='fade-in'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <svg
                  className='w-6 h-6 sm:w-8 sm:h-8 text-yellow-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <p className='text-sm sm:text-base text-gray-600 font-medium'>
                Select print sizes for your photos to see order summary
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
        total={total}
        photoCount={selectedPhotos.length}
      />
    </>
  );
}
