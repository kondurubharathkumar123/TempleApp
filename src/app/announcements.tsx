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

import { apiRequest } from '@/services/api';


export default function AnnouncementsScreen() {

  const { id } =
    useLocalSearchParams<{
      id?: string;
    }>();

  const [announcement, setAnnouncement] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    loadAnnouncement();

  }, [id]);


  async function loadAnnouncement() {

    try {

      setLoading(true);


      if (id) {

        const response =
          await apiRequest(
            `/announcements/${id}`
          );

        if (
          response.success
        ) {
          setAnnouncement(
            response.data
          );
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
        />
      </View>
    );
  }


  if (!announcement) {
    return (
      <View style={styles.center}>
        <Text>
          Announcement not found.
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


const styles =
  StyleSheet.create({

    container: {
      padding: 20,
      paddingTop: 60,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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