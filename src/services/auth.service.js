import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "default-secret";
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

export const generateToken = (user) => {
  return jwt.sign({ user }, secret, { expiresIn });
};

export const verifyToken = (token, res) => {
  return jwt.verify(token, secret, (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "Error al verificar el token" });
    }
    return decode;
  });
};
