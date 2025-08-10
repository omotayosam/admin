import axios from 'axios';

// Create an axios instance with default config
const isServer = typeof window === 'undefined';

const resolvedBaseUrl =
    process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim().length > 0
        ? process.env.NEXT_PUBLIC_API_URL
        : isServer
            ? 'http://localhost:1440/api'
            : '/api';

const apiClient = axios.create({
    baseURL: resolvedBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    // Send cookies only for same-origin proxy usage (development rewrites)
    withCredentials: typeof window !== 'undefined' ? resolvedBaseUrl.startsWith('/') : false,
});

// Log the configuration
console.log('API Client Configuration:', {
    baseURL: apiClient.defaults.baseURL,
    headers: apiClient.defaults.headers,
    withCredentials: apiClient.defaults.withCredentials
});

// Add request interceptor for auth
apiClient.interceptors.request.use((config) => {
    // Only try to access auth in browser environment
    if (typeof window !== 'undefined') {
        // For Clerk, we rely on session cookies being sent automatically
        // The backend will handle authentication via the session
        console.log('Making API request with session cookies');
    }
    return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log('Received response:', {
            status: response.status,
            url: response.config.url
        });
        return response;
    },
    (error) => {
        // Only handle redirects in browser environment
        if (typeof window !== 'undefined' && error.response?.status === 401) {
            console.log('401 error - redirecting to sign-in');
            // For Clerk, we don't need to remove anything from localStorage
            // Just redirect to sign-in
            window.location.href = '/auth/sign-in';
        }
        return Promise.reject(error);
    }
);

export default apiClient; 