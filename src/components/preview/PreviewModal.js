import React from 'react';
import styled from 'styled-components';
import { Mask } from 'antd-mobile';
import PreviewComponent from './PreviewComponent';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PreviewContent = styled.div`
  width: 360px;
  height: 640px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  z-index: 1001;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  background: #f5f5f5;
`;

const PreviewModal = ({ visible, onClose, components }) => {
  if (!visible) return null;

  return (
    <Mask visible={visible} onMaskClick={onClose}>
      <ModalContainer>
        <PreviewContent>
          <CloseButton onClick={onClose}>×</CloseButton>
          <PreviewContainer>
            {components.map(component => (
              <PreviewComponent
                key={component.id}
                {...component}
              />
            ))}
          </PreviewContainer>
        </PreviewContent>
      </ModalContainer>
    </Mask>
  );
};

export default PreviewModal; 