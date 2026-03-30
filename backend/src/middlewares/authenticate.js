export function requireAuth(req, res, next) {
  if (!req.user || !Number.isInteger(req.user.id)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}