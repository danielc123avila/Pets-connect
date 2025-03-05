import Pet from "../models/petsModel.js";

export const obtenerMascotas = async (req, res) => {
  try {
    const mascotas = await Pet.find({ deletedAt: { $eq: null } });
    return res.status(200).json(mascotas);
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

    const mascota = await Pet.findOne({
      _id: id,
      deletedAt: { $eq: null },
    }).populate("dueno", "nombre telefono email profileImg username direccion edad"); // 🔥 Solo los campos necesarios

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
      dueno,
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
      dueno,
      especie,
      sexo,
      nombre,
      ultimaUbicacion,
      fechaExtravio,
      color,
      raza,
      email: email ? email.toLowerCase() : undefined,
      celular,
      descripcion,
      palabrasClave: palabrasClave ? palabrasClave.split(",").map((p) => p.trim()) : [],
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

export const actualizarMascota = async (req, res) => {
  try {
    const { id } = req.params;
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
    if (fechaExtravio && new Date(fechaExtravio) > new Date()) {
      throw new Error("La fecha de extravío no puede ser futura");
    }

    const fotosActualizadas =
      req.files?.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        thumbnail: `/uploads/thumbs/${file.filename}`,
        descripcion: `Foto ${index + 1}`,
      })) || [];

    const datosActualizados = {
      especie,
      sexo,
      nombre,
      ultimaUbicacion,
      fechaExtravio,
      color,
      raza,
      email: email ? email.toLowerCase() : undefined,
      celular,
      descripcion,
      palabrasClave: palabrasClave ? palabrasClave.split(",").map((p) => p.trim()) : [],
      ...(fotosActualizadas.length && { fotos: fotosActualizadas }),
      estado,
    };

    const mascotaActualizada = await Pet.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true }
    );

    if (!mascotaActualizada) {
      throw new Error("Mascota no encontrada");
    }

    res.status(200).json({
      success: true,
      data: mascotaActualizada,
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
    const mascotaEliminada = await Pet.findById(req.params.id);
    mascotaEliminada.deletedAt = Date.now();
    mascotaEliminada.save();

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
