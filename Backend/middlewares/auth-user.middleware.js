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

// Middleware para proteger rutas
export function authMiddleware(req, res, next) {
    console.log('Middleware de autenticación');  // Aquí está el console.log para la prueba
    
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Token inválido.' });
    }

    req.user = decoded;
    next();
}
