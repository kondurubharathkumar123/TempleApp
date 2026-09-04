import React, { useState } from 'react';
import { Alert } from 'react-native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

export default function PoojaDevoteeScreen() {
  const params = useLocalSearchParams<{
    sevaName?: string;
    amount?: string;
    category?: string;
    date?: string;
  }>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const continueBooking = () => {
  if (!name.trim()) {
    Alert.alert('Required', 'Please enter your full name.');
    return;
  }

  if (!phone.trim()) {
    Alert.alert('Required', 'Please enter your mobile number.');
    return;
  }

  if (phone.replace(/\D/g, '').length < 10) {
    Alert.alert('Invalid Mobile', 'Please enter a valid mobile number.');
    return;
  }

  if (!email.trim()) {
    Alert.alert('Required', 'Please enter your email address.');
    return;
  }

  
    router.push({
      pathname: '/pooja-payment',
      params: {
        sevaName: params.sevaName || '',
        amount: params.amount || '',
        category: params.category || '',
        date: params.date || '',
        name,
        phone,
        email,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Devotee Details
          </Text>

          <View style={styles.spacer} />
        </View>

        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            YOUR SEVA
          </Text>

          <Text style={styles.sevaName}>
            {params.sevaName || 'Seva'}
          </Text>

          <Text style={styles.category}>
            {params.category || 'Temple Seva'}
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.dateLabel}>
              Date
            </Text>

            <Text style={styles.dateValue}>
              {params.date || 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.dateLabel}>
              Amount
            </Text>

            <Text style={styles.amount}>
              {params.amount || '₹0'}
            </Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>
            Booking Process
          </Text>

          <View style={styles.stepsRow}>
            <Step number="1" title="Seva" />
            <Step number="2" title="Date" />
            <Step number="3" title="Details" active />
            <Step number="4" title="Payment" />
          </View>
        </View>

        {/* Form */}
        <Text style={styles.sectionTitle}>
          Devotee Information
        </Text>

        <Text style={styles.sectionSubtitle}>
          Enter the details required for your seva booking.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>
            Full Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#A49A91"
            style={styles.input}
          />

          <Text style={styles.inputLabel}>
            Mobile Number
          </Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter mobile number"
            placeholderTextColor="#A49A91"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.inputLabel}>
            Email Address
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor="#A49A91"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Continue */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={continueBooking}
        >
          <Text style={styles.continueText}>
            Continue to Payment
          </Text>

          <Text style={styles.arrow}>
            →
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Your information will be used for the seva booking
          and confirmation.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({
  number,
  title,
  active = false,
}: {
  number: string;
  title: string;
  active?: boolean;
}) {
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepCircle,
          active && styles.stepCircleActive,
        ]}
      >
        <Text
          style={[
            styles.stepNumber,
            active && styles.stepNumberActive,
          ]}
        >
          {number}
        </Text>
      </View>

      <Text
        style={[
          styles.stepTitle,
          active && styles.stepTitleActive,
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  backIcon: {
    fontSize: 31,
    color: '#4A2C18',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
  },

  spacer: {
    width: 40,
  },

  summaryCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  summaryLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#A66A3D',
    marginBottom: 6,
  },

  sevaName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
  },

  category: {
    fontSize: 12,
    color: '#6D5140',
    marginTop: 4,
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },

  dateLabel: {
    fontSize: 12,
    color: '#777',
  },

  dateValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A2C18',
  },

  amount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B66A2C',
  },

  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 24,
    elevation: 2,
  },

  stepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 15,
  },

  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  step: {
    alignItems: 'center',
    flex: 1,
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0E8DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  stepCircleActive: {
    backgroundColor: '#B66A2C',
  },

  stepNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A7B70',
  },

  stepNumberActive: {
    color: '#FFFFFF',
  },

  stepTitle: {
    fontSize: 9,
    color: '#999',
  },

  stepTitleActive: {
    color: '#B66A2C',
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
    marginBottom: 18,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A2C18',
    marginBottom: 7,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5D9CE',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#4A2C18',
    marginBottom: 17,
    backgroundColor: '#FFFCF8',
  },

  continueButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
  },

  note: {
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    lineHeight: 16,
    marginTop: 13,
    paddingHorizontal: 10,
  },
});