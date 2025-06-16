const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todo_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = await Task.create({ content: req.body.content });
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  const { content } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { content },
    { new: true }
  );
  res.json(updatedTask);
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
