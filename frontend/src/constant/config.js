import { NativeModules, Platform } from "react-native";

const API_PORT = 3000;

function buildBaseUrl(host, port = API_PORT) {
  if (!host) return "";
  const trimmedHost = String(host).trim();
  if (!trimmedHost) return "";

  const hasProtocol = /^https?:\/\//i.test(trimmedHost);
  const base = hasProtocol ? trimmedHost : `http://${trimmedHost}`;

  try {
    const url = new URL(base);
    if (port && !url.port) {
      url.port = String(port);
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return base.replace(/\/$/, "");
  }
}

const emulatorHost = Platform.select({
  android: "10.0.2.2",
  ios: "localhost",
  default: "localhost"
});

function normalizeBaseUrl(value) {
  if (!value) return "";
  let trimmed = String(value).trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("https:") && !trimmed.startsWith("https://")) {
    trimmed = trimmed.replace(/^https:\/*/i, "");
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `http://${trimmed.replace(/^\/+/, "")}`;
  }
  return trimmed;
}

function getHostFromUrl(value) {
  try {
    const url = new URL(value);
    return url.hostname;
  } catch {
    return "";
  }
}

function getDevServerHost() {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (!scriptURL) return null;

  const match = scriptURL.match(/https?:\/\/([^/:]+)/);
  if (!match || !match[1]) return null;

  const host = match[1];
  if (host === "localhost" || host === "127.0.0.1") return null;
  return host;
}

const devServerHost = getDevServerHost();
const devServerFallback = devServerHost
  ? buildBaseUrl(devServerHost, API_PORT)
  : null;

const emulatorFallback = buildBaseUrl(emulatorHost, API_PORT);

const envUrl = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL);
const envHost = getHostFromUrl(envUrl);
const isEmulatorHost =
  envHost === "10.0.2.2" || envHost === "localhost" || envHost === "127.0.0.1";
const preferredEnvUrl = envUrl && !isEmulatorHost ? envUrl : "";

export const API_BASE_URL =
  preferredEnvUrl || devServerFallback || envUrl || emulatorFallback;
