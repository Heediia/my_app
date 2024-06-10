import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewNotes.css'; // Fichier CSS pour le style

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
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

  useEffect(() => {
    fetchNotes();
    fetchUserRole();
  }, []);

  const fetchNotes = () => {
    axios.get('/api/notes')
      .then(response => {
        setNotes(response.data.notes);
      })
      .catch(error => {
        setError('Erreur lors de la récupération des notes');
        console.error(error);
      });
  };

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/user', {
          headers: {
            Authorization: token
          }
        });
        setUserRole(response.data.user.type);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle de l\'utilisateur :', error);
    }
  };

  const handleEditClick = (note) => {
    // Logique pour gérer le clic sur le bouton Modifier
    setEditingNoteId(note.id);
    setFormData({ ...note }); // Pré-remplir le formulaire avec les données de la note
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveClick = async (noteId) => {
    try {
      await axios.put(`/api/notes/${noteId}`, formData);
      setEditingNoteId(null);
      fetchNotes(); // Re-fetch notes to update the table
    } catch (error) {
      setError('Erreur lors de la modification de la note');
      console.error(error);
    }
  };

  const handleDeleteClick = async (noteId) => {
    try {
      await axios.delete(`/api/notes/${noteId}`);
      fetchNotes(); // Re-fetch notes to update the table
    } catch (error) {
      setError('Erreur lors de la suppression de la note');
      console.error(error);
    }
  };

  return (
    <div className="view-notes-container">
      <h2>Liste des Notes</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="notes-table">
        {/* En-tête de tableau */}
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Département</th>
            <th>Classe</th>
            <th>Note</th>
            {userRole === 'admin' && (
              <>
                <th>Modifier</th>
                <th>Supprimer</th>
              </>
            )}
          </tr>
        </thead>
        {/* Corps de tableau */}
        <tbody>
          {/* Mapping des notes */}
          {notes.map(note => (
            <tr key={note.id}>
              {/* Champs de la note */}
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.first_name
                )}
              </td>
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.last_name
                )}
              </td>
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.section
                )}
              </td>
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="classe"
                    value={formData.classe}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.classe
                )}
              </td>
              <td>
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                ) : (
                  note.note
                )}
              </td>
              {/* Boutons Modifier et Supprimer (si l'utilisateur est un admin) */}
              {userRole === 'admin' && (
                <>
                  <td>
                    {editingNoteId === note.id ? (
                      <button onClick={() => handleSaveClick(note.id)}>Enregistrer</button>
                    ) : (
                      <button onClick={() => handleEditClick(note)}>Modifier</button>
                    )}
                  </td>
                  <td>
                    <button className="button-delete" onClick={() => handleDeleteClick(note.id)}>Supprimer</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewNotes;
