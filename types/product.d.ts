type CategoryListProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  category: {
    discount: number;
  };
};
