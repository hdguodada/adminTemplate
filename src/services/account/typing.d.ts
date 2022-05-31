declare namespace Account {
  type Deps = {
    id: K;
    name: string;
    status: number;
    parentId: number;
  };
  type Role = {
    id: K;
    name: string;
    routeIds: string[];
  };
  type Account = {
    id: K;
    name: string;
    phone: string;
    deptName: string;
    roleName: string;
    deptId: K;
    roleId: K;
  };
  type AccountR = {
    records: Api.CurrentUser[];
    current: number;
    size: number;
    total: number;
  };
  type Router = {
    id: K;
    name: string;
    path: string;
    icon: string;
  };
}

declare namespace Grid {
  interface Contact {
    contactsId: number;
    szz: string; // 街道
    id: number;
    szsq: string; // 社区
    gridName: string; // 网格
    gridUsername: string; // 网格员
    gridContact: string; // 网格员手机号
    gridId: K; // 网格id
    name: string; // 联络员
    contact: string; // 联络员手机号
    type: string; // 身份
    personNum: string; // 人口数
  }
  interface gridTreeItem {
    label: string;
    value: string;
    type: 'szz';
    children: {
      label: string;
      value: string;
      type: 'szsq';
      id: string;
      children: { id: string; label: string; value: string; type: 'wg'; children: null }[];
    }[];
  }
  interface gridUserItem {
    id: number | string;
    contactsId: string;
    name: string;
    idCard: string;
    contact: string;
    family: number;
    household?: string;
    add?: boolean;
    familyId?: string;
  }
  interface grid {
    gridMapId: K;
    id: K;
    town: string;
    townArea: string;
    gridName: string;
    gridUsername: string;
    gridContact: string;
  }
  interface sms {
    id: K;
    content: string;
    name: string;
    status: 0 | 1;
    type: 1 | 2;
    add?: boolean;
  }
}
