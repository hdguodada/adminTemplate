import { request } from 'umi';
// 角色相关Api Start

export async function login(options: { [key: string]: any }, type: string) {
  const url = type ? `${API_URL}/api/v1/account/login` : `${API_URL}/api/v1/account/login`
  return request<MyResponse<string>>(url, {
    method: 'GET',
    params: options,
  });
}

export async function getCurrentUser(options?: { [key: string]: any }) {
  
  return request<MyResponse<API.CurrentUser>>(`${API_URL}/api/v1/currentUser`, {
    method: 'GET',
    params: options,
  });
}

export async function getDeps(options?: { [key: string]: any }) {
  return request<MyResponse<Account.Deps[]>>(`${API_URL}/api/v1/deptsNoRoot`, {
    method: 'GET',
    params: options,
  });
}

export async function getDepsHasRoot(options?: { [key: string]: any }) {
  const d = await request<MyResponse<Account.Deps[]>>(`${API_URL}/api/v1/depts`, {
    method: 'GET',
    params: options,
  });
  return {
    ...d,
    data: d.data.filter((i) => i.parentId !== 1),
  };
}

export async function getAccounts(options?: { [key: string]: any }) {
  return request<MyResponse<Account.AccountR>>(`${API_URL}/api/v1/accounts`, {
    method: 'GET',
    params: options,
  });
}
export async function updAccount(data: Account.Account) {
  return request<MyResponse<Account.Account>>(`${API_URL}/api/v1/account/update`, {
    method: 'POST',
    data,
  });
}

export async function newAccount(data: Account.Account) {
  return request<MyResponse<Account.Account>>(`${API_URL}/api/v1/account`, {
    method: 'POST',
    data,
  });
}

export async function resetPwd(params: { phone: string }) {
  return request<MyResponse<Account.Account>>(`${API_URL}/api/v1/account/reset`, {
    method: 'GET',
    params,
  });
}

export async function getRoles(options?: { [key: string]: any }) {
  return request<MyResponse<Account.Role[]>>(`${API_URL}/api/v1/roles`, {
    method: 'GET',
    params: options,
  });
}

export async function updRole(data: Account.Role) {
  return request<MyResponse<Account.Role[]>>(`${API_URL}/api/v1/role/update`, {
    method: 'POST',
    data,
  });
}

export async function getRouters(params?: { [key: string]: any }) {
  return request<MyResponse<Account.Router[]>>(`${API_URL}/api/v1/routes`, {
    method: 'GET',
    params,
  });
}

export async function newRouter(data: Account.Account) {
  return request<MyResponse<any>>(`${API_URL}/api/v1/route`, {
    method: 'POST',
    data,
  });
}

// 角色相关Api End

// 联络员 Start
export async function getContacts(params?: { [key: string]: any }) {
  return request<RecordsResponse<Grid.Contact[]>>(`${API_URL}/api/v1/list/contact`, {
    params,
  });
}

export async function delContact(id: number) {
  return request<MyResponse<Grid.gridTreeItem[]>>(`${API_URL}/api/v1/delete/contact`, {
    params: { id },
  });
}

export async function newContact(v: Grid.Contact) {
  return request<MyResponse<Grid.gridUserItem[]>>(`${API_URL}/api/v1/save/contact`, {
    method: 'POST',
    data: v,
  });
}

export async function editContact(v: Grid.Contact) {
  return request<MyResponse<Grid.gridTreeItem[]>>(`${API_URL}/api/v1/update/contact`, {
    method: 'POST',
    data: v,
  });
}
// 联络员 End

// 联系户 Start
export async function getContactUsers(params?: { [key: string]: any }) {
  return request<MyResponse<Grid.gridUserItem[]>>(`${API_URL}/api/v1/list/contactUser`, {
    params,
  });
}

export async function editContactUser(v: Grid.gridUserItem) {
  return request<MyResponse<Grid.gridUserItem[]>>(`${API_URL}/api/v1/update/contactsUser`, {
    method: 'POST',
    data: v,
  });
}

export async function newContactUser(v: Grid.gridUserItem) {
  return request<MyResponse<Grid.gridUserItem[]>>(`${API_URL}/api/v1/save/contactsUser`, {
    method: 'POST',
    data: v,
  });
}

export async function delContactUser(id: number | string, contactsId: number) {
  return request<MyResponse<Grid.gridUserItem[]>>(`${API_URL}/api/v1/delete/contactsUser`, {
    params: { id, contactsId },
  });
}
// 联系户 End
export async function getGrids(params?: { [key: string]: any }) {
  return request<RecordsResponse<Grid.grid[]>>(`${API_URL}/api/v1/list/gridUser`, {
    params,
  });
}
// 网格 Start

// 网格 End

export async function getGridTree(params?: { [key: string]: any }) {
  return request<MyResponse<Grid.gridTreeItem[]>>(`${API_URL}/api/v1/grid/tree`, {
    params,
  });
}

// 短信配置API Start
export async function smsList(params?: { [key: string]: any }) {
  return request<MyResponse<Grid.sms[]>>(`${API_URL}/api/v1/sms/configs`, {
    params,
  });
}

export async function smsDetail(id: K) {
  return request<MyResponse<Grid.sms[]>>(`${API_URL}/api/v1/sms/config/${id}`);
}

export async function smsUpdate(data: Grid.sms) {
  return request<MyResponse<Grid.sms>>(`${API_URL}/api/v1/sms/config/update`, {
    method: 'POST',
    data,
  });
}

export async function smsNew(data: Grid.sms) {
  return request<MyResponse<Grid.sms>>(`${API_URL}/api/v1/sms/config`, {
    method: 'POST',
    data,
  });
}

// 短信配置API End
