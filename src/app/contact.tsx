import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const phoneNumber = 'tel:+919999999999';
  const whatsappNumber = 'https://wa.me/919999999999';
  const email = 'mailto:info@temple.com';

  const openPhone = () => {
    Linking.openURL(phoneNumber);
  };

  const openWhatsApp = () => {
    Linking.openURL(whatsappNumber);
  };

  const openEmail = () => {
    Linking.openURL(email);
  };

  const openMaps = () => {
    Linking.openURL(
      'https://www.google.com/maps/search/?api=1&query=Temple'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.label}>GET IN TOUCH</Text>

        <Text style={styles.title}>Contact Temple</Text>

        <Text style={styles.subtitle}>
          We are here to help devotees with temple
          services and information.
        </Text>

        {/* Contact Options */}
        <Text style={styles.sectionTitle}>
          Contact Us
        </Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={openPhone}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>📞</Text>
            </View>

            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>
                Phone
              </Text>

              <Text style={styles.contactValue}>
                +91 99999 99999
              </Text>

              <Text style={styles.contactHint}>
                Tap to call the temple
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={openWhatsApp}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>💬</Text>
            </View>

            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>
                WhatsApp
              </Text>

              <Text style={styles.contactValue}>
                Chat with Temple
              </Text>

              <Text style={styles.contactHint}>
                Contact us through WhatsApp
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={openEmail}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>✉️</Text>
            </View>

            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>
                Email
              </Text>

              <Text style={styles.contactValue}>
                info@temple.com
              </Text>

              <Text style={styles.contactHint}>
                Send us an email
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Address */}
        <Text style={styles.sectionTitle}>
          Temple Address
        </Text>

        <View style={styles.addressCard}>
          <View style={styles.addressIcon}>
            <Text style={styles.addressEmoji}>📍</Text>
          </View>

          <View style={styles.addressContent}>
            <Text style={styles.addressTitle}>
              Temple Address
            </Text>

            <Text style={styles.addressText}>
              Temple Road,{'\n'}
              Temple Town,{'\n'}
              Karnataka, India
            </Text>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>
          Temple Location
        </Text>

        <View style={styles.mapCard}>
          <Text style={styles.mapEmoji}>🗺️</Text>

          <Text style={styles.mapTitle}>
            Find Us on Google Maps
          </Text>

          <Text style={styles.mapText}>
            Open the temple location and get directions
            from your current location.
          </Text>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={openMaps}
          >
            <Text style={styles.mapButtonText}>
              Open Google Maps
            </Text>
          </TouchableOpacity>
        </View>

        {/* Office Hours */}
        <Text style={styles.sectionTitle}>
          Temple Office
        </Text>

        <View style={styles.hoursCard}>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursLabel}>
              Monday – Saturday
            </Text>

            <Text style={styles.hoursValue}>
              9:00 AM – 6:00 PM
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.hoursRow}>
            <Text style={styles.hoursLabel}>
              Sunday
            </Text>

            <Text style={styles.hoursValue}>
              9:00 AM – 1:00 PM
            </Text>
          </View>
        </View>

        {/* Back */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>
            Back to Home
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Contact details, address and timings can be
          updated from the admin dashboard after the
          backend is connected.
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
    marginTop: 5,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 15,
    elevation: 2,
    marginBottom: 22,
  },

  contactItem: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE3D8',
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#F8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 21,
  },

  contactContent: {
    flex: 1,
  },

  contactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 3,
  },

  contactValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B4D20',
    marginBottom: 2,
  },

  contactHint: {
    fontSize: 9,
    color: '#999',
  },

  arrow: {
    fontSize: 23,
    color: '#B66A2C',
    marginLeft: 8,
  },

  addressCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  addressIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  addressEmoji: {
    fontSize: 24,
  },

  addressContent: {
    flex: 1,
  },

  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  addressText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#777',
  },

  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 22,
  },

  mapEmoji: {
    fontSize: 40,
    marginBottom: 9,
  },

  mapTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
    textAlign: 'center',
  },

  mapText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
    textAlign: 'center',
    marginBottom: 15,
  },

  mapButton: {
    backgroundColor: '#B66A2C',
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },

  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  hoursCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    elevation: 2,
    marginBottom: 22,
  },

  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  hoursLabel: {
    fontSize: 11,
    color: '#777',
  },

  hoursValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A2C18',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEE3D8',
    marginVertical: 13,
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