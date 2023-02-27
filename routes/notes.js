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
        if(err){
            console.info("Error reading db.json\n"+err)
            res.status(500).json("Error reading database")
        }
        else{
            const parsedData = JSON.parse(data)
            console.log(parsedData)

            parsedData.push(requestData)

            fs.writeFile('./db/db.json',JSON.stringify(parsedData,null,4), (err)=>{
                if(err){
                    console.error(err)
                    res.status(500).json("Error writing to database\n"+err)
                }else{
                    console.info("Data written to /db/db.json")
                    res.status(201).json("Successfully wrote note to database")
                } 
            })


        }
    })
})
app.delete('/notes/:id',(req,res)=>{
    //takes the id in the delete request and assigns it to a variable
    let idToDelete = req.params.id

    fs.readFile('./db/db.json',(err,data)=>{
        if(err){console.info("Error reading db.json\n"+err)}
        else{

            //parses database
            db = JSON.parse(data)
            let indexToDelete;
            //compares the id from delete request to all of the notes in the db
            for (let i =0; i < db.length; i++) {
                if(idToDelete === db[i].id){
                    indexToDelete = i;
                    break
                }
            }
            console.log(`Index to delete: ${indexToDelete}`)
            db.splice(indexToDelete,1)

            fs.writeFile('./db/db.json',JSON.stringify(db,null,4),(err)=>{
                if(err){
                    res.status(500).json("Error reading database")
                    console.log(err)
                }else{
                    res.status(201).json("Successfully deleted note from database")
                    console.info(`Removed note at index ${indexToDelete}`)
                }
            })
        }
    })
})

module.exports = app