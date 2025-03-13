const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

// Подключение к MongoDB
mongoose.connect('mongodb+srv://kamiltahirov20072442:<db_password>@cluster0.1cmiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Схемы
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['buyer', 'seller'] },
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

// Мидлварь для проверки аутентификации
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Не авторизован' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'secret');
    req.user = await User.findById(decoded.userId);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Неверный токен' });
  }
};

// Роуты аутентификации
app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY || 'secret', {
      expiresIn: '1h'
    });

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'Регистрация успешна', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY || 'secret', {
      expiresIn: '1h'
    });

    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Вход выполнен', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Выход выполнен' });
});

// Защищенные роуты
app.get('/profile', authMiddleware, (req, res) => {
  res.json(req.user);
});

// Модифицированный роут сообщений
app.get('/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'username role')
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});