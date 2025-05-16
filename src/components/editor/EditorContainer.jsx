import React from 'react';
import '../../styles/editor-grid.css';

const EditorContainer = ({ children }) => {
  return (
    <div className="editor-grid-container">
      <div className="editor-inner-container">
        <div 
          className="editor-content-wrapper"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0',
          }}
        >
          {/* Layout guides */}
          <div className="editor-layout-guides" />
          
          {/* Margin guides */}
          <div className="editor-margin-guides" />
          
          {/* Column guides */}
          <div className="editor-column-guides">
            <div />
            <div />
            <div />
            <div />
          </div>
          
          {/* Status bar area */}
          <div className="editor-status-bar" />
          
          {/* Device frame */}
          <div className="editor-device-frame" />
          
          {/* Actual content */}
          <div className="editor-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorContainer; 