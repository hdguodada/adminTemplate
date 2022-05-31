import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { getAccounts, getDepsHasRoot, newAccount, resetPwd, updAccount } from '@/services/account';
import InitDataWrapper from '@/components/InitDataWrapper';
import { useModel } from '@@/plugin-model/useModel';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, notification, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';

const NewAccountForm: React.FC<{
  actionRef?: React.MutableRefObject<ActionType | undefined>;
}> = (props) => {
  const { roles } = useModel('role');
  return (
    <ModalForm<UserItem>
      title="新建账号"
      trigger={
        <Button key="button" type="primary">
          <PlusOutlined />
          新建账号
        </Button>
      }
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      onFinish={async (values) => {
        await newAccount(values);
        notification.success({
          message: '新建账户成功',
        });
        props.actionRef?.current?.reload();
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText width="md" name="phone" label="手机号码" />
        <ProFormText width="md" name="name" label="用户名" />
        <ProFormSelect
          width="md"
          name="deptId"
          label="部门"
          request={async () => {
            const d = await getDepsHasRoot();
            return d.data.map((i) => ({
              label: i.name,
              value: i.id,
            }));
          }}
        />
        <ProFormSelect
          width="md"
          name="roleId"
          label="角色"
          options={roles.map((i) => ({ label: i.name, value: i.id }))}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export type DepTableProps = {
  deptId: K;
  onChange: (id: K) => void;
};
export const depColumns: ProColumns<Account.Deps>[] = [
  { title: 'id', dataIndex: 'id', hideInTable: true },
  { title: '部门名称', dataIndex: 'name' },
];
export const DepTable: React.FC<DepTableProps> = (props) => {
  const { deptId, onChange } = props;

  return (
    <ProTable<Account.Deps>
      toolbar={{
        search: {
          onSearch: (value) => {
            alert(value);
          },
        },
      }}
      rowKey="id"
      rowClassName={(record) => {
        return record.id === deptId ? 'bg-gray-300' : '';
      }}
      pagination={false}
      columns={depColumns}
      options={false}
      search={false}
      onRow={(r) => {
        return {
          onClick: () => {
            if (r.id) {
              onChange(r.id);
            }
          },
        };
      }}
      request={async (params = {}) => {
        const r = await getDepsHasRoot(params);
        return {
          data: r.data,
          success: r.code === '0',
        };
      }}
    />
  );
};

export type UserTableProps = {
  deptId: K;
};
export type UserItem = Account.Account;
export const UserTable: React.FC<UserTableProps> = (props) => {
  const { deptId } = props;
  const { roles } = useModel('role');
  const { dep } = useModel('dept');
  const actionRef = useRef<ActionType>();

  const [editableKeys, setEditableRowKeys] = useState<K[]>([]);

  const userColumns: ProColumns<UserItem>[] = [
    { title: '手机', dataIndex: 'phone', editable: false },
    { title: '用户名', dataIndex: 'name' },
    {
      title: '部门',
      dataIndex: 'deptId',
      valueType: 'select',
      request: async () => {
        return dep.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      valueType: 'select',
      request: async () => {
        return roles.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record, index, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="是否重置密码"
          onConfirm={async () => {
            await resetPwd({ phone: record.phone });
            notification.success({
              message: '更新密码成功',
            });
          }}
          onCancel={() => {}}
          key="resetPassword"
        >
          <a>重置密码</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <EditableProTable
      toolBarRender={() => [<NewAccountForm actionRef={actionRef} />]}
      columns={userColumns}
      rowKey="id"
      actionRef={actionRef}
      params={{
        deptId: deptId,
      }}
      request={async (params) => {
        const d = await getAccounts({
          ...params,
          pageSize: 100,
        });
        return {
          success: d.code === '0',
          data: d.data.records,
        };
      }}
      editable={{
        type: 'multiple',
        editableKeys,
        onSave: async (rowKey, data) => {
          await updAccount(data).then(() => {
            actionRef.current?.reload();
            notification.success({
              message: '更新成功',
            });
          });
        },
        onChange: setEditableRowKeys,
        actionRender: (row, config, dom) => [dom.save, dom.cancel],
      }}
      recordCreatorProps={false}
    />
  );
};

const A: React.FC = () => {
  const { dep } = useModel('dept');
  const [deptId, setDepName] = useState<K>(dep[0].id);
  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="384px">
          <DepTable
            onChange={(v) => {
              setDepName(v);
            }}
            deptId={deptId}
          />
        </ProCard>
        <ProCard>
          <UserTable deptId={deptId} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
export default () => (
  <InitDataWrapper>
    <A />
  </InitDataWrapper>
);
