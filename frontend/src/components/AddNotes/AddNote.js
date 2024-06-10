import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddNote.css'; // Importer le fichier CSS pour le style de AddNote

const AddNote = () => {
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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    section: '',
    classe: '',
    matiere: '',
    note: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/add-note', formData);
      console.log('Note ajoutée avec succès:', response.data);
      setMessage(response.data.message);
      setError('');
      // Réinitialiser le formulaire après l'ajout de la note
      setFormData({
        firstName: '',
        lastName: '',
        section: '',
        classe: '',
        matiere: '',
        note: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note :', error);
      setMessage('');
      setError(error.response ? error.response.data.message : 'Erreur lors de l\'ajout de la note');
    }
  };

  return (
    <div className="form-containerr">
      <h2 className="h1">Ajouter une Note</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom:</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Prénom:</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Département :</label>
          <select
            name="section"
            className="form-controll"
            value={formData.section}
            onChange={handleInputChange}
            required
          >
            <option value="">Sélectionnez un département</option>
            <option value="Administration" className="custom-option">Administration des Affaires</option>
            <option value="Mécanique" className="custom-option">Génie Mécanique</option>
            <option value="électrique" className="custom-option">Génie électrique</option>
            <option value="Informatique" className="custom-option">Technologie de l'informatique</option>
          </select>
        </div>
        <div className="form-group">
          <label>Classe:</label>
          <input
            type="text"
            name="classe"
            className="form-control"
            value={formData.classe}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Note:</label>
          <input
            type="text"
            name="note"
            className="form-control"
            value={formData.note}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn">Ajouter</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddNote;
