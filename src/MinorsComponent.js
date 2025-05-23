import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "./config";

function MinorsComponent() {
  const [minors, setMinors] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/minors`)
      .then((response) => {
        setMinors(response.data);
      })
      .catch((error) => {
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
