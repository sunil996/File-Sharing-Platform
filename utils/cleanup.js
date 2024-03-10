const cron = require('node-cron');
const File=require("../models/file.model.js")
const fs=require("fs")
 
async function cleanupOldFiles() {

  try {

    let page = 1;
    let pageSize = 5;  
 
    while (true) {

      const files = await File.find()
        .sort({ createdAt: 1 }) // Sorting by createdAt in ascending order
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select("path createdAt")
       
      if (files.length === 0) {
        break;  
      }

      for (const file of files) {

       const retentionPeriodInDays =7;
         
       if ( Date.now() - file.createdAt.getTime() >  retentionPeriodInDays * 24 * 60 * 60 * 1000) {
 
        await File.findOneAndDelete({ _id: file._id });
         
          const filePath = file.path;
          fs.unlinkSync(filePath);
          
        }
      }

      page++;
    }
  } catch (error) {
    throw error;
  }
}

  module.exports=cleanupOldFiles;