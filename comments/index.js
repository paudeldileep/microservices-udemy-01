const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  //const comments=commentsByPostId[req.params.id] ? commentsByPostId[req.params.id] : [];
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];

  comments.push({ id: commentId, content, status:'pending' });

  commentsByPostId[postId] = comments;

  //to event bus
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId,
      status:'pending'
    },
  });

  res.status(201).send(comments);
});

app.post('/events',async(req,res)=>{
  //console.log('event received',req.body);
  const {type,data}=req.body;

  //get the moderated comments from list and update its status
  if(type==="CommentModerated"){
    const{status,postId,id,content}=data;
    const comments=commentsByPostId[postId];

    const comment=comments.find(comment=>{
      return comment.id===id;
    })
    comment.status=status;

    //to event bus
  await axios.post("http://localhost:4005/events", {
    type: "CommentUpdated",
    data: {
      id: comment.id,
      content,
      postId,
      status
    },
  });
  }
  res.send({status:'OK'});
})

app.listen(port, () => {
  console.log(`Comments service listening at http://localhost:${port}`);
});
