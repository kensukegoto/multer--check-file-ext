const express = require('express');
const multer = require('multer');
const fileType = require('file-type');
const fs = require('fs');
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp')
  },
  filename: function (req, file, cb) {
    
    const filename = file.originalname.split('.')[0];
    cb(null, filename);
    
  }
})
const upload = multer({
  storage: storage,
  fileFilter: (req,file,cb) => {
    // 拡張子が不正でも受け付けるもののチェックは可能
    cb(null,true);
  },
  limits:{
    fileSize: 1024 * 1024
  }
});

app.use(express.urlencoded({ extended: false }));
app.post('/upload', upload.single('image'), async (req, res) => {

  /**
   * 実際調べてみて不正じゃなかったら一時フォルダから移動
   */
  const img = fs.readFileSync(req.file.path);
  const ext = fileType(img).ext;
  if(fileType(img).mime === req.file.mimetype){
    fs.rename(req.file.path,'uploads/' + req.file.filename + '.' + ext, err =>{
      if(err) {}
    });
  }else{
    console.log('ダメだよ！');
    fs.unlinkSync(req.file.path);
  }


  // s3に保存したい



  res.status(200).send('done file control.').end();
});

app.listen(8080);