const express = require('express');
const fs = require('fs')
const { v4: uuid} = require("uuid")

const app = express()
app.use(express.json())

// everything past /api/
app.get('/notes',(req,res)=>{
    fs.readFile('./db/db.json',(err,data)=>{
        if(err){console.info("Error reading db.json\n"+err)}
        else{
            res.json(JSON.parse(data))
        }
    })
    
})
app.post('/notes',(req,res)=>{
    let requestData = req.body;
    requestData.id = uuid()
    fs.readFile('./db/db.json',(err,data)=>{
        if(err){console.info("Error reading db.json\n"+err)}
        else{
            const parsedData = JSON.parse(data)
            console.log(parsedData)

            parsedData.push(requestData)

            fs.writeFile('./db/db.json',JSON.stringify(parsedData,null,4), (err)=>{
                err ? console.error(err) : console.info("Data written to /db/db.json")
            })
        }
    })
})

module.exports = app