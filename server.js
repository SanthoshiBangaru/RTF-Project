const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/movieRecommender', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log('Connection error:', err.message));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: { type: Array, default: [] },
    recommendations: { type: Array, default: [] }
});

const User = mongoose.model('User', UserSchema);

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key';

// Register User
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected routes middleware
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Get user watchlist
app.get('/api/watchlist', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to watchlist
app.post('/api/watchlist', authenticateToken, async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user.watchlist.includes(movieId)) {
            user.watchlist.push(movieId);
            await user.save();
        }

        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recommendations
app.get('/api/recommendations', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add recommendation
app.post('/api/recommendations', authenticateToken, async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user.recommendations.includes(movieId)) {
            user.recommendations.push(movieId);
            await user.save();
        }

        res.json(user.recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));