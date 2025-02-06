"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ModalContextProps {
  showModal: (
    title: string,
    description: string,
    showCancel?: boolean,
    onOk?: () => void | Promise<void>
  ) => void;
  hideModal: () => void;
  modalContent: {
    title: string;
    description: string;
    showCancel: boolean;
    onOk?: () => void | Promise<void>;
  } | null;
  isModalVisible: boolean;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] =
    useState<ModalContextProps["modalContent"]>(null);

  const showModal = (
    title: string,
    description: string,
    showCancel: boolean = true,
    onOk?: () => void | Promise<void>
  ) => {
    setModalContent({ title, description, showCancel, onOk });
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setModalContent(null);
    setIsModalVisible(false);
  };

  return (
    <ModalContext.Provider
      value={{ showModal, hideModal, modalContent, isModalVisible }}
    >
      {children}
      {isModalVisible && modalContent && (
        <AlertDialog open={isModalVisible} onOpenChange={hideModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{modalContent.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {modalContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {modalContent.showCancel && (
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              )}
              <AlertDialogAction
                onClick={async () => {
                  await modalContent.onOk?.();
                  hideModal();
                }}
              >
                Ok
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
