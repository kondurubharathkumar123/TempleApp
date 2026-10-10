
import React, {
  useEffect,
  useState,
} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
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

const LOCALES: Record<string, string> = {
  en: 'en-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
};

export default function EventsScreen() {

  const { t, i18n } = useTranslation();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const locale = LOCALES[i18n.language] || 'en-IN';

  // ========================================
  // LOAD EVENTS
  // ========================================

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

      setError(t('events.loadError'));

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadEvents();

  }, []);

  // ========================================
  // FORMAT DATE
  // ========================================

  function parseDate(value?: string) {

    if (!value) return null;

    const date = new Date(
      `${value.substring(0, 10)}T00:00:00`
    );

    return Number.isNaN(date.getTime())
      ? null
      : date;

  }

  function formatDate(value?: string) {

    const date = parseDate(value);

    if (!date) {
      return value?.substring(0, 10) ||
        t('events.date');
    }

    return date.toLocaleDateString(locale, {
      month: 'short',
      day: '2-digit',
    });

  }

  function formatDay(value?: string) {

    const date = parseDate(value);

    if (!date) return '';

    return date.toLocaleDateString(locale, {
      weekday: 'long',
    });

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

  // ========================================
  // SCREEN
  // ========================================

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View style={styles.headerContent}>

            <Text style={styles.smallText}>
              {t('events.community')}
            </Text>

            <Text style={styles.title}>
              {t('events.title')} 📅
            </Text>

            <Text style={styles.subtitle}>
              {t('events.subtitle')}
            </Text>

          </View>

          <View style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>
              ⚙️
            </Text>
          </View>

        </View>

        {/* LOADING */}

        {loading ? (

          <Text style={styles.statusText}>
            {t('events.loading')}
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
                {t('events.retry')}
              </Text>

            </TouchableOpacity>

          </View>

        ) : events.length === 0 ? (

          <Text style={styles.statusText}>
            {t('events.noEvents')}
          </Text>

        ) : (

          <>

            {/* FEATURED EVENT */}

            {featuredEvent && (

              <>

                <Text style={styles.sectionTitle}>
                  {t('events.featured')}
                </Text>

                <TouchableOpacity
                  style={styles.featuredCard}
                  activeOpacity={0.8}
                >

                  <View style={styles.featuredIconBox}>

                    <Text style={styles.featuredIcon}>
                      🛕
                    </Text>

                  </View>

                  <View style={styles.featuredContent}>

                    <Text style={styles.featuredDate}>
                      {formatDate(featuredEvent.event_date)}

                      {formatDay(featuredEvent.event_date)
                        ? ` • ${formatDay(
                            featuredEvent.event_date
                          )}`
                        : ''}
                    </Text>

                    <Text style={styles.featuredTitle}>
                      {featuredEvent.title}
                    </Text>

                    <Text style={styles.featuredDescription}>
                      {featuredEvent.description ||
                        t('events.descriptionFallback')}
                    </Text>

                    <Text style={styles.featuredTime}>
                      🕐{' '}
                      {formatTime(featuredEvent.start_time) ||
                        t('events.timeNotSpecified')}

                      {featuredEvent.end_time
                        ? ` - ${formatTime(
                            featuredEvent.end_time
                          )}`
                        : ''}
                    </Text>

                    {featuredEvent.location ? (

                      <Text style={styles.featuredTime}>
                        📍 {featuredEvent.location}
                      </Text>

                    ) : null}

                  </View>

                </TouchableOpacity>

              </>

            )}

            {/* UPCOMING EVENTS */}

            <Text style={styles.sectionTitle}>
              {t('events.upcoming')}
            </Text>

            {upcomingEvents.length === 0 ? (

              <Text style={styles.statusText}>
                {t('events.noMore')}
              </Text>

            ) : (

              upcomingEvents.map((event, index) => (

                <View
                  key={event.id}
                  style={styles.eventCard}
                >

                  <View style={styles.dateBox}>

                    <Text style={styles.dateText}>
                      {formatDate(event.event_date)}
                    </Text>

                  </View>

                  <View style={styles.eventIconBox}>

                    <Text style={styles.eventIcon}>
                      {getIcon(index)}
                    </Text>

                  </View>

                  <View style={styles.eventContent}>

                    <Text style={styles.eventTitle}>
                      {event.title}
                    </Text>

                    <Text style={styles.eventTime}>
                      🕐{' '}
                      {formatTime(event.start_time) ||
                        t('events.timeNotSpecified')}
                    </Text>

                    <Text style={styles.eventDescription}>
                      {event.description ||
                        t('events.descriptionFallback')}
                    </Text>

                    {event.location ? (

                      <Text style={styles.eventDescription}>
                        📍 {event.location}
                      </Text>

                    ) : null}

                  </View>

                  <Text style={styles.arrow}>
                    ›
                  </Text>

                </View>

              ))

            )}

            {/* REFRESH */}

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={loadEvents}
            >

              <Text style={styles.viewAllText}>
                {t('events.refresh')}
              </Text>

            </TouchableOpacity>

          </>

        )}

      </ScrollView>

    </SafeAreaView>

  );

}

// ========================================
// STYLES
// ========================================

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

  headerContent: {
    flex: 1,
    paddingRight: 12,
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
    marginTop: 3,
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
    minHeight: 55,
    borderRadius: 13,
    backgroundColor: '#F4E0C5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    padding: 3,
  },

  dateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B4513',
    textAlign: 'center',
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
