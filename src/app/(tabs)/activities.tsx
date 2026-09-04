import React, { useEffect, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { apiRequest } from '@/services/api';

type Activity = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  activity_date: string | null;
  location: string | null;
  is_active: boolean;
};

const programs = [
  {
    icon: '🕉️',
    title: 'Dharmayatra',
    description:
      'Join upcoming spiritual journeys and temple programs.',
  },
  {
    icon: '🌼',
    title: 'Special Programs',
    description:
      'Explore ongoing and upcoming spiritual programs.',
  },
];

const videos = [
  {
    icon: '🔴',
    title: 'Live Darshan',
    description:
      'Watch live darshan and experience the divine presence.',
  },
  {
    icon: '▶️',
    title: 'Temple YouTube',
    description:
      'Watch devotional videos, talks and temple programs.',
  },
];

const insights = [
  'Daily spiritual message and blessings',
  'Important temple announcements',
  'Devotional updates and messages',
];

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);

      const response = await apiRequest('/activities');

      if (response.success && Array.isArray(response.data)) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('Activities loading error:', error);
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
          <View style={styles.headerTextContainer}>
            <Text style={styles.eyebrow}>
              TEMPLE ACTIVITIES
            </Text>

            <Text style={styles.title}>
              Activities 🙏
            </Text>

            <Text style={styles.subtitle}>
              Discover our spiritual, social and community activities.
            </Text>
          </View>

          <View style={styles.omCircle}>
            <Text style={styles.om}>
              ॐ
            </Text>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introCard}>
          <Text style={styles.introIcon}>
            🕉️
          </Text>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>
              Temple Activities
            </Text>

            <Text style={styles.introText}>
              Explore the many ways our temple serves devotees,
              preserves tradition and supports the community.
            </Text>
          </View>
        </View>

        {/* Main Activities */}
        <Text style={styles.sectionTitle}>
          Temple Activities
        </Text>

        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🙏
            </Text>

            <Text style={styles.emptyTitle}>
              Loading Activities...
            </Text>

            <Text style={styles.emptyText}>
              Please wait while we load temple activities.
            </Text>
          </View>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
           <TouchableOpacity
  key={activity.id}
  style={styles.activityCard}
  activeOpacity={0.8}
  onPress={() =>
    router.push({
      pathname: '/activities/[id]',
      params: {
        id: String(activity.id),
      },
    })
  }
>
              <View style={styles.iconBox}>
                <Text style={styles.cardIcon}>
                  🛕
                </Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {activity.title}
                </Text>

                <Text style={styles.cardDescription}>
                  {activity.description ||
                    'Temple activity information.'}
                </Text>

                {activity.location ? (
                  <Text style={styles.cardDescription}>
                    📍 {activity.location}
                  </Text>
                ) : null}

                {activity.activity_date ? (
                  <Text style={styles.cardDescription}>
                    📅 {activity.activity_date}
                  </Text>
                ) : null}

                <Text style={styles.viewText}>
                  View Details ›
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🙏
            </Text>

            <Text style={styles.emptyTitle}>
              No Activities Available
            </Text>

            <Text style={styles.emptyText}>
              No active temple activities are available right now.
            </Text>
          </View>
        )}

        {/* Swamy Vani */}
        <Text style={styles.sectionTitle}>
          Swamy Vani
        </Text>

        <View style={styles.vaniCard}>
          <View style={styles.vaniIconCircle}>
            <Text style={styles.vaniIcon}>
              🙏
            </Text>
          </View>

          <View style={styles.vaniContent}>
            <Text style={styles.vaniLabel}>
              TODAY'S MESSAGE
            </Text>

            <Text style={styles.vaniTitle}>
              Walk with devotion and let faith guide every step.
            </Text>

            <Text style={styles.vaniText}>
              Daily sacred thoughts and spiritual messages for devotees.
            </Text>
          </View>
        </View>

        {/* Programs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Dharmayatra / Programs
          </Text>

          <Text style={styles.viewAll}>
            View All
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {programs.map((program) => (
            <TouchableOpacity
              key={program.title}
              style={styles.programCard}
              activeOpacity={0.8}
            >
              <View style={styles.programIcon}>
                <Text style={styles.programEmoji}>
                  {program.icon}
                </Text>
              </View>

              <Text style={styles.programTitle}>
                {program.title}
              </Text>

              <Text style={styles.programDescription}>
                {program.description}
              </Text>

              <Text style={styles.viewText}>
                View Program ›
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Seva CTA */}
        <View style={styles.sevaCard}>
          <Text style={styles.sevaIcon}>
            🪔
          </Text>

          <View style={styles.sevaContent}>
            <Text style={styles.sevaTitle}>
              Serve / Seva
            </Text>

            <Text style={styles.sevaText}>
              Participate in temple seva and offer your service
              with devotion.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.sevaButton}
            onPress={() => router.push('/pooja')}
          >
            <Text style={styles.sevaButtonText}>
              Explore Seva
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live Darshan & YouTube */}
        <Text style={styles.sectionTitle}>
          Live Darshan & Videos
        </Text>

        {videos.map((video) => (
          <TouchableOpacity
            key={video.title}
            style={styles.videoCard}
            activeOpacity={0.8}
          >
            <View style={styles.videoThumbnail}>
              <Text style={styles.videoIcon}>
                {video.icon}
              </Text>
            </View>

            <View style={styles.videoContent}>
              <Text style={styles.cardTitle}>
                {video.title}
              </Text>

              <Text style={styles.cardDescription}>
                {video.description}
              </Text>

              <Text style={styles.viewText}>
                Watch Now ›
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Events */}
        <View style={styles.eventCard}>
          <View style={styles.eventDate}>
            <Text style={styles.eventMonth}>
              SEP
            </Text>

            <Text style={styles.eventDay}>
              07
            </Text>
          </View>

          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>
              Temple Festival
            </Text>

            <Text style={styles.eventText}>
              Celebrate together with our temple community.
            </Text>

            <Text style={styles.viewText}>
              View Event ›
            </Text>
          </View>
        </View>

        {/* Insights */}
        <Text style={styles.sectionTitle}>
          Insights & Messages
        </Text>

        <View style={styles.insightsCard}>
          {insights.map((item, index) => (
            <View
              key={item}
              style={[
                styles.insightRow,
                index !== insights.length - 1 &&
                  styles.insightBorder,
              ]}
            >
              <Text style={styles.insightIcon}>
                💬
              </Text>

              <Text style={styles.insightText}>
                {item}
              </Text>

              <Text style={styles.arrow}>
                ›
              </Text>
            </View>
          ))}
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>
          Temple in Numbers
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              100+
            </Text>

            <Text style={styles.statLabel}>
              Years of Service
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              10K+
            </Text>

            <Text style={styles.statLabel}>
              Devotees
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              500+
            </Text>

            <Text style={styles.statLabel}>
              Sevas
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              365
            </Text>

            <Text style={styles.statLabel}>
              Days of Devotion
            </Text>
          </View>
        </View>

        {/* Contact */}
        <Text style={styles.sectionTitle}>
          Contact & Location
        </Text>

        <View style={styles.contactCard}>
          <TouchableOpacity style={styles.contactRow}>
            <Text style={styles.contactIcon}>
              📞
            </Text>

            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>
                Contact Temple
              </Text>

              <Text style={styles.contactText}>
                Call or WhatsApp the temple
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </TouchableOpacity>

          <View style={styles.contactDivider} />

          <TouchableOpacity style={styles.contactRow}>
            <Text style={styles.contactIcon}>
              📍
            </Text>

            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>
                Temple Location
              </Text>

              <Text style={styles.contactText}>
                Open Google Maps for directions
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.bottomNote}>
          More activities, programs and live updates will be
          connected through the temple backend later.
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
    marginBottom: 18,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  eyebrow: {
    fontSize: 9,
    color: '#B66A2C',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 11,
    color: '#777',
    marginTop: 5,
  },

  omCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  om: {
    fontSize: 25,
    color: '#B66A2C',
  },

  introCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  introIcon: {
    fontSize: 32,
    marginRight: 13,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  introText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#777',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 13,
    flexDirection: 'row',
    marginBottom: 10,
    elevation: 2,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  cardIcon: {
    fontSize: 27,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
  },

  viewText: {
    fontSize: 10,
    color: '#B66A2C',
    fontWeight: '700',
    marginTop: 7,
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 35,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  emptyIcon: {
    fontSize: 35,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },

  vaniCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    marginBottom: 25,
  },

  vaniIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  vaniIcon: {
    fontSize: 22,
  },

  vaniContent: {
    flex: 1,
  },

  vaniLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#B66A2C',
    letterSpacing: 1,
    marginBottom: 4,
  },

  vaniTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    lineHeight: 19,
  },

  vaniText: {
    fontSize: 10,
    color: '#777',
    marginTop: 5,
    lineHeight: 15,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewAll: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B66A2C',
    marginBottom: 12,
  },

  horizontalList: {
    paddingBottom: 8,
  },

  programCard: {
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 14,
    marginRight: 10,
    elevation: 2,
  },

  programIcon: {
    width: '100%',
    height: 85,
    borderRadius: 13,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  programEmoji: {
    fontSize: 34,
  },

  programTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  programDescription: {
    fontSize: 10,
    color: '#777',
    lineHeight: 15,
  },

  sevaCard: {
    backgroundColor: '#8F4617',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
    marginBottom: 25,
  },

  sevaIcon: {
    fontSize: 28,
    marginBottom: 7,
  },

  sevaContent: {
    marginBottom: 12,
  },

  sevaTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },

  sevaText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#F8E8D8',
  },

  sevaButton: {
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sevaButtonText: {
    color: '#8F4617',
    fontSize: 12,
    fontWeight: '700',
  },

  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 10,
    elevation: 2,
  },

  videoThumbnail: {
    width: 82,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  videoIcon: {
    fontSize: 27,
  },

  videoContent: {
    flex: 1,
    justifyContent: 'center',
  },

  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 13,
    flexDirection: 'row',
    marginBottom: 25,
    elevation: 2,
  },

  eventDate: {
    width: 58,
    height: 62,
    borderRadius: 13,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  eventMonth: {
    fontSize: 8,
    fontWeight: '700',
    color: '#B66A2C',
  },

  eventDay: {
    fontSize: 21,
    fontWeight: '700',
    color: '#4A2C18',
  },

  eventContent: {
    flex: 1,
    justifyContent: 'center',
  },

  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  eventText: {
    fontSize: 10,
    color: '#777',
  },

  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingHorizontal: 14,
    marginBottom: 25,
    elevation: 2,
  },

  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  insightBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE3D8',
  },

  insightIcon: {
    fontSize: 18,
    marginRight: 12,
  },

  insightText: {
    flex: 1,
    fontSize: 11,
    color: '#4A2C18',
  },

  arrow: {
    fontSize: 22,
    color: '#B66A2C',
    marginLeft: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#B66A2C',
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
  },

  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingHorizontal: 14,
    elevation: 2,
    marginBottom: 20,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  contactIcon: {
    fontSize: 22,
    marginRight: 12,
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

  contactText: {
    fontSize: 10,
    color: '#777',
  },

  contactDivider: {
    height: 1,
    backgroundColor: '#EEE3D8',
  },

  bottomNote: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 16,
    color: '#999',
    paddingHorizontal: 15,
  },
});