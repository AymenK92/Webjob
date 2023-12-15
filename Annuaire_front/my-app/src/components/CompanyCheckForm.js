import React, { useContext, useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { CompanyFormContext } from '../contexts/CompanyFormContext';

const getCsrfTokenFromCookies = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const CompanyCheckForm = ({ onCompanyExists, onCompanyNotFound }) => {
  const { updateCompanyData } = useContext(CompanyFormContext);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkCompany = async () => {
    setIsLoading(true);
    setError('');
    try {
      const csrfToken = getCsrfTokenFromCookies();
          const response = await axios.get(`https://devjobnavigator-api.onrender.com/api/companies/`, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });

      const filteredCompanies = response.data.filter(company =>
        company.name.toLowerCase() === formData.name.toLowerCase() &&
        company.city.toLowerCase() === formData.location.toLowerCase()
      );

      if (filteredCompanies.length > 0) {
        const selectedCompany = filteredCompanies[0];
        updateCompanyData({ id: selectedCompany.id, name: selectedCompany.name, city: selectedCompany.city });
        onCompanyExists(selectedCompany);
      } else {
        updateCompanyData({ companyExists: false, name: formData.name, location: formData.location });
        onCompanyNotFound();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'entreprise:', error);
      setError('Une erreur est survenue lors de la vérification de l\'entreprise.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TextField
        label="Nom de l'entreprise"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Lieu de l'entreprise"
        name="location"
        value={formData.location}
        onChange={handleChange}
        margin="normal"
      />
      <Button
        onClick={checkCompany}
        disabled={isLoading || !formData.name || !formData.location}
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
      >
        {isLoading ? 'Vérification...' : 'Vérifier l\'entreprise'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CompanyCheckForm;
