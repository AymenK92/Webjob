import React, { useState, useContext } from 'react'; 
import { Modal, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import { CompanyFormContext } from '../contexts/CompanyFormContext';
import Cookies from 'js-cookie';

const API_URL = 'https://devjobnavigator-api.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

const CompanyFormModal = ({ open, handleClose, addNewCompany }) => {
  const { companyData } = useContext(CompanyFormContext);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    city: '',
    email_address: '',
    physical_address: '',
    contact_name: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const csrfToken = Cookies.get('csrftoken');
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      const response = await axiosInstance.post('/companies/', formData, {
        headers: { 'X-CSRFToken': csrfToken },
      });

      console.log('Entreprise ajoutée:', response.data);
      addNewCompany(response.data);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
      setErrorMessage(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'entreprise.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <h2 id="modal-modal-title">Ajouter une entreprise</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <TextField name="name" margin="normal" fullWidth id="name" label="Nom de l'entreprise" variant="outlined" value={formData.name} onChange={handleChange} />
        <TextField name="website" margin="normal" fullWidth id="website" label="Site web de l'entreprise" variant="outlined" value={formData.website} onChange={handleChange} />
        <TextField name="city" margin="normal" fullWidth id="city" label="Ville de l'entreprise" variant="outlined" value={formData.city} onChange={handleChange} />
        <TextField name="email_address" margin="normal" fullWidth id="email_address" label="Adresse e-mail de l'entreprise" variant="outlined" value={formData.email_address} onChange={handleChange} />
        <TextField name="physical_address" margin="normal" fullWidth id="physical_address" label="Adresse physique de l'entreprise" variant="outlined" value={formData.physical_address} onChange={handleChange} />
        <TextField name="contact_name" margin="normal" fullWidth id="contact_name" label="Nom de la personne à contacter" variant="outlined" value={formData.contact_name} onChange={handleChange} />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} style={{ marginTop: '20px' }}>Enregistrer</Button>
      </Box>
    </Modal>
  );
};

export default CompanyFormModal;
