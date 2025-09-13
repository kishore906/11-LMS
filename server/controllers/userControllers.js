import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";

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

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      imageUrl: "",
    });

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

// updateRole: /api/updateRole
const updateRole = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await User.findByIdAndUpdate(
      { _id },
      { role: "educator" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ user: { _id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// user enrolled courses with lecture links
// endpoint: /api/enrolledCourses
const userEnrolledCourses = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).populate("enrolledCourses");
    res
      .status(200)
      .json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// purchase course by user
// endpoint: /api/purchase
const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { _id } = req.user;
    const user = await User.findById(_id);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found.." });
    }

    // creating purchase data
    const purchaseData = {
      courseId: course._id,
      userId: _id,
      amount: (
        course.coursePrice -
        (course.discount * course.coursePrice) / 100
      ).toFixed(2),
    };

    // storing purchase data in db
    const newPurchase = await Purchase.create(purchaseData);

    // initializing stripe payment gateway
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // creating line items for stripe payment
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: course.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100, // in cents
        },
        quantity: 1,
      },
    ];

    // payment session
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update user course progress
// endpoint: /api/update-course-progress
const updateUserCourseProgress = async (req, res) => {
  try {
    const { _id } = req.user;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({
      userId: _id,
      courseId,
    });

    if (progressData) {
      //console.log(progressData.lectureCompleted.includes(lectureId));
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res
          .status(200)
          .json({ success: true, message: "Lecture already completed" });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId: _id,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.status(200).json({ success: true, message: "Progress updated!!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get user course progress
// endpoint: /api/get-course-progress
const getUserCourseProgress = async (req, res) => {
  try {
    const { _id } = req.user;
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({
      userId: _id,
      courseId,
    });
    res.status(200).json({ success: true, progressData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// add user rating to course
// endpoint: /api/add-rating
const addUserRating = async (req, res) => {
  const { _id } = req.user;
  const { courseId, rating } = req.body;

  if (!courseId || !_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid Details" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found.." });
    }

    const user = await User.findById(_id);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "User didn't purchase this course !!" });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === _id
    );

    // if rating is already available then update rating
    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId: _id, rating });
    }

    await course.save();

    res.status(200).json({ success: true, message: "Rating added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  register,
  login,
  logout,
  getUser,
  updateProfile,
  updatePassword,
  updateRole,
  userEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
};

/*
In Stripe, the unit_amount is multiplied by 100 because Stripe's API expects the amount to be in the smallest currency unit (e.g., cents for USD, pence for GBP).

For example:

If you're charging $10.00, you would set the unit_amount to 1000 (because $10.00 is 1000 cents).
For a price of €20.50, you would set unit_amount to 2050 (because €20.50 is 2050 cents).
*/
