import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ADMIN_PAYMENT_DEFAULTS_KEY = "admin_payment_defaults";
const memoryStore = new Map();

const DEFAULT_VALUES = {
  taxPercent: "0",
  offerType: "fixed",
  offerValue: "0"
};

function getWebStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch (_) {
    return null;
  }
}

function isNativeModuleNull(error) {
  return String(error?.message || "").toLowerCase().includes("native module is null");
}

function normalizeDefaults(raw) {
  const safe = raw && typeof raw === "object" ? raw : {};
  const nextOfferType = String(safe.offerType || "fixed").toLowerCase() === "percent"
    ? "percent"
    : "fixed";
  return {
    taxPercent: String(safe.taxPercent ?? DEFAULT_VALUES.taxPercent),
    offerType: nextOfferType,
    offerValue: String(safe.offerValue ?? DEFAULT_VALUES.offerValue)
  };
}

async function readFromNative() {
  if (typeof AsyncStorage?.getItem !== "function") return null;
  try {
    return await AsyncStorage.getItem(ADMIN_PAYMENT_DEFAULTS_KEY);
  } catch (error) {
    if (isNativeModuleNull(error)) return null;
    throw error;
  }
}

async function writeToNative(value) {
  if (typeof AsyncStorage?.setItem !== "function") return;
  try {
    await AsyncStorage.setItem(ADMIN_PAYMENT_DEFAULTS_KEY, value);
  } catch (error) {
    if (!isNativeModuleNull(error)) {
      throw error;
    }
  }
}

export async function loadAdminPaymentDefaults() {
  if (Platform.OS === "web") {
    const storage = getWebStorage();
    const rawValue = storage
      ? storage.getItem(ADMIN_PAYMENT_DEFAULTS_KEY)
      : memoryStore.get(ADMIN_PAYMENT_DEFAULTS_KEY) || null;
    if (!rawValue) return { ...DEFAULT_VALUES };
    try {
      return normalizeDefaults(JSON.parse(rawValue));
    } catch (_) {
      return { ...DEFAULT_VALUES };
    }
  }

  const nativeValue = await readFromNative();
  const fallbackValue =
    (nativeValue ?? memoryStore.get(ADMIN_PAYMENT_DEFAULTS_KEY)) || null;
  if (!fallbackValue) return { ...DEFAULT_VALUES };
  try {
    return normalizeDefaults(JSON.parse(fallbackValue));
  } catch (_) {
    return { ...DEFAULT_VALUES };
  }
}

export async function saveAdminPaymentDefaults(defaults) {
  const normalized = normalizeDefaults(defaults);
  const serialized = JSON.stringify(normalized);
  memoryStore.set(ADMIN_PAYMENT_DEFAULTS_KEY, serialized);

  if (Platform.OS === "web") {
    const storage = getWebStorage();
    if (storage) storage.setItem(ADMIN_PAYMENT_DEFAULTS_KEY, serialized);
    return normalized;
  }

  await writeToNative(serialized);
  return normalized;
}
