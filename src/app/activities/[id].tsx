import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

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

export default function ActivityDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, [id]);

  const loadActivity = async () => {
    try {
      setLoading(true);

      const response = await apiRequest(`/activities/${id}`);

      if (response.success && response.data) {
        setActivity(response.data);
      }
    } catch (error) {
      console.error('Activity details loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.icon}>🙏</Text>
          <Text style={styles.loadingText}>
            Loading Activity...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.icon}>🙏</Text>

          <Text style={styles.notFoundTitle}>
            Activity Not Found
          </Text>

          <Text style={styles.notFoundText}>
            We couldn't find the requested activity.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = activity.activity_date
    ? new Date(activity.activity_date).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      )
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Activity Details
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Image */}
        {activity.image_url ? (
          <Image
            source={{ uri: activity.image_url }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>🛕</Text>
          </View>
        )}

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {activity.title}
          </Text>

          <View style={styles.divider} />
        </View>

        {/* Date */}
        {formattedDate ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📅</Text>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                DATE
              </Text>

              <Text style={styles.infoValue}>
                {formattedDate}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Location */}
        {activity.location ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📍</Text>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                LOCATION
              </Text>

              <Text style={styles.infoValue}>
                {activity.location}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            About This Activity
          </Text>

          <Text style={styles.description}>
            {activity.description ||
              'Temple activity information will be available soon.'}
          </Text>
        </View>

        {/* Devotional Message */}
        <View style={styles.messageCard}>
          <Text style={styles.messageIcon}>
            🪔
          </Text>

          <Text style={styles.messageText}>
            May this sacred activity bring peace, devotion
            and divine blessings to all devotees.
          </Text>
        </View>

        {/* Back */}
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => router.back()}
        >
          <Text style={styles.bottomButtonText}>
            Back to Activities
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
    paddingBottom: 40,
  },

  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  backIcon: {
    fontSize: 32,
    color: '#4A2C18',
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
  },

  headerSpacer: {
    width: 40,
  },

  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#F0E6DA',
  },

  imagePlaceholder: {
    width: '100%',
    height: 280,
    backgroundColor: '#F0E6DA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderIcon: {
    fontSize: 60,
  },

  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A2C18',
    textAlign: 'center',
  },

  divider: {
    width: 55,
    height: 2,
    backgroundColor: '#C98A4A',
    marginTop: 12,
  },

  infoCard: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  infoIcon: {
    fontSize: 24,
    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B66A2C',
    letterSpacing: 1,
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 13,
    color: '#4A2C18',
    fontWeight: '600',
  },

  sectionCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 9,
  },

  description: {
    fontSize: 13,
    lineHeight: 21,
    color: '#6F6259',
  },

  messageCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },

  messageIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  messageText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#6D5140',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  bottomButton: {
    marginHorizontal: 20,
    marginTop: 22,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  icon: {
    fontSize: 45,
    marginBottom: 12,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 8,
  },

  notFoundText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },

  backButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#B66A2C',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});