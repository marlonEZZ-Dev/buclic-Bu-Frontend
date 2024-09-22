import React from 'react';
import { Modal as AntModal } from 'antd';
import { CSSTransition } from 'react-transition-group';


const Modal = ({ children, open, onClose, modalTitle }) => {
  return (
    <CSSTransition
      in={open}
      timeout={400}
      classNames="fade"
      unmountOnExit
    >
      <AntModal
        title={modalTitle}
        open={open}
        onCancel={() => onClose(false)}
        footer={null}
        centered
        maskStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
        }}
        className="blurred-modal"
      >
        <style jsx>{`
          :global(.ant-modal-mask) {
            backdrop-filter: blur(8px) !important;
          }
        `}</style>
        {children}
      </AntModal>
    </CSSTransition>
  );
};

export default Modal;