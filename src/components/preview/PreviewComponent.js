import React, { useState } from 'react';
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
  TabBar,
  Space
} from 'antd-mobile';

const ComponentWrapper = styled.div`
  position: absolute;
  transform: translate(${props => props.x}px, ${props => props.y}px);
  width: ${props => props.width}px;
  height: ${props => props.height}px;

  // 禁用拖拽相关的事件
  -webkit-user-drag: none;
  user-select: none;

  // 允许内部组件的交互
  & > * {
    pointer-events: auto;
  }
`;

const PreviewComponent = ({ type, x, y, width, height, properties = {} }) => {
  // 为需要状态的组件添加本地状态
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [switchChecked, setSwitchChecked] = useState(properties.checked || false);
  const [radioValue, setRadioValue] = useState(properties.defaultValue || '1');
  const [checkboxChecked, setCheckboxChecked] = useState(properties.checked || false);
  const [rateValue, setRateValue] = useState(Number(properties.defaultValue) || 0);
  const [stepperValue, setStepperValue] = useState(Number(properties.defaultValue) || 0);
  const [activeTab, setActiveTab] = useState(properties.defaultActiveKey || '首页');

  const renderComponent = () => {
    switch (type) {
      case 'Button':
        return (
          <Button
            color={properties.color || 'primary'}
            fill={properties.fill || 'solid'}
            size={properties.size || 'middle'}
            block={properties.block}
            onClick={() => console.log('Button clicked')}
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
            value={inputValue}
            onChange={setInputValue}
          />
        );
      
      case 'Card':
        return (
          <Card
            title={properties.title || '卡片标题'}
            extra={properties.extra}
            style={{ width: '100%' }}
            onClick={() => console.log('Card clicked')}
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
            value={searchValue}
            onChange={setSearchValue}
            onSearch={(val) => console.log('Search:', val)}
          />
        );
      
      case 'NavBar':
        return (
          <NavBar
            back={properties.showBack ? (properties.back || '返回') : null}
            right={properties.right}
            onBack={() => console.log('NavBar back clicked')}
          >
            {properties.title || '标题'}
          </NavBar>
        );
      
      case 'Switch':
        return (
          <Switch
            checked={switchChecked}
            onChange={setSwitchChecked}
            disabled={properties.disabled}
          />
        );

      case 'Radio':
        const radioOptions = properties.options || [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
          { label: '选项三', value: '3' }
        ];
        return (
          <Radio.Group
            value={radioValue}
            onChange={setRadioValue}
            disabled={properties.disabled}
          >
            <Space direction={properties.direction || 'vertical'}>
              {radioOptions.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case 'Checkbox':
        return (
          <Checkbox
            checked={checkboxChecked}
            onChange={setCheckboxChecked}
            disabled={properties.disabled}
            indeterminate={properties.indeterminate}
          >
            {properties.text || '复选框'}
          </Checkbox>
        );

      case 'Rate':
        return (
          <Rate
            value={rateValue}
            onChange={setRateValue}
            count={Number(properties.count) || 5}
            allowHalf={properties.allowHalf}
            disabled={properties.disabled}
          />
        );

      case 'Stepper':
        return (
          <Stepper
            value={stepperValue}
            onChange={setStepperValue}
            min={Number(properties.min) || 0}
            max={Number(properties.max) || 100}
            step={Number(properties.step) || 1}
            disabled={properties.disabled}
          />
        );
      
      case 'Grid':
        const items = (properties.items || '条目1\n条目2\n条目3')
          .split('\n')
          .map((text, index) => ({
            key: index,
            title: text,
            onClick: () => console.log('Grid item clicked:', text)
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
                onClick={() => console.log('List item clicked:', item.title)}
              >
                {item.title}
              </List.Item>
            ))}
          </List>
        );

      case 'SwipeAction':
        const rightActions = (properties.rightActions || 'Delete|danger\nEdit|primary')
          .split('\n')
          .map(action => {
            const [text, color] = action.split('|');
            return {
              key: text,
              text: text,
              color: color,
              onClick: () => console.log('SwipeAction clicked:', text)
            };
          });

        return (
          <SwipeAction rightActions={rightActions}>
            <List.Item>{properties.content || '可滑动列表项'}</List.Item>
          </SwipeAction>
        );

      case 'TabBar':
        const tabItems = (properties.items || '首页\n待办\n我的')
          .split('\n')
          .map(title => ({
            key: title,
            title: title,
            icon: null
          }));

        return (
          <TabBar
            activeKey={activeTab}
            onChange={setActiveTab}
            safeArea={properties.safeArea}
          >
            {tabItems.map(item => (
              <TabBar.Item key={item.key} title={item.title} />
            ))}
          </TabBar>
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