import { getToken } from './authApi.js';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(BASE + path, { ...options, headers });
  if (!response.ok) {
    let message = 'Request failed';
    try { message = (await response.json()).detail || message; } catch {}
    throw new Error(message);
  }
  return response;
}

export async function listImageCategories() {
  return (await request('/images/categories')).json();
}
export async function createImageCategory(name) {
  return (await request('/images/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })).json();
}
export async function deleteImageCategory(id) {
  return request(`/images/categories/${id}`, { method: 'DELETE' });
}
export async function listImages(categoryId, search = '') {
  return (await request(`/images?category_id=${encodeURIComponent(categoryId)}&search=${encodeURIComponent(search)}`)).json();
}
export async function uploadImage(file, categoryId) {
  const form = new FormData();
  form.append('file', file);
  form.append('category_id', categoryId);
  return (await request('/images', { method: 'POST', body: form })).json();
}
export async function deleteImage(id) {
  return request(`/images/${id}`, { method: 'DELETE' });
}
export async function getImageUrl(id) {
  const response = await request(`/images/${id}/file`);
  return URL.createObjectURL(await response.blob());
}
