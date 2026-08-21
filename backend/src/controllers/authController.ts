import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { registerUser } from "../services/authService.js";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface UpdateProfileBody {
  name: string;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = req.user;

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterBody;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Ім'я, email та пароль обов'язкові",
      });
      return;
    }

    const user = await registerUser({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Реєстрація успішна",
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      res.status(401).json({
        message: "Невірний email або пароль",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        message: "Невірний email або пароль",
      });
      return;
    }

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

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name } = req.body as UpdateProfileBody;

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

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body as ChangePasswordBody;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        message: "Поточний та новий пароль обов'язкові",
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        message: "Новий пароль повинен містити щонайменше 6 символів",
      });
      return;
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      res.status(404).json({
        message: "Користувача не знайдено",
      });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({
        message: "Поточний пароль введено неправильно",
      });
      return;
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

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
