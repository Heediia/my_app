import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './Home.css'; // Importation du fichier CSS
import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  console.log(token)

  return (
  <div>
    <img src="https://isetke.rnu.tn/useruploads/banners/01385634647_11_30_47.jpg" alt="A beautiful scenery"></img>
    <div className="form-container">
      <h1>ISET Kebili</h1>
      <p>Notre plateforme vous permet de consulter tous les moyens à l'ISET Kebili pour tous les étudiants dans toutes les branches. </p>
      {!token ? (
  <>
    <p>Cliquez sur 'Se connecter' pour accéder à votre compte.</p>
    <div>
      <Link to='/login'>
        <button className="Btn">
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9v-62.1H128c-17.7 0-32-14.3-32-32v-64c0-17.7 14.3-32 32-32h128v-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96H96c-17.7 0-32 14.3-32 32v256c0 17.7 14.3 32 32 32h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-53 0-96-43-96-96V128c0-53 43-96 96-96h64c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>
          <div className="text">Se connecter</div>
        </button>
      </Link>
    </div>
    <p>Si vous n'avez pas de compte, cliquez sur 'Créer un compte' pour en créer un.</p>
    <div>
      <Link to='/signup'>
        <button className="Btn">
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9v-62.1H128c-17.7 0-32-14.3-32-32v-64c0-17.7 14.3-32 32-32h128v-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96H96c-17.7 0-32 14.3-32 32v256c0 17.7 14.3 32 32 32h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-53 0-96-43-96-96V128c0-53 43-96 96-96h64c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>
          <div className="text">Créer un compte</div>
        </button>
      </Link>
    </div>
  </>
) : ""}

    </div>
    </div>

  );
};

export default Home;