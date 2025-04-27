// server.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User registration
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        
        res.status(201).json({ user: newUser.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user.rows[0].user_id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({ token, userId: user.rows[0].user_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user recommendations (protected route)
app.get('/api/recommendations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Get recommendations for user
        const recommendations = await pool.query(
            `SELECT m.*, r.score 
             FROM recommendations r
             JOIN movies m ON r.movie_id = m.movie_id
             WHERE r.user_id = $1
             ORDER BY r.score DESC
             LIMIT 10`,
            [userId]
        );
        
        // Get user preferences
        const preferences = await pool.query(
            'SELECT * FROM user_preferences WHERE user_id = $1',
            [userId]
        );
        
        res.json({
            recommendations: recommendations.rows,
            preferences: preferences.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add this to your server.js

// Simple recommendation algorithm
async function generateRecommendations(userId) {
    try {
        // Get user preferences
        const preferences = await pool.query(
            'SELECT * FROM user_preferences WHERE user_id = $1',
            [userId]
        );
        
        if (preferences.rows.length === 0) {
            // If no preferences, return popular movies
            return await pool.query(
                `SELECT m.*, 0.5 as score 
                 FROM movies m
                 ORDER BY m.average_rating DESC NULLS LAST
                 LIMIT 10`
            );
        }
        
        // Get movies that match preferences
        const pref = preferences.rows[0]; // Using first preference for simplicity
        
        let query = `SELECT m.*, `;
        let conditions = [];
        let params = [];
        
        // Build scoring based on preferences
        if (pref.preferred_genre) {
            query += `CASE WHEN m.genre = $1 THEN 0.4 ELSE 0 END + `;
            params.push(pref.preferred_genre);
        }
        
        if (pref.preferred_director) {
            query += `CASE WHEN m.director = $${params.length + 1} THEN 0.3 ELSE 0 END + `;
            params.push(pref.preferred_director);
        }
        
        // Add base score for rating
        query += `COALESCE(m.average_rating * 0.01, 0.1) as score `;
        query += `FROM movies m `;
        
        // Add WHERE conditions if needed
        if (params.length > 0) {
            conditions = params.map((_, i) => 
                `(m.genre = $${i + 1} OR m.director = $${i + 1})`
            );
            query += `WHERE ${conditions.join(' OR ')} `;
        }
        
        query += `ORDER BY score DESC LIMIT 10`;
        
        const recommendations = await pool.query(query, params);
        
        // Store recommendations in database
        await pool.query('DELETE FROM recommendations WHERE user_id = $1', [userId]);
        
        for (const movie of recommendations.rows) {
            await pool.query(
                'INSERT INTO recommendations (user_id, movie_id, score) VALUES ($1, $2, $3)',
                [userId, movie.movie_id, movie.score]
            );
        }
        
        return recommendations;
    } catch (err) {
        console.error(err);
        throw err;
    }
}