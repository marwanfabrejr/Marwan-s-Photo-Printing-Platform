'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Photo } from '@/types';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
}

export default function ImageModal({
  isOpen,
  onClose,
  photo,
}: ImageModalProps) {
  if (!photo) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-90' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-3 sm:p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-4xl transform overflow-hidden rounded-xl sm:rounded-2xl text-left align-middle transition-all'>
                <div className='relative bg-black rounded-xl sm:rounded-2xl overflow-hidden'>
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className='absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-70 transition-all duration-200 cursor-pointer'
                  >
                    <svg
                      className='w-4 h-4 sm:w-5 sm:h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>

                  {/* Image */}
                  <div className='relative w-full h-96 sm:h-[500px] md:h-[600px]'>
                    {photo.url.startsWith('blob:') ? (
                      // For blob URLs, use regular img with proper error handling
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className='w-full h-full object-contain'
                        onError={(e) => {
                          // Fallback if blob URL fails
                          const target = e.target as HTMLImageElement;
                          target.src = '/image-placeholder.svg';
                        }}
                      />
                    ) : (
                      // For external URLs, use Next.js Image
                      <Image
                        src={photo.url}
                        alt={photo.name}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
                        className='object-contain'
                        priority
                      />
                    )}
                  </div>

                  {/* Image info */}
                  <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 sm:p-4'>
                    <p className='font-semibold text-sm sm:text-base truncate'>
                      {photo.name}
                    </p>
                    <p className='text-xs sm:text-sm text-gray-300 mt-1'>
                      {photo.size} •{' '}
                      {photo.url.startsWith('blob:')
                        ? 'Local file'
                        : 'External image'}
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
