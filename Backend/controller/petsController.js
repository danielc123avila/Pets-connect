import Pet from "../models/petsModel.js";

export const obtenerMascotas = async (req, res) => {
  try {
    const mascotas = await Pet.find();

    res.status(200).json({
      success: true,
      data: mascotas,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const obtenerMascotaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await Pet.findById(id);

    if (!mascota) {
      throw new Error("Mascota no encontrada");
    }

    res.status(200).json({
      success: true,
      data: mascota,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const crearReporte = async (req, res) => {
  try {
    const {
      especie,
      sexo,
      nombre,
      ultimaUbicacion,
      fechaExtravio,
      color,
      raza,
      email,
      celular,
      descripcion,
      palabrasClave,
      estado,
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
      raza,
      email: email.toLowerCase(),
      celular,
      descripcion,
      palabrasClave: palabrasClave.split(",").map((p) => p.trim()),
      estado,
      fotos:
        req.files?.map((file, index) => ({
          url: `/uploads/${file.filename}`,
          thumbnail: `/uploads/thumbs/${file.filename}`,
          descripcion: `Foto ${index + 1}`,
        })) || [],
    });

    await nuevaMascota.save();

    res.status(201).json({
      success: true,
      data: nuevaMascota,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const eliminarMascota = async (req, res) => {
  try {
    const { id } = req.params;
    const mascotaEliminada = await Pet.findByIdAndDelete(id);

    if (!mascotaEliminada) {
      throw new Error("Mascota no encontrada");
    }

    res.status(200).json({
      success: true,
      message: "Mascota eliminada correctamente",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
