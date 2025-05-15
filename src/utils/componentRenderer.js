import React from 'react';
import {
  Button,
  Input,
  Card,
  Tag,
  NavBar,
  TabBar,
  Grid,
  List,
  Avatar,
  SwipeAction,
  Space,
  Radio,
  Checkbox,
  Rate,
  Stepper,
  SearchBar,
  Switch
} from 'antd-mobile';
import '../styles/variables.css';
import '../styles/components.css';

// Component wrapper with CSS classes
const ComponentWrapper = ({ children, type }) => {
  const getWrapperClassName = () => {
    const baseClass = 'component-wrapper';
    const typeClass = `${type.toLowerCase()}-wrapper`;
    return `${baseClass} ${typeClass}`;
  };

  const getContentClassName = () => {
    const baseClass = 'component-content';
    const classes = [baseClass];
    
    // Add full-width class for components that need it
    if (['NavBar', 'TabBar', 'List', 'SwipeAction', 'Grid'].includes(type)) {
      classes.push('component-content--full-width');
    }
    
    // Add full-height class for components that need it
    if (['NavBar', 'TabBar'].includes(type)) {
      classes.push('component-content--full-height');
    }

    // Add safe area classes for components that need it
    if (type === 'NavBar') {
      classes.push('safe-area-top');
    }
    if (type === 'TabBar') {
      classes.push('safe-area-bottom');
    }

    return classes.join(' ');
  };

  return (
    <div className={getWrapperClassName()}>
      <div className={getContentClassName()}>
        {children}
      </div>
    </div>
  );
};

export const renderComponent = (type, properties = {}) => {
  const renderContent = () => {
    switch (type) {
      case 'Button':
        return (
          <Button 
            color={properties?.color || 'primary'}
            fill={properties?.fill || 'solid'}
            size={properties?.size || 'middle'}
            block={properties?.block}
          >
            {properties?.text || '按钮'}
          </Button>
        );
      case 'Input':
        return (
          <Input 
            placeholder={properties?.placeholder || '请输入'}
            type={properties?.type || 'text'}
            clearable={properties?.clearable}
            disabled={properties?.disabled}
          />
        );
      case 'SearchBar':
        return (
          <SearchBar 
            placeholder={properties?.placeholder || '请输入搜索关键词'}
            showCancelButton={properties?.showCancelButton}
            cancelText={properties?.cancelText}
            maxLength={parseInt(properties?.maxLength) || 50}
          />
        );
      case 'NavBar':
        return (
          <NavBar 
            back={properties?.showBack ? properties?.back : null}
            right={properties?.right}
          >
            {properties?.title || '标题'}
          </NavBar>
        );
      case 'Card':
        return (
          <Card 
            title={properties?.title || '卡片标题'}
            extra={properties?.extra}
            headerStyle={properties?.headerStyle === 'primary' ? { color: 'var(--primary-color)' } : {}}
          >
            <Card.Body>{properties?.content || '卡片内容'}</Card.Body>
          </Card>
        );
      case 'Switch':
        return (
          <Switch
            checked={properties?.checked}
            disabled={properties?.disabled}
            loading={properties?.loading}
          />
        );
      case 'Radio':
        const radioOptions = (properties?.options || '选项1\n选项2\n选项3').split('\n');
        return (
          <Radio.Group
            defaultValue={properties?.defaultValue}
            disabled={properties?.disabled}
          >
            <Space direction={properties?.direction || 'vertical'}>
              {radioOptions.map((option, index) => (
                <Radio key={index} value={option}>{option}</Radio>
              ))}
            </Space>
          </Radio.Group>
        );
      case 'Checkbox':
        return (
          <Checkbox
            checked={properties?.checked}
            disabled={properties?.disabled}
            indeterminate={properties?.indeterminate}
          >
            {properties?.text || '复选框'}
          </Checkbox>
        );
      case 'Rate':
        return (
          <Rate
            count={parseInt(properties?.count) || 5}
            defaultValue={parseInt(properties?.defaultValue) || 0}
            allowHalf={properties?.allowHalf}
            disabled={properties?.disabled}
          />
        );
      case 'Stepper':
        return (
          <Stepper
            defaultValue={parseInt(properties?.defaultValue) || 0}
            min={parseInt(properties?.min) || 0}
            max={parseInt(properties?.max) || 100}
            step={parseInt(properties?.step) || 1}
            disabled={properties?.disabled}
          />
        );
      case 'Tag':
        return (
          <Tag 
            color={properties?.color || 'primary'}
            fill={properties?.fill}
            round={properties?.round}
          >
            {properties?.text || '标签'}
          </Tag>
        );
      case 'Grid':
        const gridItems = (properties?.items || '条目1\n条目2\n条目3\n条目4\n条目5\n条目6').split('\n');
        return (
          <Grid 
            columns={parseInt(properties?.columns) || 3} 
            gap={parseInt(properties?.gap) || 8}
          >
            {gridItems.map((item, index) => (
              <Grid.Item key={index}>{item}</Grid.Item>
            ))}
          </Grid>
        );
      case 'List':
        const listItems = (properties?.items || '列表项1|描述信息\n列表项2|描述信息').split('\n');
        return (
          <List mode={properties?.mode || 'default'}>
            {listItems.map((item, index) => {
              const [title, description] = item.split('|');
              return (
                <List.Item
                  key={index}
                  prefix={properties?.showAvatar ? <Avatar src='' /> : null}
                  description={description}
                >
                  {title}
                </List.Item>
              );
            })}
          </List>
        );
      case 'SwipeAction':
        const actions = (properties?.rightActions || '删除|danger\n编辑|primary').split('\n')
          .map(action => {
            const [text, color] = action.split('|');
            return { key: text, text, color };
          });

        return (
          <SwipeAction rightActions={actions}>
            <List.Item>{properties?.content || '可滑动列表项'}</List.Item>
          </SwipeAction>
        );
      case 'TabBar':
        const tabItems = (properties?.items || '首页\n待办\n我的').split('\n');
        return (
          <TabBar 
            defaultActiveKey={properties?.defaultActiveKey || tabItems[0]}
            safeArea={properties?.safeArea}
          >
            {tabItems.map((item) => (
              <TabBar.Item key={item} title={item} />
            ))}
          </TabBar>
        );
      default:
        return <div>未知组件</div>;
    }
  };

  return (
    <ComponentWrapper type={type}>
      {renderContent()}
    </ComponentWrapper>
  );
}; 