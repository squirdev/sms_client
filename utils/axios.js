import axios from "axios";
import mitt from "mitt";
export const eventBus = mitt();

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use dynamic import to get the store only on the client
axiosApi.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const { store } = await import("../redux/store"); // Import store dynamically
      const { auth } = store.getState(); // Get auth state
      if (auth?.token) {
        config.headers.Authorization = auth.token; // Attach token
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and trigger logout
axiosApi.interceptors.response.use(
  (response) => response, // Return response if no errors
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const { store } = await import("../redux/store"); // Import store dynamically
        const { logout } = await import("../redux/authSlice"); // Import logout action
        store.dispatch(logout()); // Dispatch logout action
        eventBus.emit("logout");
      }
    }
    return Promise.reject(error); // Reject the error
  }
);

export default axiosApi;
