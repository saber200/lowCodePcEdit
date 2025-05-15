import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 250px;
  background: #f0f0f0;
  padding: 20px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
`;

const ComponentCategory = styled.div`
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h4`
  margin-bottom: 10px;
  color: #666;
`;

const DraggableComponent = styled.div`
  padding: 10px;
  margin: 5px 0;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: move;
  user-select: none;
  &:hover {
    background: #f5f5f5;
  }
`;

const componentCategories = {
  '导航布局': ['NavBar', 'TabBar'],
  '基础组件': ['Button', 'Tag'],
  '表单组件': ['Input', 'SearchBar', 'Switch', 'Radio', 'Checkbox', 'Rate', 'Stepper'],
  '数据展示': ['Grid', 'Card'],
  '操作反馈': ['SwipeAction'],
};

const ComponentList = ({ onDragStart }) => {
  return (
    <Container>
      <h3>组件列表</h3>
      {Object.entries(componentCategories).map(([category, components]) => (
        <ComponentCategory key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          {components.map((type) => (
            <DraggableComponent
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
            >
              {type}
            </DraggableComponent>
          ))}
        </ComponentCategory>
      ))}
    </Container>
  );
};

export default ComponentList; 