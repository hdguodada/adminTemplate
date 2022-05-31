import { request } from 'umi';

export async function q_banks(params?: { [key: string]: any }) {
  return request<RecordsResponse<Question.Bank[]>>('/api/gzhQuestionBank', {
    data: params,
  });
}
