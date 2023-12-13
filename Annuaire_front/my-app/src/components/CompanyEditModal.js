import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const getCsrfTokenFromCookies = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const CompanyEditModal = ({ open, handleClose, company, updateCompany }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const csrfToken = getCsrfTokenFromCookies();
    axios.patch(`http://localhost:8000/api/companies/${formData.id}/`, formData, {
      headers: {
        'X-CSRFToken': csrfToken
      },
      withCredentials: true,
    })
    .then(response => {
      updateCompany(response.data);
      handleClose();
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Modifier une entreprise</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nom de l'entreprise"
          type="text"
          fullWidth
          value={formData.name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="website"
          label="Site web"
          type="text"
          fullWidth
          value={formData.website || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="city"
          label="Ville"
          type="text"
          fullWidth
          value={formData.city || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email_address"
          label="Adresse e-mail"
          type="email"
          fullWidth
          value={formData.email_address || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="physical_address"
          label="Adresse physique"
          type="text"
          fullWidth
          value={formData.physical_address || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="contact_name"
          label="Nom du contact"
          type="text"
          fullWidth
          value={formData.contact_name || ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Mettre à jour
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyEditModal;
