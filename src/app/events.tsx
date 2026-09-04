import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiRequest } from '@/services/api';

type Event = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  is_active: boolean;
};

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadEvents() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: Event[];
      }>('/events');

      setEvents(result.data || []);
    } catch (err) {
      console.error('Events API error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load events'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function formatDate(value?: string) {
    if (!value) return 'DATE';

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value.substring(0, 10);
    }

    return date
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      })
      .toUpperCase();
  }

  function formatDay(value?: string) {
    if (!value) return '';

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return '';
    }

    return date
      .toLocaleDateString('en-US', {
        weekday: 'long',
      })
      .toUpperCase();
  }

  function formatTime(value?: string) {
    if (!value) return '';

    return value.substring(0, 5);
  }

  function getIcon(index: number) {
    const icons = ['🪔', '🎉', '🙏', '📿', '🛕'];

    return icons[index % icons.length];
  }

  const featuredEvent = events[0];
  const upcomingEvents = events.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>
              Temple Community
            </Text>

            <Text style={styles.title}>
              Events 📅
            </Text>

            <Text style={styles.subtitle}>
              Join us in devotion, celebrations and
              special occasions
            </Text>
          </View>

          <View style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>
              ⚙️
            </Text>
          </View>
        </View>

        {loading ? (
          <Text style={styles.statusText}>
            Loading events...
          </Text>
        ) : error ? (
          <View>
            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadEvents}
            >
              <Text style={styles.retryText}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : events.length === 0 ? (
          <Text style={styles.statusText}>
            No upcoming events.
          </Text>
        ) : (
          <>
            {/* Featured Event */}
            {featuredEvent && (
              <>
                <Text style={styles.sectionTitle}>
                  Featured Event
                </Text>

                <TouchableOpacity
                  style={styles.featuredCard}
                >
                  <View
                    style={styles.featuredIconBox}
                  >
                    <Text
                      style={styles.featuredIcon}
                    >
                      🛕
                    </Text>
                  </View>

                  <View
                    style={styles.featuredContent}
                  >
                    <Text
                      style={styles.featuredDate}
                    >
                      {formatDate(
                        featuredEvent.event_date
                      )}
                      {formatDay(
                        featuredEvent.event_date
                      )
                        ? ` • ${formatDay(
                            featuredEvent.event_date
                          )}`
                        : ''}
                    </Text>

                    <Text
                      style={styles.featuredTitle}
                    >
                      {featuredEvent.title}
                    </Text>

                    <Text
                      style={
                        styles.featuredDescription
                      }
                    >
                      {featuredEvent.description ||
                        'Join us for this special temple event.'}
                    </Text>

                    <Text
                      style={styles.featuredTime}
                    >
                      🕐{' '}
                      {formatTime(
                        featuredEvent.start_time
                      ) || 'Time not specified'}
                      {featuredEvent.end_time
                        ? ` - ${formatTime(
                            featuredEvent.end_time
                          )}`
                        : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* Upcoming Events */}
            <Text style={styles.sectionTitle}>
              Upcoming Events
            </Text>

            {upcomingEvents.length === 0 ? (
              <Text style={styles.statusText}>
                No more upcoming events.
              </Text>
            ) : (
              upcomingEvents.map(
                (event, index) => (
                  <EventCard
                    key={event.id}
                    date={formatDate(
                      event.event_date
                    )}
                    icon={getIcon(index)}
                    title={event.title}
                    time={
                      formatTime(
                        event.start_time
                      ) ||
                      'Time not specified'
                    }
                    description={
                      event.description ||
                      'Join us for this special temple event.'
                    }
                  />
                )
              )
            )}

            {/* View All */}
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={loadEvents}
            >
              <Text style={styles.viewAllText}>
                Refresh Events
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function EventCard({
  date,
  icon,
  title,
  time,
  description,
}: {
  date: string;
  icon: string;
  title: string;
  time: string;
  description: string;
}) {
  return (
    <TouchableOpacity
      style={styles.eventCard}
    >
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>
          {date}
        </Text>
      </View>

      <View style={styles.eventIconBox}>
        <Text style={styles.eventIcon}>
          {icon}
        </Text>
      </View>

      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>
          {title}
        </Text>

        <Text style={styles.eventTime}>
          🕐 {time}
        </Text>

        <Text style={styles.eventDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.arrow}>
        ›
      </Text>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
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
    maxWidth: 250,
    lineHeight: 17,
  },

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  settingsIcon: {
    fontSize: 21,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
    marginTop: 4,
  },

  featuredCard: {
    flexDirection: 'row',
    backgroundColor: '#8B4513',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },

  featuredIconBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#F4D6AD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  featuredIcon: {
    fontSize: 28,
  },

  featuredContent: {
    flex: 1,
  },

  featuredDate: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD99A',
    marginBottom: 5,
  },

  featuredTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },

  featuredDescription: {
    fontSize: 11,
    color: '#F8E7D4',
    lineHeight: 16,
    marginBottom: 7,
  },

  featuredTime: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },

  dateBox: {
    width: 55,
    height: 55,
    borderRadius: 13,
    backgroundColor: '#F4E0C5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  dateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B4513',
  },

  eventIconBox: {
    width: 38,
    alignItems: 'center',
    marginRight: 5,
  },

  eventIcon: {
    fontSize: 23,
  },

  eventContent: {
    flex: 1,
  },

  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 3,
  },

  eventTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B56A22',
    marginBottom: 3,
  },

  eventDescription: {
    fontSize: 10,
    color: '#999',
    lineHeight: 15,
  },

  arrow: {
    fontSize: 25,
    color: '#999',
    marginLeft: 5,
  },

  viewAllButton: {
    backgroundColor: '#8B4513',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  viewAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  statusText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    marginTop: 30,
  },

  errorText: {
    textAlign: 'center',
    color: '#B3261E',
    fontSize: 14,
    marginTop: 30,
    marginBottom: 15,
  },

  retryButton: {
    backgroundColor: '#8B4513',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});