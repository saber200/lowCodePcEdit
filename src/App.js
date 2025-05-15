import React, { useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'antd-mobile/es/global';
import { Toast } from 'antd-mobile';

import ComponentList from './components/editor/ComponentList';
import EditableComponent from './components/editor/EditableComponent';
import PropertyPanel from './components/property-panel/PropertyPanel';
import Header from './components/editor/Header';
import PreviewPage from './pages/PreviewPage';
import { getDefaultComponentSize, getComponentProperties } from './utils/componentProperties';
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

const Canvas = styled.div`
  flex: 1;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Editor() {
  const [components, setComponents] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const handleSave = useCallback(() => {
    try {
      // 创建页面配置对象
      const pageConfig = {
        version: '1.0.0',
        components: components.map(comp => ({
          id: comp.id,
          type: comp.type,
          x: comp.x,
          y: comp.y,
          width: comp.width,
          height: comp.height,
          properties: comp.properties
        })),
        lastModified: new Date().toISOString()
      };

      // 将对象转换为JSON字符串
      const jsonStr = JSON.stringify(pageConfig, null, 2);
      
      // 创建Blob对象
      const blob = new Blob([jsonStr], { type: 'application/json' });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 生成文件名：page-config-时间戳.json
      const timestamp = new Date().getTime();
      link.download = `page-config-${timestamp}.json`;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      Toast.show({
        content: '页面配置已保存',
        duration: 1500,
      });
    } catch (error) {
      console.error('保存失败:', error);
      Toast.show({
        content: '保存失败，请重试',
        duration: 1500,
      });
    }
  }, [components]);

  const handlePreview = useCallback(() => {
    if (components.length === 0) {
      Toast.show({
        content: '请先添加一些组件',
        duration: 1500,
      });
      return;
    }
    // 将组件数据存储到 localStorage
    localStorage.setItem('previewComponents', JSON.stringify(components));
    // 导航到预览页面
    navigate('/preview');
  }, [components, navigate]);

  const handleDragStart = (e, componentType) => {
    e.dataTransfer.setData('componentType', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    if (!componentType) return;

    const editorContent = editorRef.current;
    if (!editorContent) return;

    const rect = editorContent.getBoundingClientRect();
    const scrollTop = editorContent.scrollTop || 0;
    const scrollLeft = editorContent.scrollLeft || 0;

    // Calculate position relative to the editor content area
    const x = e.clientX - rect.left + scrollLeft;
    const y = e.clientY - rect.top + scrollTop;

    // Get default size for the component
    const { width, height } = getDefaultComponentSize(componentType);
    
    // Ensure the component is placed within bounds
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

    setComponents([...components, newComponent]);
    setNextId(nextId + 1);
    setSelectedId(nextId);
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
    setComponents(prevComponents =>
      prevComponents.map(comp => {
        if (comp.id === id) {
          if ('selected' in updates) {
            setSelectedId(updates.selected ? id : null);
            return comp;
          }
          return { ...comp, ...updates };
        }
        // Deselect other components when one is selected
        if ('selected' in updates && updates.selected) {
          return { ...comp };
        }
        return comp;
      })
    );
  }, []);

  const deleteComponent = useCallback((id) => {
    setComponents(prevComponents => prevComponents.filter(comp => comp.id !== id));
    setSelectedId(prev => prev === id ? null : prev);
  }, []);

  const updateComponentProperty = useCallback((id, propertyName, value) => {
    setComponents(prevComponents =>
      prevComponents.map(comp =>
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
    );
  }, []);

  return (
    <AppLayout>
      <Header onSave={handleSave} onPreview={handlePreview} />
      <EditorLayout>
        <ComponentList onDragStart={handleDragStart} />
        <Canvas>
          <EditorContainer>
            <div 
              ref={editorRef}
              className="editor-content"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleCanvasClick}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '100vh'
              }}
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
            </div>
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
