import { useAuth } from '../services/authContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const { isLoggedIn } = useAuth(); //  hook useAuth pour obtenir l'état d'authentification

    if (!isLoggedIn) {
        // si l'utilisateur n'est pas connecté, le redirige vers la page de connexion
        return <Navigate to="/signin" />;
    }

    // si l'utilisateur est connecté, affiche composant enfant (le composant protégé)
    return children;
}

export default PrivateRoute;
