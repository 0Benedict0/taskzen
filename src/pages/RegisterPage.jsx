import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { register } from "../services/authService";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      setError("Введіть ім'я");
      return;
    }

    if (!email.trim()) {
      setError("Введіть email");
      return;
    }

    if (password.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів");
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Акаунт успішно створено!");

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Не вдалося створити акаунт";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const stars = useMemo(
    () =>
      Array.from({ length: 45 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
        size: 1 + Math.random() * 2,
      })),
    [],
  );
  return (
    <main className="register-page">
      <div className="register-background">
        <div className="register-glow register-glow-one" />
        <div className="register-glow register-glow-two" />
        <div className="register-stars">
          {stars.map((star) => (
            <span
              key={star.id}
              className="register-star"
              style={{
                left: ` ${star.left}%`,
                top: ` ${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      <section className="register-card">
        <div className="register-header">
          <div className="register-logo">TZ</div>

          <h1>Створити акаунт</h1>

          <p>
            Приєднуйтесь до <strong>TaskZen</strong> та організуйте свої
            завдання
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="name">Ім'я</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Введіть ваше ім'я"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

          <div className="register-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="register-field">
            <label htmlFor="password">Пароль</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Мінімум 6 символів"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">Підтвердження пароля</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Повторіть пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="register-error">
              <span>⚠</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="register-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="register-spinner" />
                Створення акаунта...
              </>
            ) : (
              "Створити акаунт →"
            )}
          </button>
        </form>

        <div className="register-footer">
          <span>Вже маєте акаунт?</span>

          <Link to="/login">Увійти</Link>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
