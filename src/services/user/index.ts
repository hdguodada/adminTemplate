import { request } from 'umi';

export async function login(params?: { [key: string]: any }) {
  return request('/api/login', {
    method: 'POST',
    data: params
  })
}
