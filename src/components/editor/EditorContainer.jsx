import React from 'react';
import '../../styles/editor-grid.css';

const EditorContainer = ({ children }) => {
  return (
    <div className="editor-grid-container">
      <div className="editor-inner-container">
        <div className="editor-content-wrapper">
          {/* Base grid overlay */}
          <div className="editor-grid-overlay" />
          
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