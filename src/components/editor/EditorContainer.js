import React from 'react';
import styled from 'styled-components';

// 定义手机屏幕的标准尺寸
export const PHONE_SCREEN_WIDTH = 404;
export const PHONE_SCREEN_HEIGHT = 848;

const PhoneScreen = styled.div`
  width: 404px; // 屏幕宽度
  height: 848px; // 屏幕高度
  background: white;
  border-radius: 45px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: ${PHONE_SCREEN_WIDTH}px;
  height: ${PHONE_SCREEN_HEIGHT}px;
  background: white;
  border-radius: 45px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 0 2px #e0e0e0,
    0 4px 8px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 30px;
    background: #f5f5f5;
    border-radius: 0 0 20px 20px;
    z-index: 2;
  }
`;

const EditorContainer = ({ children }) => {
  return (
    <Container>
      <div 
        className="editor-content"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </Container>
  );
};

export default EditorContainer; 