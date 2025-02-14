import bcrypt from "bcryptjs";

// Función para hashear una contraseña
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("Hash generado:", hash);
    return hash;
}

// Función para comparar una contraseña con su hash
export async function comparePassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    console.log("Resultado de la comparación:", match);
    return match;
}

export default bcrypt;