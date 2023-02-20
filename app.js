const express = require("express");
const app = express();
const Post = require("./api/models/posts");
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${getExtension(file.mimetype)}`)
  }
})
const getExtension = (mimeType) => {
  switch(mimeType){
    case "image/png":
      return ".png"
    case "image/jpeg":
      return ".jpeg"
  }
}
const upload = multer({storage:storage})
const postData = new Post();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/uploads", express.static("uploads"));

app.get("/api/posts", (req, res) => {
  res.status(200).send(postData.get());
});

app.get("/api/posts/:post_id", (req, res) => {
  const postId = req.params.post_id;
  const foundPost = postData.getIndividualPost(postId);
  if (foundPost) {
    res.status(200).send(foundPost);
  } else {
    res.status(404).send("Not Found");
  }
});

// app.post("/api/posts", upload.single("post-image"),(req, res) => {
//   const newPost = {
//     id: `${Date.now()}`,
//     title: req.body.title,
//     content: req.body.content,
//     post_image: req.file.path,
//     added_date: `${Date.now()}`,
//   };
//   console.log(JSON.stringify(req));
//   postData.add(newPost);
//   res.status(201).send(newPost);
// });

app.post("/api/posts",upload.single("post-image"),(req, res) => {
  const newPost = {
    id: `${Date.now()}`,
    title: req.body.title,
    content: req.body.content,
    post_image: req.file.path,
    added_date: `${Date.now()}`,
  };
  postData.add(newPost);
  res.status(201).send("OK");
})

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
