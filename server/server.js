require('./config.js');
const express = require('express');
const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json());

app.get('/items', (req, res) => {
  res.send();
});

app.post('/items', (req, res) => {
  res.send();
});

app.delete('/items/:id', (req, res) => {
  const id = req.params.id;

  res.send({
    id
  });
});

app.put('/items/:id', (req, res) => {
  const id = req.params.id;
  res.send({
    id
  });
});

app.listen(process.env.PORT, () => {
      console.log(`server is listening on ${process.env.PORT});
})
