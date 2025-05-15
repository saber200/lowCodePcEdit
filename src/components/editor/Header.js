import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd-mobile';

const HeaderContainer = styled.div`
  height: 60px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Header = ({ onSave, onPreview }) => {
  return (
    <HeaderContainer>
      <Title>移动端页面编辑器</Title>
      <ButtonGroup>
        <Button 
          color='primary' 
          fill='outline'
          onClick={onPreview}
        >
          预览
        </Button>
        <Button 
          color='primary'
          onClick={onSave}
        >
          保存
        </Button>
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default Header; 