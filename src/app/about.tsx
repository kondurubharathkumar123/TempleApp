import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <Text style={styles.label}>
          ABOUT OUR TEMPLE
        </Text>

        <Text style={styles.title}>
          About Temple 🙏
        </Text>

        <Text style={styles.subtitle}>
          Temple history, mission and spiritual heritage
        </Text>

        {/* Introduction */}
        <View style={styles.heroCard}>
          <Text style={styles.om}>
            ॐ
          </Text>

          <Text style={styles.heroTitle}>
            Welcome to Our Temple
          </Text>

          <Text style={styles.heroText}>
            Our temple is a sacred place where devotees
            come together for prayer, worship, spiritual
            learning and community service.
          </Text>
        </View>

        {/* History */}
        <Text style={styles.sectionTitle}>
          Temple History
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            The temple has a rich spiritual heritage and
            continues to preserve traditional practices,
            rituals and devotional activities for generations.
          </Text>

          <Text style={styles.cardText}>
            Devotees can participate in daily worship,
            special poojas, festivals and other spiritual
            programs conducted throughout the year.
          </Text>
        </View>

        {/* Mission */}
        <Text style={styles.sectionTitle}>
          Our Mission
        </Text>

        <View style={styles.card}>
          <Text style={styles.missionItem}>
            🙏 Preserve spiritual traditions
          </Text>

          <Text style={styles.missionItem}>
            🪔 Support devotional practices
          </Text>

          <Text style={styles.missionItem}>
            🤝 Serve devotees and the community
          </Text>

          <Text style={styles.missionItem}>
            📖 Promote spiritual knowledge
          </Text>
        </View>

        {/* Temple Services */}
        <Text style={styles.sectionTitle}>
          Temple Services
        </Text>

        <View style={styles.card}>
          <ServiceRow title="Daily Pooja & Seva" />
          <ServiceRow title="Special Religious Activities" />
          <ServiceRow title="Festival Celebrations" />
          <ServiceRow title="Community Service" />
          <ServiceRow title="Spiritual Programs" />
        </View>

        {/* Bottom message */}
        <View style={styles.bottomCard}>
          <Text style={styles.bottomIcon}>
            🙏
          </Text>

          <Text style={styles.bottomText}>
            May the divine blessings be with all devotees.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function ServiceRow({ title }: { title: string }) {
  return (
    <View style={styles.serviceRow}>
      <Text style={styles.serviceIcon}>
        🪔
      </Text>

      <Text style={styles.serviceText}>
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

  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#B66A2C',
    marginBottom: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
  },

  heroCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 25,
  },

  om: {
    fontSize: 38,
    color: '#B66A2C',
    marginBottom: 8,
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 8,
    textAlign: 'center',
  },

  heroText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6F6258',
    textAlign: 'center',
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
    padding: 18,
    marginBottom: 22,
    elevation: 2,
  },

  cardText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#6F6258',
    marginBottom: 10,
  },

  missionItem: {
    fontSize: 13,
    color: '#4A2C18',
    paddingVertical: 9,
  },

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE3D8',
  },

  serviceIcon: {
    fontSize: 18,
    marginRight: 12,
  },

  serviceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A2C18',
  },

  bottomCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },

  bottomIcon: {
    fontSize: 26,
    marginBottom: 7,
  },

  bottomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A2C18',
    textAlign: 'center',
  },
});