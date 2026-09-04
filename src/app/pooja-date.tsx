import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const DATES = [
  { label: 'SEP 02', value: '2026-09-02' },
  { label: 'SEP 03', value: '2026-09-03' },
  { label: 'SEP 04', value: '2026-09-04' },
  { label: 'SEP 05', value: '2026-09-05' },
  { label: 'SEP 06', value: '2026-09-06' },
  { label: 'SEP 07', value: '2026-09-07' },
  { label: 'SEP 08', value: '2026-09-08' },
];

export default function PoojaDateScreen() {
  const params = useLocalSearchParams<{
    sevaName?: string;
    amount?: string;
    category?: string;
  }>();

const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Select Date
          </Text>

          <View style={styles.spacer} />
        </View>

        <View style={styles.selectedCard}>
          <Text style={styles.label}>SELECTED SEVA</Text>

          <Text style={styles.sevaName}>
            {params.sevaName || 'Seva'}
          </Text>

          <Text style={styles.category}>
            {params.category || 'Temple Seva'}
          </Text>

          <Text style={styles.amount}>
            {params.amount || '₹0'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Choose Date
        </Text>

        <Text style={styles.subtitle}>
          Select the date on which you would like to offer
          your seva.
        </Text>

        <View style={styles.dateGrid}>
          {DATES.map((date) => {
  const active = selectedDate === date.value;

  return (
    <TouchableOpacity
      key={date.value}
      style={[
        styles.dateCard,
        active && styles.dateCardActive,
      ]}
      onPress={() => setSelectedDate(date.value)}
    >
      <Text
        style={[
          styles.dateText,
          active && styles.dateTextActive,
        ]}
      >
        {date.label}
      </Text>
    </TouchableOpacity>
  );
})}
        </View>

        <TouchableOpacity
          disabled={!selectedDate}
          style={[
            styles.continueButton,
            !selectedDate && styles.disabledButton,
          ]}
          onPress={() =>
            router.push({
              pathname: '/pooja-devotee',
              params: {
                sevaName: params.sevaName || '',
                amount: params.amount || '',
                category: params.category || '',
                date: selectedDate || '',
              },
            })
          }
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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

  selectedCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },

  label: {
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
    marginTop: 5,
  },

  amount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B66A2C',
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
    marginBottom: 18,
  },

  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  dateCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9DED3',
  },

  dateCardActive: {
    backgroundColor: '#B66A2C',
    borderColor: '#B66A2C',
  },

  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6D5140',
  },

  dateTextActive: {
    color: '#FFFFFF',
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

  disabledButton: {
    backgroundColor: '#D5C9BD',
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
});