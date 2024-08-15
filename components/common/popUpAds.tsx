"use client";
import Modal from "antd/es/modal";
import { useEffect, useState } from "react";
import Image from "next/image";

function PopUpAds() {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setModalOpen(true);
  }, []);
  const timeStamp = new Date().getTime();

  return (
    <Modal
      centered
      style={{}}
      open={modalOpen}
      footer={null}
      onCancel={() => setModalOpen(false)}
    >
      <Image src={`https://publicen.s3.ap-southeast-2.amazonaws.com/images/popup.jpg?timeStamp=${timeStamp}`} width={600} height={600} alt="" priority={true} />
    </Modal>
  );
}

export default PopUpAds;
