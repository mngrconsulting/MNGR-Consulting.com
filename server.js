const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Подключение к MongoDB
mongoose.connect('mongodb+srv://kamiltahirov20072442:<db_password>@cluster0.1cmiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Схема сообщения
const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: String, enum: ['buyer', 'seller'] },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const { text, sender } = req.body;
    const newMessage = new Message({ text, sender });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
