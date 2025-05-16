import { Modal } from 'antd';

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
    console.log('Registering event type:', eventType, 'with metadata:', metadata);
    if (!this.eventRegistry.has(eventType)) {
      this.eventRegistry.set(eventType, {
        handlers: [],
        metadata
      });
    }
  }

  // 绑定事件到组件
  bindEvent(componentId, config) {
    console.log('Binding events for component:', componentId, 'with config:', config);
    this.eventConfigs.set(componentId, config);
    
    // 为每个事件注册处理函数
    config.events?.forEach(event => {
      console.log('Processing event:', event);
      const eventData = this.eventRegistry.get(event.type);
      if (eventData) {
        const handler = this.createEventHandler(componentId, event);
        eventData.handlers.push(handler);
        console.log('Added handler for event:', event.type);
      } else {
        console.warn('No event data found for type:', event.type);
        // 自动注册事件类型
        this.registerEvent(event.type);
        const eventData = this.eventRegistry.get(event.type);
        const handler = this.createEventHandler(componentId, event);
        eventData.handlers.push(handler);
        console.log('Auto-registered event type and added handler:', event.type);
      }
    });
  }

  // 触发事件
  triggerEvent(eventType, payload) {
    console.log('Triggering event:', eventType, 'with payload:', payload);
    const eventData = this.eventRegistry.get(eventType);
    if (eventData) {
      console.log('Found handlers for event:', eventData.handlers.length);
      eventData.handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error handling event ${eventType}:`, error);
        }
      });
    } else {
      console.warn('No handlers found for event type:', eventType);
    }
  }

  // 解绑事件
  unbindEvent(componentId) {
    console.log('Unbinding events for component:', componentId);
    const config = this.eventConfigs.get(componentId);
    if (config) {
      config.events?.forEach(event => {
        const eventData = this.eventRegistry.get(event.type);
        if (eventData) {
          eventData.handlers = eventData.handlers.filter(
            handler => handler.componentId !== componentId
          );
          console.log('Removed handlers for event:', event.type);
        }
      });
      this.eventConfigs.delete(componentId);
    }
  }

  // 创建事件处理器
  createEventHandler(componentId, event) {
    console.log('Creating event handler for component:', componentId, 'event:', event);
    const handler = (payload) => {
      console.log('Event handler called:', event.type, 'with payload:', payload);
      // 执行所有动作
      event.actions.forEach(action => {
        console.log('Executing action:', action);
        this.executeAction(action, payload);
      });
    };
    handler.componentId = componentId;
    return handler;
  }

  // 执行动作
  executeAction(action, payload) {
    const { type, target, params } = action;
    console.log('Executing action:', type, 'for target:', target, 'with payload:', payload);
    
    // 创建自定义事件来通知组件状态变化
    const dispatchStateChange = (detail) => {
      const event = new CustomEvent('componentStateChange', {
        detail: {
          componentId: target,
          ...detail
        }
      });
      console.log('Dispatching state change event:', event);
      window.dispatchEvent(event);
    };

    switch (type) {
      // 组件交互类动作
      case 'show':
        dispatchStateChange({ visible: true });
        break;

      case 'hide':
        dispatchStateChange({ visible: false });
        break;

      case 'toggle':
        dispatchStateChange({ toggle: true });
        break;

      case 'updateData':
        if (params) {
          dispatchStateChange({ data: params });
        }
        break;

      // 系统功能类动作
      case 'alert':
        if (params?.message) {
          alert(params.message);
        }
        break;

      case 'confirm':
        if (params?.message) {
          Modal.confirm({
            title: params.title || '确认',
            content: params.message,
            okText: params.okText || '确定',
            cancelText: params.cancelText || '取消',
            onOk: () => {
              window.dispatchEvent(new CustomEvent('confirmResult', {
                detail: { confirmed: true, actionId: action.id }
              }));
            },
            onCancel: () => {
              window.dispatchEvent(new CustomEvent('confirmResult', {
                detail: { confirmed: false, actionId: action.id }
              }));
            }
          });
        }
        break;

      case 'log':
        if (params?.message) {
          console.log('[Event System Log]:', params.message);
        }
        break;

      case 'copy':
        if (params?.content) {
          navigator.clipboard.writeText(params.content)
            .then(() => {
              console.log('Content copied to clipboard');
              // 可以添加成功提示
            })
            .catch(err => {
              console.error('Failed to copy:', err);
              // 可以添加错误提示
            });
        }
        break;

      case 'openUrl':
        if (params?.url) {
          window.open(params.url, params.target || '_blank');
        }
        break;

      case 'delay':
        if (params?.duration && params?.actions) {
          setTimeout(() => {
            // 执行延迟后的动作
            params.actions.forEach(delayedAction => {
              this.executeAction(delayedAction, payload);
            });
          }, params.duration);
        }
        break;

      default:
        console.warn('Unsupported action type:', type);
    }
  }
}

// 导出单例
export default new EventSystem(); 