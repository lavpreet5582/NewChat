export const getAccessToken = () => localStorage.getItem("access");

export const refreshToken = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const res = await fetch(`${backendUrl}/api/token/refresh/`, {
    method: "POST",
    credentials: "include", // ✅ Send cookies including HttpOnly refresh token
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("access", data.access); // Only access token is returned
    return data.access;
  } else {
    localStorage.clear();
    window.location.href = "/"; // force logout
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
