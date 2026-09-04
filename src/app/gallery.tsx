import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const photos = [
  { id: '1', title: 'Temple Entrance', icon: '🛕' },
  { id: '2', title: 'Main Sannidhi', icon: '🙏' },
  { id: '3', title: 'Festival Decoration', icon: '🌸' },
  { id: '4', title: 'Daily Pooja', icon: '🪔' },
  { id: '5', title: 'Temple Event', icon: '🎉' },
  { id: '6', title: 'Devotional Gathering', icon: '📿' },
];

const videos = [
  {
    id: '1',
    title: 'Temple Darshan',
    description: 'Watch devotional temple darshan.',
  },
  {
    id: '2',
    title: 'Festival Highlights',
    description: 'Highlights from temple festivals and programs.',
  },
];

const stotras = [
  {
    id: '1',
    title: 'Sri Narasimha Stotra',
    description: 'Read the sacred devotional stotra.',
  },
  {
    id: '2',
    title: 'Guru Stotra',
    description: 'Devotional verses dedicated to the Guru.',
  },
  {
    id: '3',
    title: 'Sharada Stotra',
    description: 'Sacred verses dedicated to Goddess Sharada.',
  },
];

export default function GalleryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.label}>TEMPLE MEDIA</Text>

        <Text style={styles.title}>Gallery</Text>

        <Text style={styles.subtitle}>
          Explore temple photos, videos and devotional stotras
        </Text>

        {/* Photos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Photos</Text>

          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photoGrid}>
          {photos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoCard}
              activeOpacity={0.8}
            >
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>{photo.icon}</Text>
              </View>

              <Text style={styles.photoTitle}>
                {photo.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Videos */}
        <Text style={styles.sectionTitle}>
          Videos
        </Text>

        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            activeOpacity={0.8}
          >
            <View style={styles.videoThumbnail}>
              <Text style={styles.playIcon}>▶</Text>
            </View>

            <View style={styles.videoContent}>
              <Text style={styles.videoTitle}>
                {video.title}
              </Text>

              <Text style={styles.videoDescription}>
                {video.description}
              </Text>

              <Text style={styles.watchText}>
                Watch Video ›
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Stotras */}
        <Text style={styles.sectionTitle}>
          Stotras
        </Text>

        <View style={styles.stotraCard}>
          {stotras.map((stotra, index) => (
            <TouchableOpacity
              key={stotra.id}
              style={[
                styles.stotraRow,
                index !== stotras.length - 1 &&
                  styles.stotraBorder,
              ]}
            >
              <View style={styles.stotraIcon}>
                <Text style={styles.stotraEmoji}>📜</Text>
              </View>

              <View style={styles.stotraContent}>
                <Text style={styles.stotraTitle}>
                  {stotra.title}
                </Text>

                <Text style={styles.stotraDescription}>
                  {stotra.description}
                </Text>

                <Text style={styles.readText}>
                  Read Stotra ›
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🎧</Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Audio Stotras
            </Text>

            <Text style={styles.infoText}>
              Devotional audio playback will be connected
              when temple media content is available.
            </Text>
          </View>
        </View>
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
    marginBottom: 22,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  viewAll: {
    fontSize: 11,
    color: '#B66A2C',
    fontWeight: '700',
    marginBottom: 12,
  },

  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  photoCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
  },

  photoPlaceholder: {
    height: 115,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoIcon: {
    fontSize: 38,
  },

  photoTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A2C18',
    padding: 10,
  },

  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 11,
    elevation: 2,
  },

  videoThumbnail: {
    width: 90,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  playIcon: {
    fontSize: 24,
    color: '#B66A2C',
  },

  videoContent: {
    flex: 1,
    justifyContent: 'center',
  },

  videoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  videoDescription: {
    fontSize: 10,
    color: '#777',
    lineHeight: 15,
  },

  watchText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B66A2C',
    marginTop: 6,
  },

  stotraCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    elevation: 2,
    marginBottom: 20,
  },

  stotraRow: {
    flexDirection: 'row',
    paddingVertical: 14,
  },

  stotraBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE3D8',
  },

  stotraIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  stotraEmoji: {
    fontSize: 20,
  },

  stotraContent: {
    flex: 1,
  },

  stotraTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  stotraDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
  },

  readText: {
    fontSize: 10,
    color: '#B66A2C',
    fontWeight: '700',
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 27,
    marginRight: 12,
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
    lineHeight: 16,
    color: '#6F6258',
  },
});