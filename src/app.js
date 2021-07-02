require('dotenv').config();
const path = require('path');
const bcript = require('bcryptjs');
const express = require('express');
const dotenv = require('dotenv');
const hbs = require('hbs');
const cookies_parser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;
require("./db/conn");
const Register = require("../src/model/scema");
const auth = require("./middelware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use( cookies_parser());

const static_path = path.join(__dirname, '../public');
const templates_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');



app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index")
});


// registration section


app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", async (req, res) => {
    try {
        const pass = req.body.password;
        const cpass = req.body.repeatePass;


        // console.log(req.body.name);
        // console.log(req.body.email);
        // console.log(req.body.password);
        // console.log(req.body.repeatePass);

        // res.send(req.body.name);


        if (pass === cpass) {
            const userData = new Register({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: pass,
                repeatePass: cpass
            })

            // token generting

            const token = await userData.generatingToken();
            console.log("the token part" + token);

            // geneting cookies
            res.cookie("jwt", token,{
                expires:new Date(Date.now()+30000),
                httpOnly:true
            });
            // console.log(cookie);

            //    save the sata into database
            const Registered = await userData.save();
            res.status(200).render('index');

        } else {
            res.send('password not match');
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


//  About page or secrte page

app.get("/about",auth, (req, res) => {
    console.log(`the cookies is ${req.cookies.jwt}`);
    res.render("about");
});
// Login section

app.get("/login", (req, res) => {
    res.render("login")
});
app.post("/login", async (req, res) => {
    const email = req.body.email_id;
    const pass = req.body.your_pass;

    // console.log(`email:${email} password : ${pass}`);

    const validEmail = await Register.findOne({ email: email });

    const isMatch = await bcript.compare(pass, validEmail.password);

    const token = await validEmail.generatingToken();
    // console.log("the token part" + token)


    res.cookie("jwt", token,{
        expires:new Date(Date.now()+600000),
        httpOnly:true
        
    });

    // res.send(validEmail.password);
    // console.log(validEmail);


    if (isMatch) {

        res.status(201).render('index');

    }
    else {
        res.send("Ivalid User")
    }
});

app.get("/logout" , auth , async(req , res)=>{
    try {
        // console.log(req.user);

  req.user.tokens= req.user.tokens.filter((val)=>{
      return val.token != req.token
  })


        res.clearCookie("jwt");
        consol.log("logout Succesfull");
        await req.user.save();
        res.render("login");

    } catch (error) {
       res.status(500).send(error); 
    }
})



app.get("/index", (req, res) => {
    res.render("index")
});

app.listen(port, () => {
    console.log(`server is started at port no ${port}`);
})