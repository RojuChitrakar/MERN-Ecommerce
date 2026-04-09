// Admin middleware - allows only admin users

export const admin = (req, res, next) => {
  try {
    // req.user comes from protect middleware
    if (req.user && req.user.isAdmin) {
      next(); // ✅ allow access
    } else {
      res.status(403).json({ message: "Admin access only" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};