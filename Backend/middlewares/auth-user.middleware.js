const jwt = require("jsonwebtoken");

// Función para generar un token
function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SEED, { expiresIn: "1h" });
}

// Función para verificar un token
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SEED);
    } catch (error) {
        return null;
    }
}

// Middleware para proteger rutas
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Token inválido.' });
    }

    req.user = decoded; // Agregar los datos decodificados del usuario a la solicitud
    next(); // Continuar con la siguiente función middleware
}

module.exports = { generateToken, verifyToken, authMiddleware };
