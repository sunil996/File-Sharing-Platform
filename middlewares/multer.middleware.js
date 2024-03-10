const multer=require("multer");
const path=require("path");

const storage = multer.diskStorage({
    destination:  "./uploads",
    filename:  function (req,file,cb ) {

        const uniqueFileName=`${file.originalname}-${Date.now()}${path.extname(file.originalname)}`
        cb(null,uniqueFileName)
      },

  })
  
  const upload = multer({ storage: storage,limits:{fileSize: 100 * 1024 * 1024} });

  module.exports=upload