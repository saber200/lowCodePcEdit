import React from 'react';
import styled from 'styled-components';
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
  List,
  SwipeAction,
  TabBar
} from 'antd-mobile';

const ComponentWrapper = styled.div`
  position: absolute;
  pointer-events: none;
  transform: translate(${props => props.x}px, ${props => props.y}px);
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

const PreviewComponent = ({ type, x, y, width, height, properties = {} }) => {
  const renderComponent = () => {
    switch (type) {
      case 'Button':
        return (
          <Button
            color={properties.color || 'primary'}
            fill={properties.fill || 'solid'}
            size={properties.size || 'middle'}
            block={properties.block}
          >
            {properties.text || '按钮'}
          </Button>
        );
      
      case 'Input':
        return (
          <Input
            placeholder={properties.placeholder || '请输入'}
            type={properties.type || 'text'}
            clearable={properties.clearable}
            disabled={properties.disabled}
          />
        );
      
      case 'Card':
        return (
          <Card
            title={properties.title || '卡片标题'}
            extra={properties.extra}
            style={{ width: '100%' }}
          >
            {properties.content || '卡片内容'}
          </Card>
        );
      
      case 'Tag':
        return (
          <Tag
            color={properties.color || 'primary'}
            fill={properties.fill ? 'solid' : 'outline'}
            round={properties.round}
          >
            {properties.text || '标签'}
          </Tag>
        );
      
      case 'SearchBar':
        return (
          <SearchBar
            placeholder={properties.placeholder || '请输入搜索关键词'}
            showCancelButton={properties.showCancelButton}
          />
        );
      
      case 'NavBar':
        return (
          <NavBar
            back={properties.showBack ? (properties.back || '返回') : null}
            right={properties.right}
          >
            {properties.title || '标题'}
          </NavBar>
        );
      
      case 'Switch':
        return (
          <Switch
            checked={properties.checked}
            disabled={properties.disabled}
          />
        );
      
      case 'Grid':
        const items = (properties.items || '条目1\n条目2\n条目3')
          .split('\n')
          .map((text, index) => ({
            key: index,
            title: text
          }));
        
        return (
          <Grid
            columns={Number(properties.columns) || 3}
            gap={Number(properties.gap) || 8}
            items={items}
          />
        );
      
      case 'List':
        const listItems = properties.items || [
          { title: '列表项1', description: '描述信息1' },
          { title: '列表项2', description: '描述信息2' }
        ];
        
        return (
          <List>
            {listItems.map((item, index) => (
              <List.Item
                key={index}
                description={item.description}
              >
                {item.title}
              </List.Item>
            ))}
          </List>
        );
      
      default:
        return <div>不支持的组件类型: {type}</div>;
    }
  };

  return (
    <ComponentWrapper
      x={x}
      y={y}
      width={width}
      height={height}
    >
      {renderComponent()}
    </ComponentWrapper>
  );
};

export default PreviewComponent; 