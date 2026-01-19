// back-end server url
// Automatically use the same host as the frontend for network access
const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        // Client-side: use the same hostname as the current page
        const hostname = window.location.hostname;
        const port = '3001';
        const protocol = window.location.protocol;
        return `${protocol}//${hostname}:${port}`;
    }
    // Server-side: use environment variable or default to localhost
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
};

export const API_URL = getApiUrl();
