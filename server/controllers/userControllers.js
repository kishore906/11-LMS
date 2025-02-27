import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// register: /api/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isEmailAlreadyExists = await User.findOne({ email });

    if (isEmailAlreadyExists) {
      return res.status(400).json({ message: "Email already exists!!" });
    }

    // encrypting password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User created Successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((value) => ({
        fieldName: value.path,
        message: value.message,
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: err.message });
  }
};

// login: /api/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid EmailId" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // generating token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_TIME }
    );

    // passing token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res
      .status(200)
      .json({ user: { _id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// logout: /api/logout
const logout = async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    maxAge: new Date(Date.now()),
  });

  res.status(200).json({ message: "LoggedOut Successfully" });
};

// getUser: /api/user/id
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// updateProfile: /api/updateProfile/id
const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const { _id } = req.user;

    const user = await User.findByIdAndUpdate(
      { _id },
      { name, email },
      { new: true }
    );
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// updatePassword: /api/updatePassword/id
const updatePassword = async (req, res) => {
  const { password } = req.body;

  try {
    const { _id } = req.user;

    // get the user
    const user = await User.findById(_id).select("+password");

    // check password is changed or not
    let newPassword = "";
    const isPasswordSame = await bcrypt.compare(password, user.password);

    // if password changed hash the password
    if (!isPasswordSame) {
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(password, salt);
    }

    // insery the updated document
    const result = await User.updateOne(
      { _id },
      {
        $set: {
          password: isPasswordSame ? user.password : newPassword,
        },
      },
      { returnDocument: "after" } // This option ensures the updated document is returned
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { register, login, logout, getUser, updateProfile, updatePassword };
