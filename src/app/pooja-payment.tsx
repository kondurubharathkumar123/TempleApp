import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { apiRequest } from '@/services/api';

export default function PoojaPaymentScreen() {
  const params = useLocalSearchParams<{
    sevaName?: string;
    amount?: string;
    category?: string;
    date?: string;
    name?: string;
    phone?: string;
    email?: string;
  }>();

  const [loading, setLoading] = useState(false);

  const amount = params.amount || '₹0';

  /*
   * Convert amount such as:
   * ₹500
   * ₹ 500
   * 500
   * ₹1,500
   *
   * into a numeric value for the backend.
   */
  const getAmountValue = () => {
    const cleanedAmount = amount
      .replace(/₹/g, '')
      .replace(/,/g, '')
      .trim();

    const numericAmount = Number(cleanedAmount);

    return Number.isFinite(numericAmount) ? numericAmount : 0;
  };
 const getServiceType = () => {
  const seva = (params.sevaName || '').trim().toLowerCase();

  if (seva.includes('darshan')) {
    return 'Darshan';
  }

  return 'Pooja';
};

  /*
   * Backend only accepts:
   *
   * Darshan
   * Pooja
   *
   * The actual seva name can still be:
   * Narasimha Special Pooja
   * Special Darshan
   * etc.
   */
 

  const createBooking = async () => {
    if (loading) {
      return;
    }

    /*
     * Basic validation
     */
    if (!params.sevaName) {
      Alert.alert(
        'Booking Error',
        'Seva information is missing.'
      );
      return;
    }

    if (!params.date) {
      Alert.alert(
        'Booking Error',
        'Please select a booking date.'
      );
      return;
    }

    if (!params.name) {
      Alert.alert(
        'Booking Error',
        'Devotee name is missing.'
      );
      return;
    }

    const totalAmount = getAmountValue();

    if (totalAmount <= 0) {
      Alert.alert(
        'Booking Error',
        'Invalid booking amount.'
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Create the seva/service booking.
       *
       * IMPORTANT:
       * service_type must be "Darshan" or "Pooja"
       * according to the backend validation.
       */
      const result = await apiRequest('/service-bookings', {
        method: 'POST',
        body: {
          service_type: getServiceType(),
          booking_date: params.date,
          booking_time: '10:00:00',
          number_of_devotees: 1,
          total_amount: totalAmount,
          special_requests: '',
        },
      });

      /*
       * Backend may return:
       *
       * {
       *   booking_id: "SEVA-2026-00001",
       *   ...
       * }
       *
       * or:
       *
       * {
       *   data: {
       *     booking_id: "SEVA-2026-00001"
       *   }
       * }
       */

      const bookingId =
        result?.booking_id ||
        result?.data?.booking_id ||
        result?.booking?.booking_id;

      if (!bookingId) {
        
        console.error(
          'Service booking response:',
          result
        );

        throw new Error(
          result?.message ||
            'Booking was created but Booking ID was not returned.'
        );
      }
// Complete test payment
const paymentResult = await apiRequest(
  `/service-bookings/${encodeURIComponent(
    String(bookingId)
  )}/pay`,
  {
    method: 'POST',
  }
);

if (!paymentResult?.success) {
  throw new Error(
    paymentResult?.message ||
      'Payment could not be completed.'
  );
}
      /*
       * Go to the real booking confirmation page.
       */
      router.replace({
        pathname: '/booking-confirmation',
        params: {
          bookingId: String(bookingId),
          bookingType: 'service',
        },
      });
    } catch (error: any) {
      console.error(
        'Service booking creation error:',
        error
      );

      Alert.alert(
        'Booking Failed',
        error?.message ||
          'Unable to complete your seva booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
            onPress={() => {
              if (!loading) {
                router.back();
              }
            }}
            disabled={loading}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Payment
          </Text>

          <View style={styles.spacer} />
        </View>

        {/* Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>
            Booking Process
          </Text>

          <View style={styles.stepsRow}>
            <Step
              number="1"
              title="Seva"
            />

            <Step
              number="2"
              title="Date"
            />

            <Step
              number="3"
              title="Details"
            />

            <Step
              number="4"
              title="Payment"
              active
            />
          </View>
        </View>

        {/* Payment Summary */}
        <Text style={styles.sectionTitle}>
          Booking Summary
        </Text>

        <View style={styles.summaryCard}>
          <Row
            label="Seva"
            value={params.sevaName || 'Seva'}
          />

          <Row
            label="Category"
            value={
              params.category ||
              'Temple Seva'
            }
          />

          <Row
            label="Date"
            value={
              params.date ||
              'Not selected'
            }
          />

          <Row
            label="Devotee"
            value={
              params.name ||
              'Devotee'
            }
          />

          {params.phone ? (
            <Row
              label="Mobile"
              value={params.phone}
            />
          ) : null}

          {params.email ? (
            <Row
              label="Email"
              value={params.email}
            />
          ) : null}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total Amount
            </Text>

            <Text style={styles.totalAmount}>
              {amount}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>
          Payment Method
        </Text>

        <View style={styles.paymentCard}>
          <PaymentOption
            icon="📱"
            title="UPI"
            description="Pay using UPI apps"
            selected
          />

          <PaymentOption
            icon="💳"
            title="Card"
            description="Credit or debit card"
          />

          <PaymentOption
            icon="👛"
            title="Wallet"
            description="Pay using supported wallets"
          />
        </View>

        {/* Continue / Payment */}
        <TouchableOpacity
          style={[
            styles.payButton,
            loading && styles.payButtonDisabled,
          ]}
          onPress={createBooking}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.payText}>
            {loading
              ? 'Processing Booking...'
              : 'Proceed to Payment'}
          </Text>

          {!loading && (
            <Text style={styles.arrow}>
              →
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          Your booking will be securely created
          and a booking confirmation will be
          generated after successful processing.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>
        {label}
      </Text>

      <Text style={styles.rowValue}>
        {value}
      </Text>
    </View>
  );
}

/* =========================================================
   PAYMENT OPTION
========================================================= */

function PaymentOption({
  icon,
  title,
  description,
  selected = false,
}: {
  icon: string;
  title: string;
  description: string;
  selected?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.paymentOption}
      activeOpacity={0.8}
    >
      <View style={styles.paymentIcon}>
        <Text style={styles.paymentEmoji}>
          {icon}
        </Text>
      </View>

      <View style={styles.paymentContent}>
        <Text style={styles.paymentTitle}>
          {title}
        </Text>

        <Text style={styles.paymentDescription}>
          {description}
        </Text>
      </View>

      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      >
        {selected && (
          <View style={styles.radioInner} />
        )}
      </View>
    </TouchableOpacity>
  );
}

/* =========================================================
   BOOKING STEP
========================================================= */

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
          active &&
            styles.stepCircleActive,
        ]}
      >
        <Text
          style={[
            styles.stepNumber,
            active &&
              styles.stepNumberActive,
          ]}
        >
          {number}
        </Text>
      </View>

      <Text
        style={[
          styles.stepTitle,
          active &&
            styles.stepTitleActive,
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Header */

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
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
  },

  spacer: {
    width: 40,
  },

  /* Steps */

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

  /* Section */

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  /* Summary */

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },

  rowLabel: {
    fontSize: 12,
    color: '#777',
  },

  rowValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A2C18',
    maxWidth: '65%',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEE3D8',
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B66A2C',
  },

  /* Payment */

  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 8,
    marginBottom: 20,
    elevation: 2,
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DF',
  },

  paymentIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#F8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paymentEmoji: {
    fontSize: 21,
  },

  paymentContent: {
    flex: 1,
    marginLeft: 12,
  },

  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
  },

  paymentDescription: {
    fontSize: 10,
    color: '#888',
    marginTop: 3,
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CFC5BC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: '#B66A2C',
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#B66A2C',
  },

  /* Button */

  payButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  payButtonDisabled: {
    opacity: 0.65,
  },

  payText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
  },

  /* Note */

  note: {
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    lineHeight: 16,
    marginTop: 13,
    paddingHorizontal: 10,
  },
});