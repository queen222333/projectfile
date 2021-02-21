import React, { useEffect } from 'react';
import { Button, Input, Form, Row, Col, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProductSelect from '@/pages/Tasks/components/ProductSelect';
import AddJenkinsConfig from '../../app/components/addJenkinsConfig';
import { create, update } from '../sevices';

// 布局
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 3 },
  },
};

// 检验新增部署环境表单
const checkEnvConfig = (value) => {
  return new Promise((resolve, reject) => {
    // 判断表单是否有空的或者undefined,findIndex()等于-1，就是找不到空或者undefined，!== -1就是找得到，就提示错误
    if (!value || Object.values(value).findIndex((v) => v === '' || v === undefined) !== -1) {
      reject(new Error('请填写完整部署环境'));
    } else {
      resolve();
    }
  });
};

const Dialog = (props) => {
  // 环境数据初始化
  const productEnv = [];
  const jenkins = [];

  // 模态框表单
  const [newForm] = Form.useForm();
  useEffect(() => {
    if (props.currentEditData) {
      newForm.setFieldsValue(props.currentEditData);
    } else {
      newForm.resetFields();
    }
  });

  // 隐藏模态框
  const hideUserModal = () => {
    props.onHideUserModal();
  };

  // 定义新增数据的方法
  const Create = async (values) => {
    await create(values);
    message.success('新增成功', 2);
    hideUserModal();
    props.Fetch(); // 重新渲染数据
  };

  // 定义编辑数据的方法
  const Update = async (values) => {
    await update(props.currentEditData.id, values);
    message.success('编辑成功', 2);
    hideUserModal();
    props.Fetch(); // 重新渲染数据
  };

  // 点击确认提交
  const onOk = () => {
    if (props.currentEditData) {
      // 提交编辑
      newForm.validateFields().then((values) => {
        Update(values);
      });
    } else {
      // 提交新增
      newForm.validateFields().then((values) => {
        Create(values);
      });
    }
  };

  return (
    <div>
      <Modal
        title={props.currentEditData ? '编辑' : '创建'}
        width="900px"
        visible={props.visible}
        onOk={onOk}
        onCancel={hideUserModal}
        getContainer={false}
      >
        <Form
          {...layout}
          form={newForm}
          layout="horizontal"
          name="userForm"
          initialValues={props.currentEditData || {}}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="请输入 Kubernetes Deployment 名称" />
          </Form.Item>
          <Form.Item
            name="title"
            label="标题"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="git_repo"
            label="代码仓库"
            rules={[
              {
                required: true,
                pattern: /\.git$/,
                message: '请填写正确的代码仓库地址',
              },
            ]}
          >
            <Input placeholder="请输入代码仓库地址, eg: https://xxxxx.com/xxx.git" />
          </Form.Item>
          <Form.Item
            name="code_auditor_id"
            label="代码审核人"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="product_id"
            label="产品线"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <ProductSelect placeholder="请选择产品线" />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea />
          </Form.Item>
          <Form.List name="env">
            {/* 两个参数，解构函数的add，remove方法 */}
            {(fields, { add, remove }) => {
              return (
                <div>
                  {/* 判断是否有新增的内容 */}
                  {fields.length ? (
                    <Row>
                      <Col {...formItemLayoutWithOutLabel.wrapperCol}>
                        <Row gutter={10}>
                          <Col span={5}>环境名称</Col>
                          <Col span={5}>Jenkins</Col>
                          <Col span={5}>部署环境</Col>
                          <Col span={5}>Jenkins Job</Col>
                        </Row>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? '构建设置' : ''}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        rules={[
                          {
                            validateTrgger: 'onBlur',
                            validator(_rule, value) {
                              // 失去焦点验证表单的内容是否符合规则
                              return checkEnvConfig(value);
                            },
                          },
                        ]}
                        noStyle
                      >
                        <AddJenkinsConfig
                          // 组件通讯方法和数据的传递
                          remove={() => remove(field.name)}
                          envOptions={productEnv}
                          jenkinsOptions={jenkins}
                        />
                      </Form.Item>
                    </Form.Item>
                  ))}
                  <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                    >
                      <PlusOutlined /> 新增部署环境
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};
export default Dialog;
