import React, { useState, useEffect } from 'react';
import Filter from './components/filter';
import List from './components/list';
import Dialog from './components/dialog';
import { getAppList } from './sevices/index';

const MenuPage = () => {
  // 列表数据初始化
  const [data, changeData] = useState([]);

  // 定义paginations
  const [pagination, changePagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1,
  });

  // 定义请求数据的方法
  const fetchApi = async (params, newPagination) => {
    const newData = await getAppList(params);
    changeData(newData.records);
    changePagination({ ...pagination, total: newData.total, ...newPagination });
  };

  // 搜索数据的方法
  const onFilter = (values) => {
    // 调用请求数据的方法，传参获取需要搜索的数据，并改变pagination的值改变分页状态
    fetchApi(
      {
        params: {
          page: 1,
          ...values,
        },
      },
      { current: 1, hideOnSinglePage: true },
    );
  };

  // 分页请求数据
  const onChange = (paginationFromClick) => {
    // 调用请求数据的方法，传参获取需要分页的数据，并改变pagination的值改变分页状态
    fetchApi(
      {
        params: {
          page: paginationFromClick.current,
        },
      },
      paginationFromClick,
      // paginationFromClick是一个对象，这里的参数也是一个对象就不需要再用{...paginationFromClick}这用方式传进去了。paginationFromClick是表示点击页码是所获取的分页pagination的所有属性，所有属性都传进去，如果pagination里面有相同的数据就忽略，有最新的数据就会覆盖旧的数据。
    );
  };

  // 进入页面就渲染数据
  useEffect(() => {
    // 调用请求数据的方法，传参获取初始数据，并改变pagination的值改变分页状态
    fetchApi(
      {
        params: {
          page: 1,
        },
      },
      { current: 1, hideOnSinglePage: true },
    );
  }, []);

  // 模态框初始化数据（编辑）
  const [currentEditData, changeCurrentEditData] = useState({});

  // 模态框初始化状态
  const [visible, setVisible] = useState(false);

  // 显示模态框
  const onShowUserModal = (editData) => {
    setVisible(true);
    changeCurrentEditData(editData);
  };

  // 隐藏模态框
  const onHideUserModal = () => {
    setVisible(false);
  };

  // 重置重新渲染数据
  const Fetch = () => {
    fetchApi(
      {
        params: {
          page: 1,
        },
      },
      { current: 1 },
    );
  };

  return (
    <div>
      {/* 搜索表单 */}
      <Filter onFilter={onFilter} Fetch={Fetch} onShowUserModal={onShowUserModal} />
      {/* 列表表单 */}
      <List
        data={data}
        pagination={pagination}
        changeData={changeData}
        onShowUserModal={onShowUserModal}
        fetchApi={fetchApi}
        onChange={onChange}
        Fetch={Fetch}
      />
      {/* 创建模态框 */}
      <Dialog
        visible={visible}
        setVisible={setVisible}
        currentEditData={currentEditData}
        onHideUserModal={onHideUserModal}
        fetchApi={fetchApi}
        Fetch={Fetch}
      />
    </div>
  );
};

export default MenuPage;
