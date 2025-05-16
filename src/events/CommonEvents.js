import EventSystem from './EventSystem';

// 注册常用事件类型
export const registerCommonEvents = () => {
  // UI 交互事件
  EventSystem.registerEvent('click', {
    description: '点击事件',
    category: 'interaction'
  });

  EventSystem.registerEvent('change', {
    description: '值改变事件',
    category: 'interaction'
  });

  // 导航事件
  EventSystem.registerEvent('navigate', {
    description: '页面导航事件',
    category: 'navigation'
  });

  // 数据事件
  EventSystem.registerEvent('dataUpdate', {
    description: '数据更新事件',
    category: 'data'
  });

  EventSystem.registerEvent('formSubmit', {
    description: '表单提交事件',
    category: 'data'
  });

  // 状态事件
  EventSystem.registerEvent('stateChange', {
    description: '状态改变事件',
    category: 'state'
  });

  // 生命周期事件
  EventSystem.registerEvent('componentMount', {
    description: '组件挂载事件',
    category: 'lifecycle'
  });

  EventSystem.registerEvent('componentUnmount', {
    description: '组件卸载事件',
    category: 'lifecycle'
  });
};

// 预定义的事件处理器
export const commonHandlers = {
  // UI 处理器
  show: (componentId) => ({
    type: 'visibility',
    action: 'show',
    target: componentId
  }),

  hide: (componentId) => ({
    type: 'visibility',
    action: 'hide',
    target: componentId
  }),

  // 导航处理器
  navigateTo: (pageId) => ({
    type: 'navigation',
    action: 'navigate',
    target: pageId
  }),

  // 数据处理器
  updateData: (data) => ({
    type: 'data',
    action: 'update',
    payload: data
  }),

  // 状态处理器
  setState: (state) => ({
    type: 'state',
    action: 'setState',
    payload: state
  })
};

export default {
  registerCommonEvents,
  commonHandlers
}; 