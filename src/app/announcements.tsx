
import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
} from 'expo-router';

import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/services/api';

type Announcement = {
  id?: number;
  title: string;
  message: string;
};

export default function AnnouncementsScreen() {

  const { t } = useTranslation();

  const { id } =
    useLocalSearchParams<{
      id?: string;
    }>();

  const [announcement, setAnnouncement] =
    useState<Announcement | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  async function loadAnnouncement() {

    try {

      setLoading(true);
      setAnnouncement(null);

      if (id) {

        const response = await apiRequest<{
          success: boolean;
          data: Announcement;
        }>(
          `/announcements/${encodeURIComponent(id)}`
        );

        if (response.success) {
          setAnnouncement(response.data);
        }

      }

    } catch (error) {

      console.error(
        'Load announcement error:',
        error
      );

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (
      <View style={styles.center}>

        <ActivityIndicator
          size="large"
          color="#6B1720"
        />

        <Text style={styles.statusText}>
          {t('announcements.loading')}
        </Text>

      </View>
    );

  }

  if (!announcement) {

    return (
      <View style={styles.center}>

        <Text style={styles.statusText}>
          {t('announcements.notFound')}
        </Text>

      </View>
    );

  }

  return (

    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >

      <Text style={styles.title}>
        {announcement.title}
      </Text>

      <Text style={styles.message}>
        {announcement.message}
      </Text>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    padding: 20,
    paddingTop: 60,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  statusText: {
    fontSize: 15,
    color: '#6B1720',
    textAlign: 'center',
    marginTop: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },

  message: {
    fontSize: 17,
    lineHeight: 27,
  },

});
