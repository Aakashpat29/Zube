// require('dotenv').config({path : './.env'});
import 'dotenv/config';
import connectDB from './db/index.js';

connectDB();


/*
import mongoose, { connect } from 'mongoose';
import {DB_NAME} from "./constants";
import express from 'express';
const app = express();

( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("Error in connecting to the database");
            throw error;
        })
        //this app.on() is used if there is any error in connecting to the database 
        //i mean when app is not connected to database then it will throw an error and print the message "Error in connecting to the database"
        
        app.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })

    }
    catch(error){
        console.error("Error : ", error);
        throw error;
    }
})()

//the above one is our first approach to connect to the database and start the server but it is not a good approach 
//because it is not handling the errors properly and it is not using the best practices for connecting to the database and starting the server.
*/
