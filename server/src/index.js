const express = require('express');
const cors = require('cors');
const path = require('path');
const { initSchema } = require('./config/database');
const { runSeed } = require('./seed/seedData');

const authRoutes = require('./routes/auth.routes');
const classRoutes = require('./routes/class.routes');
const groupRoutes = require('./routes/group.routes');
const quizRoutes = require('./routes/quiz.routes');
const contentRoutes = require('./routes/content.routes');

initSchema();
runSeed();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/content', contentRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Kodic Edu Server',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Kodic Edu Server listening on port ${PORT}`);
  });
}

module.exports = app;
