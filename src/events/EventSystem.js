// 事件系统单例
class EventSystem {
  constructor() {
    if (EventSystem.instance) {
      return EventSystem.instance;
    }
    EventSystem.instance = this;
    
    this.eventRegistry = new Map();
    this.eventConfigs = new Map();
  }

  // 注册事件类型
  registerEvent(eventType, metadata = {}) {
    if (!this.eventRegistry.has(eventType)) {
      this.eventRegistry.set(eventType, {
        handlers: [],
        metadata
      });
    }
  }

  // 绑定事件到组件
  bindEvent(componentId, config) {
    this.eventConfigs.set(componentId, config);
    
    // 为每个监听器注册处理函数
    config.listeners?.forEach(listener => {
      const eventData = this.eventRegistry.get(listener.eventType);
      if (eventData) {
        const handler = this.createEventHandler(componentId, listener);
        eventData.handlers.push(handler);
      }
    });
  }

  // 触发事件
  triggerEvent(eventType, payload) {
    const eventData = this.eventRegistry.get(eventType);
    if (eventData) {
      eventData.handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error handling event ${eventType}:`, error);
        }
      });
    }
  }

  // 解绑事件
  unbindEvent(componentId) {
    const config = this.eventConfigs.get(componentId);
    if (config) {
      config.listeners?.forEach(listener => {
        const eventData = this.eventRegistry.get(listener.eventType);
        if (eventData) {
          eventData.handlers = eventData.handlers.filter(
            handler => handler.componentId !== componentId
          );
        }
      });
      this.eventConfigs.delete(componentId);
    }
  }

  // 创建事件处理器
  createEventHandler(componentId, listener) {
    const handler = (payload) => {
      // 检查条件
      if (this.checkConditions(listener.conditions, payload)) {
        // 执行处理函数
        this.executeHandler(componentId, listener.handler, payload);
      }
    };
    handler.componentId = componentId;
    return handler;
  }

  // 检查条件
  checkConditions(conditions = [], payload) {
    if (!conditions.length) return true;
    return conditions.every(condition => {
      // 这里可以根据需要扩展条件检查逻辑
      return true;
    });
  }

  // 执行处理函数
  executeHandler(componentId, handlerName, payload) {
    // 这里可以根据实际需求实现具体的处理逻辑
    console.log(`Executing ${handlerName} for component ${componentId}`, payload);
  }
}

// 导出单例
export default new EventSystem(); 