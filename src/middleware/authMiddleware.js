import { verifyToken } from "../services/auth.service.js";

// Middleware que valida si el token es válido y agrega el usuario al request
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, res); // tu función devuelve el usuario decodificado
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Token inválido o expirado" });
    }

    req.user = decoded.user; // el payload que guardaste en generateToken({user})
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Error al verificar token" });
  }
};

// Middleware solo para admin
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Acceso denegado: solo admin" });
  }
  next();
};

// Middleware para permitir solo al dueño o al admin
export const requireOwnerOrAdmin = (req, res, next) => {
  const { userId } = req.params;
  if (req.user.role === "admin" || req.user.id === parseInt(userId)) {
    return next();
  }
  return res.status(403).json({ success: false, message: "No autorizado" });
};
