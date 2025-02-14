import jwt from "jsonwebtoken";

// Función para generar un token
export function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SEED, { expiresIn: "1h" });
}

// Función para verificar un token
export function verifyToken(token) {
    try {   
        return jwt.verify(token, process.env.JWT_SEED);
    } catch (error) {
        return null;
    }
}
