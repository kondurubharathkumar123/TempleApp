import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PoliciesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.label}>TEMPLE INFORMATION</Text>

        <Text style={styles.title}>Policies</Text>

        <Text style={styles.subtitle}>
          Please read the temple policies before using
          booking and other services.
        </Text>

        <PolicySection
          title="Privacy Policy"
          text={`Your privacy is important to us. Personal information
provided while using temple services will be used only
for providing bookings, communications and related
temple services.

The temple will take reasonable measures to protect
devotee information. Personal information will not be
used for unrelated purposes.`}
        />

        <PolicySection
          title="Terms & Conditions"
          text={`By using this application, devotees agree to provide
accurate information while making bookings.

Temple services, seva availability, timings and other
information may be changed by the temple when required.

Devotees are responsible for checking their booking
details before completing a booking.`}
        />

        <PolicySection
          title="Refund & Cancellation Policy"
          text={`Cancellation and refund eligibility may depend on
the type of service booked.

Pooja, seva and room booking cancellation rules will be
displayed during the booking process.

Approved refunds will be processed according to the
temple's applicable refund policy.`}
        />

        <PolicySection
          title="Booking Policy"
          text={`A booking confirmation will be generated after the
booking process is successfully completed.

Devotees should keep their Booking ID or confirmation
details for future reference.

For room bookings, devotees may be required to provide
valid identification at the time of check-in.`}
        />

        <PolicySection
          title="Payment Policy"
          text={`Payments for online services will be processed through
the supported payment gateway.

The final amount will be displayed before payment is
completed.

Payment and transaction details will be associated with
the relevant booking.`}
        />

        <PolicySection
          title="Contact for Policy Queries"
          text={`For questions regarding privacy, bookings, refunds or
other policies, devotees can contact the temple through
the Contact Temple section of the application.`}
        />

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => router.push('/contact')}
        >
          <Text style={styles.contactButtonText}>
            Contact Temple
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>
            Back to Home
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Final policy wording, refund rules and legal
          information will be provided by the temple and
          can later be managed through the admin dashboard.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PolicySection({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      <Text style={styles.cardText}>{text}</Text>
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

  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: '#B66A2C',
    marginBottom: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 11,
    lineHeight: 17,
    color: '#777',
    marginTop: 5,
    marginBottom: 22,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 11,
    lineHeight: 18,
    color: '#777',
  },

  contactButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 10,
  },

  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  homeButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D5C8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    color: '#4A2C18',
    fontSize: 13,
    fontWeight: '600',
  },

  note: {
    textAlign: 'center',
    fontSize: 9,
    lineHeight: 15,
    color: '#999',
    marginTop: 13,
    paddingHorizontal: 10,
  },
});