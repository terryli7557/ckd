require('../config/config.js');
const express = require('express');
const bodyparser = require('body-parser');
const _ = require('lodash');
const {
  Item
} = require('../model/item');
const app = express();
app.use(bodyparser.json());

app.get('/items', async(req, res) => {
  try {
    const items = await Item.find();
    res.send(items);

  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

app.post('/items', async(req, res) => {
  try {
    const item = new Item({
      order: req.body.order,
      desc: req.body.desc,
      createdAt: Date.now()
    })
    const doc = await item.save();
    res.send(doc);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

app.put('/items/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const body = _.pick(req.body, ['order', 'desc', 'completed']);
    const doc = await Item.findByIdAndUpdate(id, {
      $set: body
    }, {
      new: true
    });
    res.send(doc);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }

});

app.listen(process.env.PORT, () => {
  console.log(`server is listening on ${process.env.PORT}`);
})
