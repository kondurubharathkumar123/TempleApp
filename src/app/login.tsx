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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
        await saveToken(response.data.token);

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
        error?.message || 'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TEMPLE</Text>

      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Login to manage your bookings and temple activities.
      </Text>

      <Text style={styles.inputLabel}>Email</Text>

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

      <Text style={styles.inputLabel}>Password</Text>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="#999"
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[
          styles.loginButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
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