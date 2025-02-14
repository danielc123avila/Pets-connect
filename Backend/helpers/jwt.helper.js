import jwt from "jsonwebtoken";

// Función para verificar un token
export function verifyToken(err, req, res, next) {
  try {
    if (err.name === "UnauthorizedError") {
      return res
        .status(401)
        .json({ message: "Acceso denegado. No se proporcionó token." });
    } else {
      next(err);
    }
  } catch (error) {
    return res.status(401).json({ message: "Token inválido." });
  }
}
