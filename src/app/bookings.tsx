import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  const [selectedType, setSelectedType] = useState('Darshan');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>Temple Services</Text>
            <Text style={styles.title}>Bookings 🎫</Text>
            <Text style={styles.subtitle}>
              Book your temple services with ease
            </Text>
          </View>

          <View style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </View>
        </View>

        {/* Booking Type */}
        <Text style={styles.sectionTitle}>Select Service</Text>

        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'Darshan' && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType('Darshan')}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === 'Darshan' && styles.typeTextActive,
              ]}
            >
              🙏 Darshan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'Pooja' && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType('Pooja')}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === 'Pooja' && styles.typeTextActive,
              ]}
            >
              🪔 Pooja
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date */}
        <Text style={styles.sectionTitle}>Select Date</Text>

        <View style={styles.dateCard}>
          <Text style={styles.dateIcon}>📅</Text>

          <View style={styles.dateContent}>
            <Text style={styles.dateLabel}>Booking Date</Text>
            <Text style={styles.dateValue}>Select your preferred date</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </View>

        {/* Time */}
        <Text style={styles.sectionTitle}>Select Time</Text>

        <View style={styles.timeGrid}>
          <TimeSlot time="6:00 AM" />
          <TimeSlot time="7:00 AM" />
          <TimeSlot time="12:00 PM" />
          <TimeSlot time="1:00 PM" />
          <TimeSlot time="6:00 PM" />
          <TimeSlot time="7:00 PM" />
        </View>

        {/* Devotees */}
        <Text style={styles.sectionTitle}>Number of Devotees</Text>

        <View style={styles.counterCard}>
          <Text style={styles.devoteeText}>Devotees</Text>

          <View style={styles.counter}>
            <TouchableOpacity style={styles.counterButton}>
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.count}>1</Text>

            <TouchableOpacity style={styles.counterButton}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{selectedType}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Devotees</Text>
            <Text style={styles.summaryValue}>1</Text>
          </View>

          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmText}>Continue Booking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TimeSlot({ time }: { time: string }) {
  return (
    <TouchableOpacity style={styles.timeSlot}>
      <Text style={styles.timeText}>{time}</Text>
    </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },

  smallText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
  },

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  settingsIcon: {
    fontSize: 21,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
    marginTop: 5,
  },

  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  typeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E5D8',
  },

  typeButtonActive: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },

  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A2C18',
  },

  typeTextActive: {
    color: '#FFFFFF',
  },

  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
  },

  dateIcon: {
    fontSize: 25,
    marginRight: 13,
  },

  dateContent: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  dateValue: {
    fontSize: 11,
    color: '#999',
  },

  arrow: {
    fontSize: 26,
    color: '#999',
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  timeSlot: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E5D8',
  },

  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B4513',
  },

  counterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 18,
  },

  devoteeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A2C18',
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4E0C5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterButtonText: {
    fontSize: 20,
    color: '#8B4513',
    fontWeight: '600',
  },

  count: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
  },

  summaryCard: {
    backgroundColor: '#F5DFBC',
    borderRadius: 18,
    padding: 18,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  summaryLabel: {
    fontSize: 12,
    color: '#806A55',
  },

  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A2C18',
  },

  confirmButton: {
    backgroundColor: '#8B4513',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});