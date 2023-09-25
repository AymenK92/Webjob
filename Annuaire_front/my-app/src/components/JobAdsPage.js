import React, { useState } from 'react';
import Navbar from './Navbar';
import Menu from './Menu';
import { Toolbar, Grid, Card, CardHeader, CardContent, Button, Modal, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { styled } from '@mui/system';

// Données factices pour l'exemple
const jobAds = [
  { id: 1, job_title: 'Développeur Front-End', company: { name: 'Entreprise 1' }, job_location: 'Paris', job_description: 'Description du poste...', job_type: 'CDI', job_site: 'Site du poste', job_link: 'Lien vers l\'annonce', date_added: new Date(), is_favorite: false },
  { id: 2, job_title: 'Développeur Back-End', company: { name: 'Entreprise 2' }, job_location: 'Lyon', job_description: 'Description du poste...', job_type: 'CDD', job_site: 'Site du poste', job_link: 'Lien vers l\'annonce', date_added: new Date(), is_favorite: false },
  // autres annonces...
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const JobAdModal = ({ open, ad, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="job-ad-modal-title"
      aria-describedby="job-ad-modal-description"
    >
      <Box sx={style}>
        <h2 id="job-ad-modal-title">{ad?.job_title}</h2>
        <p id="job-ad-modal-description">{ad?.job_description}</p>
        <p>Lieu : {ad?.job_location}</p>
        <p>Type de poste : {ad?.job_type}</p>
        <p>Site du poste : {ad?.job_site}</p>
        <a href={ad?.job_link}>Lien vers l'annonce</a>
      </Box>
    </Modal>
  );
};

const JobAdsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const handleOpen = (ad) => {
    setSelectedAd(ad);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFavoriteToggle = (ad) => {
    ad.is_favorite = !ad.is_favorite;
  };

  return (
    <>
      <Navbar />
      <Menu />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: 10,
          px: 2,
        }}
      >
        <Toolbar />
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}> {/* Center the content */}
              <Button variant="contained" color="primary" onClick={handleOpen}>Ajouter une annonce</Button>
            </Box>
          </Grid>
          {jobAds.map((ad) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={ad.id}>
              <Card onClick={() => handleOpen(ad)} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  action={
                    <IconButton onClick={() => handleFavoriteToggle(ad)}>
                      <FavoriteIcon color={ad.is_favorite ? 'primary' : 'disabled'} />
                    </IconButton>
                  }
                  title={ad.job_title}
                  subheader={`Entreprise : ${ad.company.name}`}
                />
                <CardContent>{ad.job_location}</CardContent>
                <CardContent>Date d'ajout : {ad.date_added.toLocaleDateString()}</CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <JobAdModal open={open} ad={selectedAd} handleClose={handleClose} />
      </Box>
    </>
  );
};

export default JobAdsPage;
