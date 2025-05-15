export const getComponentProperties = (type) => {
  switch (type) {
    case 'Button':
      return {
        text: { type: 'string', label: '按钮文本', default: '按钮' },
        color: { 
          type: 'select', 
          label: '按钮颜色', 
          options: ['default', 'primary', 'success', 'warning', 'danger'],
          default: 'primary'
        },
        fill: { 
          type: 'select', 
          label: '填充方式', 
          options: ['solid', 'outline', 'none'],
          default: 'solid'
        },
        size: { 
          type: 'select', 
          label: '按钮大小', 
          options: ['mini', 'small', 'middle', 'large'],
          default: 'middle'
        },
        block: { type: 'boolean', label: '是否块级', default: false }
      };
    case 'Input':
      return {
        placeholder: { type: 'string', label: '占位文本', default: '请输入' },
        type: { 
          type: 'select', 
          label: '输入类型', 
          options: ['text', 'password', 'number', 'tel'],
          default: 'text'
        },
        clearable: { type: 'boolean', label: '是否可清除', default: true },
        disabled: { type: 'boolean', label: '是否禁用', default: false }
      };
    case 'Card':
      return {
        title: { type: 'string', label: '卡片标题', default: '卡片标题' },
        content: { 
          type: 'text', 
          label: '卡片内容', 
          default: '这是一段示例内容，展示了卡片组件的文本显示效果。\n可以包含多行文本。' 
        },
        headerStyle: { 
          type: 'select', 
          label: '标题样式', 
          options: ['default', 'primary'],
          default: 'default'
        },
        extra: { type: 'string', label: '右上角内容', default: '更多' }
      };
    case 'Tag':
      return {
        text: { type: 'string', label: '标签文本', default: '标签' },
        color: { 
          type: 'select', 
          label: '标签颜色', 
          options: ['default', 'primary', 'success', 'warning', 'danger'],
          default: 'primary'
        },
        fill: { type: 'boolean', label: '是否填充', default: true },
        round: { type: 'boolean', label: '是否圆角', default: false }
      };
    case 'SearchBar':
      return {
        placeholder: { type: 'string', label: '占位文本', default: '请输入搜索关键词' },
        showCancelButton: { type: 'boolean', label: '显示取消按钮', default: false },
        cancelText: { type: 'string', label: '取消按钮文本', default: '取消' },
        maxLength: { type: 'string', label: '最大长度', default: '50' }
      };
    case 'NavBar':
      return {
        title: { type: 'string', label: '标题', default: '标题' },
        back: { type: 'string', label: '返回文本', default: '返回' },
        showBack: { type: 'boolean', label: '显示返回按钮', default: true },
        right: { type: 'string', label: '右侧内容', default: '' }
      };
    case 'Switch':
      return {
        checked: { type: 'boolean', label: '是否选中', default: false },
        disabled: { type: 'boolean', label: '是否禁用', default: false },
        loading: { type: 'boolean', label: '加载状态', default: false }
      };
    case 'Radio':
      return {
        options: {
          type: 'array',
          label: '选项列表',
          default: [
            { label: '选项一', value: '1' },
            { label: '选项二', value: '2' },
            { label: '选项三', value: '3' }
          ]
        },
        defaultValue: { type: 'string', label: '默认值', default: '1' },
        disabled: { type: 'boolean', label: '是否禁用', default: false },
        direction: {
          type: 'select',
          label: '排列方向',
          options: ['horizontal', 'vertical'],
          default: 'vertical'
        }
      };
    case 'Checkbox':
      return {
        text: { type: 'string', label: '选项文本', default: '复选框' },
        checked: { type: 'boolean', label: '是否选中', default: false },
        disabled: { type: 'boolean', label: '是否禁用', default: false },
        indeterminate: { type: 'boolean', label: '半选状态', default: false }
      };
    case 'Rate':
      return {
        count: { type: 'string', label: '星星数量', default: '5' },
        defaultValue: { type: 'string', label: '默认值', default: '0' },
        allowHalf: { type: 'boolean', label: '允许半星', default: false },
        disabled: { type: 'boolean', label: '是否禁用', default: false }
      };
    case 'Stepper':
      return {
        defaultValue: { type: 'string', label: '默认值', default: '0' },
        min: { type: 'string', label: '最小值', default: '0' },
        max: { type: 'string', label: '最大值', default: '100' },
        step: { type: 'string', label: '步长', default: '1' },
        disabled: { type: 'boolean', label: '是否禁用', default: false }
      };
    case 'Grid':
      return {
        columns: { type: 'string', label: '列数', default: '3' },
        gap: { type: 'string', label: '间距', default: '8' },
        items: { type: 'text', label: '项目列表(每行一个)', default: '条目1\n条目2\n条目3\n条目4\n条目5\n条目6' }
      };
    case 'List':
      return {
        items: {
          type: 'array',
          label: '列表项',
          default: [
            {
              avatar: '👤',
              title: '列表项1',
              description: '描述信息1'
            },
            {
              avatar: '📱',
              title: '列表项2',
              description: '描述信息2'
            },
            {
              avatar: '💡',
              title: '列表项3',
              description: '描述信息3'
            }
          ]
        },
        showAvatar: {
          type: 'boolean',
          label: '显示头像',
          default: true
        }
      };
    case 'SwipeAction':
      return {
        content: { type: 'string', label: '内容', default: '可滑动列表项' },
        rightActions: {
          type: 'text',
          label: '右侧按钮(每行: 文本|颜色)',
          default: '删除|danger\n编辑|primary'
        }
      };
    case 'TabBar':
      return {
        items: {
          type: 'text',
          label: '标签项(每行: 标题)',
          default: '首页\n待办\n我的'
        },
        defaultActiveKey: { type: 'string', label: '默认选中项', default: '首页' },
        safeArea: { type: 'boolean', label: '安全区适配', default: true }
      };
    case 'Table':
      return {
        columns: {
          type: 'array',
          label: '列配置',
          default: [
            { title: '标题1', dataIndex: 'col1', key: 'col1' },
            { title: '标题2', dataIndex: 'col2', key: 'col2' },
            { title: '标题3', dataIndex: 'col3', key: 'col3' }
          ]
        },
        data: {
          type: 'array',
          label: '表格数据',
          default: [
            { key: '1', col1: '内容1-1', col2: '内容1-2', col3: '内容1-3' },
            { key: '2', col1: '内容2-1', col2: '内容2-2', col3: '内容2-3' }
          ]
        }
      };
    default:
      return {};
  }
};

export const getDefaultComponentSize = (type) => {
  switch (type) {
    case 'Button':
      return { width: 120, height: 40 };
    case 'Input':
      return { width: 200, height: 40 };
    case 'SearchBar':
      return { width: 300, height: 45 };
    case 'NavBar':
      return { width: 366, height: 45 };
    case 'Card':
      return { width: 345, height: 120 };
    case 'Switch':
      return { width: 60, height: 40 };
    case 'Radio':
      return { width: 200, height: 40 };
    case 'Checkbox':
      return { width: 200, height: 40 };
    case 'Rate':
      return { width: 200, height: 40 };
    case 'Stepper':
      return { width: 120, height: 40 };
    case 'Tag':
      return { width: 70, height: 30 };
    case 'Grid':
      return { width: 366, height: 200 };
    case 'List':
      return { width: 350, height: 240 };
    case 'TabBar':
      return { width: 366, height: 50 };
    case 'SwipeAction':
      return { width: 366, height: 50 };
    case 'Table':
      return { width: 350, height: 200 };
    default:
      return { width: 100, height: 100 };
  }
}; 