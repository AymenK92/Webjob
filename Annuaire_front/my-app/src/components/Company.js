import React, { useState, useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import { useDrawer } from '../DrawerContext';
import Navbar from './Navbar';
import CssBaseline from '@mui/material/CssBaseline';
import Menu from './Menu';
import CompanyFormModal from './CompanyFormModal';
import CompanyDetailModal from './CompanyDetailModal';
import CompanyEditModal from './CompanyEditModal'; 
import axios from 'axios';

const getCsrfTokenFromCookies = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const Company = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const csrfToken = getCsrfTokenFromCookies();
    axios.get('http://localhost:8000/api/companies/', {
      headers: {
        'X-CSRFToken': csrfToken
      },
      withCredentials: true,
    })
    .then(response => {
      setCompanies(response.data);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des entreprises:', error);
    });
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDetailOpen = (event, company) => {
    event.stopPropagation();
    setSelectedCompany(company);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };

  const handleEditOpen = (event, company) => {
    event.stopPropagation();
    setSelectedCompany(company);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const addNewCompany = (newCompany) => {
    setCompanies([...companies, newCompany]);
  };

  const updateCompany = (updatedCompany) => {
    setCompanies(companies.map(company => company.id === updatedCompany.id ? updatedCompany : company));
  };

  const deleteCompany = (id) => {
    const csrfToken = getCsrfTokenFromCookies();
    axios.delete(`http://localhost:8000/api/companies/${id}/`, {
      headers: {
        'X-CSRFToken': csrfToken
      },
      withCredentials: true,
    })
    .then(() => {
      setCompanies(companies.filter(company => company.id !== id));
    })
    .catch(error => {
      console.error('Erreur lors de la suppression de l\'entreprise:', error);
    });
  };

  const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nom de l\'entreprise', width: 200 },
  { field: 'number_of_ads', headerName: 'Nombre d\'annonces', width: 200 },

  {
    field: 'created_at',
    headerName: 'Date d\'ajout',
    width: 200,
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <div>
        <IconButton onClick={(event) => handleDetailOpen(event, params.row)} color="primary" aria-label="Lire">
          <ReadMoreIcon />
        </IconButton>
        <IconButton onClick={(event) => handleEditOpen(event, params.row)} color="default" aria-label="Modifier">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => deleteCompany(params.row.id)} color="secondary" aria-label="Supprimer">
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  }
];


  return (
    <>
      <CssBaseline />
      <Navbar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
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
          pt: 8,
          px: 2,
        }}
      >
        <Toolbar />
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleOpen}>Ajouter une entreprise</Button>
            </Box>
          </Grid>
        </Grid>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper>
                <DataGrid
                  rows={companies}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  checkboxSelection
                  pagination
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <CompanyFormModal open={open} handleClose={handleClose} addNewCompany={addNewCompany} />
        <CompanyDetailModal open={detailOpen} handleClose={handleDetailClose} company={selectedCompany} />
        <CompanyEditModal open={editOpen} handleClose={handleEditClose} company={selectedCompany} updateCompany={updateCompany} />
      </Box>
    </>
  );
};

export default Company;
