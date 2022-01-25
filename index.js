let express = require("express");
let app = express();
let mongoose = require("mongoose");
let multer = require("multer");
let cookieParser = require("cookie-parser");

let auth = require("./controllers/auth");

let emailsRouter = require("./routes/emails");
let usersRouter = require("./routes/users");
let callbackRouter = require("./routes/callback-requests");
let profileRouter = require("./routes/profile");
let placeRouter = require("./routes/places");
let tourPackagesRouter = require("./routes/tourPackages");

app.set("view engine", "ejs");

const connectionString =
    "mongodb+srv://user1:xnTu0FJAONJWrx2v@cluster0.o6rah.mongodb.net/TurAppDb?retryWrites=true&w=majority";
mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", (error) => {
    console.log("error", error);
    app.use(express.json());

    let imageStorage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "public/images"),
        filename: (req, file, cb) => cb(null, file.originalname),
    });
    //app.use(multer({dest: 'public/images'}).single('imageFile'));
    app.use(multer({ storage: imageStorage }).single("imageFile"));
    app.use(express.static("public"));
    app.use(cookieParser()); //so that cookies are automatically generated for every request.

    app.listen(process.env.PORT || 3000, () =>
        console.log("Listening 3000...")
    );
});
db.once("open", function () {
    console.log("Connected successfully");
    app.use(express.json());

    let imageStorage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "public/images"),
        filename: (req, file, cb) => cb(null, file.originalname),
    });
    //app.use(multer({dest: 'public/images'}).single('imageFile'));
    app.use(multer({ storage: imageStorage }).single("imageFile"));
    app.use(express.static("public"));
    app.use(cookieParser()); //so that cookies are automatically generated for every request.

    // api routes
    app.use("/users", usersRouter);
    app.use("/emails", emailsRouter);
    app.use("/callback-requests", callbackRouter);
    app.use("/api/profile", profileRouter);
    app.use("/api/place", placeRouter);
    app.use("/api/tour-package", tourPackagesRouter);

    // page routes
    app.get("/admin", (req, res) => {
        let token = req.cookies["auth_token"];
        if (token && auth.checkToken(token, "ADMIN").state) {
            //token should not be empty!
            res.render("dashboard");
        } else {
            res.redirect("/"); //redirecting sign-in page!
        }
    });
    app.get("/client", (req, res) => {
        let token = req.cookies["auth_token"];
        if (token && auth.checkToken(token, "USER").state) {
            //token should not be empty!
            res.render("client");
        } else {
            res.redirect("/"); //redirecting sign-in page!
        }
    });

    app.get("/dashboard", (req, res) => {
        let token = req.cookies["auth_token"];
        if (token && auth.checkToken(token, "ADMIN").state) {
            //token should not be empty!
            res.render("dashboard");
        } else if (token && auth.checkToken(token, "USER").state) {
            //token should not be empty!
            res.render("client");
        } else {
            res.redirect("/"); //redirecting sign-in page!
        }
    });
    app.get("/profile", (req, res) => {
        let token = req.cookies["auth_token"];
        if (token && auth.checkToken(token, "ADMIN").state) {
            //token should not be empty!
            res.render("profile");
        } else if (token && auth.checkToken(token, "USER").state) {
            //token should not be empty!
            res.render("clientProfile");
        } else {
            res.redirect("/"); //redirecting sign-in page!
        }
    });
    app.get("/login", (req, res) => {
        let token = req.cookies["auth_token"];
        if (token && auth.checkToken(token, "USER").state) {
            //token should not be empty!
            res.render("places");
        } else {
            res.redirect("/"); //redirecting sign-in page!
        }
    });

    app.get("/submited_messages", (req, res) => {
        let token = req.cookies["auth_token"];
        if (token && auth.checkToken(token, "ADMIN").state) {
            //token should not be empty!
            res.render("submitedMessages");
        } else {
            res.redirect("/"); //redirecting sign-in page!
        }
    });
    app.get("/callback-requests-page", (req, res) => {
        let token = req.cookies["auth_token"];
        if (token && auth.checkToken(token, "ADMIN").state) {
            //token should not be empty!
            res.render("callback-requests-page");
        } else {
            res.redirect("/"); //redirecting sign-in page!
        }
    });

    app.get("/about", (req, res) => {
        res.render("about-page");
    });
    app.get("/contact", (req, res) => {
        res.render("contact-page");
    });
    app.get("/places", (req, res) => {
        res.render("places-page");
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

    app.listen(process.env.PORT || 3000, () =>
        console.log("Listening 3000...")
    );
});
