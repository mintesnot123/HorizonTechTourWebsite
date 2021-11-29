let express = require("express");
let app = express();
let mongoose = require("mongoose");
let multer = require("multer");
let cookieParser = require("cookie-parser");

//let postsRouter = require('./routes/posts');
//let callbackRequestsRouter = require('./routes/callback-requests');
let emailsRouter = require("./routes/emails");
let usersRouter = require("./routes/users");
let callbackRouter = require("./routes/callback-requests");
let profileRouter = require("./routes/profile");
//let Post = require('./models/posts').Post;
let auth = require("./controllers/auth");

app.set("view engine", "ejs");

const connectionString =
    "mongodb+srv://user1:xnTu0FJAONJWrx2v@cluster0.o6rah.mongodb.net/TurAppDb?retryWrites=true&w=majority";
mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.use(express.json());

let imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/images"),
    filename: (req, file, cb) => cb(null, file.originalname),
});
//app.use(multer({dest: 'public/images'}).single('imageFile'));
app.use(multer({ storage: imageStorage }).single("imageFile"));
app.use(express.static("public"));
app.use(cookieParser()); //so that cookies are automatically generated for every request.

app.get("/terms-conditions", (req, res) => {
    res.render("terms-conditions");
});

/* app.get("/login", (req, res) => {
    res.render("login");
}); */

app.get("/chatbox", (req, res) => {
    res.render("chatbox");
});

app.get("/chatbox2", (req, res) => {
    res.render("chatbox2");
});

app.get("/login", (req, res) => {
    res.render("login2");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

app.get("/profile", (req, res) => {
    res.render("profile");
});

app.get("/submited_messages", (req, res) => {
    res.render("emails");
});
app.get("/callback-requests-page", (req, res) => {
    res.render("callback-requests-page");
});

app.use("/users", usersRouter);
app.use("/emails", emailsRouter);
app.use("/callback-requests", callbackRouter);
app.use("/api/profile", profileRouter);

app.get("/admin", (req, res) => {
    /*to read the cookie */
    let token = req.cookies["auth_token"];
    if (token && auth.checkToken(token, "ADMIN").state) {
        //token should not be empty!
        res.render("admin");
    } else {
        res.redirect("/login"); //redirecting sign-in page!
    }
});
app.get("/client", (req, res) => {
    /*to read the cookie */
    let token = req.cookies["auth_token"];
    if (token && auth.checkToken(token, "USER").state) {
        //token should not be empty!
        res.render("client");
    } else {
        res.redirect("/login"); //redirecting sign-in page!
    }
});

/* app.use("/posts", postsRouter);
app.use("/callback-requests", callbackRequestsRouter); */
/*That means that when the request is made on the route path which starts with /callback-requests,
then it will be redirected callback-requests.js*/
/*
 */

/* app.get("/sight", async (req, res) => {
  let id = req.query.id;
  let post = await Post.findOne({ id: id });
  res.render("sight", {
    title: post.title,
    imageUrl: post.imageUrl,
    date: post.date,
    text: post.text,
  });
}); */

app.listen(3000, () => console.log("Listening 3000..."));
