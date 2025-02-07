import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";
import { render } from "@react-email/render";
import { User } from "@prisma/client";

const url = process.env.NEXT_BASE_URL;
if (!url) throw new Error("Missing Base URL");

export const forgetPasswordEmail = (user: Partial<User>, id: string) => {
  return render(
    <Html lang="en">
      <Text>Hello {user.email},</Text>

      <Hr style={{ marginTop: "8px" }} />

      <Text style={{ fontWeight: "bold" }}>Forget Password</Text>

      <Text style={{ marginTop: "8px" }}>
        Link: <Link href={`${url}/verification/${id}`}>Reset Password</Link>
      </Text>

      <Text style={{ marginTop: "8px" }}>
        This link will be expired in 1 hour.
      </Text>

      <Hr style={{ marginTop: "8px" }} />

      <Text style={{ marginTop: "8px" }}>
        Shop
      </Text>
    </Html>
  );
};
