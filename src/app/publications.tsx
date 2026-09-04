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

const publications = [
  {
    title: 'Magazines',
    icon: '📰',
    description:
      'Read temple magazines, spiritual articles and monthly publications.',
  },
  {
    title: 'Books',
    icon: '📚',
    description:
      'Explore spiritual books, temple literature and devotional publications.',
  },
  {
    title: 'News & Updates',
    icon: '📢',
    description:
      'Read the latest temple announcements, news and important updates.',
  },
  {
    title: 'eBooks & Downloads',
    icon: '📖',
    description:
      'Access available digital books, PDFs and devotional reading material.',
  },
];

export default function PublicationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.smallTitle}>TEMPLE RESOURCES</Text>

        <Text style={styles.title}>Publications 📚</Text>

        <Text style={styles.subtitle}>
          Explore books, magazines, news and devotional reading material.
        </Text>

        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>📖</Text>

          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>
              Spiritual Knowledge
            </Text>

            <Text style={styles.bannerText}>
              Discover publications and devotional resources
              from the temple.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Explore Publications
        </Text>

        <View style={styles.cardContainer}>
          {publications.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.card}
              activeOpacity={0.8}
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.arrow}>›</Text>
                </View>

                <Text style={styles.cardText}>
                  {item.description}
                </Text>

                <Text style={styles.viewText}>
                  Explore ›
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🙏</Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Devotional Reading
            </Text>

            <Text style={styles.infoText}>
              Books, magazines and downloadable publications
              will be connected through the admin system later.
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  smallTitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#B66A2C',
    marginBottom: 4,
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

  banner: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  bannerIcon: {
    fontSize: 32,
    marginRight: 14,
  },

  bannerContent: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  bannerText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  cardContainer: {
    gap: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    elevation: 2,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  icon: {
    fontSize: 26,
  },

  cardContent: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
  },

  arrow: {
    fontSize: 22,
    color: '#B66A2C',
  },

  cardText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
    marginTop: 5,
  },

  viewText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B66A2C',
    marginTop: 8,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    elevation: 2,
  },

  infoIcon: {
    fontSize: 27,
    marginRight: 13,
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
    marginTop: 22,
  },

  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});