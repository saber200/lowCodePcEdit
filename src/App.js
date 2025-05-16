import React, { useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'antd-mobile/es/global';
import { Toast } from 'antd-mobile';

import ComponentList from './components/editor/ComponentList';
import EditableComponent from './components/editor/EditableComponent';
import PropertyPanel from './components/property-panel/PropertyPanel';
import Header from './components/editor/Header';
import PageManager from './components/editor/PageManager';
import PreviewPage from './pages/PreviewPage';
import { getDefaultComponentSize } from './utils/componentProperties';
import EditorContainer from './components/editor/EditorContainer';

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const EditorLayout = styled.div`
  display: flex;
  flex: 1;
  background: #f5f5f5;
`;

const SidebarLayout = styled.div`
  display: flex;
  background: #fff;
  border-right: 1px solid #eee;
`;

const Canvas = styled.div`
  flex: 1;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EditorContent = styled.div`
  position: relative;
  width: 404px;
  height: 848px;
  background: white;
  border-radius: 45px;
  overflow: hidden;
`;

function Editor() {
  // 页面相关的状态
  const [pages, setPages] = useState(() => {
    // 尝试从 localStorage 恢复数据
    const savedPages = localStorage.getItem('previewPages');
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages);
      // Sort pages: home first, then regular pages by ID, profile last
      return parsedPages.sort((a, b) => {
        if (a.type === 'home') return -1;
        if (b.type === 'home') return 1;
        if (a.type === 'profile') return 1;
        if (b.type === 'profile') return -1;
        return a.id - b.id;
      });
    }
    // 如果没有保存的数据，返回默认值
    return [
      { id: 1, name: '首页', type: 'home', components: [], nextId: 1 },
      { id: 2, name: '我的', type: 'profile', components: [], nextId: 1 }
    ];
  });

  const [currentPageId, setCurrentPageId] = useState(() => {
    // 尝试从 localStorage 恢复当前页面 ID
    const savedCurrentPageId = localStorage.getItem('currentPageId');
    return savedCurrentPageId ? Number(savedCurrentPageId) : 1;
  });
  
  // 获取当前页面
  const currentPage = pages.find(page => page.id === currentPageId);
  const components = currentPage?.components || [];
  const nextId = currentPage?.nextId || 1;

  const [selectedId, setSelectedId] = useState(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  // 页面管理相关的处理函数
  const handleAddPage = useCallback((pageName, pageType = 'normal', parentId = null) => {
    setPages(prevPages => {
      const newPages = [
        ...prevPages,
        {
          id: Math.max(...prevPages.map(p => p.id)) + 1,
          name: pageName,
          type: pageType,
          parentId: parentId,
          components: [],
          nextId: 1
        }
      ];
      // 保存到 localStorage
      localStorage.setItem('previewPages', JSON.stringify(newPages));
      return newPages;
    });
  }, []);

  const handleSelectPage = useCallback((pageId) => {
    setCurrentPageId(pageId);
    // 保存当前页面ID到 localStorage
    localStorage.setItem('currentPageId', pageId.toString());
    setSelectedId(null);
  }, []);

  const handleDeletePage = useCallback((pageId) => {
    setPages(prevPages => {
      const newPages = prevPages.filter(p => p.id !== pageId);
      // 保存到 localStorage
      localStorage.setItem('previewPages', JSON.stringify(newPages));
      return newPages;
    });
    if (currentPageId === pageId) {
      const newCurrentPageId = pages.find(p => p.id !== pageId)?.id;
      setCurrentPageId(newCurrentPageId);
      // 保存当前页面ID到 localStorage
      localStorage.setItem('currentPageId', newCurrentPageId?.toString() || '1');
    }
  }, [currentPageId, pages]);

  const handleRenamePage = useCallback((pageId, newName) => {
    setPages(prevPages => {
      const newPages = prevPages.map(page =>
        page.id === pageId
          ? { ...page, name: newName }
          : page
      );
      // 保存到 localStorage
      localStorage.setItem('previewPages', JSON.stringify(newPages));
      return newPages;
    });
  }, []);

  const handleReset = useCallback(() => {
    const defaultPages = [
      { id: 1, name: '首页', type: 'home', components: [], nextId: 1 },
      { id: 2, name: '我的', type: 'profile', components: [], nextId: 1 }
    ];
    setPages(defaultPages);
    setCurrentPageId(1);
    setSelectedId(null);
    // 保存默认状态到 localStorage
    localStorage.setItem('previewPages', JSON.stringify(defaultPages));
    localStorage.setItem('currentPageId', '1');
    Toast.show({
      content: '已重置编辑器',
      duration: 1500,
    });
  }, []);

  const handleSave = useCallback(() => {
    try {
      // 创建多页面配置对象
      const config = {
        version: '1.0.0',
        pages: pages.map(page => ({
          id: page.id,
          name: page.name,
          components: page.components.map(comp => ({
            id: comp.id,
            type: comp.type,
            x: comp.x,
            y: comp.y,
            width: comp.width,
            height: comp.height,
            properties: comp.properties
          }))
        })),
        lastModified: new Date().toISOString()
      };

      const jsonStr = JSON.stringify(config, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().getTime();
      link.download = `miniapp-config-${timestamp}.json`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      Toast.show({
        content: '小程序配置已保存',
        duration: 1500,
      });
    } catch (error) {
      console.error('保存失败:', error);
      Toast.show({
        content: '保存失败，请重试',
        duration: 1500,
      });
    }
  }, [pages]);

  const handlePreview = useCallback(() => {
    if (pages.every(page => page.components.length === 0)) {
      Toast.show({
        content: '请先添加一些组件',
        duration: 1500,
      });
      return;
    }
    // 导航到预览页面（不需要再保存数据，因为已经实时保存了）
    navigate('/preview');
  }, [pages, navigate]);

  // 组件操作相关的处理函数
  const updatePageData = useCallback((updater) => {
    setPages(prevPages => {
      const newPages = prevPages.map(page =>
        page.id === currentPageId
          ? updater(page)
          : page
      );
      // 保存到 localStorage
      localStorage.setItem('previewPages', JSON.stringify(newPages));
      return newPages;
    });
  }, [currentPageId]);

  const handleDrop = (e) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    if (!componentType) return;

    const editorContent = editorRef.current;
    if (!editorContent) return;

    const rect = editorContent.getBoundingClientRect();
    const scrollTop = editorContent.scrollTop || 0;
    const scrollLeft = editorContent.scrollLeft || 0;

    const x = e.clientX - rect.left + scrollLeft;
    const y = e.clientY - rect.top + scrollTop;

    const { width, height } = getDefaultComponentSize(componentType);
    
    const boundedX = Math.max(0, Math.min(x, rect.width - width));
    const boundedY = Math.max(0, Math.min(y, rect.height - height));

    const newComponent = {
      id: nextId,
      type: componentType,
      x: boundedX,
      y: boundedY,
      width,
      height,
      properties: {}
    };

    updatePageData(page => ({
      ...page,
      components: [...page.components, newComponent],
      nextId: page.nextId + 1
    }));
    setSelectedId(nextId);
  };

  const handleDragStart = (e, componentType) => {
    e.dataTransfer.setData('componentType', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  }, []);

  const selectedComponent = components.find((comp) => comp.id === selectedId);

  const updateComponent = useCallback((id, updates) => {
    updatePageData(page => ({
      ...page,
      components: page.components.map(comp => {
        if (comp.id === id) {
          if ('selected' in updates) {
            setSelectedId(updates.selected ? id : null);
            return comp;
          }
          return { ...comp, ...updates };
        }
        return comp;
      })
    }));
  }, [updatePageData]);

  const deleteComponent = useCallback((id) => {
    updatePageData(page => ({
      ...page,
      components: page.components.filter(comp => comp.id !== id)
    }));
    setSelectedId(prev => prev === id ? null : prev);
  }, [updatePageData]);

  const updateComponentProperty = useCallback((id, propertyName, value) => {
    updatePageData(page => ({
      ...page,
      components: page.components.map(comp =>
        comp.id === id
          ? {
              ...comp,
              properties: {
                ...comp.properties,
                [propertyName]: value,
              },
            }
          : comp
      )
    }));
  }, [updatePageData]);

  return (
    <AppLayout>
      <Header 
        onSave={handleSave} 
        onPreview={handlePreview}
        onReset={handleReset}
      />
      <EditorLayout>
        <SidebarLayout>
          <PageManager
            pages={pages}
            currentPageId={currentPageId}
            onAddPage={handleAddPage}
            onSelectPage={handleSelectPage}
            onDeletePage={handleDeletePage}
            onRenamePage={handleRenamePage}
          />
          <ComponentList onDragStart={handleDragStart} />
        </SidebarLayout>
        <Canvas>
          <EditorContainer>
            <EditorContent 
              ref={editorRef}
              className="editor-content"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleCanvasClick}
            >
              {components.map((component) => (
                <EditableComponent
                  key={component.id}
                  {...component}
                  selected={component.id === selectedId}
                  onUpdate={updateComponent}
                  onDelete={deleteComponent}
                />
              ))}
            </EditorContent>
          </EditorContainer>
        </Canvas>
        <PropertyPanel
          selectedComponent={selectedComponent}
          onPropertyChange={updateComponentProperty}
        />
      </EditorLayout>
    </AppLayout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
