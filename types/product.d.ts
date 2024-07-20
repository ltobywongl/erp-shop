type CategoryListProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  couponPoint: number;
  category: {
    discount: number;
  };
};
