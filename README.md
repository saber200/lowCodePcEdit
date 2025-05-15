src/
  ├── components/
  │   ├── editor/
  │   │   ├── ComponentList.jsx    # 左侧组件列表
  │   │   └── EditableComponent.jsx # 可编辑组件
  │   └── property-panel/
  │       ├── PropertyPanel.jsx    # 右侧属性面板
  │       └── PropertyEditor.jsx   # 属性编辑器
  ├── utils/
  │   ├── componentProperties.js   # 组件属性定义
  │   └── componentRenderer.js     # 组件渲染器
  └── App.js     

ComponentList: 负责展示可用组件列表
EditableComponent: 处理组件的拖拽和调整大小
PropertyPanel: 处理属性编辑
PropertyEditor: 根据属性类型渲染对应的编辑器
componentProperties: 定义组件属性和默认值
componentRenderer: 负责组件的实际渲染

组件属性定义可以在多处复用
编辑器组件可以在其他项目中使用
渲染逻辑与业务逻辑分离

易于添加新的组件类型
易于添加新的属性类型
易于修改组件的渲染方式