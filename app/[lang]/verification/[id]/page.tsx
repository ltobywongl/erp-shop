import NotFound from "@/app/not-found";
import ResetPassword from "@/components/resetPassword/page";
import prisma from "@/utils/prisma";

async function Page(props: Readonly<{ params: Promise<{ id: string }> }>) {
  const params = await props.params;
  const currentTime = new Date();
  const verification = await prisma.verifications.findUnique({
    select: {
      id: true,
      type: true,
      userId: true,
      expiredAt: true,
    },
    where: {
      id: params.id,
      deletedAt: null,
    },
  });

  if (
    !verification ||
    (verification.expiredAt && verification.expiredAt < currentTime)
  )
    return <NotFound />;

  if (verification.type === "register") {
    await prisma.$transaction([
      prisma.verifications.update({
        data: {
          deletedAt: currentTime,
        },
        where: {
          id: verification.id,
        },
      }),
      prisma.user.update({
        data: {
          status: "",
        },
        where: {
          id: verification.userId,
          status: "v",
        },
      }),
    ]);
  }

  if (verification.type === "forget-password") {
    return (
      <ResetPassword verificationId={params.id} />
    )
  }
  return (
    <h1 className="text-center text-xl text-bold mt-8">You are all set!</h1>
  );
}

export default Page;
