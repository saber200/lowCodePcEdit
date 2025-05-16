import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Button, Dialog, Toast, Input } from 'antd-mobile';
import { Tree } from 'antd';
import { AddOutline } from 'antd-mobile-icons';
import 'antd/dist/reset.css';

const PageManagerContainer = styled.div`
  width: 240px;
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
`;

const PageManagerHeader = styled.div`
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
`;

const TreeContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;

  .ant-tree {
    background: transparent;
  }

  .ant-tree-node-content-wrapper {
    display: flex;
    align-items: center;
  }

  .ant-tree-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const TreeNodeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

const AddButton = styled(Button)`
  --adm-button-border-radius: 8px;
  --adm-button-mini-padding: 4px 8px;
`;

const DeleteButton = styled.span`
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
  
  &:hover {
    color: #666;
  }
`;

const PageManager = ({ 
  pages, 
  currentPageId, 
  onAddPage, 
  onSelectPage, 
  onDeletePage, 
  onRenamePage 
}) => {
  const treeData = useMemo(() => {
    // 创建主页节点
    const homeNode = {
      key: '1',
      title: (
        <TreeNodeContent>
          <span>主页</span>
        </TreeNodeContent>
      )
    };

    // 获取一级页面（非主页和我的页面）并按 ID 排序
    const firstLevelPages = pages
      .filter(page => !page.parentId && page.type !== 'home' && page.type !== 'profile')
      .sort((a, b) => a.id - b.id);

    // 构建一级页面节点
    const pageNodes = firstLevelPages.map(page => ({
      key: page.id.toString(),
      title: (
        <TreeNodeContent>
          <span>{page.name}</span>
          <AddButton
            size='mini'
            fill='none'
            onClick={(e) => {
              e.stopPropagation();
              let tempName = '';
              Dialog.show({
                title: `在"${page.name}"下新建子页面`,
                content: (
                  <div style={{ padding: '12px 0' }}>
                    <Input
                      placeholder="请输入页面名称"
                      onChange={val => {
                        tempName = val;
                      }}
                    />
                  </div>
                ),
                closeOnAction: true,
                actions: [
                  {
                    key: 'cancel',
                    text: '取消'
                  },
                  {
                    key: 'confirm',
                    text: '确定',
                    bold: true,
                    onClick: () => {
                      if (tempName?.trim()) {
                        onAddPage(tempName.trim(), 'subpage', page.id);
                      }
                    }
                  }
                ]
              });
            }}
          >
            <AddOutline fontSize={12} />
          </AddButton>
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePage(page.id, page.name, page.type, onDeletePage);
            }}
          >
            ×
          </DeleteButton>
        </TreeNodeContent>
      ),
      children: []
    }));

    // 添加子页面到对应的父页面节点，并按 ID 排序
    const subPages = pages.filter(page => page.parentId);
    subPages.sort((a, b) => a.id - b.id);

    subPages.forEach(page => {
      const parentNode = pageNodes.find(node => node.key === page.parentId.toString());
      if (parentNode) {
        parentNode.children.push({
          key: page.id.toString(),
          title: (
            <TreeNodeContent>
              <span>{page.name}</span>
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePage(page.id, page.name, page.type, onDeletePage);
                }}
              >
                ×
              </DeleteButton>
            </TreeNodeContent>
          )
        });
      }
    });

    // 创建我的页面节点
    const profileNode = {
      key: '2',
      title: (
        <TreeNodeContent>
          <span>我的</span>
        </TreeNodeContent>
      )
    };

    return [homeNode, ...pageNodes, profileNode];
  }, [pages]);

  const handleDeletePage = (pageId, pageName, pageType, onDelete) => {
    if (pageType === 'home' || pageType === 'profile') {
      Toast.show({
        content: '系统页面不能删除',
        position: 'center'
      });
      return;
    }

    Dialog.confirm({
      title: '删除页面',
      content: `确定要删除"${pageName}"页面吗？`,
      onConfirm: () => {
        onDelete(pageId);
      }
    });
  };

  return (
    <PageManagerContainer>
      <PageManagerHeader>
        <h2>页面管理</h2>
        <Button
          size='small'
          onClick={() => {
            let tempName = '';
            Dialog.show({
              title: '新建页面',
              content: (
                <div style={{ padding: '12px 0' }}>
                  <Input
                    placeholder="请输入页面名称"
                    onChange={val => {
                      tempName = val;
                    }}
                  />
                </div>
              ),
              closeOnAction: true,
              actions: [
                {
                  key: 'cancel',
                  text: '取消'
                },
                {
                  key: 'confirm',
                  text: '确定',
                  bold: true,
                  onClick: () => {
                    if (tempName?.trim()) {
                      onAddPage(tempName.trim(), 'page');
                    }
                  }
                }
              ]
            });
          }}
        >
          新建页面
        </Button>
      </PageManagerHeader>
      <TreeContainer>
        <Tree
          defaultExpandAll
          treeData={treeData}
          selectedKeys={[currentPageId?.toString()]}
          onSelect={(selectedKeys) => {
            const pageId = selectedKeys[0];
            if (pageId) {
              onSelectPage(Number(pageId));
            }
          }}
        />
      </TreeContainer>
    </PageManagerContainer>
  );
};

export default PageManager; 