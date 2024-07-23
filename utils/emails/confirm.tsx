import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";
import { render } from "@react-email/render";
import { Order } from "@prisma/client";

export const confirmEmail = (order: Partial<Order>) => {
  return render(
    <Html lang="en">
      <Text>確認訂單 - 編號:{order.id}</Text>
      <Hr />

      <Text>我們已經收到你的訂單, 我們會盡快處理並完成你的訂單</Text>

      <Text>
        詳情: <Link href="https://erp-shop.com/order-history">點擊這裡</Link>
      </Text>
    </Html>
  );
};
