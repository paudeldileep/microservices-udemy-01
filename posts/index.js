const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  //to event bus
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: { id, title }
  });

  res.status(201).send(posts[id]);
});

app.post('/events',(req,res)=>{
  console.log('event received',req.body);

  res.send({status:'OK'});
})

app.listen(port, () => {
  console.log('updated version');
  console.log(`Posts service listening at http://localhost:${port}`);
});
