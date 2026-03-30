import axios from "axios";

// Base URL for the API
// For real device testing, replace 'localhost' with your local IP address
// e.g. http://192.168.1.100:4000
const BASE_URL = "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Set auth token for requests
export function setApiToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

export default apiClient;
