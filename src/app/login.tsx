import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { apiRequest } from '@/services/api';
import { saveToken } from '@/services/authStorage';
import { registerForPushNotificationsAsync } from '@/services/notifications';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // =========================
  // REAL LOGIN
  // =========================

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        'Login Required',
        'Please enter your email and password.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          email: email.trim(),
          password,
        },
      });

      if (response.success && response.data?.token) {
        // Save JWT first
        await saveToken(response.data.token);

        // Register this device for push notifications
        await registerForPushNotificationsAsync();

        // Go to home
        router.replace('/(tabs)');

        return;
      }

      Alert.alert(
        'Login Failed',
        response.message || 'Unable to login.'
      );
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error?.message ||
          'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN REGISTER SCREEN
  // =========================

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TEMPLE</Text>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to manage your bookings and temple activities.
      </Text>

      {/* =========================
          EMAIL
      ========================= */}

      <Text style={styles.inputLabel}>
        Email
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
      />

      {/* =========================
          PASSWORD
      ========================= */}

      <Text style={styles.inputLabel}>
        Password
      </Text>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="#999"
        secureTextEntry
        autoCapitalize="none"
      />

      {/* =========================
          LOGIN BUTTON
      ========================= */}

      <TouchableOpacity
        style={[
          styles.loginButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading
            ? 'Logging in...'
            : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* =========================
          REGISTER BUTTON
      ========================= */}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerButtonText}>
          Create Account
        </Text>
      </TouchableOpacity>

      {/* =========================
          BACK
      ========================= */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    padding: 24,
    justifyContent: 'center',
  },

  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#B66A2C',
    marginBottom: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#777',
    marginTop: 6,
    marginBottom: 30,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 13,
    color: '#333',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EEE3D8',
  },

  loginButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  registerButton: {
    height: 45,
    borderRadius: 15,
    backgroundColor: '#F4E0C5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  registerButtonText: {
    color: '#8B4513',
    fontSize: 13,
    fontWeight: '700',
  },

  backButton: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  backButtonText: {
    color: '#B66A2C',
    fontSize: 13,
    fontWeight: '600',
  },
});