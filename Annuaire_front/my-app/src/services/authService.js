import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://devjobnavigator-api.onrender.com';

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

  try {
    const response = await axiosInstance.post(`/login/`, {
      username,
      password,
    });

    if (response.status === 200) {
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.response) {
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
      return { success: true };
    }
  } catch (error) {
    if (error.response) {
      return { success: false, error: error.response.data };
    } else {
      return { success: false, error: { message: "Une erreur inconnue est survenue" } };
    }
  }
};


export const logout = async () => {
    try {
        const response = await axiosInstance.post(`/logout/`);
        if (response.status === 204) {
            localStorage.removeItem('isLoggedIn');
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
