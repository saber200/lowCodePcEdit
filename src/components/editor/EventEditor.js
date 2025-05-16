import React, { useState } from 'react';
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

// 预定义的动作类型
const ACTION_TYPES = [
  { label: '显示组件', value: 'show' },
  { label: '隐藏组件', value: 'hide' },
  { label: '切换显示状态', value: 'toggle' },
  { label: '更新数据', value: 'updateData' },
  { label: '跳转页面', value: 'navigate' },
  { label: '提交表单', value: 'submit' },
];

const EventEditor = ({ componentId, availableTargets, onSave }) => {
  const [events, setEvents] = useState([]);

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

  // 更新动作配置
  const handleActionChange = (eventId, actionId, field, value) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          actions: event.actions.map(action => {
            if (action.id === actionId) {
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
    const config = {
      componentId,
      events: events.map(event => ({
        type: event.type,
        actions: event.actions.map(action => ({
          type: action.type,
          target: action.target,
          params: action.params
        }))
      }))
    };
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
                      options={ACTION_TYPES}
                    />
                  </Form.Item>
                  
                  <Form.Item label="目标组件">
                    <Select
                      style={{ width: '100%' }}
                      placeholder="选择目标"
                      value={action.target}
                      onChange={value => handleActionChange(event.id, action.id, 'target', value)}
                      options={availableTargets}
                    />
                  </Form.Item>
                  
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