import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";
import { render } from "@react-email/render";
import { User } from "@prisma/client";

export const verificationEmail = (user: Partial<User>, id: string) => {
  return render(
    <Html lang="en">
      <Text>你好：</Text>
      <Text>{user.email}</Text>

      <Hr />

      <Text style={{ fontWeight: "bold" }}>電郵驗證</Text>

      <Text>
        詳情: <Link href="https://erp-shop.com/order-history">點擊這裡</Link>
      </Text>
    </Html>
  );
};
