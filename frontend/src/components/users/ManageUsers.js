import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageUsers.css'

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
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
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        setError('Erreur lors de la récupération des utilisateurs');
        console.error(error);
      });
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setFormData({ ...user });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveClick = async (userId) => {
    try {
      await axios.put(`/api/users/${userId}`, formData);
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      setError('Erreur lors de la modification de l\'utilisateur');
      console.error(error);
    }
  };

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error(error);
    }
  };

  return (
    <div className="manage-users-container">
      <h2>Liste des Utilisateurs</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="notes-table">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Type</th>
            <th>Modifier</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{editingUserId === user.id ? <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} /> : user.first_name}</td>
              <td>{editingUserId === user.id ? <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} /> : user.last_name}</td>
              <td>{editingUserId === user.id ? <input type="text" name="email" value={formData.email} onChange={handleInputChange} /> : user.email}</td>
              <td>{editingUserId === user.id ? <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} /> : user.phone_number}</td>
              <td>{editingUserId === user.id ? <input type="text" name="type" value={formData.type} onChange={handleInputChange} /> : user.type}</td>
              <td>
                {editingUserId === user.id ? (
                  <button onClick={() => handleSaveClick(user.id)}>Enregistrer</button>
                ) : (
                  <button onClick={() => handleEditClick(user)}>Modifier</button>
                )}
              </td>
              <td>
              <button className="button-delete" onClick={() => handleDeleteClick(user.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
