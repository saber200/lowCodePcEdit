import React, { useCallback, forwardRef } from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';
import { 
  Button, 
  Input, 
  Card, 
  Tag, 
  SearchBar,
  NavBar,
  Switch,
  Radio,
  Checkbox,
  Rate,
  Stepper,
  Grid,
  SwipeAction,
  TabBar
} from 'antd-mobile';
import { snapPositionToGrid, snapDimensionsToGrid, GRID_SIZE } from '../../utils/gridUtils';
import { renderComponent } from '../../utils/componentRenderer';

const ComponentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  ${props => props.selected && `
    outline: 2px solid #1677ff;
    outline-offset: 2px;
    z-index: 1;
  `}
  
  &:hover {
    outline: 1px solid #1677ff;
    outline-offset: 1px;
  }

  .adm-button {
    width: 100%;
    height: 100%;
  }

  .adm-input {
    width: 100%;
    height: 100%;
  }

  .adm-card {
    width: 100%;
    height: 100%;
  }

  .adm-tag {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .adm-search-bar {
    width: 100%;
    height: 100%;
  }

  .adm-nav-bar {
    width: 100%;
    height: 100%;
  }

  .adm-switch {
    margin: auto;
  }

  .adm-radio-group {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .adm-checkbox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .adm-rate {
    margin: auto;
  }

  .adm-stepper {
    margin: auto;
  }

  .adm-grid {
    width: 100%;
    height: 100%;
  }

  .adm-swipe-action {
    width: 100%;
    height: 100%;
  }

  .adm-tab-bar {
    width: 100%;
    height: 100%;
  }
`;

const DeleteButton = styled.div`
  position: absolute;
  right: -10px;
  top: -10px;
  width: 20px;
  height: 20px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  z-index: 10000;
  transform: translate(0, 0);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.2s;

  &.visible {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }

  &:hover {
    background: #ff7875;
  }
`;

const StyledRnd = styled(Rnd)`
  &:hover ${DeleteButton} {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }
`;

const EditableComponent = forwardRef(({ id, type, x, y, width, height, selected, properties = {}, onUpdate, onDelete }, ref) => {
  const handleSelect = useCallback((e) => {
    e.stopPropagation();
    if (!selected) {
      onUpdate(id, { selected: true });
    }
  }, [id, selected, onUpdate]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(id);
  }, [id, onDelete]);

  const handleDragStop = useCallback((e, d) => {
    e.stopPropagation();
    const { x, y } = snapPositionToGrid(d.x, d.y);
    onUpdate(id, { x, y });
  }, [id, onUpdate]);

  const handleResizeStop = useCallback((e, direction, ref, delta, position) => {
    e.stopPropagation();
    const newWidth = parseInt(ref.style.width);
    const newHeight = parseInt(ref.style.height);
    const { width: snappedWidthRaw, height: snappedHeight } = snapDimensionsToGrid(newWidth, newHeight);
    const { x: snappedX, y: snappedY } = snapPositionToGrid(position.x, position.y);
    const SCREEN_WIDTH = 404;
    let snappedWidth = snappedWidthRaw;
    if (snappedX + snappedWidth > SCREEN_WIDTH) {
      snappedWidth = SCREEN_WIDTH - snappedX;
    }
    onUpdate(id, {
      width: snappedWidth,
      height: snappedHeight,
      x: snappedX,
      y: snappedY
    });
  }, [id, onUpdate]);

  return (
    <StyledRnd
      ref={ref}
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onClick={handleSelect}
      bounds="parent"
      dragGrid={[GRID_SIZE, GRID_SIZE]}
      resizeGrid={[GRID_SIZE, GRID_SIZE]}
      minWidth={GRID_SIZE * 2}
      minHeight={GRID_SIZE * 2}
    >
      <ComponentWrapper selected={selected}>
        {renderComponent(type, properties)}
        <DeleteButton
          className={selected ? 'visible' : ''}
          onClick={handleDelete}
        >
          ×
        </DeleteButton>
      </ComponentWrapper>
    </StyledRnd>
  );
});

EditableComponent.displayName = 'EditableComponent';

export default EditableComponent; 