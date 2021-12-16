/**
 * @param {string} url
 * @returns {Promise<Blob>}
 */
async function fetchBinary(url) {
  const result = await fetch(url, {
    method: 'GET',
    url,
  });
  return result.blob();
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
async function fetchJSON(url) {
  const result = await fetch(url, {
    method: 'GET',
  });
  if (!result.ok) {
    const obj = await result.json();
    return Promise.reject(obj.message);
  }
  return result.json();
}

/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  const formData = new FormData();
  formData.append('file', file);
  const result = await fetch(url, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    method: 'POST',
    body: formData,
  });
  return result.json();
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  const jsonString = JSON.stringify(data);
  const result = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: jsonString,
  });
  return result.json();
}

export { fetchBinary, fetchJSON, sendFile, sendJSON };
