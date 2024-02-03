"use client";
import Modal from "antd/es/modal";
import { useEffect, useState } from "react";
import poster from "@/public/images/poster.jpg";
import Image from "next/image";

function PopUpAds() {
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
      <Image src={poster} alt="" priority={true} />
    </Modal>
  );
}

export default PopUpAds;
