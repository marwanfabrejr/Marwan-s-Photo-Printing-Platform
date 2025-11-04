export interface Photo {
  id: string;
  url: string;
  name: string;
  size: string;
  file?: File;
  isExternal?: boolean;
}

export interface PrintSize {
  id: string;
  name: string;
  dimensions: string;
  price: number;
}

export interface OrderItem {
  photo: Photo;
  size: PrintSize;
  quantity: number;
}
