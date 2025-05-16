import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, TabBar } from 'antd-mobile';
import PreviewComponent from '../components/preview/PreviewComponent';

const PreviewContainer = styled.div`
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
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  background: #f5f5f5;
`;

const TabBarContainer = styled.div`
  height: 50px;
  background: #fff;
  border-top: 1px solid #eee;
`;

const PreviewPage = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);

  useEffect(() => {
    const savedPages = localStorage.getItem('previewPages');
    const savedCurrentPageId = localStorage.getItem('currentPageId');
    
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages);
      setPages(parsedPages);
      setCurrentPageId(Number(savedCurrentPageId) || parsedPages[0]?.id);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const currentPage = pages.find(page => page.id === currentPageId);

  const handleBack = () => {
    navigate('/');
  };

  if (!currentPage) return null;

  return (
    <PreviewContainer>
      <Header>
        <Title>预览模式 - {currentPage.name}</Title>
        <Button 
          color='primary'
          fill='outline'
          style={{
            '--adm-color-primary': '#fff',
            '--adm-button-border-radius': '20px'
          }}
          onClick={handleBack}
        >
          返回编辑
        </Button>
      </Header>
      <PhoneContainer>
        <PhoneScreen>
          <Content>
            {currentPage.components.map((component) => (
              <PreviewComponent
                key={component.id}
                {...component}
              />
            ))}
          </Content>
          {pages.length > 1 && (
            <TabBarContainer>
              <TabBar
                activeKey={currentPageId.toString()}
                onChange={key => setCurrentPageId(Number(key))}
              >
                {pages.map(page => (
                  <TabBar.Item
                    key={page.id.toString()}
                    title={page.name}
                  />
                ))}
              </TabBar>
            </TabBarContainer>
          )}
        </PhoneScreen>
      </PhoneContainer>
    </PreviewContainer>
  );
};

export default PreviewPage; 