import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Button, Grid, Card, IconButton, Modal, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Navbar from './Navbar';
import Menu from './Menu';
import { useDrawer } from '../DrawerContext';
import JobAdForm from './JobAdForm';
import JobAdDetail from './JobAdDetail';
import CompanyCheckForm from './CompanyCheckForm';
import CompanyFormModal from './CompanyFormModal';
import axios from 'axios';
import { CompanyFormContext } from '../contexts/CompanyFormContext';

const getCsrfTokenFromCookies = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const JobAdsPage = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const [jobAds, setJobAds] = useState([]);
  const [activeJobAd, setActiveJobAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('details');
  const [isCompanyCheckModalOpen, setIsCompanyCheckModalOpen] = useState(false);
  const [isCompanyFormModalOpen, setIsCompanyFormModalOpen] = useState(false);
  const [isJobAdModalOpen, setIsJobAdModalOpen] = useState(false);
  const { companyData, updateCompanyData } = useContext(CompanyFormContext);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const csrfToken = getCsrfTokenFromCookies();
        const response = await axios.get('https://devjobnavigator-api.onrender.com/api/jobads/', {
          headers: {
            'X-CSRFToken': csrfToken
          },
          withCredentials: true,
        });
        setJobAds(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
      }
    }
    fetchData();
  }, []);

  const handleOpenModal = (jobAd) => {
  setActiveJobAd(jobAd);
  setModalContent('details');
  setIsModalOpen(true);
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (newData, isEditing) => {
  console.log("Data to be saved:", newData);
  const csrfToken = getCsrfTokenFromCookies();
  const method = isEditing ? 'put' : 'post';
  const url = isEditing ? `https://devjobnavigator-api.onrender.com/api/jobads/${activeJobAd.id}/` : 'https://devjobnavigator-api.onrender.com/api/jobads/';

  const payload = {
    ...newData,
    company: newData.company,
  };

  try {
    const response = await axios[method](url, payload, {
      headers: { 'X-CSRFToken': csrfToken },
      withCredentials: true
    });

    if (response.status === 201 || response.status === 200) {
      console.log("handleSave called, closing modal...");
      if (isEditing) {
        setJobAds(jobAds.map(j => j.id === response.data.id ? response.data : j));
      } else {
        setJobAds([...jobAds, response.data]);
      }
      setIsJobAdModalOpen(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 6000);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};


  const handleDelete = async (jobAdId) => {
    const csrfToken = getCsrfTokenFromCookies();
    try {
      await axios.delete(`https://devjobnavigator-api.onrender.com/api/jobads/${jobAdId}/`, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true,
      });
      setJobAds(jobAds.filter(jobAd => jobAd.id !== jobAdId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const toggleFavorite = async (jobAdId) => {
    const csrfToken = getCsrfTokenFromCookies();
    try {
      const response = await axios.patch(`https://devjobnavigator-api.onrender.com/api/jobads/${jobAdId}/toggle-favorite/`, {}, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setJobAds(jobAds.map(jobAd => jobAd.id === jobAdId ? { ...jobAd, is_favorite: !jobAd.is_favorite } : jobAd));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du favori:', error);
    }
  };

  const handleOpenCompanyCheckModal = () => {
    setIsCompanyCheckModalOpen(true);
  };

  const handleCloseCompanyCheckModal = () => {
    setIsCompanyCheckModalOpen(false);
  };

  const handleOpenCompanyFormModal = () => {
    setIsCompanyFormModalOpen(true);
  };

  const handleCloseCompanyFormModal = () => {
    setIsCompanyFormModalOpen(false);
  };

  const handleCloseJobAdModal = () => {
    setIsJobAdModalOpen(false);
  };

  const handleCompanyExists = (companyId) => {
    updateCompanyData({ ...companyData, id: companyId });
    handleOpenJobAdModal();
  };

  const handleCompanyNotFound = () => {
    // Diriger vers la création d'une nouvelle entreprise
    setIsCompanyFormModalOpen(true); // Ouvrir le modal de création d'entreprise
  };

  const handleOpenJobAdModal = () => {
    setIsJobAdModalOpen(true);
    setActiveJobAd({
      company: companyData.name,
      job_location: companyData.city,
    });
    setIsJobAdModalOpen(true);
  };

  const addNewCompany = (newCompany) => {
    updateCompanyData(newCompany);
    handleCloseCompanyFormModal();
    handleOpenJobAdModal();
  };

  const modalStyle = {
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

  const renderModalContent = () => {
    switch (modalContent) {
      case 'details':
        return <JobAdDetail jobAd={activeJobAd} />;
      case 'form':
        return <JobAdForm jobAd={activeJobAd} onSave={handleSave} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
      <Menu />
      <Box component='main' sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', marginLeft: '250px' }}>
        <Container sx={{ mt: 20, mb: 4 }}>

          {showSuccessMessage && <Alert severity="success">L'annonce a été enregistrée avec succès!</Alert>}

          <Button variant='contained' color='primary' onClick={handleOpenCompanyCheckModal} sx={{ marginBottom: '20px' }}>
            Ajouter une annonce
          </Button>

          <Grid container spacing={3}>
            {jobAds.map((jobAd, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  elevation={3}
                  sx={{ padding: '10px', marginBottom: '10px', position: 'relative' }}
                  onClick={() => handleOpenModal(jobAd)}
                >
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(jobAd.id); }}
                  >
                    {jobAd.is_favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <h3>{jobAd.job_title}</h3>
                  <p>{jobAd.company ? jobAd.company_details.name : 'Entreprise non spécifiée'}</p>
                  <p>{jobAd.job_location}</p>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleOpenModal(jobAd, 'form'); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(jobAd.id); }}>
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Box sx={modalStyle}>
                {renderModalContent()}
            </Box>
          </Modal>

          <Modal open={isCompanyCheckModalOpen} onClose={handleCloseCompanyCheckModal}>
            <Box sx={modalStyle}>
              <CompanyCheckForm
                onClose={handleCloseCompanyCheckModal}
                onCompanyExists={handleCompanyExists}
                onCompanyNotFound={handleCompanyNotFound}
              />
            </Box>
          </Modal>

          <Modal open={isCompanyFormModalOpen} onClose={handleCloseCompanyFormModal}>
            <Box sx={modalStyle}>
              <CompanyFormModal
                 open={isCompanyFormModalOpen}
                 handleClose={handleCloseCompanyFormModal}
                 addNewCompany={addNewCompany}
              />
            </Box>
          </Modal>
          <Modal open={isJobAdModalOpen} onClose={handleCloseJobAdModal}>
            <Box sx={modalStyle}>
              <JobAdForm jobAdData={activeJobAd} onSave={handleSave} />
            </Box>
          </Modal>
        </Container>
      </Box>
    </Box>
  );
};

export default JobAdsPage;
