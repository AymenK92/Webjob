import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import WorkIcon from '@mui/icons-material/Work';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Drawer from '@mui/material/Drawer';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { useDrawer } from '../DrawerContext';
import { styled } from '@mui/material/styles';
import { useAuth } from '../services/authContext';

const CustomDrawer = styled(Drawer)({
  '.MuiDrawer-paper': {
    backgroundColor: '#1976d2',
  },
});

const Menu = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // hook useAuth pour obtenir l'état d'authentification

  const handleLogout = async () => {
    await logout(); // Attendre que la déconnexion soit terminée
    navigate('/');
  };

  return (
    <CustomDrawer variant="persistent" open={isDrawerOpen}>
      <div>
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {isLoggedIn && ( // Montrez ces liens seulement si l'utilisateur est connecté
          <>
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/profile">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Mon Profil" />
            </ListItem>
            <ListItem button component={Link} to="/company">
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Annuaire" />
            </ListItem>
            <ListItem button component={Link} to="/jobads">
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Annonces" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItem>
          </>
        )}
      </List>
    </CustomDrawer>
  );
};

export default Menu;
