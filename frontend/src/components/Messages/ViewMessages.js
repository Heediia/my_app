import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewMessages.css';

const ViewMessages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des messages :', error);
        setError('Erreur lors de la récupération des messages');
      });
  }, []);

  return (
    <div className="view-messages-container">
      <h2>Messages envoyés</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="notes-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.email}</td>
              <td>{message.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewMessages;
