// src/components/AboutMe.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate(); // Utiliser useNavigate pour gérer la redirection

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté lors du chargement de la page
    axios.get('/api/user')
      .then(response => {
        // setUser(response.data.user); // Supprimez si vous ne l'utilisez pas
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        navigate('/login'); // Remplacez '/login' par le chemin de votre page de connexion
        window.location.reload();
      });
  }, [navigate]); // Ajoutez 'navigate' comme dépendance
  return (
    <div class="card">
        <p class="heading">About Me</p>
        <p>Mahmoud Bousbih</p>
        <p>I am a second-year Computer Technology student at ISET Kebili, passionate about web and software development. As an enthusiastic student developer, I have honed strong skills in creating dynamic and efficient solutions.</p>

    </div>
  );
};

export default About;
