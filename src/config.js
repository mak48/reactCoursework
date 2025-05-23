const config = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "https://coursework-latest-uayr.onrender.com"
      : "http://localhost:8080",
};

export default config;
