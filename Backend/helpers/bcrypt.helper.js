import bcrypt from "bcryptjs";

// Función para hashear una contraseña
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Función para comparar una contraseña con su hash
export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}
