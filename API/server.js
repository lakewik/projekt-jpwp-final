const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();

const port = 3000;


app.use(
    session({
      secret: 'test', 
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, 
        maxAge: 3600000,
      },
    })
  );

  mongoose.connect('mongodb://127.0.0.1:27017/taskmanager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });



  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });
  
  const User = mongoose.model('User', userSchema);


  const taskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
  const Task = mongoose.model('Task', taskSchema);


  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  app.use(express.json());



app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to register user' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }

        const token = jwt.sign({ userId: user._id }, 'test');
        req.session.token = token;

        res.status(200).json({ message: 'Authentication successful', token: token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Authentication failed' });
    }
});


app.post('/tasks', async (req, res) => {
    const { description, userId } = req.body;
  
    try {
      const task = new Task({ description, userId });
      var taskadded = await task.save();
      res.status(201).json({ message: 'Task created successfully', description:  description, userId:userId, _id: taskadded._id });
    } catch (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ message: 'Failed to create task' });
    }
  });


  app.get('/tasks/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const tasks = await Task.find({ userId });
      res.status(200).json(tasks);
    } catch (err) {
      console.error('Error retrieving tasks:', err);
      res.status(500).json({ message: 'Failed to retrieve tasks' });
    }
  });
  

  app.get('/task/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    
    try {
      const task = await Task.findById(taskId);
      res.status(200).json(task);
    } catch (err) {
      console.error('Error retrieving tasks:', err);
      res.status(500).json({ message: 'Failed to retrieve tasks' });
    }
    });

    
app.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { description } = req.body;
  
    try {
  
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
     
      task.description = description;
      const updatedTask = await task.save();
  
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  