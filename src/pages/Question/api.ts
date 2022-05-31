import { request } from 'umi';

export async function q_banks(params?: { [key: string]: any }) {
  return request<RecordsResponse<Question.Bank[]>>(`${API_URL}/api/gzhQuestionBank`, {
    data: params,
  });
}
