import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Contact.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const Contact = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  // Supprimez 'user' si vous ne l'utilisez pas
  // const [user, setUser] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/contact', { email, message });
      setResponse(response.data.message);
      // Réinitialiser le formulaire après l'envoi du message
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setResponse('Erreur lors de l\'envoi du message');
    }
  };

  return (
    <div className="form-container">
      <h1 className="h1">Contact</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Company Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="textarea">How Can We Help You?</label>
          <textarea
            name="textarea"
            id="textarea"
            rows="10"
            cols="50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button className="form-submit-btn" type="submit">Submit</button>
      </form>
      {response && <p className="response-message">{response}</p>}
    </div>
  );
};

export default Contact;
