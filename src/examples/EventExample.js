import React, { useEffect } from 'react';
import { Button, Modal } from 'antd-mobile';
import EventSystem from '../events/EventSystem';
import ComponentEventAdapter from '../events/ComponentEventAdapter';
import { registerCommonEvents } from '../events/CommonEvents';
import EventEditor from '../components/EventEditor';

const EventExample = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  
  useEffect(() => {
    // 1. 首先注册所有常用事件类型
    registerCommonEvents();
    
    // 2. 定义按钮组件的配置
    const buttonConfig = {
      id: 'showModalButton',
      triggers: [{
        eventType: 'click',      // 事件类型：点击
        action: 'showModal',     // 要执行的动作
        target: 'testModal'      // 目标组件
      }]
    };
    
    // 3. 定义模态框的配置
    const modalConfig = {
      id: 'testModal',
      listeners: [{
        eventType: 'click',      // 监听的事件类型
        handler: 'showModal'     // 处理函数名称
      }]
    };
    
    // 4. 注册这些组件的事件
    ComponentEventAdapter.registerComponentEvents(buttonConfig, {
      triggers: buttonConfig.triggers
    });
    
    ComponentEventAdapter.registerComponentEvents(modalConfig, {
      listeners: modalConfig.listeners
    });
    
    // 5. 重写事件系统的执行处理函数
    EventSystem.executeHandler = (componentId, handlerName, payload) => {
      if (componentId === 'testModal' && handlerName === 'showModal') {
        setModalVisible(true);
      }
    };
    
    // 6. 清理函数
    return () => {
      ComponentEventAdapter.unregisterComponentEvents(buttonConfig);
      ComponentEventAdapter.unregisterComponentEvents(modalConfig);
    };
  }, []);
  
  // 7. 点击按钮时触发事件
  const handleClick = () => {
    ComponentEventAdapter.triggerComponentEvent(
      { id: 'showModalButton' },
      'click',
      { value: 'clicked' }
    );
  };
  
  return (
    <div>
      <Button color='primary' onClick={handleClick}>
        显示模态框
      </Button>
      
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        content='这是一个通过事件系统控制的模态框'
      />
    </div>
  );
};

// 按钮组件示例
const MyButton = ({ id, onClick }) => {
  useEffect(() => {
    // 注册事件
    ComponentEventAdapter.registerComponentEvents(
      { id },
      {
        triggers: [{
          eventType: 'click',
          action: 'someAction',
          target: 'someTarget'
        }]
      }
    );
    
    // 清理
    return () => ComponentEventAdapter.unregisterComponentEvents({ id });
  }, [id]);

  const handleClick = () => {
    // 触发事件
    ComponentEventAdapter.triggerComponentEvent(
      { id },
      'click',
      { someData: 'value' }
    );
    if (onClick) onClick();
  };

  return <Button onClick={handleClick}>点击我</Button>;
};

export default EventExample; 