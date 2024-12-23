"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal } from "antd";

interface ModalContextProps {
  showModal: (content: ReactNode, onConfirm: () => void) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});

  const showModal = (content: ReactNode, onConfirm: () => void) => {
    setModalContent(content);
    setOnConfirm(() => onConfirm);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    onConfirm();
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        open={modalVisible}
        onOk={handleConfirm}
        onCancel={hideModal}
        okText="確定"
        cancelText="取消"
      >
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
