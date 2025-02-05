import Pet from "../models/petsModel.js";

export const crearReporte = async (req, res) => {
  try {
    const {
      especie,
      sexo,
      nombre,
      ultimaUbicacion,
      fechaExtravio,
      color,
      email,
      celular,
      descripcion,
      palabrasClave,
    } = req.body;

    // Validación de fecha
    if (new Date(fechaExtravio) > new Date()) {
      throw new Error("La fecha de extravío no puede ser futura");
    }

    const nuevaMascota = new Pet({
      especie,
      sexo,
      nombre,
      ultimaUbicacion,
      fechaExtravio,
      color,
      email: email.toLowerCase(),
      celular,
      descripcion,
      palabrasClave: palabrasClave.split(",").map(p => p.trim()),
      fotos: req.files?.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        thumbnail: `/uploads/thumbs/${file.filename}`,
        descripcion: `Foto ${index + 1}`,
      })) || [],
    });

    await nuevaMascota.save();
    
    res.status(201).json({
      success: true,
      data: nuevaMascota
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
