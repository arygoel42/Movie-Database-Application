function adminCheck(req, res, next) {
  return req.user.isAdmin ? next() : res.sendStatus(403);
}

module.exports = adminCheck;
