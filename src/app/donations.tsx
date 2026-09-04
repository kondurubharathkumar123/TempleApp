import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DonationsScreen() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState('');

  const amounts = [100, 500, 1000, 2500, 5000, 10000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>Support Our Temple</Text>

            <Text style={styles.title}>Donations 🙏</Text>

            <Text style={styles.subtitle}>
              Your contribution helps us serve devotees and maintain our temple.
            </Text>
          </View>

          <View style={styles.iconButton}>
            <Text style={styles.icon}>💰</Text>
          </View>
        </View>

        {/* Donation Banner */}
        <View style={styles.banner}>
          <Text style={styles.om}>ॐ</Text>

          <Text style={styles.bannerTitle}>
            Give with Devotion
          </Text>

          <Text style={styles.bannerText}>
            Every contribution makes a meaningful difference in our temple
            community.
          </Text>
        </View>

        {/* Select Amount */}
        <Text style={styles.sectionTitle}>Select Donation Amount</Text>

        <View style={styles.amountGrid}>
          {amounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.amountCard,
                selectedAmount === amount && styles.amountCardSelected,
              ]}
              onPress={() => handleAmountSelect(amount)}
            >
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === amount && styles.amountTextSelected,
                ]}
              >
                ₹{amount.toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount */}
        <Text style={styles.sectionTitle}>Custom Amount</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.rupee}>₹</Text>

          <TextInput
            value={customAmount}
            onChangeText={(value) => {
              setCustomAmount(value);
              setSelectedAmount(null);
            }}
            placeholder="Enter amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Donation Purpose */}
        <Text style={styles.sectionTitle}>Donation Purpose</Text>

        <View style={styles.purposeCard}>
          <TouchableOpacity style={styles.purposeRow}>
            <View style={styles.purposeIconBox}>
              <Text style={styles.purposeIcon}>🛕</Text>
            </View>

            <View style={styles.purposeContent}>
              <Text style={styles.purposeTitle}>Temple Maintenance</Text>
              <Text style={styles.purposeText}>
                Support the upkeep and maintenance of the temple.
              </Text>
            </View>

            <Text style={styles.radioSelected}>●</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.purposeRow}>
            <View style={styles.purposeIconBox}>
              <Text style={styles.purposeIcon}>🍚</Text>
            </View>

            <View style={styles.purposeContent}>
              <Text style={styles.purposeTitle}>Annadanam</Text>
              <Text style={styles.purposeText}>
                Help provide food to devotees and visitors.
              </Text>
            </View>

            <Text style={styles.radio}>○</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.purposeRow}>
            <View style={styles.purposeIconBox}>
              <Text style={styles.purposeIcon}>🙏</Text>
            </View>

            <View style={styles.purposeContent}>
              <Text style={styles.purposeTitle}>General Donation</Text>
              <Text style={styles.purposeText}>
                Contribute towards the temple's general activities.
              </Text>
            </View>

            <Text style={styles.radio}>○</Text>
          </TouchableOpacity>
        </View>

        {/* Donation Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Donation Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>

            <Text style={styles.summaryValue}>
              ₹
              {customAmount
                ? Number(customAmount || 0).toLocaleString('en-IN')
                : (selectedAmount || 0).toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Purpose</Text>

            <Text style={styles.summaryValue}>Temple Maintenance</Text>
          </View>

          <TouchableOpacity style={styles.donateButton}>
            <Text style={styles.donateButtonText}>
              Proceed to Donate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          🔒 Your donation is processed securely.
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
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
    maxWidth: 245,
    lineHeight: 17,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  icon: {
    fontSize: 21,
  },

  banner: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  om: {
    fontSize: 32,
    color: '#FFD99A',
    marginBottom: 6,
  },

  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  bannerText: {
    fontSize: 12,
    color: '#F8E7D4',
    lineHeight: 18,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 11,
    marginTop: 5,
  },

  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  amountCard: {
    width: '31.5%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0E5D8',
  },

  amountCardSelected: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },

  amountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2C18',
  },

  amountTextSelected: {
    color: '#FFFFFF',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F0E5D8',
  },

  rupee: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#4A2C18',
  },

  purposeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    marginBottom: 20,
    elevation: 1,
  },

  purposeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  purposeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F7E4C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  purposeIcon: {
    fontSize: 20,
  },

  purposeContent: {
    flex: 1,
  },

  purposeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 3,
  },

  purposeText: {
    fontSize: 10,
    color: '#999',
    lineHeight: 15,
  },

  radioSelected: {
    fontSize: 20,
    color: '#8B4513',
    marginLeft: 8,
  },

  radio: {
    fontSize: 20,
    color: '#BBB',
    marginLeft: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#F0E9E0',
  },

  summaryCard: {
    backgroundColor: '#F4E0C5',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  summaryLabel: {
    fontSize: 12,
    color: '#806B58',
  },

  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A2C18',
    maxWidth: 150,
    textAlign: 'right',
  },

  donateButton: {
    backgroundColor: '#8B4513',
    borderRadius: 22,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },

  donateButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  note: {
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
});