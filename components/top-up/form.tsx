"use client";
import { Button, Form, Input, InputNumber, Table, Modal, Result } from "antd";
import Link from "next/link";
import { useState } from "react";

type FieldType = {
  name: string;
  amount: number;
};

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

  const onFinish = (values: FieldType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Success:", values);
      setModalOpen(true);
    }, 1000);
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

      <Form
        name="topUpForm"
        initialValues={{ remember: true, amount: 100 }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <h1 className="text-xl font-bold">賬號充值</h1>
        <Table
          showHeader={false}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
        <h2 className="text-xl font-bold mt-4">提交充值記錄</h2>
        <div className="mt-2">
          <Form.Item<FieldType>
            label="充值面額"
            name="amount"
            rules={[{ required: true, message: "輸入數值" }]}
          >
            <InputNumber addonBefore="$" min={1} size="large" />
          </Form.Item>

          <Form.Item<FieldType>
            label="姓名 (需與轉賬記錄相同)"
            name="name"
            rules={[{ required: true, message: "輸入姓名" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
          >
            提交
          </Button>
        </div>
      </Form>
    </>
  );
}

export default TopUpForm;
