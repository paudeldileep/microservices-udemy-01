const express = require("express");
const axios = require("axios");
//const cors=require('cors');

const app = express();

app.use(express.json());
//app.use(cors());

const port = 4003;
//checking whether the comment content haas word 'freedom'
app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type == "CommentCreated") {
    const status = data.content.includes("freedom") ? "rejected" : "approved";
    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      }
    });
  }
  res.send({});
});

app.listen(port, () => {
  console.log(`Comment-Moderation listening at http://localhost:${port}`);
});
