import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import 'antd-mobile/es/global';

import ComponentList from './components/editor/ComponentList';
import EditableComponent from './components/editor/EditableComponent';
import PropertyPanel from './components/property-panel/PropertyPanel';
import { getDefaultComponentSize, getComponentProperties } from './utils/componentProperties';
import EditorContainer from './components/editor/EditorContainer';

const EditorLayout = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
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

function App() {
  const [components, setComponents] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const editorRef = useRef(null);

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

  const updateComponent = (id, updates) => {
    setComponents(
      components.map((comp) => {
        if (comp.id === id) {
          if ('selected' in updates) {
            setSelectedId(updates.selected ? id : null);
            return comp;
          }
          return { ...comp, ...updates };
        }
        return comp;
      })
    );
  };

  const deleteComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const updateComponentProperty = (id, propertyName, value) => {
    setComponents(
      components.map((comp) =>
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
  };

  const selectedComponent = components.find((comp) => comp.id === selectedId);

  return (
    <EditorLayout>
      <ComponentList onDragStart={handleDragStart} />
      <Canvas>
        <EditorContainer>
          <div 
            ref={editorRef}
            className="editor-content"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedId(null);
              }
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
  );
}

export default App;
