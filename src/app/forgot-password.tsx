import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { apiRequest } from '@/services/api';

type Step = 'phone' | 'otp' | 'password';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>('phone');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = async () => {
    const cleanPhone = phone.trim();

    if (!cleanPhone) {
      Alert.alert(
        'Mobile Number Required',
        'Please enter your registered mobile number.'
      );
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest(
        '/auth/forgot-password',
        {
          method: 'POST',
          body: {
            phone: cleanPhone,
          },
        }
      );

      if (response.success) {
        Alert.alert(
          'OTP Sent',
          'An OTP has been generated for your registered mobile number.'
        );

        setStep('otp');
        return;
      }

      Alert.alert(
        'Unable to Send OTP',
        response.message ||
          'Please try again.'
      );
    } catch (error: any) {
      Alert.alert(
        'Unable to Send OTP',
        error?.message ||
          'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 6-digit OTP.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest(
        '/auth/verify-reset-otp',
        {
          method: 'POST',
          body: {
            phone: phone.trim(),
            otp: cleanOtp,
          },
        }
      );

      if (response.success) {
        setStep('password');
        return;
      }

      Alert.alert(
        'OTP Verification Failed',
        response.message ||
          'Invalid or expired OTP.'
      );
    } catch (error: any) {
      Alert.alert(
        'OTP Verification Failed',
        error?.message ||
          'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert(
        'Password Required',
        'Please enter your new password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Password Too Short',
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Passwords Do Not Match',
        'New password and confirm password must match.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest(
        '/auth/reset-password',
        {
          method: 'POST',
          body: {
            phone: phone.trim(),
            newPassword,
          },
        }
      );

      if (response.success) {
        Alert.alert(
          'Password Changed',
          'Your password has been reset successfully.',
          [
            {
              text: 'Login',
              onPress: () =>
                router.replace('/login'),
            },
          ]
        );

        return;
      }

      Alert.alert(
        'Password Reset Failed',
        response.message ||
          'Unable to reset password.'
      );
    } catch (error: any) {
      Alert.alert(
        'Password Reset Failed',
        error?.message ||
          'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SCREEN CONTENT
  // =========================

  const renderPhoneStep = () => (
    <>
      <Text style={styles.title}>
        Forgot Password
      </Text>

      <Text style={styles.subtitle}>
        Enter your registered mobile number.
        We will send you an OTP to verify your account.
      </Text>

      <Text style={styles.inputLabel}>
        Mobile Number
      </Text>

      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={(value) =>
          setPhone(
            value.replace(/[^0-9]/g, '').slice(0, 10)
          )
        }
        placeholder="Enter 10-digit mobile number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        maxLength={10}
        editable={!loading}
      />

      <TouchableOpacity
        style={[
          styles.primaryButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleSendOtp}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Sending...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderOtpStep = () => (
    <>
      <Text style={styles.title}>
        Verify OTP
      </Text>

      <Text style={styles.subtitle}>
        Enter the 6-digit OTP sent to your registered
        mobile number ending in {phone.slice(-4)}.
      </Text>

      <Text style={styles.inputLabel}>
        OTP
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.otpInput,
        ]}
        value={otp}
        onChangeText={(value) =>
          setOtp(
            value.replace(/[^0-9]/g, '').slice(0, 6)
          )
        }
        placeholder="000000"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
      />

      <TouchableOpacity
        style={[
          styles.primaryButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading
            ? 'Verifying...'
            : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryAction}
        onPress={() => {
          setOtp('');
          setStep('phone');
        }}
        disabled={loading}
      >
        <Text style={styles.secondaryActionText}>
          Change Mobile Number
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Text style={styles.title}>
        Create New Password
      </Text>

      <Text style={styles.subtitle}>
        Your mobile number has been verified.
        Create a new password for your account.
      </Text>

      <Text style={styles.inputLabel}>
        New Password
      </Text>

      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        placeholderTextColor="#999"
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
      />

      <Text style={styles.inputLabel}>
        Confirm Password
      </Text>

      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Enter password again"
        placeholderTextColor="#999"
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
      />

      <TouchableOpacity
        style={[
          styles.primaryButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading
            ? 'Resetting...'
            : 'Reset Password'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <View style={styles.content}>
        <Text style={styles.label}>
          TEMPLE
        </Text>

        {step === 'phone' &&
          renderPhoneStep()}

        {step === 'otp' &&
          renderOtpStep()}

        {step === 'password' &&
          renderPasswordStep()}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  content: {
    flex: 1,
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

  otpInput: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
  },

  primaryButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.6,
  },

  secondaryAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },

  secondaryActionText: {
    color: '#B66A2C',
    fontSize: 12,
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