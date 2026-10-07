import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { apiRequest } from '@/services/api';

type Activity = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  activity_date: string | null;
  location: string | null;
  section_id: number;
  display_order: number;
  is_active: boolean;
};

type ActivitySection = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
};

export default function ActivitySectionScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const [section, setSection] =
    useState<ActivitySection | null>(null);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [id]);

  const loadActivities = async () => {
    try {
      setLoading(true);

      const response = await apiRequest(
        `/activities/section/${id}`
      );

      if (
        response.success &&
        response.data
      ) {
        setSection(response.data.section);
        setActivities(
          response.data.activities || []
        );
      }
    } catch (error) {
      console.error(
        'Activity section loading error:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const openActivity = (activityId: number) => {
    router.push({
      pathname: '/activities/[id]',
      params: {
        id: String(activityId),
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#B66A2C"
          />

          <Text style={styles.loadingText}>
            Loading Activities...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!section) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.icon}>
            🙏
          </Text>

          <Text style={styles.notFoundTitle}>
            Section Not Found
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Back */}

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        {/* Section Header */}

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.headerIcon}>
              {section.icon || '🙏'}
            </Text>
          </View>

          <Text style={styles.eyebrow}>
            TEMPLE ACTIVITIES
          </Text>

          <Text style={styles.title}>
            {section.name}
          </Text>

          {section.description ? (
            <Text style={styles.subtitle}>
              {section.description}
            </Text>
          ) : null}
        </View>

        {/* Activities */}

        {activities.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              🙏
            </Text>

            <Text style={styles.emptyTitle}>
              No Activities Yet
            </Text>

            <Text style={styles.emptyText}>
              Activities under this section will
              be added soon.
            </Text>
          </View>
        ) : (
          activities.map(
            (activity, index) => {
              const formattedDate =
                activity.activity_date
                  ? new Date(
                      activity.activity_date
                    ).toLocaleDateString(
                      'en-IN',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }
                    )
                  : null;

              return (
                <TouchableOpacity
                  key={activity.id}
                  style={styles.activityCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    openActivity(
                      activity.id
                    )
                  }
                >
                  {activity.image_url ? (
                    <Image
                      source={{
                        uri: activity.image_url,
                      }}
                      style={
                        styles.activityImage
                      }
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={
                        styles.imagePlaceholder
                      }
                    >
                      <Text
                        style={
                          styles.placeholderIcon
                        }
                      >
                        🛕
                      </Text>
                    </View>
                  )}

                  <View
                    style={
                      styles.activityContent
                    }
                  >
                    <Text
                      style={styles.activityNumber}
                    >
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </Text>

                    <Text
                      style={styles.activityTitle}
                    >
                      {activity.title}
                    </Text>

                    {activity.description ? (
                      <Text
                        style={
                          styles.activityDescription
                        }
                        numberOfLines={4}
                      >
                        {activity.description}
                      </Text>
                    ) : null}

                    <View
                      style={
                        styles.metaContainer
                      }
                    >
                      {formattedDate ? (
                        <Text
                          style={
                            styles.metaText
                          }
                        >
                          📅 {formattedDate}
                        </Text>
                      ) : null}

                      {activity.location ? (
                        <Text
                          style={
                            styles.metaText
                          }
                        >
                          📍 {activity.location}
                        </Text>
                      ) : null}
                    </View>

                    <Text
                      style={styles.readMore}
                    >
                      View Details ›
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }
          )
        )}
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

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 14,
  },

  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B66A2C',
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3DEC5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  headerIcon: {
    fontSize: 34,
  },

  eyebrow: {
    fontSize: 9,
    color: '#B66A2C',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A2C18',
    textAlign: 'center',
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 19,
    color: '#777',
    textAlign: 'center',
  },

  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 3,
  },

  activityImage: {
    width: '100%',
    height: 210,
    backgroundColor: '#F3E7D8',
  },

  imagePlaceholder: {
    width: '100%',
    height: 210,
    backgroundColor: '#F3E7D8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderIcon: {
    fontSize: 55,
  },

  activityContent: {
    padding: 17,
  },

  activityNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B66A2C',
    letterSpacing: 1,
    marginBottom: 5,
  },

  activityTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 8,
  },

  activityDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: '#666',
  },

  metaContainer: {
    marginTop: 12,
  },

  metaText: {
    fontSize: 11,
    color: '#777',
    marginBottom: 4,
  },

  readMore: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: '#B66A2C',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#777',
    textAlign: 'center',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  icon: {
    fontSize: 50,
    marginBottom: 12,
  },

  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A2C18',
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 18,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});