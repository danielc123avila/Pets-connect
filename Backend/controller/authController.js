import usuariosModel from "../models/usuariosModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

export const token = async (req, res) => {
  try {
    const user = await usuariosModel.findOne({ email: req.body.email });
    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        const token = jwt.sign({ user }, process.env.JWT_SEED, {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      } else {
        res.status(400).json({ message: "Contraseña incorrecta" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default { token };
