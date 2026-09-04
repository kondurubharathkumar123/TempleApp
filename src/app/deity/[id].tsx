import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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

import { apiRequest } from '@/services/api';

type Deity = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;

  // These are optional in case your backend provides them.
  significance?: string | null;
  devotional?: string | null;
};

export default function DeityDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [deity, setDeity] = useState<Deity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadDeity();
    }
  }, [id]);

  async function loadDeity() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: Deity;
      }>(`/deities/${id}`);

      if (result.success && result.data) {
        setDeity(result.data);
      } else {
        setError('Deity not found');
      }
    } catch (err) {
      console.error('Deity details API error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load deity details'
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color="#8B4513"
          />

          <Text style={styles.loadingText}>
            Loading deity details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !deity) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>
            🙏
          </Text>

          <Text style={styles.notFoundTitle}>
            Deity Not Found
          </Text>

          <Text style={styles.notFoundText}>
            {error || 'We could not find the requested deity.'}
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
        {/* Top Bar */}

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>
            Deity Details
          </Text>

          <View style={styles.topBarSpacer} />
        </View>

        {/* Deity Image */}

        <View style={styles.imageContainer}>
          {deity.image_url ? (
            <Image
              source={{
                uri: deity.image_url,
              }}
              style={styles.deityImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>
                🛕
              </Text>
            </View>
          )}

          <View style={styles.imageOverlay}>
            <Text style={styles.overlayOm}>
              ॐ
            </Text>
          </View>
        </View>

        {/* Name */}

        <View style={styles.titleContainer}>
          <Text style={styles.deityName}>
            {deity.name}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>
            Divine Presence • Temple Deity
          </Text>
        </View>

        {/* About */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About
          </Text>

          <Text style={styles.sectionText}>
            {deity.description ||
              'Information about this deity is not available at the moment.'}
          </Text>
        </View>

        {/* Spiritual Significance */}

        {deity.significance ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Spiritual Significance
            </Text>

            <Text style={styles.sectionText}>
              {deity.significance}
            </Text>
          </View>
        ) : null}

        {/* Devotional Practice */}

        {deity.devotional ? (
          <View style={styles.devotionalCard}>
            <Text style={styles.devotionalIcon}>
              🪔
            </Text>

            <View style={styles.devotionalContent}>
              <Text style={styles.devotionalTitle}>
                Devotional Practice
              </Text>

              <Text style={styles.devotionalText}>
                {deity.devotional}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Prayer */}

        <View style={styles.prayerCard}>
          <Text style={styles.prayerOm}>
            ॐ
          </Text>

          <Text style={styles.prayerText}>
            May the divine blessings of {deity.name} bring
            peace, strength and happiness to all devotees.
          </Text>
        </View>

        {/* Back Button */}

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => router.back()}
        >
          <Text style={styles.bottomButtonText}>
            Back to Deities
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

  topBar: {
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
    lineHeight: 34,
    color: '#4A2C18',
    marginTop: -3,
  },

  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
  },

  topBarSpacer: {
    width: 40,
  },

  imageContainer: {
    marginHorizontal: 20,
    height: 330,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E9D8C6',
  },

  deityImage: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9D8C6',
  },

  placeholderIcon: {
    fontSize: 60,
  },

  imageOverlay: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayOm: {
    fontSize: 27,
    color: '#9A5726',
    fontWeight: '700',
  },

  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
  },

  deityName: {
    fontSize: 27,
    fontWeight: '700',
    color: '#4A2C18',
    textAlign: 'center',
  },

  divider: {
    width: 55,
    height: 2,
    backgroundColor: '#C98A4A',
    marginVertical: 10,
  },

  subtitle: {
    fontSize: 12,
    color: '#999',
  },

  section: {
    marginHorizontal: 20,
    marginTop: 20,
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

  sectionText: {
    fontSize: 13,
    color: '#6F6259',
    lineHeight: 21,
  },

  devotionalCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
  },

  devotionalIcon: {
    fontSize: 28,
    marginRight: 14,
  },

  devotionalContent: {
    flex: 1,
  },

  devotionalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 6,
  },

  devotionalText: {
    fontSize: 12,
    color: '#6D5140',
    lineHeight: 19,
  },

  prayerCard: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#F7E8D4',
    alignItems: 'center',
  },

  prayerOm: {
    fontSize: 32,
    color: '#9A5726',
    marginBottom: 8,
  },

  prayerText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: '#6D5140',
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

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#777',
  },

  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  notFoundIcon: {
    fontSize: 45,
    marginBottom: 15,
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