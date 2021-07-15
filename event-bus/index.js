const express=require('express');
const axios=require('axios');
//const cors=require('cors');

const app=express();

app.use(express.json());
//app.use(cors()); 

//to store all events
const events=[];

const port=4005;
app.post('/events',(req,res)=>{
    const event= req.body;

    events.push(event);


    axios.post('http://localhost:4000/events',event);
    axios.post('http://localhost:4001/events',event);
    axios.post('http://localhost:4002/events',event);
    axios.post('http://localhost:4003/events',event);
    console.log('event bus');
    res.send({status:'OK'});
})

app.get('/events',(req,res)=>{
    res.send(events);
})

app.listen(port, () => {
    console.log(`Event-Bus listening at http://localhost:${port}`)
  })
