type CategoryListProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  couponPoint: number;
  useStock: boolean;
  stock: number;
  category: {
    discount: number;
  };
};
