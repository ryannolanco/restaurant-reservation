function methodNotAllowed(req, res, next) {
  res.status(405).send({ error: "Method Not Allowed" });
}

module.exports = methodNotAllowed;