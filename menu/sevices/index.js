import request from '@/utils/request';

export function getAppList(params) {
  return request.get('/app', params);
}

export function create(data) {
  return request.post(`/app`, { data });
}

export function update(id, data) {
  return request.put(`/app/${id}`, { data });
}

export function remove(id) {
  return request.delete(`/app/${id}`);
}
