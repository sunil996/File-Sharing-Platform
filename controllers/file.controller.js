const mongoose = require("mongoose");
const File=require("../models/file.model.js")
const asyncHandler=require("../utils/asyncHandler.js") 
const transporter=require("../utils/mailer.js")
const bcrypt=require("bcrypt");
const cron = require('node-cron');

const uploadFile=asyncHandler(async(req,res)=>{

    const fileData={
        path:req.file.path,
        originalName:req.file.originalname,
        size:req.file.size
    };

    if(req.body?.password?.trim().length>0 ){
        fileData.password=await bcrypt.hash(req.body.password,10)
    }

    const createdFile = await File.create(fileData);

    if(!createdFile){
        return res.status(500).json({success:false,message:"failed to upload a file !",data:null})
    }   
    const url=`${process.env.APP_BASE_URL}/api/v1/files/${createdFile._id}`;

    return res.status(201).json({success:true,message:"file uploaded successfully.",data:url})
});


const getFileInfromation=asyncHandler(async(req,res)=>{

    const {fileId}=req.params;
    if(!fileId){
      return  res.status(400).json({success:false,message:"file id is required !",data:null})
    }

    if(!mongoose.isValidObjectId(fileId?.trim())){
      return  res.status(400).json({success:false,message:"Invalid file id !",data:null})
    }

    const file=await File.findById(fileId?.trim());

    if(!file)  return res.status(404).json({success:false,message:"resource not found !",data:null})
   
    const downloadUrl=`${process.env.APP_BASE_URL}/api/v1/files/download/${file._id}`;
  
    const fileData={
        filename:file.originalName,
        filesize:(file.size/1048576).toFixed(2),
        downloadUrl  
    }

    return res.status(201).json({success:true,message:"file details fetched successfully.",data:fileData})
})

const downloadFile=asyncHandler(async(req,res)=>{

    const {fileId}=req.params;
    if(!fileId){
       return res.status(400).json({success:false,message:"file id is required !",data:null})
    }

    if(!mongoose.isValidObjectId(fileId?.trim())){
      return  res.status(400).json({success:false,message:"Invalid file id !",data:null})
    }

    const file=await File.findById(fileId?.trim()).select('_id  originalName path password downloadCount') 
     
    if(file.password){

      let {password}=req.body;
      password=password?.trim();

      if(!password){
        return res.status(400).json({success:false,message:"This file  is secured ! . password is required in order to download this file.",data:null})
      }
    
      const passwordMatch=await bcrypt.compare(password,file.password);

      if(!passwordMatch){
        return res.status(400).json({success:false,message:"Invalid Password !",data:null})
      }
         
      file.downloadCount+=1;
      await file.save();
      return res.download(file.path,file.originalName)
     
    }

    return res.download(file.path,file.originalName)
    
})

const sendMail=asyncHandler( async(req,res)=>{

    const { fileId, senderEmail, receiverEmail } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!fileId?.trim() || !senderEmail?.trim() || !receiverEmail?.trim()) {
      return res.status(400).json({ success: false, message: 'File id, sender email, and receiver email are required!', data: null });
    }
  
    if (!mongoose.isValidObjectId(fileId?.trim())) {
      return res.status(400).json({ success: false, message: 'Invalid file id!', data: null });
    }
  
    if (!emailRegex.test(senderEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid sender email address!', data: null });
    }
  
    if (!emailRegex.test(receiverEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid receiver email address!', data: null });
    }
  
    const file = await File.findById(fileId?.trim());
  
    if (!file) {
      return res.status(404).json({ success: false, message: 'Resource not found!', data: null });
    }
  
    const mailOptions = {
      from: senderEmail,
      to: receiverEmail,
      subject: 'Download Link for Shared File',
      text: `Download the file using the link: ${process.env.APP_BASE_URL}/api/v1/files/download/${file._id}`,
    };
  
    await transporter.sendMail(mailOptions);

    return res.status(200).json({success:true,message:"Reset email sent successfully",data:null})
 
});
 

module.exports={uploadFile,getFileInfromation,downloadFile,sendMail}