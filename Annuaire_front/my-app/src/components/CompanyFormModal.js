import React from 'react';
import { Button, TextField, Modal, Box } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CompanyFormModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h2 id="modal-modal-title">Ajouter une entreprise</h2>
        <TextField margin="normal" fullWidth id="name" label="Nom de l'entreprise" variant="outlined" />
        <TextField margin="normal" fullWidth id="website" label="Site web de l'entreprise" variant="outlined" />
        <TextField margin="normal" fullWidth id="city" label="Ville de l'entreprise" variant="outlined" />
        <TextField margin="normal" fullWidth id="email_address" label="Adresse e-mail de l'entreprise" variant="outlined" />
        <TextField margin="normal" fullWidth id="physical_address" label="Adresse physique de l'entreprise" variant="outlined" />
        <TextField margin="normal" fullWidth id="contact_name" label="Nom de la personne à contacter" variant="outlined" />
        <Button variant="contained" color="primary" fullWidth onClick={handleClose}>Enregistrer</Button>
      </Box>
    </Modal>
  );
};

export default CompanyFormModal;
