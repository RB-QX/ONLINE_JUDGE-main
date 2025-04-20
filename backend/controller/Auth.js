const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
//const cookieparser = require("cookie-parser");

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existuser = await User.findOne({ email });
    if (existuser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const userRole = role || "User"; // Set default role to "User" if not provided

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashpassword,
      role: userRole,
    });

    const token = jwt.sign(
      { id: user._id, email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    user.token = token;
    user.password = undefined;

    res.status(200).json({
      message: "Successfully registered",
      user,
      success: true,
      token,
      role,
      email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    user.password = undefined;
    const role = user.role;

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.status(200).cookie("token", token, options).json({
      message: "successfully logged in",
      success: true,
      token,
      role,
      email,
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Link",
      //text: `Click the following link to reset your password: http://localhost:8000/reset_password/${user._id}/${token}`,
      html: `<p>You requested a password reset</p>
      <p>Click this <a href="https://codeinnovate.tech/reset-password/${user._id}/${token}">link</a> to reset your password</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ status: "Failed to send email" });
      }
      console.log("Email sent:", info.response);
      return res.status(200).json({ status: "Success" });
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res.status(500).json({ status: "Failed to process request" });
  }
};

//"/reset-password/:id/:token"

exports.resetpassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("dfghjk");
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
};

exports.totaluser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
