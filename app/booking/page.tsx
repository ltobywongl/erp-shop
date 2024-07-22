"use client";
import { Modal, Result, message } from "antd";
import Link from "next/link";
import { FormEvent, useState } from "react";
import LoadingSpinner from "@/components/common/spinner";

function BookingForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const res = await fetch("/api/booking", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      (document?.getElementById("topUpForm") as HTMLFormElement)?.reset();
      setModalOpen(true);
      setLoading(false);
    } else {
      message.error("發生錯誤");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Modal
        centered
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
      >
        <Result
          status="success"
          title="成功預約"
          extra={[
            <Link
              className="px-4 py-2 rounded bg-blue-500 text-white font-semibold"
              href="/"
              key="home"
            >
              返回主頁
            </Link>,
          ]}
        />
      </Modal>

      <form
        className="w-full md:w-4/5"
        id="topUpForm"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-xl font-bold">預約系統</h1>
        <div className="flex flex-col gap-2 mt-2">
          <div>
            <label htmlFor="venue">場地</label>
            <input
              className="block w-full border px-3 py-1"
              id="venue"
              name="venue"
              type="text"
              required
            />
          </div>

          <div>
            <label htmlFor="date">日期</label>
            <input
              className="block w-full border px-3 py-1"
              id="date"
              name="date"
              type="date"
              required
            />
          </div>

          <div>
            <label htmlFor="time">時間</label>
            <input
              className="block w-full border px-3 py-1"
              id="time"
              name="time"
              type="time"
              required
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center gap-1 px-3 py-1 rounded bg-blue-500 text-white"
          >
            {loading && <LoadingSpinner />}提交
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
