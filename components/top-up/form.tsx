"use client";
import { Table, Modal, Result, message } from "antd";
import Link from "next/link";
import { FormEvent, useState } from "react";
import LoadingSpinner from "../common/spinner";

const dataSource = [
  {
    key: "轉賬銀行",
    value: "恒生銀行",
  },
  {
    key: "賬戶號碼",
    value: "368-123456-888",
  },
  {
    key: "收款人名稱",
    value: "陳小明",
  },
];

const columns = [
  {
    title: "Key",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

function TopUpForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/topup", {
      method: "POST",
      body: formData,
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
    <>
      <Modal
        centered
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
      >
        <Result
          status="success"
          title="成功提交充值記錄"
          subTitle="請等候我們審核你的記錄"
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

      <form id="topUpForm" onSubmit={(e) => handleSubmit(e)}>
        <h1 className="text-xl font-bold">賬號充值</h1>
        <Table
          showHeader={false}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
        <h2 className="text-xl font-bold mt-4">提交充值記錄</h2>
        <div className="flex flex-col gap-2 mt-2">
          <div>
            <label htmlFor="amount">充值面額</label>
            <input
              className="block w-full border px-3 py-1"
              id="amount"
              name="amount"
              type="number"
              step={0.01}
              min={1}
              placeholder="輸入數值"
              required
            />
          </div>

          <div>
            <label htmlFor="name">姓名 (需與轉賬記錄相同)</label>
            <input
              className="block w-full border px-3 py-1"
              id="name"
              name="name"
              type="text"
              placeholder="輸入姓名"
              required
            />
          </div>

          <div>
            <label htmlFor="transfer">轉賬證明</label>
            <input
              className="block w-full border px-3 py-1"
              id="transfer"
              name="transfer"
              type="file"
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
    </>
  );
}

export default TopUpForm;
