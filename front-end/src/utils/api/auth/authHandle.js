// @/src/utils/api/user/userHandle.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser({ username, password }) {
  try {
    const res = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  } catch (error) {
    throw error;
  }
}

export async function registerUser({ name, username, password }) {
  try {
    const res = await fetch(`${API_URL}/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const res = await fetch(`${API_URL}/user/get/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'User not found');
    return data;
  } catch (error) {
    throw error;
  }
}
