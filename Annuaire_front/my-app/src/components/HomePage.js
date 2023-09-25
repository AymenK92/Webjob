import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Mon site d'offres d'emploi
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Box my={2}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Bienvenue sur notre site d'offres d'emploi !
                    </Typography>
                    <Typography variant="body1">
                        Vous pouvez rechercher des offres d'emploi, vous connecter, vous inscrire et gérer votre profil à partir des liens dans la barre de navigation.
                    </Typography>
                    <Box mt={2}>
                        <Button variant="contained" color="primary" component={Link} to="/signin">
                            Se connecter
                        </Button>
                        <Button variant="contained" color="secondary" component={Link} to="/signup" style={{marginLeft: '10px'}}>
                            S'inscrire
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;
