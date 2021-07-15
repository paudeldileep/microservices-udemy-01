const express=require('express');
const cors=require('cors');
const axios=require('axios');

const app=express();

app.use(express.json());
app.use(cors()); 

const port=4002;

const posts={};  // {id:{id:,title,comments:[{id:,content},{id,content}]},id:{}}

const handleEvent=(type,data)=>{
    if(type==='PostCreated'){
        const{id,title}=data;
        posts[id]={id,title,comments:[]};
    }
    if(type==="CommentCreated"){

        const{id,content,postId,status}=data;
        const post=posts[postId];
        post.comments.push({id,content,status});
    }
    if(type==="CommentUpdated"){

        const{id,content,postId,status}=data;
        const post=posts[postId];
        const comment=post.comments.find(comment=>{
            return comment.id===id;
          })
          comment.status=status;
          //just in case if the content was also changed by  moderation
          comment.content=content;
    }
}

app.get('/posts',(req,res)=>{

    res.send(posts);
})


app.post('/events',(req,res)=>{
    const {type,data}=req.body;
    
    handleEvent(type,data);

    res.send({message:'Processed!'});
})

//when this starts working fetch all events from event-bus and process them(especially for missing events then this service was down)
app.listen(port,async () => {
    console.log(`Query Service listening at http://localhost:${port}`);

    const res=await axios.get('http://localhost:4005/events');

    for(let event of res.data){
        console.log('processing event:',event.type);
        handleEvent(event.type,event.data);
    }
  })
