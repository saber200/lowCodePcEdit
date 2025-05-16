import EventSystem from './EventSystem';

class ComponentEventAdapter {
  constructor() {
    if (ComponentEventAdapter.instance) {
      return ComponentEventAdapter.instance;
    }
    ComponentEventAdapter.instance = this;
  }

  // 将组件事件转换为系统事件
  adaptComponentEvent(component, event) {
    return {
      type: event.type,
      componentId: component.id,
      payload: {
        value: event.value,
        target: event.target,
        timestamp: Date.now()
      }
    };
  }

  // 将系统事件转换为组件动作
  adaptSystemEvent(event) {
    return {
      type: 'action',
      action: event.action,
      params: event.payload
    };
  }

  // 注册组件事件
  registerComponentEvents(component, events) {
    const config = {
      triggers: events.triggers || [],
      listeners: events.listeners || []
    };

    EventSystem.bindEvent(component.id, config);
  }

  // 触发组件事件
  triggerComponentEvent(component, eventName, data) {
    const systemEvent = this.adaptComponentEvent(component, {
      type: eventName,
      value: data
    });
    
    EventSystem.triggerEvent(systemEvent.type, systemEvent.payload);
  }

  // 卸载组件事件
  unregisterComponentEvents(component) {
    EventSystem.unbindEvent(component.id);
  }
}

export default new ComponentEventAdapter(); 