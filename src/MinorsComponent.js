import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MinorsComponent() {
  const [minors, setMinors] = useState([]);

  useEffect(() => {
    // Выполните GET-запрос к вашему эндпоинту
    axios.get('http://localhost:8080/api/minors')
      .then(response => {
        // Обновите состояние компонента с полученными данными
        setMinors(response.data);
      })
      .catch(error => {
        console.error("Ошибка при получении данных о майнорах:", error);
      });
  }, []);

  return (
    <div>
      <h1>Список майноров</h1>
      <ul>
        {minors.map((minor, index) => (
          <li key={index}>{minor.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default MinorsComponent;