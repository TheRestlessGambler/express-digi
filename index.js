import express from 'express'
import 'dotenv/config'
import logger from './logger.js';
import morgan from 'morgan';

const morganFormat = ':method :url :status :response-time ms';
const app = express()
const port = process.env.PORT||3000

app.use(morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
  
        };
        logger.info(JSON.stringify(logObject));
      }
    }
  }));
app.use(express.json())

let teaData = []
let nextId = 1

//add a new item
app.post('/teas', (req,res) =>{
    logger.warn("a post req has been made")
    const {name,price}= req.body
    const newTea = {id:nextId++, name, price}
    teaData.push(newTea)
    res.status(201).send(newTea)
})
//get all tea
app.get('/teas',(req,res)=>{
    res.status(200).send(teaData)
})
//get tea sorted by id
app.get('/teas/:id',(req,res)=>{
    const tea = teaData.find(t =>t.id === parseInt(req.params.id))
    if(!tea){
        return res.status(404).send('Not found')    
    }
    res.status(200).send(tea)
})

//update tea
app.put('/teas/:id', (req,res)=>{
    const teaId = req.params.id
    const tea = teaData.find(t => t.id === parseInt(teaId))
    if(!tea){
        return res.status(404).send('Not found')    
    }
    const {name,price} = req.body
    tea.name = name
    tea.price = price
    res.status(200).send(tea)

})

//delete tea

app.delete('/teas/:id',(req,res)=>{
    const index = teaData.findIndex(t => t.id === parseInt(req.params.id))

    if(index === -1){
        return res.status(404).send('Not found')
    }
    teaData.splice(index,1)
    res.status(204).send('item deleted')
})

app.listen(port, () =>{
    console.log(`server is running at port:${port}`)
})

