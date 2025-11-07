import { User } from "../models/users.js";
import { Cart } from "../models/carts.js";
import { validatePass, hashPass } from "../services/hashService.js";
import { generateToken } from "../services/jwtService.js";

// ✅ Crear un usuario (registro)
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, direccion, telefono, rol, contrasena } = req.body;

    if (!nombre || !email || !direccion || !telefono || !rol || !contrasena) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ mensaje: "El email ya está registrado" });
    }

    const contrasenaHash = await hashPass(contrasena);

    const user = new User({
      nombre,
      email,
      direccion,
      telefono,
      rol,
      contrasena: contrasenaHash,
    });

    const nuevoUsuario = await user.save();

    return res.status(201).json({ mensaje: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// ✅ Obtener todos los usuarios (solo admin)
export const mostrarUsuario = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      return res.status(204).json([]);
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ mensaje: `Error al obtener usuarios: ${err}` });
  }
};

// ✅ Obtener usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findById(id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
};

// ✅ Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, direccion, telefono } = req.body;

    const actualizado = await User.findByIdAndUpdate(
      id,
      { nombre, email, direccion, telefono },
      { new: true }
    );

    if (!actualizado) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.status(200).json({ mensaje: "Usuario actualizado correctamente", usuario: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

// ✅ Eliminar usuario (solo admin)
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await User.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

// ✅ Eliminar usuario y carrito
export const eliminarUsuarioYCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await User.findByIdAndDelete(id);
    if (!usuarioEliminado) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    await Cart.deleteOne({ userId: id });

    res.status(200).json({ mensaje: "Usuario y carrito eliminados correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario y carrito" });
  }
};

// ✅ Login (devuelve token JWT)
export const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ mensaje: "Faltan email o contraseña" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    const valid = await validatePass(contrasena, user.contrasena);
    if (!valid)
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });

    const token = generateToken({
      id: user._id,
      role: user.rol,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      user: { id: user._id, nombre: user.nombre, rol: user.rol },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
