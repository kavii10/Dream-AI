import axios from 'axios';
const BASE = "http://localhost:8000"; // backend FastAPI address

export async function searchRoles(query) {
  const res = await axios.post(`${BASE}/search_roles`, { query });
  return res.data;
}

export async function getRoadmap(conceptUri_or_text) {
  const res = await axios.post(`${BASE}/get_roadmap`, { query: conceptUri_or_text });
  return res.data;
}