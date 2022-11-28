export const BASE_URL = "https://recruit-teacher.herokuapp.com/";
// export const BASE_URL = "http://localhost:8400/";

export const configToken = (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};
