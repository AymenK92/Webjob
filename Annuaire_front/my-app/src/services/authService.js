import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['X-CSRFToken'] = Cookies.get('csrftoken');
  }
  return config;
});

export const login = async (username, password) => {
  console.log(`Attempting to login with username: ${username} and password: ${password}`);

  try {
    const response = await axiosInstance.post(`/login/`, {
      username,
      password,
    });

    console.log('Server responded with status:', response.status);
    console.log('Response data:', response.data);

    if (response.status === 200) {
      localStorage.setItem('isLoggedIn', 'true'); // définir l'utilisateur comme connecté dans le localStorage
      return true;
    } else {
      console.error("Failed to login:", response.data);
      return false;
    }
  } catch (error) {
    console.error("An error occurred while logging in", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    return false;
  }
};

export const register = async (username, email, password, firstName, lastName) => {
  try {
    const response = await axiosInstance.post(`/register/`, {
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });

    if (response.status === 201) {
      return true;
    } else {
      console.error("Failed to register:", response.data);
      return false;
    }
  } catch (error) {
    console.error("An error occurred while registering", error);
    console.error("Server response:", error.response.data);
    return false;
  }
};

export const logout = async () => {
    try {
        const response = await axiosInstance.post(`/logout/`);
        if (response.status === 204) {
            localStorage.removeItem('isLoggedIn');  // Réinitialisation du localStorage
            return true;
        } else {
            console.error("Failed to logout:", response.data);
            return false;
        }
    } catch (error) {
        console.error("An error occurred while logging out", error);
        if (error.response) {
            console.error("Server response:", error.response.data);
        }
        return false;
    }
};

export const isAuthenticated = async () => {
  try {
    const response = await axiosInstance.get(`/user/`);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
