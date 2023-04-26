import { API_URL } from './config.js';
import { TIMEOUT_SEC } from './config.js';
const timeout = async function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (recipeHash) {
  try {
    const res = await Promise.race([
      fetch(`${API_URL}/${recipeHash}`),
      timeout(TIMEOUT_SEC),
    ]);
    if (!res.ok) throw new Error(`(${res.status}) ${data.message}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const res = uploadData
      ? await Promise.race([
          fetch(`${url}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
          }),
          timeout(TIMEOUT_SEC),
        ])
      : await Promise.race([fetch(`${API_URL}/${url}`), timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`(${res.status}) ${uploadData.message}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  const res = await Promise.race([
    fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    }),
    timeout(TIMEOUT_SEC),
  ]);
  if (!res.ok) throw new Error(`(${res.status}) ${uploadData.message}`);
  const data = await res.json();
  return data;
};
