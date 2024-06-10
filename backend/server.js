const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'baha_hedia',
});

// Connexion à la base de données MySQL
connection.connect((err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

// Utiliser express-session pour gérer les sessions
// Génération de la clé secrète aléatoire
const secretKey = crypto.randomBytes(32).toString('hex');
// Configuration du middleware express-session
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000, // Durée de vie du cookie de session en millisecondes (1 heure dans cet exemple)
    secure: false, // Définissez sur true si votre application utilise HTTPS
    httpOnly: true
  }
}));

// Route POST pour gérer l'inscription d'un utilisateur
app.post('/api/signup', (req, res) => {
    const { firstName, lastName, email, phoneNumber, type, cin, password } = req.body;

    const sql = 'INSERT INTO users (first_name, last_name, email, phone_number, type, cin, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [firstName, lastName, email, phoneNumber, type, cin, password], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données utilisateur :', err);
            res.status(500).json({ message: 'Erreur lors de l\'inscription de l\'utilisateur' });
            return;
        }
        console.log('Utilisateur inscrit avec succès');
        res.status(200).json({ message: 'Utilisateur inscrit avec succès' });
    });
});

// Route POST pour gérer la connexion d'un utilisateur et générer un token JWT
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT id, email,type FROM users WHERE email = ? AND password = ?'; // Sélectionnez également le champ "type"
    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification des informations d\'identification de l\'utilisateur :', err);
            res.status(500).json({ message: 'Erreur lors de la connexion de l\'utilisateur' });
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({ userId: user.id, role: user.type }, secretKey, { expiresIn: '1h' }); // Inclure le rôle dans le token JWT
            req.session.user = user;
            res.status(200).json({ message: 'Utilisateur connecté avec succès', token, role: user.type }); // Envoyer le rôle dans la réponse JSON
        } else {
            console.log('Email ou mot de passe incorrect');
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    });
});

// Middleware pour vérifier le token JWT sur les routes protégées
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }

    jwt.verify(token, 'secretKey', (err, decodedToken) => {
        if (err) {
            console.error('Erreur de vérification du token JWT :', err);
            return res.status(403).json({ message: 'Token invalide' });
        }
        req.userId = decodedToken.userId;
        next();
    });
};

// Exemple de route protégée
app.get('/api/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Route protégée accessible' });
});

// Route pour obtenir les informations de l'utilisateur connecté
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'Utilisateur non connecté' });
    }
});

// Route POST pour ajouter une note
app.post('/api/add-note', (req, res) => {
    const { firstName, lastName, section, classe, note } = req.body;

    const findUserSql = 'SELECT id FROM users WHERE first_name = ? AND last_name = ?';
    const insertNoteSql = 'INSERT INTO notes (user_id, section, classe, note) VALUES (?, ?, ?, ?)';

    // Vérifier si l'utilisateur existe déjà
    connection.query(findUserSql, [firstName, lastName], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'utilisateur :', err);
            res.status(500).json({ message: 'Erreur lors de la vérification de l\'utilisateur' });
            return;
        }

        if (results.length > 0) {
            // L'utilisateur existe, récupérer l'ID de l'utilisateur
            const userId = results[0].id;

            // Insérer la note dans la table notes
            connection.query(insertNoteSql, [userId, section, classe, note], (err, result) => {
                if (err) {
                    console.error('Erreur lors de l\'ajout de la note :', err);
                    res.status(500).json({ message: 'Erreur lors de l\'ajout de la note' });
                    return;
                }
                console.log('Note ajoutée avec succès');
                res.status(200).json({ message: 'Note ajoutée avec succès' });
            });
        } else {
            // L'utilisateur n'existe pas, retourner une erreur
            res.status(400).json({ message: 'Utilisateur non trouvé' });
        }
    });
});


  
// Route pour obtenir tous les utilisateurs
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            return res.status(500).send('Erreur lors de la récupération des utilisateurs');
        }
        res.json({ users: results });
    });
});

// Route GET pour récupérer les notes
app.get('/api/notes', (req, res) => {
    const sql = `
      SELECT notes.id, users.first_name, users.last_name, notes.section, notes.classe, notes.note
      FROM notes
      JOIN users ON notes.user_id = users.id
    `;
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des notes :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des notes' });
        return;
      }
      res.status(200).json({ notes: results });
    });
  });

// Route pour mettre à jour un utilisateur
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, phone_number, type } = req.body;

    const sql = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, type = ? WHERE id = ?';
    connection.query(sql, [first_name, last_name, email, phone_number, type, userId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
            return res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur');
        }
        console.log(`Utilisateur avec l'ID ${userId} mis à jour avec succès`);
        res.sendStatus(200);
    });
});

// Route PUT pour modifier une note
app.put('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const { section, classe, note } = req.body;
  
    const sql = 'UPDATE notes SET section = ?, classe = ?, note = ? WHERE id = ?';
    connection.query(sql, [section, classe, note, noteId], (err, result) => {
      if (err) {
        console.error('Erreur lors de la modification de la note :', err);
        res.status(500).json({ message: 'Erreur lors de la modification de la note' });
        return;
      }
      console.log('Note modifiée avec succès');
      res.status(200).json({ message: 'Note modifiée avec succès' });
    });
  });

// Route DELETE pour supprimer une note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    const sql = 'DELETE FROM notes WHERE id = ?';
    connection.query(sql, [noteId], (err, result) => {
      if (err) {
        console.error('Erreur lors de la suppression de la note :', err);
        res.status(500).json({ message: 'Erreur lors de la suppression de la note' });
        return;
      }
      console.log('Note supprimée avec succès');
      res.status(200).json({ message: 'Note supprimée avec succès' });
    });
  });
  
// Route pour supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM users WHERE id = ?';
    connection.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        res.status(200).send({ message: 'Utilisateur supprimé avec succès' });
    });
});

// Endpoint pour gérer les requêtes POST depuis la page de contact
app.post('/api/contact', (req, res) => {
    const { email, message } = req.body;
  
    // Insérer les données du formulaire dans la base de données
    const query = 'INSERT INTO messages (email, message) VALUES (?, ?)';
    connection.query(query, [email, message], (error, results) => {
      if (error) {
        console.error('Erreur lors de l\'insertion des données:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement du message' });
      } else {
        console.log('Message enregistré avec succès !');
        res.status(200).json({ message: 'Message envoyé avec succès' });
      }
    });
  });

// Endpoint pour ajouter un nouveau message
app.post('/api/messages', (req, res) => {
  const { email, message } = req.body;
  const sql = 'INSERT INTO messages (email, message) VALUES (?, ?)';
  const values = [email, message];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du message dans la base de données :', err);
      res.status(500).json({ error: 'Erreur lors de l\'ajout du message dans la base de données' });
    } else {
      console.log('Message ajouté avec succès');
      res.json({ message: 'Message ajouté avec succès' });
    }
  });
});

app.get('/api/messages', (req, res) => {
  const sql = 'SELECT * FROM messages';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des messages :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    } else {
      res.json(results);
    }
  });
});



// Route pour terminer la session de l'utilisateur
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erreur lors de la déconnexion de l\'utilisateur :', err);
            res.status(500).json({ message: 'Erreur lors de la déconnexion de l\'utilisateur' });
            return;
        }
        console.log('Utilisateur déconnecté avec succès');
        res.status(200).json({ message: 'Utilisateur déconnecté avec succès' });
    });
});

// Servir les fichiers statiques de l'application React
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Gérer les autres requêtes en renvoyant l'application React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
