import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import { getProductsByIds } from "@/utils/products/products";

export async function POST(request: NextRequest) {
  try {
    let cart: Item[] = await request.json();
    if (!cart) {
      return successResponse([], 400);
    }

    // Validate the cart
    const products = await getProductsByIds(cart.map((product) => product.id));
    cart = cart.map((product) => {
      const p = products.find((p) => p.id === product.id);
      if (!p) {
        return {
          ...product,
          quantity: 0,
        };
      }

      product.useStock = p.useStock;
      product.stock = p.stock;
      product.couponPoint = p.couponPoint;
      product.markedPrice = p.price;
      product.sellingPrice = p.price - p.discount - p.category.discount;

      if (p.useStock && p.stock < product.quantity) {
        return {
          ...product,
          quantity: p.stock,
        };
      }

      return product;
    });

    cart = cart.filter((product) => {
      return product.quantity > 0;
    });

    return successResponse(cart);
  } catch (error: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
