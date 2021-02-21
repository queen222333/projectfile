import React from 'react';
import { Button, Input, Form } from 'antd';
import ProductSelect from '@/pages/Tasks/components/ProductSelect';

const Filter = (props) => {
  // 搜索框表单
  const [seachForm] = Form.useForm();

  // 提交搜索内容
  const onSubmit = () => {
    seachForm.validateFields().then((values) => {
      // 获取搜索表单数据传回给父组件处理
      props.onFilter(values);
    });
  };

  // 重置搜索内容
  const onReset = () => {
    seachForm.resetFields();
    props.Fetch();
  };

  // 点击打开创建模态框
  const showUserModal = () => {
    props.onShowUserModal();
  };

  return (
    <div>
      {/* 搜索表单 */}
      <Form form={seachForm} name="control-hooks" layout="inline" style={{ marginBottom: '20px' }}>
        <Form.Item name="name" label="名称">
          <Input placeholder="请输入名称" allowClear />
        </Form.Item>
        <Form.Item name="title" label="标题">
          <Input placeholder="请输入标题" allowClear />
        </Form.Item>
        <Form.Item name="product_id" label="产品线">
          <ProductSelect placeholder="请选择产品线" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onSubmit} style={{ marginRight: '16px' }}>
            搜索
          </Button>
          <Button htmlType="button" onClick={onReset} style={{ marginRight: '16px' }}>
            重置
          </Button>
          <Button type="primary" htmlType="button" onClick={showUserModal}>
            创建
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Filter;
