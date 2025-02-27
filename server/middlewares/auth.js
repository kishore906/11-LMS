import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied, Please Login to access route",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Invalid Token or Expired Please Login" });
    }

    res.status(500).json({ error: err.message });
  }
};

export { isAuthenticated };
