import type { IRecord, ITag } from "@/store";
import shttp from "../utils/shttp";
import storage from "../utils/storage";

export async function getAccessToken(refresh_token: string) {
  const result = await shttp.post(`https://jiayou.work/gw/user/oauth/refresh`, {}, {
    headers: {
      Authorization: refresh_token
    }
  });
  if (result.code === 0) {
    const data = result.data;
    return data;
  } else {
    throw ('error')
  }
}

export async function getProfile() {
  const result = await shttp.get(`https://jiayou.work/gw/user/profile`, {
    headers: { Authorization: storage.getValue('access_token') }
  })
  if (result.code === 0) {
    return result.data;
  } else {
    throw ('error')
  }
}

export async function logout() {
  const result = await shttp.post(`https://jiayou.work/gw/user/oauth/sign-out`, {}, {
    headers: { Authorization: storage.getValue('refresh_token') }
  })
  return result;
}

// kinds
export async function getTags(query = {}) {
  const result = await shttp.get<ITag>(`/api/tags`, { params: query });
  if (result.success) {
    const data = result.data.list;
    return data;
  } else {
    throw ('error')
  }
}
export async function createTag(data: ITag) {
  return await shttp.post('/api/tags', data)
}
export async function destroyTag(id: string) {
  return await shttp.delete(`/api/tags/${id}`);
}
// records
export async function getRecordsByDate(date: string) {
  const result = await shttp.get<IRecord>(`/api/records/${date}`);
  if (result.success) {
    const data = result.data.list;
    return data;
  } else {
    throw ('error')
  }
}
export async function createRecord(data: IRecord) {
  return await shttp.post('/api/records', data)
}
export async function destryRecord(id: string) {
  return await shttp.delete(`/api/records/${id}`);
}

