import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function PersonalInformation({ data, isEditing, onSave }) {
  const [information, setInformation] = useState({
    civility: '',
    first_name: '',
    last_name: '',
    age: '',
    phone_number: '',
    email: '',
    city: '',
  });

  useEffect(() => {
    const actualData = Array.isArray(data) ? data[0] : data;

    if (isEditing && actualData) {
      setInformation({
        civility: actualData.civility || '',
        first_name: actualData.user?.first_name || '',
        last_name: actualData.user?.last_name || '',
        age: actualData.age || '',
        phone_number: actualData.phone_number || '',
        email: actualData.user?.email || '',
        city: actualData.city || '',
      });
    }
  }, [isEditing, data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInformation({
      ...information,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(information);
  };

  return (
    <>
      {isEditing ? (
        <form>
          <FormControl fullWidth variant="filled" margin="normal">
            <InputLabel>Civilité</InputLabel>
            <Select name="civility" value={information.civility} onChange={handleChange}>
              <MenuItem value="M.">M.</MenuItem>
              <MenuItem value="Mme.">Mme.</MenuItem>
            </Select>
          </FormControl>
          <TextField name="first_name" label="Prénom" value={information.first_name} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="last_name" label="Nom" value={information.last_name} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="age" label="Âge" value={information.age} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="phone_number" label="Numéro de Tel" value={information.phone_number} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="email" label="Adresse Email" value={information.email} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="city" label="Ville d'habitation" value={information.city} onChange={handleChange} fullWidth margin="normal" />
          <Button onClick={handleSave} sx={{ mt: 2 }}>Enregistrer</Button>
        </form>
      ) : (
        data && data.length > 0 && (
          <>
            <p><strong>Civilité:</strong> {data[0].civility}</p>
            <p><strong>Nom:</strong> {data[0].user?.last_name}</p>
            <p><strong>Prénom:</strong> {data[0].user?.first_name}</p>
            <p><strong>Âge:</strong> {data[0].age}</p>
            <p><strong>Numéro de Tel:</strong> {data[0].phone_number}</p>
            <p><strong>Email:</strong> {data[0].user?.email}</p>
            <p><strong>Ville:</strong> {data[0].city}</p>
          </>
        )
      )}
    </>
  );
}

export default PersonalInformation;
