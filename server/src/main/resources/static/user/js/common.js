const API_BASE_URL = '';

const request = {
    async get(url) {
        const response = await fetch(API_BASE_URL + url);
        return await response.json();
    },
    async post(url, data) {
        const response = await fetch(API_BASE_URL + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },
    async postForm(url, data) {
        const searchParams = new URLSearchParams();
        for (const key in data) {
            searchParams.append(key, data[key]);
        }
        const response = await fetch(API_BASE_URL + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: searchParams.toString()
        });
        return await response.json();
    },
    async delete(url) {
        const response = await fetch(API_BASE_URL + url, { method: 'DELETE' });
        return await response.json();
    },
    async upload(file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(API_BASE_URL + '/file/upload', {
            method: 'POST',
            body: formData
        });
        return await response.json();
    }
};

// Tooltip and UI Helpers
const UI = {
    toast(message, type = 'success') {
        const toastEl = document.createElement('div');
        toastEl.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
        toastEl.style.zIndex = '9999';
        toastEl.innerText = message;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 3000);
    }
};
