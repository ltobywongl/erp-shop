import prisma from "@/utils/prisma";

async function Page() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="md:grid md:grid-cols-2 gap-2">
      {categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}

export default Page;
