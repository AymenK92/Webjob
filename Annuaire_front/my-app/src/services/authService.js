import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://devjobnavigator-api.onrender.com/api';

// Fonction pour récupérer le token CSRF depuis les cookies
const getCsrfToken = () => {
  return Cookies.get('csrftoken');
};

// Création d'une instance d'Axios avec les configurations requises
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'X-CSRFToken': getCsrfToken(), // Initialiser avec le token CSRF actuel
  },
});

// Intercepteur de requête pour ajouter le token CSRF
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  } else {
    console.error('CSRF token not found');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post(`/login/`, {
      username,
      password,
    });

    if (response.status === 200) {
      // Met à jour le token CSRF après une connexion réussie
      axiosInstance.defaults.headers.common['X-CSRFToken'] = getCsrfToken();
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error during login:", error);
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
    return { success: false, error: "Unable to register" };
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false, error: error.response?.data || "An unknown error occurred" };
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post(`/logout/`);
    if (response.status === 204) {
      localStorage.removeItem('isLoggedIn');
      axiosInstance.defaults.headers.common['X-CSRFToken'] = undefined;
      return true;
    }
    return false;
  } catch (error) {
    console.error("An error occurred while logging out:", error);
    return false;
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await axiosInstance.get(`/user/`);
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
