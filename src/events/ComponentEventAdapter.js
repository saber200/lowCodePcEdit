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
    console.log('Adapting component event:', event, 'for component:', component);
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
    console.log('Adapting system event:', event);
    return {
      type: 'action',
      action: event.action,
      params: event.payload
    };
  }

  // 注册组件事件
  registerComponentEvents(component, events) {
    console.log('Registering events for component:', component.id, events);
    // 确保事件配置格式正确
    const config = {
      events: Array.isArray(events) ? events : events.events || []
    };
    EventSystem.bindEvent(component.id, config);
  }

  // 触发组件事件
  triggerComponentEvent(component, eventName, data) {
    console.log('Triggering component event:', eventName, 'with data:', data, 'for component:', component);
    const systemEvent = this.adaptComponentEvent(component, {
      type: eventName,
      value: data
    });
    
    EventSystem.triggerEvent(systemEvent.type, systemEvent.payload);
  }

  // 卸载组件事件
  unregisterComponentEvents(component) {
    console.log('Unregistering events for component:', component.id);
    EventSystem.unbindEvent(component.id);
  }
}

export default new ComponentEventAdapter(); 