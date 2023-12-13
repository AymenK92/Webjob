import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Box sx={{
            height: '100vh',
            backgroundImage: 'url(homepageimage.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 2, textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)' }}>
                Centralisez et gérez
                <br />
                Votre recherche d'emploi
                <br />
                Au même endroit!
            </Typography>
            <Box>
                <Button variant="contained" color="primary" component={Link} to="/signin" sx={{ mr: 2 }}>
                    Sign In
                </Button>
                <Button variant="contained" color="secondary" component={Link} to="/signup">
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
};

export default HomePage;
