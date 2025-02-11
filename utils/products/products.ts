import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

export async function getProductById(
  id: string,
  lang: string,
  bGetDescription = false
) {
  const product = await prisma.product.findUnique({
    select: {
      id: true,
      name: true,
      descriptionTranslationId: bGetDescription,
      image: true,
      price: true,
      useStock: true,
      stock: true,
      discount: true,
      couponPoint: true,
      category: {
        select: {
          name: true,
          discount: true,
        },
      },
    },
    where: {
      id: id,
      OR: [
        {
          useStock: false,
        },
        {
          stock: { gt: 0 },
        },
      ],
      deletedAt: null,
      category: {
        suspend: false,
        deletedAt: null,
      },
    },
  });

  if (!product) return null;

  const productName = (product.name as Record<string, string>)[lang];
  const productDescriptionId = (
    product.descriptionTranslationId as Record<string, string>
  )[lang];
  const productDescriptions = bGetDescription
    ? await prisma.productDescription.findUnique({
        where: {
          id: productDescriptionId,
        },
      })
    : null;

  return {
    id: product.id,
    name: productName,
    description: productDescriptions?.content ?? "",
    image: product.image ?? "",
    markedPrice: product.price,
    sellingPrice: product.price - product.discount - product.category.discount,
    couponPoints: product.couponPoint,
    quantity: 1,
    useStock: product.useStock,
    stock: product.stock,
  };
}

export async function getProductsByIds(ids: string[]) {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      price: true,
      useStock: true,
      stock: true,
      discount: true,
      couponPoint: true,
      category: {
        select: {
          id: true,
          discount: true,
        },
      },
    },
    where: {
      id: {
        in: ids,
      },
      category: {
        suspend: false,
        deletedAt: null,
      },
    },
  });

  return products;
}

export async function getProducts(
  lang: string,
  orderBy?: Prisma.ProductOrderByWithRelationInput,
  take?: number,
  skip?: number,
  where?: Prisma.ProductWhereInput
) {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      discount: true,
      couponPoint: true,
      useStock: true,
      stock: true,
      category: {
        select: {
          name: true,
          discount: true,
        },
      },
    },
    where: where || {
      OR: [
        {
          useStock: false,
        },
        {
          stock: { gt: 0 },
        },
      ],
      deletedAt: null,
      category: {
        suspend: false,
        deletedAt: null,
      },
    },
    orderBy: orderBy,
    take: take,
    skip: skip,
  });

  return products.map((product) => {
    const productName = (product.name as Record<string, string>)[lang];

    return {
      id: product.id,
      name: productName,
      image: product.image ?? "",
      markedPrice: product.price,
      sellingPrice:
        product.price - product.discount - product.category.discount,
      couponPoints: product.couponPoint,
      quantity: 1,
      useStock: product.useStock,
      stock: product.stock,
    } as Item;
  });
}

export async function searchProducts(
  lang: string,
  keyword: string,
  take?: number,
  skip?: number
) {
  const products: {
    id: string;
    name: Record<string, string>;
    image: string;
    price: number;
    discount: number;
    couponPoint: number;
    useStock: boolean;
    stock: number;
    categoryDiscount: number;
  }[] = await prisma.$queryRaw(Prisma.sql`
    SELECT Product.id as id, Product.name as name, Product.image as image, Product.price as price, Product.discount as discount, Product.coupon_point as couponPoint, Product.use_stock as useStock, Product.stock as stock, Category.discount as categoryDiscount
    FROM products AS Product
    LEFT JOIN categories AS Category ON Product.categories_id = Category.id
    WHERE Product.deleted_at IS NULL
    AND Category.deleted_at IS NULL
    AND Category.suspend = 0
    AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(Product.name, \'$.${Prisma.raw(lang)}\'))) LIKE LOWER(\'%${Prisma.raw(keyword)}%\')
    AND (Product.use_stock = 0 OR Product.stock > 0)
    ORDER BY Product.created_at DESC
    LIMIT ${take ?? 10}
    OFFSET ${skip ?? 0}
  `);

  const productCount: {
    count: number;
  }[] = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM products AS Product
    WHERE Product.deleted_at IS NULL
    AND Category.deleted_at IS NULL
    AND Category.suspend = 0
    AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(Product.name, \'$.${Prisma.raw(lang)}\'))) LIKE LOWER(\'%${Prisma.raw(keyword)}%\')
    AND (Product.use_stock = 0 OR Product.stock > 0)
  `;

  return {
    products: products.map((product) => {
      const productName = (product.name as Record<string, string>)[lang];

      return {
        id: product.id,
        name: productName,
        image: product.image ?? "",
        markedPrice: product.price,
        sellingPrice:
          product.price - product.discount - product.categoryDiscount,
        couponPoints: product.couponPoint,
        quantity: 1,
        useStock: product.useStock,
        stock: product.stock,
      } as Item;
    }),
    counts: Number(productCount[0].count),
  };
}
