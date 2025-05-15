import React, { useEffect, useRef } from 'react';
import '../../styles/editor-grid.css';

const EditorContainer = ({ children }) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const updateScrollbar = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercent = scrollTop / (scrollHeight - clientHeight);
      const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * clientHeight);
      const thumbTop = scrollPercent * (clientHeight - thumbHeight) + 35; // 35px is the top offset

      // 更新滚动条滑块的样式
      container.style.setProperty('--thumb-height', `${thumbHeight}px`);
      container.style.setProperty('--thumb-top', `${thumbTop}px`);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollbar);
      window.addEventListener('resize', updateScrollbar);
      updateScrollbar(); // 初始化滚动条

      return () => {
        container.removeEventListener('scroll', updateScrollbar);
        window.removeEventListener('resize', updateScrollbar);
      };
    }
  }, []);

  return (
    <div className="editor-grid-container">
      <div className="editor-inner-container">
        <div className="editor-scroll-container" ref={scrollContainerRef}>
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
    </div>
  );
};

export default EditorContainer; 