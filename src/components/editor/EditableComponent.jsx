import React from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { renderComponent } from '../../utils/componentRenderer';

const ComponentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border: 1px dashed #ccc;
  border-radius: 8px;
  cursor: move;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  &.selected {
    border: 2px solid #1677ff;
  }
`;

const DeleteButton = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  background: #ff3141;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    background: #ff4757;
  }

  ${ComponentWrapper}.selected ~ & {
    opacity: 1;
  }
`;

const GRID_SIZE = 8; // 8px 网格

const EditableComponent = ({ id, type, x, y, width, height, properties, onUpdate, selected, onDelete }) => {
  const getGridWidth = () => {
    const gridOverlay = document.querySelector('.editor-grid-overlay');
    return gridOverlay ? gridOverlay.clientWidth : 366;
  };

  const updateContainerHeight = (newY, componentHeight) => {
    const gridOverlay = document.querySelector('.editor-grid-overlay');
    const contentArea = document.querySelector('.editor-content');
    const columnGuides = document.querySelector('.editor-column-guides');
    
    if (gridOverlay && contentArea && columnGuides) {
      const bottomPosition = newY + componentHeight + 50; // 添加50px的底部边距
      const newHeight = Math.max(bottomPosition, gridOverlay.clientHeight);
      
      // 更新所有相关容器的高度
      [gridOverlay, contentArea, columnGuides].forEach(element => {
        element.style.height = `${newHeight}px`;
        element.style.bottom = 'auto';
      });
    }
  };

  return (
    <Rnd
      position={{ x, y }}
      size={{ width, height }}
      minWidth={50}
      minHeight={30}
      maxWidth={366}
      bounds=".editor-grid-overlay"
      dragGrid={[GRID_SIZE, GRID_SIZE]}
      resizeGrid={[GRID_SIZE, GRID_SIZE]}
      enableResizing={{
        top: false,
        right: true,
        bottom: true,
        left: true,
        topRight: false,
        bottomRight: true,
        bottomLeft: true,
        topLeft: false
      }}
      onDrag={(e, d) => {
        // 在拖动过程中实时更新高度
        updateContainerHeight(d.y, height);
      }}
      onDragStop={(e, d) => {
        const newX = Math.round(d.x / GRID_SIZE) * GRID_SIZE;
        const newY = Math.round(d.y / GRID_SIZE) * GRID_SIZE;
        onUpdate(id, { x: newX, y: newY });
        updateContainerHeight(newY, height);
      }}
      onResize={(e, direction, ref, delta, position) => {
        // 在调整大小过程中实时更新高度
        updateContainerHeight(position.y, parseInt(ref.style.height));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newWidth = Math.round(parseInt(ref.style.width) / GRID_SIZE) * GRID_SIZE;
        const newHeight = Math.round(parseInt(ref.style.height) / GRID_SIZE) * GRID_SIZE;
        const newX = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
        const newY = Math.round(position.y / GRID_SIZE) * GRID_SIZE;
        
        onUpdate(id, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY
        });
        updateContainerHeight(newY, newHeight);
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <ComponentWrapper 
          className={selected ? 'selected' : ''}
          onClick={(e) => {
            e.stopPropagation();
            onUpdate(id, { selected: true });
          }}
        >
          {renderComponent(type, properties)}
        </ComponentWrapper>
        <DeleteButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(id);
          }}
        >
          ×
        </DeleteButton>
      </div>
    </Rnd>
  );
};

export default EditableComponent;