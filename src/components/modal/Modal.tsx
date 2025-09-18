import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  Backdrop,
  Dialog,
  Header,
  Title,
  CloseBtn,
  Body,
  Footer,
  Divider,
} from "./modal.style";

export type ModalProps = {
  open: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string; // dialog width (e.g. 720 or "720px")
  maxWidth?: number | string; // clamp at large screens
  closeOnOverlay?: boolean; // click outside to close
  ariaLabel?: string; // aria-label for accessibility if no title
};

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  width = 720,
  maxWidth = "90vw",
  closeOnOverlay = true,
  ariaLabel,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // autofocus dialog for screen readers
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const node = (
    <Backdrop
      role="presentation"
      onMouseDown={(e) => {
        if (!closeOnOverlay) return;
        // close only if click is strictly outside the dialog
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : ariaLabel}
        tabIndex={-1}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <Header>
            <Title>{title}</Title>
            <CloseBtn type="button" aria-label="Закрыть" onClick={onClose}>
              <span />
              <span />
            </CloseBtn>
          </Header>
        )}

        <Divider />

        <Body>{children}</Body>

        {footer ? (
          <>
            <Divider />
            <Footer>{footer}</Footer>
          </>
        ) : null}
      </Dialog>
    </Backdrop>
  );

  return ReactDOM.createPortal(node, document.body);
}

export { Body as ModalBody, Footer as ModalFooter, Header as ModalHeader };
