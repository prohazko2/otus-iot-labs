const jwt = require("jsonwebtoken");
const db = require("./db");

/** gen with
 * > crypto.randomBytes(48).toString('hex')
 */
const SECRET = process.env.JWT_SECRET;

async function issue(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    throw new Error("username or password not passed");
  }

  const user = db.users.find((u) => u.username === username);
  if (!user) {
    throw new Error("user not found");
  }

  /** !!! WARNING !!!
   *
   * this is only an example
   * never actualuly store plain text passwords in db
   * use bcrypt module or node's PBKDF2 builtin hash function
   */
  if (user.password !== password) {
    throw new Error("password didn't match");
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: "3d" });

  res.json({
    username,
    token,
  });
}

async function verify(req, res, next) {
  try {
    const token = (req.headers.authorization || "")
      .split("Bearer")
      .map((x) => x.trim())
      .filter((x) => !!x)[0];

    if (!token) {
      throw new Error("token not passed");
    }

    const decoded = jwt.verify(token, SECRET);
    req.token = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  verify,
  issue,
};
