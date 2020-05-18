const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dataValidator = require("../middleware/DataValidate");

const app = express();

const User = require("../models/User");

app.post("/login", async (req, res) => {
    const { error } = dataValidator.login(req.body);
    if (error) {
        return res.status(400).send({
            success: false,
            message: error.details[0].message,
        });
    }

    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user)
        return res.status(401).send({
            success: false,
            message: "No user found for " + req.body.email,
        });

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (passwordMatch) {
        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.SECRET,
            { expiresIn: '1h' }
        );
        res
            .header({
                "auth-token": token,
                "Access-Control-Expose-Headers": "auth-token",
            })
            .send({
                success: true,
            });
    } else {
        res.send({
            success: false,
            message: "Password is incorrect"
        });
    }
});

app.post("/signup", async (req, res) => {
    const { error } = dataValidator.signup(req.body);
    if (error) {
        return res.status(400).send({
            success: false,
            message: error.details[0].message,
        });
    }

    const user = await User.findOne({
        email: req.body.email,
    });

    if (user)
        return res.status(401).send({
            success: false,
            message: "User already exits for " + req.body.email,
        });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
    });
    const obj = await newUser.save();
    if (obj) {
        res.send({
            success: true,
        });
    } else {
        res.send({
            success: false,
        });
    }
});

module.exports = app;