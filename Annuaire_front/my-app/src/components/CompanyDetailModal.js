import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

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

const CompanyDetailModal = ({ open, handleClose, company }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" id="modal-modal-title">Détails de l'entreprise</Typography>
        <Typography variant="body2">Nom: {company?.name}</Typography>
        <Typography variant="body2">Site web: {company?.website}</Typography>
        <Typography variant="body2">Ville: {company?.city}</Typography>
        <Typography variant="body2">Adresse e-mail: {company?.email_address}</Typography>
        <Typography variant="body2">Adresse physique: {company?.physical_address}</Typography>
        <Typography variant="body2">Nom du contact: {company?.contact_name}</Typography>
      </Box>
    </Modal>
  );
};

export default CompanyDetailModal;