type CategoryListProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  couponPoint: number;
  stock: number;
  category: {
    discount: number;
  };
};
