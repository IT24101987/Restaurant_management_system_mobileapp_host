import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen({
  authMode,
  setAuthMode,
  loginScope,
  setLoginScope,
  authTitle,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  dateOfBirth,
  setDateOfBirth,
  hometown,
  setHometown,
  telephoneNumber,
  setTelephoneNumber,
  nicNumber,
  setNicNumber,
  gender,
  setGender,
  address,
  setAddress,
  keepLetters,
  normalizeNic,
  handleLogin,
  handleRegister,
  authBusy,
  error,
  info,
  API_BASE_URL,
  styles,
  accentColor,
  primaryTextColor
}) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
          }}
          style={styles.background}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.backgroundOverlay} />
          <ScrollView contentContainerStyle={styles.authContainer}>
            <Text style={styles.brand}>THE GOLDEN FORK</Text>
            <Text style={styles.heroTitle}>Restaurant Mobile</Text>
            <Text style={styles.heroSubtitle}>{authTitle}</Text>
            {authMode === "login" && loginScope === "admin" ? (
              <Text style={styles.authBadge}>Admin / Staff Login</Text>
            ) : null}

            <View style={styles.authCard}>
              <View style={styles.switchRow}>
              <TouchableOpacity
                style={[styles.switchButton, authMode === "login" && styles.switchActive]}
                onPress={() => setAuthMode("login")}
              >
                <Text style={styles.switchText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switchButton, authMode === "register" && styles.switchActive]}
                onPress={() => {
                  setAuthMode("register");
                  setLoginScope("customer");
                }}
              >
                <Text style={styles.switchText}>Register</Text>
              </TouchableOpacity>
              </View>

            {authMode === "register" && (
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.half]}
                  placeholder="First name"
                  placeholderTextColor="#8F98A8"
                  value={firstName}
                  onChangeText={(value) => setFirstName(keepLetters(value))}
                  autoCapitalize="words"
                  maxLength={20}
                />
                <TextInput
                  style={[styles.input, styles.half]}
                  placeholder="Last name"
                  placeholderTextColor="#8F98A8"
                  value={lastName}
                  onChangeText={(value) => setLastName(keepLetters(value))}
                  autoCapitalize="words"
                  maxLength={20}
                />
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8F98A8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8F98A8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {authMode === "register" && (
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#8F98A8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            )}

            {authMode === "register" && (
              <>
                <Text style={styles.sectionLabel}>Additional Details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  placeholderTextColor="#8F98A8"
                  value={dateOfBirth}
                  onChangeText={(value) =>
                    setDateOfBirth(String(value || "").replace(/[^0-9-]/g, "").slice(0, 10))
                  }
                  maxLength={10}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Hometown"
                  placeholderTextColor="#8F98A8"
                  value={hometown}
                  onChangeText={(value) => setHometown(keepLetters(value))}
                  maxLength={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telephone number"
                  placeholderTextColor="#8F98A8"
                  value={telephoneNumber}
                  onChangeText={(value) =>
                    setTelephoneNumber(String(value || "").replace(/[^0-9]/g, "").slice(0, 10))
                  }
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                <TextInput
                  style={styles.input}
                  placeholder="NIC number"
                  placeholderTextColor="#8F98A8"
                  value={nicNumber}
                  onChangeText={(value) => setNicNumber(normalizeNic(value))}
                  autoCapitalize="characters"
                  maxLength={12}
                />
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "male" && styles.genderButtonActive
                    ]}
                    onPress={() => setGender("male")}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === "male" && styles.genderTextActive
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "female" && styles.genderButtonActive
                    ]}
                    onPress={() => setGender("female")}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === "female" && styles.genderTextActive
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  placeholder="Address"
                  placeholderTextColor="#8F98A8"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {info ? <Text style={styles.info}>{info}</Text> : null}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={authMode === "login" ? handleLogin : handleRegister}
              disabled={authBusy}
            >
              {authBusy ? (
                <ActivityIndicator color={primaryTextColor || "#0A0A0A"} />
              ) : (
                <Text style={styles.primaryText}>
                  {authMode === "login" ? "Login" : "Create account"}
                </Text>
              )}
            </TouchableOpacity>
              {authMode === "login" ? (
                <View style={styles.authLinkRow}>
                  <Text style={styles.authLinkLabel}>
                    {loginScope === "admin" ? "Customer login?" : "Admin or staff?"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setLoginScope((current) => (current === "admin" ? "customer" : "admin"));
                    }}
                  >
                    <Text style={styles.link}>
                      {loginScope === "admin" ? "Back to customer" : "Admin Login"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <View style={styles.helperBlock}>
              <Text style={styles.helperLabel}>API</Text>
              <Text style={styles.helperText}>{API_BASE_URL}</Text>
              <Text style={styles.helperText}>Set EXPO_PUBLIC_API_URL to your live server.</Text>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


