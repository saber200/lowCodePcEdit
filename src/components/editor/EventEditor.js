import React, { useState, useEffect } from 'react';
import { Button, Form, Select, Input, Card, Collapse } from 'antd';
import styled from 'styled-components';

const EditorContainer = styled.div`
  background: #fff;
  border-radius: 8px;
`;

const EventCard = styled(Card)`
  margin-bottom: 12px;
  .ant-card-head {
    min-height: 40px;
    padding: 0 12px;
    .ant-card-head-title {
      padding: 8px 0;
    }
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

// 预定义的事件类型
const EVENT_TYPES = [
  { label: '点击', value: 'click' },
  { label: '输入变化', value: 'change' },
  { label: '获得焦点', value: 'focus' },
  { label: '失去焦点', value: 'blur' },
  { label: '滑动', value: 'swipe' },
];

// 动作分类
const ACTION_CATEGORIES = {
  COMPONENT: '组件交互',
  SYSTEM: '系统功能'
};

// 预定义的动作类型
const ACTION_TYPES = [
  // 组件交互类动作
  { 
    label: '显示组件', 
    value: 'show',
    category: ACTION_CATEGORIES.COMPONENT,
    needTarget: true 
  },
  { 
    label: '隐藏组件', 
    value: 'hide',
    category: ACTION_CATEGORIES.COMPONENT,
    needTarget: true 
  },
  { 
    label: '切换显示状态', 
    value: 'toggle',
    category: ACTION_CATEGORIES.COMPONENT,
    needTarget: true 
  },
  { 
    label: '更新数据', 
    value: 'updateData',
    category: ACTION_CATEGORIES.COMPONENT,
    needTarget: true,
    needParams: true 
  },
  
  // 系统功能类动作
  { 
    label: '显示提示框', 
    value: 'alert',
    category: ACTION_CATEGORIES.SYSTEM,
    needParams: true,
    paramTemplate: { message: '提示内容' }
  },
  { 
    label: '显示确认框', 
    value: 'confirm',
    category: ACTION_CATEGORIES.SYSTEM,
    needParams: true,
    paramTemplate: { 
      title: '确认标题',
      message: '确认内容',
      okText: '确定',
      cancelText: '取消'
    }
  },
  { 
    label: '打印日志', 
    value: 'log',
    category: ACTION_CATEGORIES.SYSTEM,
    needParams: true,
    paramTemplate: { message: '日志内容' }
  },
  { 
    label: '复制到剪贴板', 
    value: 'copy',
    category: ACTION_CATEGORIES.SYSTEM,
    needParams: true,
    paramTemplate: { content: '要复制的内容' }
  },
  { 
    label: '打开链接', 
    value: 'openUrl',
    category: ACTION_CATEGORIES.SYSTEM,
    needParams: true,
    paramTemplate: { 
      url: 'https://example.com',
      target: '_blank'
    }
  },
  { 
    label: '延迟执行', 
    value: 'delay',
    category: ACTION_CATEGORIES.SYSTEM,
    needParams: true,
    paramTemplate: { 
      duration: 1000,
      actions: []
    }
  }
];

const EventEditor = ({ componentId, availableTargets, onSave, initialEvents }) => {
  const [events, setEvents] = useState([]);

  // 初始化事件配置
  useEffect(() => {
    console.log('EventEditor initialEvents:', initialEvents);
    
    // 处理不同格式的初始事件配置
    let eventsToInit = [];
    if (initialEvents) {
      if (Array.isArray(initialEvents)) {
        eventsToInit = initialEvents;
      } else if (initialEvents.events && Array.isArray(initialEvents.events)) {
        eventsToInit = initialEvents.events;
      }
    }
    
    // 为每个事件和动作添加唯一ID
    const eventsWithIds = eventsToInit.map(event => ({
      id: Date.now() + Math.random(),
      type: event.type,
      actions: (event.actions || []).map(action => ({
        id: Date.now() + Math.random(),
        type: action.type,
        target: action.target,
        params: action.params || {}
      }))
    }));
    
    console.log('EventEditor initialized events:', eventsWithIds);
    setEvents(eventsWithIds);
  }, [initialEvents]);

  // 添加新事件
  const handleAddEvent = () => {
    setEvents([
      ...events,
      {
        id: Date.now(),
        type: '',
        actions: []
      }
    ]);
  };

  // 添加动作到事件
  const handleAddAction = (eventId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          actions: [
            ...event.actions,
            {
              id: Date.now(),
              type: '',
              target: '',
              params: {}
            }
          ]
        };
      }
      return event;
    }));
  };

  // 更新事件配置
  const handleEventChange = (eventId, field, value) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return { ...event, [field]: value };
      }
      return event;
    }));
  };

  // 根据动作类型获取参数模板
  const getParamTemplate = (actionType) => {
    const actionConfig = ACTION_TYPES.find(type => type.value === actionType);
    return actionConfig?.paramTemplate || {};
  };

  // 更新动作配置
  const handleActionChange = (eventId, actionId, field, value) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          actions: event.actions.map(action => {
            if (action.id === actionId) {
              if (field === 'type') {
                // 当动作类型改变时，设置默认参数模板
                return { 
                  ...action, 
                  [field]: value,
                  params: getParamTemplate(value)
                };
              }
              return { ...action, [field]: value };
            }
            return action;
          })
        };
      }
      return event;
    }));
  };

  // 删除事件
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  // 删除动作
  const handleDeleteAction = (eventId, actionId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          actions: event.actions.filter(action => action.id !== actionId)
        };
      }
      return event;
    }));
  };

  // 保存所有配置
  const handleSave = () => {
    // 移除内部使用的 id
    const config = events.map(event => ({
      type: event.type,
      actions: event.actions.map(action => ({
        type: action.type,
        target: action.target,
        params: action.params
      }))
    }));
    onSave?.(config);
  };

  return (
    <EditorContainer>
      <h3>事件编辑器 - {componentId}</h3>
      
      {events.map(event => (
        <EventCard
          key={event.id}
          title={
            <Select
              style={{ width: '100%' }}
              placeholder="选择触发事件"
              value={event.type}
              onChange={value => handleEventChange(event.id, 'type', value)}
              options={EVENT_TYPES}
            />
          }
          extra={
            <Button
              danger
              type="text"
              onClick={() => handleDeleteEvent(event.id)}
            >
              删除
            </Button>
          }
        >
          <Collapse>
            {event.actions.map(action => (
              <Collapse.Panel
                key={action.id}
                header="动作配置"
              >
                <Form layout="vertical">
                  <Form.Item label="动作类型">
                    <Select
                      style={{ width: '100%' }}
                      placeholder="选择动作"
                      value={action.type}
                      onChange={value => handleActionChange(event.id, action.id, 'type', value)}
                      options={ACTION_TYPES.map(type => ({
                        label: type.label,
                        value: type.value,
                        category: type.category
                      }))}
                      optionGroups={[
                        {
                          label: ACTION_CATEGORIES.COMPONENT,
                          options: ACTION_TYPES
                            .filter(type => type.category === ACTION_CATEGORIES.COMPONENT)
                            .map(type => ({
                              label: type.label,
                              value: type.value
                            }))
                        },
                        {
                          label: ACTION_CATEGORIES.SYSTEM,
                          options: ACTION_TYPES
                            .filter(type => type.category === ACTION_CATEGORIES.SYSTEM)
                            .map(type => ({
                              label: type.label,
                              value: type.value
                            }))
                        }
                      ]}
                    />
                  </Form.Item>
                  
                  {ACTION_TYPES.find(type => type.value === action.type)?.needTarget && (
                    <Form.Item label="目标组件">
                      <Select
                        style={{ width: '100%' }}
                        placeholder="选择目标"
                        value={action.target}
                        onChange={value => handleActionChange(event.id, action.id, 'target', value)}
                        options={availableTargets}
                      />
                    </Form.Item>
                  )}
                  
                  {ACTION_TYPES.find(type => type.value === action.type)?.needParams && (
                    <Form.Item label="参数">
                      <Input.TextArea
                        placeholder="参数 (JSON格式)"
                        value={JSON.stringify(action.params, null, 2)}
                        onChange={e => {
                          try {
                            const value = JSON.parse(e.target.value);
                            handleActionChange(event.id, action.id, 'params', value);
                          } catch (error) {
                            // 如果JSON解析失败，不更新值
                          }
                        }}
                        rows={4}
                      />
                    </Form.Item>
                  )}
                  
                  <Button
                    danger
                    onClick={() => handleDeleteAction(event.id, action.id)}
                  >
                    删除动作
                  </Button>
                </Form>
              </Collapse.Panel>
            ))}
          </Collapse>
          
          <ActionGroup>
            <Button
              type="primary"
              ghost
              onClick={() => handleAddAction(event.id)}
            >
              添加动作
            </Button>
          </ActionGroup>
        </EventCard>
      ))}
      
      <ActionGroup>
        <Button
          type="primary"
          onClick={handleAddEvent}
        >
          添加事件
        </Button>
        
        <Button
          type="primary"
          onClick={handleSave}
        >
          保存配置
        </Button>
      </ActionGroup>
    </EditorContainer>
  );
};

export default EventEditor; 