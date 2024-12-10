"use client";
import Modal from "antd/es/modal";
import { useEffect, useState } from "react";
import Image from "next/image";

function PopUpAds(params: Readonly<{ imageUrl: string }>) {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setModalOpen(true);
  }, []);

  return (
    <Modal
      centered
      style={{}}
      open={modalOpen}
      footer={null}
      onCancel={() => setModalOpen(false)}
    >
      <Image
        src={params.imageUrl}
        unoptimized
        width={600}
        height={600}
        alt=""
      />
    </Modal>
  );
}

export default PopUpAds;
