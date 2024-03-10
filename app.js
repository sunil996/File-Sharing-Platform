const express = require("express");
const app = express();  
const errorHandler=require("./middlewares/errorHandler.middleware.js")
const cleanupOldFiles=require("./utils/cleanup.js")
const cron = require('node-cron');

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"})) 
 
//import routes
const fileRouter=require("./routes/file.routes.js")

app.use("/api/v1/files", fileRouter) 

cron.schedule('0 0 * * 1-5', async () => {
    
    try {  
      await cleanupOldFiles();
    } catch (error) {
        console.error('Error in cleanup job:', error.message);
    }
  });
app.use(errorHandler);
 
module.exports=app;
