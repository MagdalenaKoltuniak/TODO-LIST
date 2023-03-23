const express = require('express');
const todosRouter = require('./routes/todosRoutes');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/api/todos', todosRouter);

app.listen(3000);
