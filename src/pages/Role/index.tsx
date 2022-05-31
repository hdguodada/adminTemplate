import React, {useMemo, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {useModel} from 'umi';
import InitDataWrapper from '@/components/InitDataWrapper';
import ProCard from '@ant-design/pro-card';
import {getRouters, newRouter, updRole} from '@/services/account';
import ProForm, {ModalForm, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import {Button, notification, Switch} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {listToTree} from '@/utils';

const NewRouterForm: React.FC<{
  actionRef?: React.MutableRefObject<ActionType | undefined>;
}> = (props) => {
  const { actionRef } = props;
  return (
    <ModalForm<Account.Account>
      title="新建路由"
      trigger={
        <Button key="button" type="primary">
          <PlusOutlined />
          新建路由
        </Button>
      }
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      onFinish={async (values) => {
        await newRouter(values);
        actionRef?.current?.reload();
        notification.success({
          message: '新建成功',
        });
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText width="md" name="path" label="路径" />
        <ProFormText width="md" name="name" label="名称" />
        <ProFormSelect
          width="md"
          name="icon"
          label="上级"
          request={async () => {
            const routes = await getRouters();
            return routes.data
              .filter((i) => !i.icon)
              .map((j) => ({
                label: j.name,
                value: j.id,
              }));
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export const roleColumns: ProColumns<Account.Role>[] = [
  { title: 'id', dataIndex: 'id', hideInTable: true },
  { title: '角色名称', dataIndex: 'name' },
];
const RoleTable: React.FC<{
  roleId: K;
  onChange: (roleId: K) => void;
}> = (props) => {
  const { queryRoles } = useModel('role');
  const { roleId, onChange } = props;

  return (
    <ProTable<Account.Role>
      rowKey="id"
      rowClassName={(record) => {
        return record.id === roleId ? 'bg-gray-300' : '';
      }}
      search={false}
      options={false}
      pagination={false}
      columns={roleColumns}
      onRow={(r) => {
        return {
          onClick: () => {
            console.log('r.id', r.id);
            if (r.id) {
              onChange(r.id);
            }
          },
        };
      }}
      request={async (params) => {
        const d = await queryRoles(params);
        return {
          success: d.code === '0',
          data: d.data,
        };
      }}
    />
  );
};

const RouterTable: React.FC<{ roleId: K }> = (props) => {
  const { roleId } = props;
  const { roles } = useModel('role');
  const role = roles.find((item) => item.id === roleId);
  const actionRef = useRef<ActionType>();
  console.log('role', role);
  const [checkList, setCheckList] = useState(() => {
    if (role?.routeIds && role.routeIds.length > 0) {
      return role.routeIds.map((i) => +i);
    }
    return [];
  });
  useMemo(() => {
    setCheckList(() => {
      if (role?.routeIds && role.routeIds.length > 0) {
        return role.routeIds.map((i) => +i);
      }
      return [];
    });
  }, [role]);
  const routerColumns: ProColumns<Account.Router>[] = [
    { title: 'id', dataIndex: 'id' },
    { title: '功能', dataIndex: 'name' },
    {
      title: '权限',
      valueType: 'option',
      render: (_, record) => [
        <Switch
          key={'check'}
          checked={checkList.indexOf(record.id as number) > -1}
          onChange={(checked) => {
            if (checked) {
              setCheckList((v) => [...v, record.id as number]);
            } else {
              setCheckList((v) => v.filter((i) => i !== record.id));
            }
          }}
        />,
      ],
    },
  ];
  return (
    <ProTable
      toolBarRender={() => [
        <NewRouterForm key={'newRouter'} actionRef={actionRef} />,
        <Button
          key={'save'}
          type="dashed"
          onClick={async () => {
            if (role) {
              await updRole({
                ...role,
                routeIds: checkList.map((item) => item.toString()),
              }).then(() => {
                actionRef?.current?.reload();
              });
            }
          }}
        >
          保存
        </Button>,
      ]}
      actionRef={actionRef}
      defaultExpandAllRows={true}
      search={false}
      options={false}
      pagination={false}
      columns={routerColumns}
      rowKey="id"
      request={async (params) => {
        const d = await getRouters(params);
        return {
          success: d.code === '0',
          data: listToTree(d.data, 'id', 'icon'),
        };
      }}
    />
  );
};

const A: React.FC = () => {
  const { roles } = useModel('role');
  const [roleId, setRoleId] = useState<K>(roles[0].id);
  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="384px">
          <div style={{ height: '64px' }} />
          <RoleTable
            roleId={roleId}
            onChange={(v) => {
              setRoleId(v);
            }}
          />
        </ProCard>
        <ProCard>
          <RouterTable roleId={roleId} />
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
