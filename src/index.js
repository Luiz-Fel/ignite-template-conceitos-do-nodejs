const express = require('express');
const cors = require('cors');

 const { v4: uuidv4, v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  if (users.find(user => user.username === username)) {
    return next();
  } else {
    return response.status(404).json({error : 'Mensagem do erro'})
  }
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;
  const user = {
    id: v4(),
    name,
    username,
    todos: [],
  }
  const userAlreadyExists = users.find(user => user.username === username);
  if (userAlreadyExists !== undefined) {
    return  response.status(400).json({error : 'Mensagem do erro'});
  }
  users.push(user);

  return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if (user) {

    return response.status(200).json(user.todos)
  } else {
    return response.status(404).json({error: "user not found"})
  }
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { username } = request.headers;
  const todo = { 
    id: v4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }
  const user = users.find(user => user.username === username);
  user.todos.push(todo);

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);
  if (todo != undefined) {
    const updatedTodo = {
      ...todo, 
      title,
      deadline: new Date(deadline),
    }

    user.todos[user.todos.indexOf(todo)] = updatedTodo;

    return response.status(200).json(updatedTodo);
  } else {
    return response.status(404).json({ error: "todo not found"});
  }

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);
  const updatedTodo = {...todo, done: true};
  if (todo !== undefined) {
    user.todos.map(todo => todo.id === id ? updatedTodo : todo);
    return response.status(200).json(updatedTodo);
  } else {
    return response.status(404).json({ error: "todo not found"});
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);
  if (todo !== undefined) {
    user.todos = user.todos.filter(todo => todo.id !== id);

    return response.status(204).send();
  } else {
    return response.status(404).json({ error: 'Not found' });
  }
});

module.exports = app;