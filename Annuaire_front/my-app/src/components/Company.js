import React, { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { useDrawer } from '../DrawerContext';
import Navbar from './Navbar';
import CssBaseline from '@mui/material/CssBaseline';
import Menu from './Menu';
import CompanyFormModal from './CompanyFormModal';

const Company = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const rows = [
    { id: 1, name: 'Company 1', createdAt: new Date() },
    { id: 2, name: 'Company 2', createdAt: new Date() },
    // autres entreprises...
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nom de l\'entreprise', width: 200 },
    { field: 'createdAt', headerName: 'Date d\'ajout', width: 200, type: 'dateTime' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleOpen(params.row)}>Read</Button>
          <Button>Delete</Button>
        </>
      ),
    },
  ];

  const handleOpen = (company) => {
    setSelectedCompany(company);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            <Box sx={{ display: 'flex', justifyContent: 'center' }}> {/* Center the content */}
              <Button variant="contained" color="primary" onClick={handleOpen}>Ajouter une entreprise</Button>
            </Box>
          </Grid>
        </Grid>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper>
                <DataGrid
                  rows={rows}
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
        <CompanyFormModal open={open} handleClose={handleClose} />
      </Box>
    </>
  );
};

export default Company;
