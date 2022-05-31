import { ProColumns } from '@ant-design/pro-table';

export function IndexColumns(): ProColumns<any> {
  return {
    dataIndex: 'index',
    valueType: 'indexBorder',
    fixed: 'left',
    width: 48,
  };
}
