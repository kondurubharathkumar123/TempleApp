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

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.label}>DEVOTEE</Text>

        <Text style={styles.title}>My Account</Text>

        <Text style={styles.subtitle}>
          Manage your devotee profile and temple activities.
        </Text>

        {/* Profile */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🙏</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>Devotee</Text>

            <Text style={styles.email}>
              Login to manage your account
            </Text>
          </View>
        </View>

        {/* Account options */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.card}>
          <AccountItem
            icon="👤"
            title="Profile Details"
            description="View and update your personal information"
          />

          <AccountItem
            icon="📋"
            title="My Bookings"
            description="View your room and seva bookings"
            onPress={() => router.push('/bookings')}
          />

          <AccountItem
            icon="🙏"
            title="My Seva History"
            description="View your previous seva bookings"
          />

          <AccountItem
            icon="❤️"
            title="Saved Preferences"
            description="Manage your temple preferences"
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>
          Support
        </Text>

        <View style={styles.card}>
          <AccountItem
            icon="📞"
            title="Contact Temple"
            description="Get in touch with the temple"
          />

          <AccountItem
            icon="🔒"
            title="Privacy & Security"
            description="Manage privacy and security settings"
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🙏</Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Your Spiritual Journey
            </Text>

            <Text style={styles.infoText}>
              Your profile, bookings and devotional
              activities will be connected after the
              backend and authentication system are added.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function AccountItem({
  icon,
  title,
  description,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.itemIcon}>
        <Text style={styles.itemIconText}>{icon}</Text>
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>

        <Text style={styles.itemDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
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
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
  },

  profileCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 27,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  email: {
    fontSize: 10,
    color: '#777',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    elevation: 2,
    marginBottom: 23,
  },

  item: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE3D8',
  },

  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  itemIconText: {
    fontSize: 20,
  },

  itemContent: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 3,
  },

  itemDescription: {
    fontSize: 9,
    lineHeight: 14,
    color: '#777',
  },

  arrow: {
    fontSize: 22,
    color: '#B66A2C',
    marginLeft: 8,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    marginBottom: 20,
  },

  infoIcon: {
    fontSize: 27,
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
  },

  homeButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});