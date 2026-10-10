
import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/services/api';

type DarshanSlot = {
  id: number;
  name: string;
  description?: string;
  darshan_date: string;
  start_time: string;
  end_time: string;
  price: string | number;
  capacity: number;
  is_active: boolean;
};

const LOCALES: Record<string, string> = {
  en: 'en-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
};

export default function DarshanScreen() {

  const { t, i18n } = useTranslation();

  const [slots, setSlots] =
    useState<DarshanSlot[]>([]);

  const [allSlots, setAllSlots] =
    useState<DarshanSlot[]>([]);

  const [loading, setLoading] = useState(true);
  const [allLoading, setAllLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState('');

  const locale = LOCALES[i18n.language] || 'en-IN';

  // ========================================
  // LOAD TODAY'S DARSHAN
  // ========================================

  async function loadDarshan() {

    try {

      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: DarshanSlot[];
      }>('/darshan');

      setSlots(result.data || []);

    } catch (err) {

      console.error('Darshan API error:', err);

      setError(
        err instanceof Error
          ? err.message
          : t('darshan.loadError')
      );

    } finally {

      setLoading(false);

    }

  }

  // ========================================
  // LOAD ALL DARSHANS
  // ========================================

  async function loadAllDarshan(displayAll = true) {

    try {

      setAllLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: DarshanSlot[];
      }>('/darshan/all');

      setAllSlots(result.data || []);

      if (displayAll) {
        setShowAll(true);
      }

    } catch (err) {

      console.error('All Darshan API error:', err);
      setError(t('darshan.loadError'));

    } finally {

      setAllLoading(false);

    }

  }

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    loadDarshan();
    loadAllDarshan(false);

  }, []);

  // ========================================
  // UPCOMING DARSHANS
  // ========================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSlots = allSlots
    .filter((slot) => {

      const dateString =
        slot.darshan_date?.substring(0, 10);

      if (!dateString || !slot.is_active) {
        return false;
      }

      const darshanDate =
        new Date(`${dateString}T00:00:00`);

      return (
        !Number.isNaN(darshanDate.getTime()) &&
        darshanDate > today
      );

    })
    .sort((a, b) =>
      a.darshan_date.substring(0, 10).localeCompare(
        b.darshan_date.substring(0, 10)
      )
    );

  // ========================================
  // FORMAT TIME
  // ========================================

  function formatTime(value: string) {

    if (!value) return '';

    const [hourString, minute] =
      value.substring(0, 5).split(':');

    const hour = Number(hourString);

    if (!Number.isFinite(hour)) return value;

    const period =
      hour >= 12
        ? t('darshan.pm')
        : t('darshan.am');

    return `${hour % 12 || 12}:${minute} ${period}`;

  }

  // ========================================
  // FORMAT DATE
  // ========================================

  function formatDate(value: string) {

    if (!value) return '';

    const date = new Date(
      `${value.substring(0, 10)}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return value.substring(0, 10);
    }

    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  }

  // ========================================
  // DARSHAN ICON
  // ========================================

  function getIcon(name: string) {

    const lower = name.toLowerCase();

    if (lower.includes('morning')) return '🌅';
    if (lower.includes('afternoon')) return '☀️';
    if (lower.includes('evening')) return '🌇';
    if (lower.includes('special')) return '🌸';

    return '🙏';

  }

  // ========================================
  // RENDER CARD
  // ========================================

  function renderCard(
    slot: DarshanSlot,
    prefix: string
  ) {

    return (

      <View
        key={`${prefix}-${slot.id}`}
        style={styles.darshanCard}
      >

        <View style={styles.cardTop}>

          <View style={styles.cardContent}>

            <Text style={styles.cardTitle}>
              {slot.name}
            </Text>

            <Text style={styles.cardTime}>
              {formatTime(slot.start_time)}
              {' – '}
              {formatTime(slot.end_time)}
            </Text>

          </View>

          <Text style={styles.cardIcon}>
            {getIcon(slot.name)}
          </Text>

        </View>

        <Text style={styles.cardDate}>
          {formatDate(slot.darshan_date)}
        </Text>

        <Text style={styles.cardDescription}>
          {slot.description ||
            t('darshan.descriptionFallback')}
        </Text>

        <View style={styles.infoRow}>

          <Text style={styles.price}>
            ₹{Number(slot.price).toLocaleString(locale)}
          </Text>

          <Text style={styles.capacity}>
            {t('darshan.capacity', {
              count: slot.capacity,
            })}
          </Text>

        </View>

      </View>

    );

  }

  // ========================================
  // EMPTY STATE
  // ========================================

  function renderEmpty(
    title: string,
    description: string
  ) {

    return (

      <View style={styles.emptyBox}>

        <Text style={styles.emptyIcon}>🙏</Text>

        <Text style={styles.emptyTitle}>
          {title}
        </Text>

        <Text style={styles.emptyText}>
          {description}
        </Text>

      </View>

    );

  }

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

          <Text style={styles.smallTitle}>
            {t('darshan.templeServices')}
          </Text>

          <Text style={styles.title}>
            {t('darshan.title')} 🙏
          </Text>

          <Text style={styles.subtitle}>
            {t('darshan.subtitle')}
          </Text>

        </View>

        {/* TODAY'S DARSHAN */}

        <Text style={styles.sectionTitle}>
          {t('darshan.today')}
        </Text>

        {loading ? (

          <View style={styles.loadingBox}>

            <ActivityIndicator
              size="large"
              color="#8B4513"
            />

            <Text style={styles.loadingText}>
              {t('darshan.loading')}
            </Text>

          </View>

        ) : error && slots.length === 0 ? (

          <View style={styles.errorBox}>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadDarshan}
            >
              <Text style={styles.retryText}>
                {t('darshan.retry')}
              </Text>
            </TouchableOpacity>

          </View>

        ) : slots.length === 0 ? (

          renderEmpty(
            t('darshan.noSlots'),
            t('darshan.checkLater')
          )

        ) : (

          slots.map((slot) =>
            renderCard(slot, 'today')
          )

        )}

        {/* VIEW ALL */}

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => loadAllDarshan(true)}
          disabled={allLoading}
        >

          <Text style={styles.viewAllText}>
            {allLoading
              ? t('darshan.loadingShort')
              : showAll
                ? t('darshan.refreshAll')
                : t('darshan.viewAll')}
          </Text>

        </TouchableOpacity>

        {/* ALL DARSHANS */}

        {showAll && (

          <>

            <Text style={styles.sectionTitle}>
              {t('darshan.all')}
            </Text>

            {allSlots.length === 0
              ? renderEmpty(
                  t('darshan.noSlots'),
                  t('darshan.checkLater')
                )
              : allSlots.map((slot) =>
                  renderCard(slot, 'all')
                )}

          </>

        )}

        {/* UPCOMING DARSHANS */}

        <Text style={styles.sectionTitle}>
          {t('darshan.upcoming')}
        </Text>

        {allLoading && allSlots.length === 0 ? (

          <View style={styles.loadingBox}>

            <ActivityIndicator
              size="small"
              color="#8B4513"
            />

            <Text style={styles.loadingText}>
              {t('darshan.loadingUpcoming')}
            </Text>

          </View>

        ) : upcomingSlots.length === 0 ? (

          <View style={styles.emptyBox}>

            <Text style={styles.emptyIcon}>🙏</Text>

            <Text style={styles.emptyTitle}>
              {t('darshan.noUpcoming')}
            </Text>

            <Text style={styles.emptyText}>
              {t('darshan.upcomingLater')}
            </Text>

            {error ? (

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => loadAllDarshan(false)}
                disabled={allLoading}
              >
                <Text style={styles.retryText}>
                  {t('darshan.retry')}
                </Text>
              </TouchableOpacity>

            ) : null}

          </View>

        ) : (

          upcomingSlots.map((slot) =>
            renderCard(slot, 'upcoming')
          )

        )}

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => loadAllDarshan(false)}
          disabled={allLoading}
        >

          <Text style={styles.viewAllText}>
            {allLoading
              ? t('darshan.loadingShort')
              : t('darshan.refreshUpcoming')}
          </Text>

        </TouchableOpacity>

        {/* SPECIAL DARSHAN */}

        <Text style={styles.sectionTitle}>
          {t('darshan.special')}
        </Text>

        <View style={styles.specialCard}>

          <Text style={styles.specialIcon}>🌸</Text>

          <Text style={styles.specialTitle}>
            {t('darshan.specialBooking')}
          </Text>

          <Text style={styles.specialText}>
            {t('darshan.specialDescription')}
          </Text>

          <TouchableOpacity style={styles.bookButton}>

            <Text style={styles.bookButtonText}>
              {t('darshan.book')}
            </Text>

          </TouchableOpacity>

        </View>

        {/* GUIDELINES */}

        <Text style={styles.sectionTitle}>
          {t('darshan.guidelines')}
        </Text>

        <View style={styles.guidelineCard}>

          {[
            t('darshan.guideline1'),
            t('darshan.guideline2'),
            t('darshan.guideline3'),
            t('darshan.guideline4'),
          ].map((guideline, index) => (

            <View
              key={index}
              style={styles.guidelineRow}
            >

              <Text style={styles.check}>✓</Text>

              <Text style={styles.guidelineText}>
                {guideline}
              </Text>

            </View>

          ))}

        </View>

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
    marginBottom: 24,
  },

  smallTitle: {
    fontSize: 13,
    color: '#9A7655',
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
    marginTop: 8,
    marginBottom: 14,
  },

  darshanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 12,
    elevation: 2,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
  },

  cardTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A05216',
    marginTop: 6,
  },

  cardIcon: {
    fontSize: 30,
    marginLeft: 12,
  },

  cardDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9A7655',
    marginTop: 10,
  },

  cardDescription: {
    fontSize: 13,
    color: '#777',
    lineHeight: 19,
    marginTop: 8,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },

  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B4513',
  },

  capacity: {
    fontSize: 12,
    color: '#777',
  },

  viewAllButton: {
    backgroundColor: '#8B4513',
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },

  viewAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },

  loadingText: {
    marginTop: 10,
    color: '#777',
    fontSize: 13,
  },

  errorBox: {
    backgroundColor: '#FFF0ED',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  errorText: {
    color: '#B42318',
    fontSize: 13,
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },

  specialCard: {
    backgroundColor: '#F4E0C5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  specialIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  specialTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A2C18',
  },

  specialText: {
    fontSize: 13,
    color: '#6E5542',
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 17,
  },

  bookButton: {
    backgroundColor: '#8B4513',
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
  },

  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  guidelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },

  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  check: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B4513',
    width: 25,
  },

  guidelineText: {
    flex: 1,
    fontSize: 13,
    color: '#6E5542',
    lineHeight: 19,
  },

});
