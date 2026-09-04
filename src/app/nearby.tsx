import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const places = [
  {
    icon: '🏨',
    title: 'Hotels & Rooms',
    description: 'Find nearby accommodation for your temple visit.',
  },
  {
    icon: '🍽️',
    title: 'Restaurants',
    description: 'Explore nearby restaurants and food options.',
  },
  {
    icon: '🏥',
    title: 'Hospitals',
    description: 'Find nearby hospitals and medical facilities.',
  },
  {
    icon: '🚌',
    title: 'Transport',
    description: 'Bus stops, railway stations and local transport.',
  },
  {
    icon: '📍',
    title: 'Important Places',
    description: 'Nearby temples, landmarks and useful locations.',
  },
];

export default function NearbyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.label}>TRAVEL INFORMATION</Text>

        <Text style={styles.title}>Nearby Places</Text>

        <Text style={styles.subtitle}>
          Helpful places and services around the temple.
        </Text>

        {/* Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <Text style={styles.locationEmoji}>📍</Text>
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>
              Temple Location
            </Text>

            <Text style={styles.locationText}>
              Nearby places and services will be displayed
              based on the temple location.
            </Text>
          </View>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>
          Explore Nearby
        </Text>

        <View style={styles.card}>
          {places.map((place, index) => (
            <TouchableOpacity
              key={place.title}
              style={[
                styles.item,
                index === places.length - 1 && styles.lastItem,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.itemIcon}>
                <Text style={styles.itemEmoji}>
                  {place.icon}
                </Text>
              </View>

              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>
                  {place.title}
                </Text>

                <Text style={styles.itemDescription}>
                  {place.description}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Map */}
        <Text style={styles.sectionTitle}>
          Temple & Nearby Map
        </Text>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>

          <Text style={styles.mapTitle}>
            Google Map
          </Text>

          <Text style={styles.mapText}>
            Interactive temple location and nearby
            places will be connected later.
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            Open Directions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>
            Back to Home
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
    padding: 20,
    paddingBottom: 40,
  },

  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: '#B66A2C',
    marginBottom: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 11,
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
  },

  locationCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  locationEmoji: {
    fontSize: 23,
  },

  locationContent: {
    flex: 1,
  },

  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  locationText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    elevation: 2,
    marginBottom: 25,
  },

  item: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE3D8',
  },

  lastItem: {
    borderBottomWidth: 0,
  },

  itemIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#F8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  itemEmoji: {
    fontSize: 20,
  },

  itemContent: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 3,
  },

  itemDescription: {
    fontSize: 9,
    lineHeight: 14,
    color: '#777',
  },

  arrow: {
    fontSize: 22,
    color: '#B66A2C',
    marginLeft: 8,
  },

  mapPlaceholder: {
    minHeight: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    elevation: 2,
    marginBottom: 15,
  },

  mapIcon: {
    fontSize: 42,
    marginBottom: 10,
  },

  mapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  mapText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
    textAlign: 'center',
  },

  primaryButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  homeButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D5C8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    color: '#4A2C18',
    fontSize: 13,
    fontWeight: '600',
  },
});