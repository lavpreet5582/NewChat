export const getAccessToken = () => localStorage.getItem("access");
export const getRefreshToken = () => localStorage.getItem("refresh");

export const refreshToken = async () => {
  const refresh = getRefreshToken();
  const res = await fetch("http://localhost:8000/api/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("access", data.access);
    return data.access;
  } else {
    localStorage.clear();
    window.location.href = "/"; // logout to login
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  let access = getAccessToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
    },
  });

  if (res.status === 401) {
    access = await refreshToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${access}`,
      },
    });
  }

  return res;
};
