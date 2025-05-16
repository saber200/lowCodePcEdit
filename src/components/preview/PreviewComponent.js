import React, { useState, forwardRef, useEffect } from 'react';
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
  Space,
  Image
} from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import ComponentEventAdapter from '../../events/ComponentEventAdapter';

const ComponentWrapper = styled.div`
  position: absolute;
  transform: translate(${props => props.x}px, ${props => props.y}px);
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: white;
  border-radius: 4px;
  overflow: hidden;

  // 禁用拖拽相关的事件
  -webkit-user-drag: none;
  user-select: none;

  // 允许内部组件的交互
  & > * {
    pointer-events: auto;
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

  .adm-list {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
`;

const PageLinkItem = styled(List.Item)`
  margin: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: white;
`;

// 创建包装组件来处理 antd-mobile 组件的 ref
const StyledButton = forwardRef((props, ref) => (
  <Button {...props} ref={ref} />
));

const StyledInput = forwardRef((props, ref) => (
  <Input {...props} ref={ref} />
));

const StyledCard = forwardRef((props, ref) => (
  <Card {...props} ref={ref} />
));

const StyledTag = forwardRef((props, ref) => (
  <Tag {...props} ref={ref} />
));

const StyledSearchBar = forwardRef((props, ref) => (
  <SearchBar {...props} ref={ref} />
));

const StyledNavBar = forwardRef((props, ref) => (
  <NavBar {...props} ref={ref} />
));

const StyledSwitch = forwardRef((props, ref) => (
  <Switch {...props} ref={ref} />
));

const StyledRadioGroup = forwardRef((props, ref) => (
  <Radio.Group {...props} ref={ref} />
));

const StyledCheckbox = forwardRef((props, ref) => (
  <Checkbox {...props} ref={ref} />
));

const StyledRate = forwardRef((props, ref) => (
  <Rate {...props} ref={ref} />
));

const StyledStepper = forwardRef((props, ref) => (
  <Stepper {...props} ref={ref} />
));

const StyledGrid = forwardRef((props, ref) => (
  <Grid {...props} ref={ref} />
));

const StyledSwipeAction = forwardRef((props, ref) => (
  <SwipeAction {...props} ref={ref} />
));

const StyledTabBar = forwardRef((props, ref) => (
  <TabBar {...props} ref={ref} />
));

const PreviewComponent = forwardRef(({ id, type, x, y, width, height, properties = {}, events = {}, onPageChange }, ref) => {
  // 为需要状态的组件添加本地状态
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [switchChecked, setSwitchChecked] = useState(properties.checked || false);
  const [radioValue, setRadioValue] = useState(properties.defaultValue || '1');
  const [checkboxChecked, setCheckboxChecked] = useState(properties.checked || false);
  const [rateValue, setRateValue] = useState(Number(properties.defaultValue) || 0);
  const [stepperValue, setStepperValue] = useState(Number(properties.defaultValue) || 0);
  const [activeTab, setActiveTab] = useState(properties.defaultActiveKey || '首页');

  useEffect(() => {
    // 注册组件事件
    if (events && (Array.isArray(events) || Object.keys(events).length > 0)) {
      console.log('Registering events for component:', id, events);
      ComponentEventAdapter.registerComponentEvents({ id }, events);
    }

    // 清理事件
    return () => {
      ComponentEventAdapter.unregisterComponentEvents({ id });
    };
  }, [id, events]);

  // 处理组件事件
  const handleEvent = (eventType, data = {}) => {
    console.log('Component handling event:', eventType, 'Component events:', events);
    // 检查组件是否有对应的事件配置
    const hasMatchingEvent = Array.isArray(events) 
      ? events.some(event => event.type === eventType)
      : events?.events?.some(event => event.type === eventType);

    if (hasMatchingEvent) {
      console.log('Found matching event config, triggering event');
      ComponentEventAdapter.triggerComponentEvent(
        { id },
        eventType,
        {
          ...data,
          componentId: id,
          timestamp: Date.now()
        }
      );
    } else {
      console.log('No matching event config found');
    }
  };

  // 组件可见性控制
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 监听组件状态变化
    const handleStateChange = (e) => {
      if (e.detail.componentId === id) {
        if ('visible' in e.detail) {
          setIsVisible(e.detail.visible);
        }
      }
    };

    window.addEventListener('componentStateChange', handleStateChange);
    return () => {
      window.removeEventListener('componentStateChange', handleStateChange);
    };
  }, [id]);

  if (!isVisible) {
    return null;
  }

  const renderComponent = () => {
    switch (type) {
      case 'Button':
        return (
          <StyledButton
            color={properties.color || 'primary'}
            fill={properties.fill || 'solid'}
            size={properties.size || 'middle'}
            block={properties.block}
            onClick={() => handleEvent('click')}
          >
            {properties.text || '按钮'}
          </StyledButton>
        );
      
      case 'Input':
        return (
          <StyledInput
            placeholder={properties.placeholder || '请输入'}
            type={properties.type || 'text'}
            clearable={properties.clearable}
            disabled={properties.disabled}
            value={inputValue}
            onChange={e => handleEvent('change', { value: e.target.value })}
          />
        );
      
      case 'Card':
        return (
          <StyledCard
            title={properties.title || '卡片标题'}
            extra={properties.extra}
            style={{ width: '100%' }}
            onClick={() => handleEvent('click')}
          >
            {properties.content || '卡片内容'}
          </StyledCard>
        );
      
      case 'Tag':
        return (
          <StyledTag
            color={properties.color || 'primary'}
            fill={properties.fill ? 'solid' : 'outline'}
            round={properties.round}
          >
            {properties.text || '标签'}
          </StyledTag>
        );
      
      case 'SearchBar':
        return (
          <StyledSearchBar
            placeholder={properties.placeholder || '请输入搜索关键词'}
            showCancelButton={properties.showCancelButton}
            value={searchValue}
            onChange={setSearchValue}
            onSearch={(val) => handleEvent('search', { value: val })}
          />
        );
      
      case 'NavBar':
        return (
          <StyledNavBar
            back={properties.showBack ? (properties.back || '返回') : null}
            right={properties.right}
            onBack={() => handleEvent('back')}
          >
            {properties.title || '标题'}
          </StyledNavBar>
        );
      
      case 'Switch':
        return (
          <StyledSwitch
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
          <StyledRadioGroup
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
          </StyledRadioGroup>
        );

      case 'Checkbox':
        return (
          <StyledCheckbox
            checked={checkboxChecked}
            onChange={setCheckboxChecked}
            disabled={properties.disabled}
            indeterminate={properties.indeterminate}
          >
            {properties.text || '复选框'}
          </StyledCheckbox>
        );

      case 'Rate':
        return (
          <StyledRate
            value={rateValue}
            onChange={setRateValue}
            count={Number(properties.count) || 5}
            allowHalf={properties.allowHalf}
            disabled={properties.disabled}
          />
        );

      case 'Stepper':
        return (
          <StyledStepper
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
            onClick: () => handleEvent('gridItemClick', { text })
          }));
        
        return (
          <StyledGrid
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
                onClick={() => handleEvent('listItemClick', { title: item.title })}
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
              onClick: () => handleEvent('swipeActionClick', { text })
            };
          });

        return (
          <StyledSwipeAction rightActions={rightActions}>
            <List.Item>{properties.content || '可滑动列表项'}</List.Item>
          </StyledSwipeAction>
        );

      case 'TabBar':
        return (
          <StyledTabBar
            activeKey={activeTab}
            onChange={setActiveTab}
            safeArea={properties.safeArea}
          >
            {(properties.items || '首页\n待办\n我的').split('\n').map(title => (
              <TabBar.Item key={title} title={title} />
            ))}
          </StyledTabBar>
        );

      case 'PageLink':
        return (
          <PageLinkItem
            onClick={() => handleEvent('pageLinkClick', { targetPageId: properties.targetPageId })}
            arrow={<RightOutline />}
            style={{
              '--adm-font-size-main': '16px',
              '--adm-color-text': '#333',
            }}
          >
            <Space>
              {properties.icon && (
                <Image
                  src={properties.icon}
                  width={24}
                  height={24}
                  fit='contain'
                />
              )}
              <span>{properties.text || '页面链接'}</span>
            </Space>
          </PageLinkItem>
        );
      
      default:
        return <div>不支持的组件类型: {type}</div>;
    }
  };

  return (
    <ComponentWrapper
      ref={ref}
      x={x}
      y={y}
      width={width}
      height={height}
    >
      {renderComponent()}
    </ComponentWrapper>
  );
});

PreviewComponent.displayName = 'PreviewComponent';

export default PreviewComponent; 