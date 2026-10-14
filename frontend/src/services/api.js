import { getToken } from './authApi.js';
const BASE=import.meta.env.VITE_API_BASE_URL||'http://127.0.0.1:8000/api/v1';
async function req(path,options={}){const headers=new Headers(options.headers);const token=getToken();if(token)headers.set('Authorization',`Bearer ${token}`);const r=await fetch(BASE+path,{...options,headers});if(!r.ok){let m='Request failed';try{m=(await r.json()).detail||m}catch{}throw new Error(m)}return r}
export async function listDocuments(search=''){return (await req('/documents?search='+encodeURIComponent(search))).json()}
export async function uploadDocument(file){const f=new FormData();f.append('file',file);return (await req('/documents',{method:'POST',body:f})).json()}
export async function deleteDocument(id){return req('/documents/'+id,{method:'DELETE'})}
export async function downloadDocument(id,name){const r=await req('/documents/'+id+'/download');const u=URL.createObjectURL(await r.blob());const a=document.createElement('a');a.href=u;a.download=name;a.click();URL.revokeObjectURL(u)}
