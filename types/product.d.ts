type Category = {
  id: string;
  name: string;
  discount: number;
};

type Item = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  markedPrice?: number;
  sellingPrice: number;
  couponPoint?: number;
  quantity: number;
  useStock: boolean;
  stock: number;
};

type Order = {
  id: string;
  totalPrice: number;
  receiverName: string;
  receiverAddress: string;
  state: string;
  createdAt: Date;
  products: {
    id: string;
    name: string;
    quantity: number;
  }[];
};
