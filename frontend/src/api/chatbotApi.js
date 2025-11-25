const API_BASE_URL = 'http://127.0.0.1:5000/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const sendMessageToChatbot = async (prompt, history = []) => {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ prompt, history }),
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || 'Chatbot communication failed');
    }
    return data; // { response }
};