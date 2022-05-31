import InitDataWrapper from '@/components/InitDataWrapper';
import { IndexColumns } from '@/utils/columns';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { history } from 'umi';
import { q_banks } from './api';
const Q_Table: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<Question.Bank>[] = [
    IndexColumns(),
    {
      title: '题库名称',
      dataIndex: 'questionBankName',
    },
    {
      title: '题目数量',
      dataIndex: 'questionNum',
      search: false,
    },
    {
      title: '关联活动数量',
      dataIndex: 'activityNum',
      search: false,
    },
    {
      width: 100,
      valueType: 'option',
      render: (_, record) => {
        return [
          <a
            key="edit"
            onClick={async () => {
              history.push(`/Q_bank_config/${record.id}`);
            }}
          >
            管理
          </a>,
        ];
      },
    },
  ];
  return (
    <ProTable<Question.Bank>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      request={async () => {
        const d = await q_banks();
        console.log(d)
        return {
          data: d.content,
        };
      }}
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={async () => {}}>
          新建题库
        </Button>,
      ]}
    />
  );
};

export default () => (
  <InitDataWrapper>
    <PageContainer>
      <Q_Table />
    </PageContainer>
  </InitDataWrapper>
);
