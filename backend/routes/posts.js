const express  = require('express');
const router = express.Router();
var Post = require("../models/post");
const multer = require('multer');
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
};

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error('Invalid mime type');
      if(isValid) {
        error = null;
      }
      cb(error,'/PROJECTS/Test/Angular/mean/backend/images');
    },

  filename: (req,file,cb) => {
       const name = file.originalname.toLowerCase().split(' ').join('-');
       const ext = MIME_TYPE_MAP[file.mimetype] ;
       cb(null, name + Date.now() + '.' + ext);
    }
});

router.post('', checkAuth, multer({storage:storage}).single('image'),(req, res, next) => {
  //const post = req.body;
  const url = req.protocol + '://'+ req.get("host");
  console.log('url', url);

  const post = new Post({

      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename

    });

  console.log(post);
  post.save().then(createdPost => {
 //  console.log(createdPost);
    res.status(201).json({
      message: "Post Added Successfully...",
      post: {
        id: createdPost._id,
        ...createdPost // short form
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      }
    });
  });
  });

  router.get('/:id', (req, res,next) => {

    Post.findById(req.params.id).then(post => {
      if(post){
        res.status(200).json(post);
      } else {
        res.status(404).json({message:"Post Not found!"});
      }
    })
  })

  router.put('/:id', checkAuth, multer({storage:storage}).single('image'), (req,res,next) => {

    let imagePath = req.body.imagePath;

     if(req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath =  url + "/images/" + req.file.filename;
    }

    const post = new Post ({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
      console.log("Post", post);
    Post.updateOne({_id: req.params.id}, post).then(result => {
      // console.log(result);
      res.status(200).json({message: 'Post Updated Successfully'});
    })
  })

  router.get('', (req, res,next) => {

    const pageSize = +req.query.pagesize; // + for numeric value from string
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if(pageSize && currentPage) {
      postQuery.skip( pageSize * (currentPage -1)).limit(pageSize);
    }
    postQuery.find().then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();  // Post.count();
    }).then(count => {
       res.status(200).json({
       message: "The Post Fetched Succesfully",
       posts: fetchedPosts,
       maxPosts: count
      });
    });
  });

  router.delete('/:id', checkAuth, (req,res,next) => {
    Post.deleteOne({_id:req.params.id}).then(result => {
      console.log(result);
      res.status(200).json({
        message: "Deleted Successfully..."
      });
    });
  });



module.exports = router;
