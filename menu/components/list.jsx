import React from 'react';
import { Button, Table, Space, Popconfirm, message } from 'antd';
import { remove } from '../sevices';

const { Column } = Table;
const List = (props) => {
  const showUserModal = (currentEditData) => {
    props.onShowUserModal(currentEditData);
  };

  // 定义删除数据的方法
  const DelApi = async (id) => {
    await remove(id);
    message.success('删除成功', 2);
    props.Fetch(); // 重新渲染数据
  };

  // 点击页码分页（点击页码获取当前页面的值）
  const onChange = (currentPagination) => {
    props.onChange(currentPagination);
  };

  return (
    <div>
      {/* 表格 <Table>表单要加key值 rowKey='id' */}
      {/* pagination是一个object对象 ，用来定义分页栏的，点击翻页的原理就是通过获取点击的页码的current值来发请求获取当前页的数据渲染到页面，点击第几页就获取第几页的数据渲染上去。而需要获取current值，就需要用到Table组件的一个 onChange ， onChange是一个函数，可以通过onChange获取当前点击的current值。 */}
      <Table dataSource={props.data} rowKey="id" pagination={props.pagination} onChange={onChange}>
        <Column title="名称" dataIndex="name" key="name" />
        <Column title="标题" dataIndex="title" key="title" />
        <Column title="代码库" dataIndex="git_repo" key="git_repo" />
        <Column title="代码审核人" dataIndex="code_auditor_name" key="code_auditor_name" />
        <Column title="产品线" dataIndex="product_name" key="product_name" />
        <Column
          title="操作"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button
                onClick={() => {
                  showUserModal(record);
                }}
              >
                编辑
              </Button>
              <Button danger>
                <Popconfirm
                  title="是否确定删除数据?"
                  onConfirm={() => {
                    DelApi(record.id);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="#">删除</a>
                </Popconfirm>
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default List;
