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
    const { width: snappedWidth, height: snappedHeight } = snapDimensionsToGrid(newWidth, newHeight);
    const { x: snappedX, y: snappedY } = snapPositionToGrid(position.x, position.y);
    
    onUpdate(id, {
      width: snappedWidth,
      height: snappedHeight,
      x: snappedX,
      y: snappedY
    });
  }, [id, onUpdate]);

  const renderComponent = () => {
    const props = properties || {};
    
    switch (type) {
      case 'Button':
        return (
          <Button 
            color={props.color || 'primary'} 
            fill={props.fill || 'solid'}
            size={props.size || 'middle'}
            block={props.block}
          >
            {props.text || '按钮'}
          </Button>
        );
      case 'Input':
        return (
          <Input
            placeholder={props.placeholder || '请输入'}
            type={props.type || 'text'}
            clearable={props.clearable !== false}
            disabled={props.disabled}
          />
        );
      case 'Card':
        return (
          <Card
            title={props.title || '卡片标题'}
            extra={props.extra}
            style={{ 
              '--adm-color-background': props.headerStyle === 'primary' ? '#1677ff' : undefined,
              '--adm-color-text': props.headerStyle === 'primary' ? '#fff' : undefined
            }}
          >
            {props.content || '卡片内容'}
          </Card>
        );
      case 'Tag':
        return (
          <Tag
            color={props.color || 'primary'}
            fill={props.fill}
            round={props.round}
          >
            {props.text || '标签'}
          </Tag>
        );
      case 'SearchBar':
        return (
          <SearchBar
            placeholder={props.placeholder || '请输入搜索关键词'}
            showCancelButton={props.showCancelButton}
            cancelText={props.cancelText}
            maxLength={parseInt(props.maxLength) || 50}
          />
        );
      case 'NavBar':
        return (
          <NavBar
            back={props.showBack ? props.back || '返回' : null}
            right={props.right}
          >
            {props.title || '标题'}
          </NavBar>
        );
      case 'Switch':
        return (
          <Switch
            checked={props.checked}
            disabled={props.disabled}
            loading={props.loading}
          />
        );
      case 'Radio':
        return (
          <Radio.Group
            defaultValue={props.defaultValue}
            disabled={props.disabled}
            direction={props.direction || 'vertical'}
          >
            {(props.options || []).map((option, index) => (
              <Radio key={index} value={option.value}>{option.label}</Radio>
            ))}
          </Radio.Group>
        );
      case 'Checkbox':
        return (
          <Checkbox
            checked={props.checked}
            disabled={props.disabled}
            indeterminate={props.indeterminate}
          >
            {props.text || '复选框'}
          </Checkbox>
        );
      case 'Rate':
        return (
          <Rate
            count={parseInt(props.count) || 5}
            defaultValue={parseInt(props.defaultValue) || 0}
            allowHalf={props.allowHalf}
            disabled={props.disabled}
          />
        );
      case 'Stepper':
        return (
          <Stepper
            defaultValue={parseInt(props.defaultValue) || 0}
            min={parseInt(props.min) || 0}
            max={parseInt(props.max) || 100}
            step={parseInt(props.step) || 1}
            disabled={props.disabled}
          />
        );
      case 'Grid':
        return (
          <Grid columns={parseInt(props.columns) || 4} gap={parseInt(props.gap) || 8}>
            {(props.items || []).map((item, index) => (
              <Grid.Item key={index}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px' }}>{item.icon}</div>
                  <div>{item.text}</div>
                </div>
              </Grid.Item>
            ))}
          </Grid>
        );
      case 'SwipeAction':
        return (
          <SwipeAction
            rightActions={(props.rightActions || []).map(action => ({
              key: action.text,
              text: action.text,
              color: action.color
            }))}
          >
            {props.content || '滑动操作项'}
          </SwipeAction>
        );
      case 'TabBar':
        return (
          <TabBar defaultActiveKey={props.defaultActiveKey}>
            {(props.items || []).map(item => (
              <TabBar.Item
                key={item.key}
                icon={<span style={{ fontSize: '20px' }}>{item.icon}</span>}
                title={item.title}
              />
            ))}
          </TabBar>
        );
      default:
        return <div>Unknown component type: {type}</div>;
    }
  };

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
        {renderComponent()}
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