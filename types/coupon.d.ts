type CouponCategory = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  useStock: boolean;
  stock: number;
  point: number;
  value: number;
  minCheckValue: number;
};

type Coupon = {
  id: string;
  name: string;
  imagePath?: string;
  value: number;
  minCheckValue?: number;
};
