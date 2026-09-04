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

export default function MenuScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Menu</Text>

        <Text style={styles.subtitle}>
          Temple services and information
        </Text>

        <View style={styles.card}>
          <MenuItem
  title="About Temple"
  onPress={() => router.push('/about')}
/>
           <MenuItem
  title="Deities"
  onPress={() => router.push('/deity/[id]')}
/>
           <MenuItem
  title="Activities"
  onPress={() => router.push('/activities')}
/>
          <MenuItem
  title="Pooja & Seva"
  onPress={() => router.push('/pooja-details')}
/>
          <MenuItem
  title="Gallery"
  onPress={() => router.push('/gallery')}
/>
          <MenuItem
  title="Publications"
  onPress={() => router.push('/publications')}
/>
          <MenuItem
  title="Rooms"
  onPress={() => router.push('/rooms')}
/>
        <MenuItem
  title="My Account"
  onPress={() => router.push('/account')}
/>
          <MenuItem
  title="My Bookings"
  onPress={() => router.push('/my-bookings')}
/>
          <MenuItem
  title="Nearby Places / Hotels"
  onPress={() => router.push('/nearby')}
/>
        <MenuItem
  title="Contact Temple"
  onPress={() => router.push('/contact')}
/>
          <MenuItem
  title="Policies"
  onPress={() => router.push('/policies')}
/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.itemText}>
        {title}
      </Text>

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

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    elevation: 2,
  },

  item: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE3D8',
  },

  itemText: {
    fontSize: 13,
    color: '#4A2C18',
    fontWeight: '600',
  },

  arrow: {
    fontSize: 22,
    color: '#B66A2C',
  },
});