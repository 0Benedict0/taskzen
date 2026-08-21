import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import toast from "react-hot-toast";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);

      toast.success("Ласкаво просимо!");

      navigate("/");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Не вдалося увійти";

      toast.error(message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TaskZen</h1>

        <p className="login-subtitle">Ласкаво просимо назад 👋</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <div className="login-footer">
          Немає акаунта? <Link to="/register">Зареєструватися</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
