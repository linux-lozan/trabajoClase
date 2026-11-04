const API_BASE_URL = document.querySelector('meta[name="aditech-api-url"]')?.content || "/api";

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" };
  const options = { method, headers, credentials: "include" };

  if (method !== "GET" && method !== "HEAD") {
    headers["X-CSRF-TOKEN"] = (await request("csrf-token")).token;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`, options);
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new ApiError("El servidor devolvió una respuesta que no es JSON.", response.status);
    }
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.message || Object.values(payload?.errors || {}).flat()[0] || `La API respondió con el estado ${response.status}.`,
      response.status,
      payload?.errors
    );
  }

  return payload && Object.prototype.hasOwnProperty.call(payload, "data") ? payload.data : payload;
}

window.AditechApi = Object.freeze({
  ApiError,
  getTalks: () => request("charlas"),
  getSpeakers: () => request("ponentes"),
  getRooms: () => request("salas"),
  getCurrentUser: () => request("user"),
  login: (credentials) => request("login", { method: "POST", body: credentials }),
  register: (user) => request("register", { method: "POST", body: user }),
  logout: () => request("logout", { method: "POST" }),
  getMyReservations: () => request("reservas"),
  createReservation: (talkId) => request(`charlas/${encodeURIComponent(talkId)}/reservas`, { method: "POST" }),
  cancelReservation: (reservationId) => request(`reservas/${encodeURIComponent(reservationId)}`, { method: "DELETE" }),
});
