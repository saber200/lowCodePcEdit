import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd-mobile';
import PreviewComponent from '../components/preview/PreviewComponent';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 20px;
`;

const Title = styled.h1`
  color: white;
  margin: 0;
  font-size: 24px;
`;

const PhoneContainer = styled.div`
  width: 444px; // 手机壳宽度
  height: 888px; // 手机壳高度
  background: #2a2a2a;
  border-radius: 60px;
  position: relative;
  padding: 20px;
  box-shadow: 
    0 0 0 2px #333,
    0 20px 40px rgba(0, 0, 0, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 30px;
    background: #2a2a2a;
    border-radius: 0 0 20px 20px;
    z-index: 2;
  }
`;

const PhoneScreen = styled.div`
  width: 404px; // 屏幕宽度
  height: 848px; // 屏幕高度
  background: white;
  border-radius: 45px;
  overflow: hidden;
  position: relative;
`;

const PreviewArea = styled.div`
  width: 360px;
  height: 800px;
  margin: 24px auto;
  background: #f5f5f5;
  position: relative;
  overflow: auto;
`;

const BackButton = styled(Button)`
  --adm-color-primary: #fff;
  --adm-button-border-radius: 20px;
`;

const PreviewPage = () => {
  const navigate = useNavigate();
  
  // 从 localStorage 获取组件数据
  const components = JSON.parse(localStorage.getItem('previewComponents') || '[]');

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <Header>
        <Title>页面预览</Title>
        <BackButton 
          onClick={handleBack}
          fill='outline'
        >
          返回编辑器
        </BackButton>
      </Header>
      <PhoneContainer>
        <PhoneScreen>
          <PreviewArea>
            {components.map(component => (
              <PreviewComponent
                key={component.id}
                {...component}
              />
            ))}
          </PreviewArea>
        </PhoneScreen>
      </PhoneContainer>
    </PageContainer>
  );
};

export default PreviewPage; 