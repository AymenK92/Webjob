import React, { useState, useEffect } from 'react';
import { Box, Card, Container, Grid, IconButton, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from './Navbar';
import Menu from './Menu';
import { useDrawer } from '../DrawerContext';
import PersonalInformation from './PersonalInformation';
import { CurrentPosition } from './CurrentPosition';
import { Education } from './Education';
import { Languages } from './Languages';
import { Interests } from './Interests';
import axios from 'axios';

const getCsrfTokenFromCookies = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default function Profile() {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const [sections, setSections] = useState([]);

  const [activeSection, setActiveSection] = useState(null);
  const [editingData, setEditingData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const csrfToken = getCsrfTokenFromCookies();
        const response = await axios.get("http://localhost:8000/api/profiles/", {
          headers: {
            'X-CSRFToken': csrfToken
          },
          withCredentials: true,
        });
        const dataFromApi = response.data;
        setSections([
          { title: 'Informations Personnelles', component: PersonalInformation, data: dataFromApi },
          { title: 'Poste Actuel', component: CurrentPosition, data: dataFromApi },
          { title: 'Éducation', component: Education, data: dataFromApi },
          { title: 'Langues', component: Languages, data: dataFromApi },
          { title: 'Centres d\'Intérêt', component: Interests, data: dataFromApi },
        ]);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    }
    fetchData();
  }, []);

  const handleOpenModal = (index, data) => {
    setEditingData(data);
    setActiveSection(index);
  };

  const handleCloseModal = () => {
    setActiveSection(null);
  };

  const handleSave = async (index, newData) => {
    try {
      const csrfToken = getCsrfTokenFromCookies();
      const profileId = Array.isArray(editingData) ? editingData[0].id : editingData.id;

      const formattedData = {
        user: {
          first_name: newData.first_name || "",
          last_name: newData.last_name || "",
          email: newData.email || "",
        },
        civility: newData.civility || "",
        age: newData.age || "",
        phone_number: newData.phone_number || "",
        city: newData.city || ""
      };

      const response = await axios.patch(`http://localhost:8000/api/profiles/${profileId}/`, formattedData, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        // Nouvelle requête GET pour obtenir les données les plus récentes
        const updatedResponse = await axios.get("http://localhost:8000/api/profiles/", {
          headers: {
            'X-CSRFToken': csrfToken
          },
          withCredentials: true,
        });

        const updatedDataFromApi = updatedResponse.data;
        setSections([
          { title: 'Informations Personnelles', component: PersonalInformation, data: updatedDataFromApi },
          { title: 'Poste Actuel', component: CurrentPosition, data: updatedDataFromApi },
          { title: 'Éducation', component: Education, data: updatedDataFromApi },
          { title: 'Langues', component: Languages, data: updatedDataFromApi },
          { title: 'Centres d\'Intérêt', component: Interests, data: updatedDataFromApi },
        ]);

        setActiveSection(null);
      } else {
        console.error('Erreur lors de la sauvegarde des données:', response);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
      <Menu />
      <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
        <Container sx={{ mt: 20, mb: 4 }}>
          <Grid container spacing={3}>
            {sections.map((section, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card elevation={3} sx={{ padding: '10px', marginBottom: '10px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'primary.main', color: 'white' }}>
                    <h3>{section.title}</h3>
                    <IconButton onClick={() => handleOpenModal(index, section.data)} sx={{ color: 'white' }}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <section.component
                    data={activeSection === index ? editingData : section.data}
                    isEditing={activeSection === index}
                  />
                  <Modal open={activeSection === index} onClose={handleCloseModal}>
                    <Box sx={{ bgcolor: 'white', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <section.component
                        data={editingData}
                        isEditing={true}
                        onClose={handleCloseModal}
                        onSave={(newData) => handleSave(index, newData)}
                      />
                    </Box>
                  </Modal>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
