import React, { useState } from "react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Имя пользователя обязательно";
    if (!formData.password) newErrors.password = "Пароль обязателен";
    if (!formData.email) newErrors.email = "Email обязателен";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      console.log("Данные для регистрации:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <div>
        <label>
          Имя пользователя:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        {errors.username && (
          <span style={{ color: "red" }}>{errors.username}</span>
        )}
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
      </div>
      <div>
        <label>
          Пароль:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        {errors.password && (
          <span style={{ color: "red" }}>{errors.password}</span>
        )}
      </div>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default RegisterForm;
