import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import moment from "moment";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      venue: true,
      date: true,
      time: true,
    },
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className="flex justify-center p-2">
      <div className="w-full md:w-4/5 flex flex-col gap-5">
        <h1 className="text-xl font-bold">預約記錄</h1>
        <hr />
        {bookings.map((booking) => {
          return (
            <div className="p-3 border rounded-lg" key={booking.id}>
              <div>地點: {booking.venue}</div>
              <div>日期: {moment(booking.date).format("YYYY-MM-DD")}</div>
              <div>時間: {moment(booking.time).format("hh:mm:ss")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
