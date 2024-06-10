import React from 'react';
import './Header.css';
import logo from '../iset.png';
import { Link } from 'react-router-dom';

function Header() {
  const userType = localStorage.getItem('userType'); // Récupérer le rôle de l'utilisateur depuis le stockage local

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token JWT lors de la déconnexion
    localStorage.removeItem('userType'); // Supprimer le type d'utilisateur lors de la déconnexion
    window.location.href = '/login'; // Rediriger vers la page de connexion
  };

  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
      <nav>
        <ul>
          {/* <li><Link to="/">Home</Link></li> */}
          {userType === 'admin' && ( // Afficher le lien "View Notes" uniquement si le type d'utilisateur est "admin"
            <li><Link to="/add-note">Ajouter un moyen </Link></li>
          )}
          <li><Link to="/view-notes">Liste de moyens </Link></li>
          {userType === 'admin' && ( // Afficher le lien "View Notes" uniquement si le type d'utilisateur est "admin"
            <li><Link to="/manage-users">Gestion du etudiants </Link></li>
          )}
          {userType === 'student' && ( // Afficher le lien "View Notes" uniquement si le type d'utilisateur est "admin"
            <li><Link to="/contact">Contact</Link></li>
          )}
          {userType === 'admin' && ( // Afficher le lien "View Notes" uniquement si le type d'utilisateur est "admin"
            <li><Link to="/message">Message</Link></li>
          )}
          {/* <li><Link to="/about">About</Link></li> */}
          <button class="Btn" onClick={handleLogout}>
            <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
            <div class="text">Logout</div>
          </button>



        </ul>
      </nav>
    </header>
  );
}

export default Header;
