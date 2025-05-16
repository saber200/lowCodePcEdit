import React, { useState, useEffect, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, TabBar, Popover } from 'antd-mobile';
import PreviewComponent from '../components/preview/PreviewComponent';
import EventSystem from '../events/EventSystem';
import { registerCommonEvents } from '../events/CommonEvents';
import ComponentEventAdapter from '../events/ComponentEventAdapter';

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

const SubPageList = styled.div`
  min-width: 120px;
  max-width: 200px;
`;

const SubPageItem = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  color: ${props => props.active ? '#1677ff' : '#333'};
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:active {
    background: #e5e5e5;
  }
`;

const TabBarItemWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 创建包装组件来处理 antd-mobile 组件的 ref
const StyledTabBar = forwardRef((props, ref) => (
  <TabBar {...props} ref={ref} />
));

const StyledPopover = forwardRef((props, ref) => (
  <Popover {...props} ref={ref} />
));

const StyledButton = forwardRef((props, ref) => (
  <Button {...props} ref={ref} />
));

const PreviewPage = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [visiblePopover, setVisiblePopover] = useState(null);
  const [componentStates, setComponentStates] = useState({});

  // 初始化事件系统
  const initializeEventSystem = (pages) => {
    // 注册所有组件的事件
    pages.forEach(page => {
      page.components.forEach(component => {
        if (component.events) {
          ComponentEventAdapter.registerComponentEvents(
            { id: component.id },
            component.events
          );
        }
      });
    });

    // 注册事件处理函数
    EventSystem.executeHandler = (componentId, handlerName, payload) => {
      console.log('Executing event:', { componentId, handlerName, payload });
      
      const component = pages.flatMap(page => page.components)
        .find(comp => comp.id === componentId);

      if (!component) {
        console.warn('Component not found:', componentId);
        return;
      }

      switch (handlerName) {
        case 'show':
          if (!payload.target) {
            console.warn('No target specified for show action');
            return;
          }
          setComponentStates(prev => ({
            ...prev,
            [payload.target]: { ...prev[payload.target], visible: true }
          }));
          break;

        case 'hide':
          if (!payload.target) {
            console.warn('No target specified for hide action');
            return;
          }
          setComponentStates(prev => ({
            ...prev,
            [payload.target]: { ...prev[payload.target], visible: false }
          }));
          break;

        case 'toggle':
          if (!payload.target) {
            console.warn('No target specified for toggle action');
            return;
          }
          setComponentStates(prev => ({
            ...prev,
            [payload.target]: { 
              ...prev[payload.target], 
              visible: !prev[payload.target]?.visible 
            }
          }));
          break;

        case 'navigate':
          if (!payload.target) {
            console.warn('No target specified for navigate action');
            return;
          }
          const targetPage = pages.find(p => p.id === payload.target);
          if (targetPage) {
            setCurrentPageId(targetPage.id);
            setVisiblePopover(null);
          } else {
            console.warn('Target page not found:', payload.target);
          }
          break;

        case 'updateData':
          if (!payload.data) {
            console.warn('No data specified for updateData action');
            return;
          }
          setComponentStates(prev => ({
            ...prev,
            [componentId]: { ...prev[componentId], ...payload.data }
          }));
          break;

        default:
          console.warn('Unhandled event:', handlerName, payload);
      }
    };
  };

  useEffect(() => {
    // 1. 注册常用事件类型
    registerCommonEvents();

    const savedPages = localStorage.getItem('previewPages');
    const savedCurrentPageId = localStorage.getItem('currentPageId');
    
    let parsedPages = null;

    if (savedPages) {
      parsedPages = JSON.parse(savedPages);
      setPages(parsedPages);
      setCurrentPageId(Number(savedCurrentPageId) || parsedPages[0]?.id);

      // 2. 初始化事件系统
      initializeEventSystem(parsedPages);

      // 3. 初始化组件状态
      const initialStates = {};
      parsedPages.forEach(page => {
        page.components.forEach(component => {
          if (component.properties) {
            initialStates[component.id] = {
              visible: true,
              ...component.properties
            };
          }
        });
      });
      setComponentStates(initialStates);
    } else {
      navigate('/');
    }

    // 4. 清理函数
    return () => {
      if (parsedPages) {
        parsedPages.forEach(page => {
          page.components.forEach(component => {
            ComponentEventAdapter.unregisterComponentEvents({ id: component.id });
          });
        });
      }
    };
  }, [navigate]);

  // 获取当前页面
  const currentPage = pages.find(page => page.id === currentPageId);
  
  // 获取一级页面（非子页面）
  const mainPages = pages.filter(page => !page.parentId);
  
  // 获取子页面
  const getSubPages = (parentId) => pages.filter(page => page.parentId === parentId);

  const handlePageClick = (pageId) => {
    const subPages = getSubPages(pageId);
    
    if (subPages.length === 0) {
      // 如果没有子页面，直接切换到该页面
      setCurrentPageId(pageId);
      setVisiblePopover(null);
    }
  };

  const handleSubPageClick = (pageId) => {
    setCurrentPageId(pageId);
    setVisiblePopover(null);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!currentPage) return null;

  const renderTabBarItem = (page) => {
    const subPages = getSubPages(page.id);
    
    if (subPages.length === 0) {
      return (
        <TabBar.Item
          key={page.id.toString()}
          title={page.name}
        />
      );
    }

    return (
      <TabBar.Item
        key={page.id.toString()}
        title={
          <StyledPopover
            visible={visiblePopover === page.id}
            onVisibleChange={(visible) => setVisiblePopover(visible ? page.id : null)}
            trigger='click'
            placement='top'
            content={
              <SubPageList>
                {subPages.map(subPage => (
                  <SubPageItem
                    key={subPage.id}
                    active={subPage.id === currentPageId}
                    onClick={() => handleSubPageClick(subPage.id)}
                  >
                    {subPage.name}
                  </SubPageItem>
                ))}
              </SubPageList>
            }
          >
            <TabBarItemWrapper>{page.name}</TabBarItemWrapper>
          </StyledPopover>
        }
      />
    );
  };

  return (
    <PreviewContainer>
      <Header>
        <Title>预览模式 - {currentPage.name}</Title>
        <StyledButton 
          color='primary'
          fill='outline'
          style={{
            '--adm-color-primary': '#fff',
            '--adm-button-border-radius': '20px'
          }}
          onClick={handleBack}
        >
          返回编辑
        </StyledButton>
      </Header>
      <PhoneContainer>
        <PhoneScreen>
          <Content>
            {currentPage.components.map((component) => (
              <PreviewComponent
                key={component.id}
                {...component}
                state={componentStates[component.id]}
                visible={componentStates[component.id]?.visible}
              />
            ))}
          </Content>
          {mainPages.length > 1 && (
            <TabBarContainer>
              <StyledTabBar
                activeKey={
                  currentPage.parentId
                    ? pages.find(p => p.id === currentPage.parentId)?.id.toString()
                    : currentPageId.toString()
                }
                onChange={key => handlePageClick(Number(key))}
              >
                {mainPages.map(renderTabBarItem)}
              </StyledTabBar>
            </TabBarContainer>
          )}
        </PhoneScreen>
      </PhoneContainer>
    </PreviewContainer>
  );
};

export default PreviewPage; 