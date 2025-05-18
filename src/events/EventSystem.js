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
    
    // 在构造函数中立即加载配置
    this.loadSavedConfigs();
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

  // 获取组件的事件配置
  getComponentConfig(componentId) {
    // 标准化 componentId
    const normalizedId = String(componentId);
    console.log('Getting config for component:', {
      originalId: componentId,
      normalizedId,
      type: typeof componentId
    });
    
    const config = this.eventConfigs.get(normalizedId);
    console.log('Found config:', config);
    
    // 确保返回有效的配置对象
    return config || { events: [] };
  }

  // 绑定事件到组件
  bindEvent(componentId, config) {
    // 标准化 componentId
    const normalizedId = String(componentId);
    console.log('EventSystem: Binding events for component:', {
      componentId: normalizedId,
      config
    });
    
    if (!config.events) {
      config = { events: Array.isArray(config) ? config : [config] };
    }
    
    // 移除旧的事件处理器
    this.unbindEvent(normalizedId);
    
    // 保存新配置
    this.eventConfigs.set(normalizedId, config);
    
    // 绑定新的事件处理器
    config.events.forEach(event => {
      if (!event.type) {
        console.warn('EventSystem: Invalid event config:', event);
        return;
      }
      
      let eventData = this.eventRegistry.get(event.type);
      
      if (!eventData) {
        this.registerEvent(event.type);
        eventData = this.eventRegistry.get(event.type);
      }
      
      const handler = this.createEventHandler(normalizedId, event);
      eventData.handlers.push(handler);
    });
    
    // 保存到 localStorage
    this.saveConfigs();
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
    // 标准化 componentId
    const normalizedId = String(componentId);
    console.log('Unbinding events for component:', {
      originalId: componentId,
      normalizedId
    });
    
    const config = this.eventConfigs.get(normalizedId);
    if (config && config.events) {
      config.events.forEach(event => {
        const eventData = this.eventRegistry.get(event.type);
        if (eventData) {
          eventData.handlers = eventData.handlers.filter(
            handler => handler.componentId !== normalizedId
          );
        }
      });
    }
    
    this.eventConfigs.delete(normalizedId);
  }

  // 从 localStorage 加载配置
  loadSavedConfigs() {
    try {
      console.log('EventSystem: Loading saved configs from localStorage');
      const savedConfigs = localStorage.getItem('eventSystemConfigs');
      console.log('EventSystem: Raw saved configs:', savedConfigs);
      
      if (savedConfigs) {
        const configs = JSON.parse(savedConfigs);
        console.log('EventSystem: Parsed configs:', configs);
        
        // 清空现有配置
        this.eventConfigs.clear();
        this.eventRegistry.clear();
        
        // 预处理：收集所有事件类型
        const eventTypes = new Set();
        Object.values(configs).forEach(config => {
          if (config.events) {
            config.events.forEach(event => {
              eventTypes.add(event.type);
            });
          }
        });
        
        console.log('EventSystem: Collected event types:', Array.from(eventTypes));
        
        // 注册所有事件类型
        eventTypes.forEach(type => {
          console.log('EventSystem: Registering event type:', type);
          this.registerEvent(type);
        });
        
        // 加载组件配置
        Object.entries(configs).forEach(([componentId, config]) => {
          const normalizedId = String(componentId);
          console.log('EventSystem: Loading config for component:', {
            componentId: normalizedId,
            config
          });
          
          if (!config.events) {
            console.warn('EventSystem: Invalid config for component:', normalizedId);
            return;
          }
          
          this.eventConfigs.set(normalizedId, config);
          
          // 绑定事件处理器
          config.events.forEach(event => {
            console.log('EventSystem: Binding event for component:', {
              componentId: normalizedId,
              eventType: event.type
            });
            
            const eventData = this.eventRegistry.get(event.type);
            if (eventData) {
              const handler = this.createEventHandler(normalizedId, event);
              eventData.handlers.push(handler);
            }
          });
        });
        
        console.log('EventSystem: Current state after loading:', {
          eventConfigs: Object.fromEntries(this.eventConfigs),
          eventRegistry: Object.fromEntries(this.eventRegistry)
        });
      } else {
        console.log('EventSystem: No saved configs found in localStorage');
      }
    } catch (error) {
      console.error('EventSystem: Error loading configs:', error);
      this.eventConfigs.clear();
      this.eventRegistry.clear();
    }
  }

  // 保存配置到 localStorage
  saveConfigs() {
    try {
      console.log('EventSystem: Saving configs to localStorage');
      console.log('EventSystem: Current eventConfigs:', Object.fromEntries(this.eventConfigs));
      
      // 将 Map 转换为普通对象以便序列化
      const configs = Object.fromEntries(this.eventConfigs);
      
      // 确保所有组件 ID 都是字符串类型
      const normalizedConfigs = Object.entries(configs).reduce((acc, [id, config]) => {
        acc[String(id)] = config;
        return acc;
      }, {});
      
      console.log('EventSystem: Normalized configs to save:', normalizedConfigs);
      localStorage.setItem('eventSystemConfigs', JSON.stringify(normalizedConfigs));
      
      // 验证保存是否成功
      const savedConfigs = localStorage.getItem('eventSystemConfigs');
      console.log('EventSystem: Verified saved configs:', savedConfigs);
    } catch (error) {
      console.error('EventSystem: Error saving configs:', error);
    }
  }

  // 创建事件处理器
  createEventHandler(componentId, event) {
    // 标准化 componentId
    const normalizedId = String(componentId);
    
    return (payload) => {
      console.log('Event handler called:', {
        type: event.type,
        componentId: normalizedId,
        payload
      });
      
      event.actions?.forEach(action => {
        // 确保 action.target 也被标准化
        if (action.target) {
          action.target = String(action.target);
        }
        this.executeAction(action, payload);
      });
    };
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