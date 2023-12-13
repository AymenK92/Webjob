import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button } from '@mui/material';
import { CompanyFormContext } from '../contexts/CompanyFormContext';


const JobAdForm = ({ data, isEditing, onSave }) => {
  const { companyData } = useContext(CompanyFormContext);
  const initialState = {
    company: '',
    job_title: '',
    job_description: '',
    job_location: '',
    job_type: '',
    job_site: '',
    job_link: '',
    contact_date: null,
    is_favorite: false,
  };

  const [jobAd, setJobAd] = useState(initialState);

 useEffect(() => {
  if (isEditing && data) {
    setJobAd({
      company: data.company || '',
      job_title: data.job_title || '',
      job_description: data.job_description || '',
      job_location: data.job_location || '',
      job_type: data.job_type || '',
      job_site: data.job_site || '',
      job_link: data.job_link || '',
      contact_date: data.contact_date || null,
      is_favorite: data.is_favorite || false,
    });
  } else {
    if (companyData && companyData.name) {
      setJobAd({ ...initialState, company: companyData.name, job_location: companyData.city });
    } else {
      setJobAd(initialState);
    }
    }
  }, [isEditing, data, companyData]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setJobAd({
      ...jobAd,
      [name]: value,
    });
  };

  const handleSave = () => {
  const saveData = {
    ...jobAd,
    company: companyData.id
  };
  onSave(saveData);
};

  return (
    <form>
      <TextField name="company" label="Entreprise" value={jobAd.company} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="job_title" label="Titre du poste" value={jobAd.job_title} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="job_description" label="Description du poste" value={jobAd.job_description} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="job_location" label="Lieu du poste" value={jobAd.job_location} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="job_type" label="Type de poste" value={jobAd.job_type} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="job_site" label="Site du poste" value={jobAd.job_site} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="job_link" label="Lien vers l'annonce" value={jobAd.job_link} onChange={handleChange} fullWidth margin="normal" />
      <TextField
        name="contact_date"
        label="Date de contact"
        type="date"
        value={jobAd.contact_date || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button onClick={handleSave} sx={{ mt: 2 }}>Enregistrer</Button>
    </form>
  );
};

export default JobAdForm;
