import React from 'react';
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

const ComponentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px;
  ${props => props.selected && `
    outline: 2px solid #1677ff;
    outline-offset: 2px;
  `}
`;

const DeleteButton = styled.div`
  position: absolute;
  right: -20px;
  top: -20px;
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
  z-index: 1;
  display: ${props => props['data-visible'] ? 'flex' : 'none'};
`;

const EditableComponent = ({ id, type, x, y, width, height, selected, properties = {}, onUpdate, onDelete }) => {
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
    <Rnd
      default={{
        x: x,
        y: y,
        width: width,
        height: height
      }}
      onDragStop={(e, d) => {
        onUpdate({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y
        });
      }}
      bounds="parent"
      minWidth={50}
      minHeight={30}
    >
      <ComponentWrapper 
        selected={selected}
      >
        {selected && (
          <DeleteButton
            data-visible={selected}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ×
          </DeleteButton>
        )}
        {renderComponent()}
      </ComponentWrapper>
    </Rnd>
  );
};

export default EditableComponent; 