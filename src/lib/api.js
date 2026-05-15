const PRODUCTION_API_BASE_URL = "https://career-center-volunteer-website-production.up.railway.app";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = (configuredBaseUrl || (import.meta.env.DEV ? "" : PRODUCTION_API_BASE_URL)).replace(/\/$/, "");
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || "15000");

function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function fetchJson(path, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildApiUrl(path), {
      ...options,
      signal: controller.signal,
    });
    const rawBody = await response.text();

    let data = {};

    if (rawBody) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        data = { error: rawBody };
      }
    }

    return { response, data };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The server took too long to respond. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
