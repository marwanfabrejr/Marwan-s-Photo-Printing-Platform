'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  total: number;
  photoCount: number;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  total,
  photoCount,
}: ConfirmationModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
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
              <Dialog.Panel className='w-full max-w-xs sm:max-w-sm md:max-w-md transform overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-semibold leading-6 text-gray-900'
                >
                  Confirm Your Order
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    You are about to place an order for {photoCount} photo
                    {photoCount !== 1 ? 's' : ''} with a total of{' '}
                    <span className='font-semibold'>AED {total}</span>.
                  </p>
                </div>

                <div className='mt-4 sm:mt-6 flex gap-2 sm:gap-3'>
                  <button
                    type='button'
                    className='flex-1 rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer'
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='flex-1 rounded-md border border-transparent bg-blue-600 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer'
                    onClick={onConfirm}
                  >
                    Confirm Order
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
