import bcrypt from "bcrypt";
import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";
import { registerUser } from "../services/authService.js";

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Ім'я, email та пароль обов'язкові",
      });
    }

    const user = await registerUser({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Вхід успішний",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Невірний email або пароль",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Невірний email або пароль",
      });
    }

    // Створюємо JWT
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Вхід успішний",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = req.user;

    user.name = name;

    await user.save();

    res.status(200).json({
      message: "Профіль оновлено",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Поточний та новий пароль обов'язкові",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Новий пароль повинен містити щонайменше 6 символів",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Поточний пароль введено неправильно",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Пароль успішно змінено",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const user = req.user;

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      message: "Акаунт успішно видалено",
    });
  } catch (error) {
    next(error);
  }
};
