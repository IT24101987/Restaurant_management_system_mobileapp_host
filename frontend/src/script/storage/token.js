import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const memoryStore = new Map();

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

async function readFromNative() {
  if (typeof AsyncStorage?.getItem !== "function") {
    return null;
  }
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    if (isNativeModuleNull(error)) {
      return null;
    }
    throw error;
  }
}

async function writeToNative(token) {
  if (typeof AsyncStorage?.setItem !== "function") {
    return;
  }
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    if (!isNativeModuleNull(error)) {
      throw error;
    }
  }
}

async function removeFromNative() {
  if (typeof AsyncStorage?.removeItem !== "function") {
    return;
  }
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    if (!isNativeModuleNull(error)) {
      throw error;
    }
  }
}

export async function loadToken() {
  if (Platform.OS === "web") {
    const storage = getWebStorage();
    return storage ? storage.getItem(TOKEN_KEY) : memoryStore.get(TOKEN_KEY) || null;
  }
  const nativeToken = await readFromNative();
  if (nativeToken !== null && nativeToken !== undefined) {
    return nativeToken;
  }
  return memoryStore.get(TOKEN_KEY) || null;
}

export async function saveToken(token) {
  memoryStore.set(TOKEN_KEY, token);
  if (Platform.OS === "web") {
    const storage = getWebStorage();
    if (storage) storage.setItem(TOKEN_KEY, token);
    return;
  }
  await writeToNative(token);
}

export async function clearToken() {
  memoryStore.delete(TOKEN_KEY);
  if (Platform.OS === "web") {
    const storage = getWebStorage();
    if (storage) storage.removeItem(TOKEN_KEY);
    return;
  }
  await removeFromNative();
}
