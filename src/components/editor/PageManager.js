import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Dialog, Toast, Input } from 'antd-mobile';
import { Tree } from 'antd';
import { AddOutline } from 'antd-mobile-icons';
import 'antd/dist/reset.css';

const PageManagerContainer = styled.div`
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
`;

const TreeContainer = styled.div`
  padding: 12px;
  max-height: 60vh;
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
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // 使用 useMemo 缓存树数据，只在 pages 变化时重新计算
  const treeData = useMemo(() => {
    // 创建主页节点
    const homeNode = {
      key: 'home',
      title: (
        <TreeNodeContent>
          <span>主页</span>
        </TreeNodeContent>
      ),
      selectable: false
    };

    // 获取一级页面（非主页和我的页面）
    const firstLevelPages = pages.filter(page => 
      !page.parentId && page.type !== 'home' && page.type !== 'profile'
    );

    // 构建一级页面节点
    const pageNodes = firstLevelPages.map(page => ({
      key: page.id.toString(),
      title: (
        <TreeNodeContent>
          <span>{page.name}</span>
          <AddButton
            size='mini'
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

    // 添加子页面到对应的父页面节点
    pages.forEach(page => {
      if (page.parentId) {
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
      }
    });

    // 创建我的页面节点
    const profileNode = {
      key: 'profile',
      title: (
        <TreeNodeContent>
          <span>我的</span>
        </TreeNodeContent>
      ),
      selectable: false
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

  const handleShowDialog = () => {
    setIsDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setIsDialogVisible(false);
  };

  return (
    <>
      <PageManagerContainer>
        <Button
          size='small'
          onClick={handleShowDialog}
          style={{
            '--adm-button-border-radius': '20px'
          }}
        >
          页面管理
        </Button>
      </PageManagerContainer>

      {isDialogVisible && (
        <Dialog
          visible={true}
          title='页面管理'
          content={
            <TreeContainer>
              <Tree
                defaultExpandAll
                treeData={treeData}
                selectedKeys={[currentPageId?.toString()]}
                onSelect={(selectedKeys) => {
                  const pageId = selectedKeys[0];
                  if (pageId && pageId !== 'home' && pageId !== 'profile') {
                    onSelectPage(Number(pageId));
                  }
                }}
              />
              <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                <Button
                  block
                  color='primary'
                  onClick={() => {
                    let tempName = '';
                    Dialog.show({
                      title: '新建一级页面',
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
                              onAddPage(tempName.trim(), 'normal', null);
                            }
                          }
                        }
                      ]
                    });
                  }}
                >
                  新建一级页面
                </Button>
              </div>
            </TreeContainer>
          }
          closeOnAction
          onClose={handleCloseDialog}
          actions={[
            {
              key: 'close',
              text: '关闭',
              onClick: handleCloseDialog
            }
          ]}
        />
      )}
    </>
  );
};

export default PageManager; 