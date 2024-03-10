const express=require("express")
const router=express.Router();
const multer=require("../middlewares/multer.middleware.js");
const {uploadFile,getFileInfromation,downloadFile,sendMail}=require("../controllers/file.controller.js") 

router.route("/").post(multer.single("file"),uploadFile);
router.route("/:fileId").get(getFileInfromation);
router.route("/download/:fileId").get(downloadFile);
router.route("/sendMail").post(sendMail)
module.exports=router;