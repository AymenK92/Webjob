import React, { useState, useContext, useEffect } from 'react'; // Ajoutez useEffect ici
import { Modal, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import { CompanyFormContext } from '../contexts/CompanyFormContext';

const getCsrfTokenFromCookies = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const CompanyFormModal = ({ open, handleClose, addNewCompany }) => {
  const { companyData, updateCompanyData } = useContext(CompanyFormContext);

  const initialState = {
    name: '',
    website: '',
    city: '',
    email_address: '',
    physical_address: '',
    contact_name: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (companyData) {
      setFormData({
        ...initialState,
        name: companyData.name || '',
        city: companyData.city || ''
      });
    }
  }, [companyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const csrfToken = getCsrfTokenFromCookies();
    try {
      const response = await axios.post('http://localhost:8000/api/companies/', formData, {
        headers: { 'X-CSRFToken': csrfToken },
        withCredentials: true
      });
      console.log('Entreprise ajoutée:', response.data);
      updateCompanyData({ ...response.data });
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
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Enregistrer</Button>
      </Box>
    </Modal>
  );
};

export default CompanyFormModal;
