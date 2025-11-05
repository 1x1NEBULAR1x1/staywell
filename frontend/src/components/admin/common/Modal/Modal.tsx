'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => (e.key === 'Escape') && onClose();

    if (isOpen) document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isMounted || !isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={`${styles.modal_content} ${styles[`modal_content_${size}`]}`}>
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>{title}</h2>
          <button
            className={styles.modal_close_button}
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles.modal_body}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}; 