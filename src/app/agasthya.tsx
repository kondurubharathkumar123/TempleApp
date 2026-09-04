import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORIES = [
  { title: 'Agasthya Stories', text: 'Devotional stories and traditional accounts presented for spiritual reflection.' },
  { title: 'Teachings & Wisdom', text: 'Timeless teachings, values and spiritual lessons for everyday life.' },
  { title: 'Daily Reflection', text: 'Short devotional thoughts to begin the day with peace and gratitude.' },
];

export default function AgasthyaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.om}>ॐ</Text>
          <Text style={styles.eyebrow}>DEVOTIONAL COLLECTION</Text>
          <Text style={styles.title}>Agasthya</Text>
          <Text style={styles.subtitle}>
            Stories, wisdom and spiritual content for devotees.
          </Text>
        </View>

        {STORIES.map((item) => (
          <TouchableOpacity key={item.title} style={styles.card} activeOpacity={0.85}>
            <View style={styles.icon}><Text style={styles.iconText}>🪔</Text></View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardText}>{item.text}</Text>
              <Text style={styles.read}>Read More  →</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>‹  Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  content: { padding: 20 },
  hero: { backgroundColor: '#6F3518', borderRadius: 25, padding: 25, marginBottom: 20 },
  om: { fontSize: 42, color: '#FFD98A', marginBottom: 3 },
  eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, color: '#EBCB9C' },
  title: { fontSize: 31, fontWeight: '800', color: '#FFF', marginTop: 5 },
  subtitle: { fontSize: 13, lineHeight: 20, color: '#F9E9D5', marginTop: 7 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 17, marginBottom: 13, borderWidth: 1, borderColor: '#EADBC8', elevation: 2 },
  icon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F8E8D2', alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  iconText: { fontSize: 25 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#4A2C18', marginBottom: 5 },
  cardText: { fontSize: 12, lineHeight: 18, color: '#7C6B5D' },
  read: { fontSize: 11, fontWeight: '800', color: '#8B4513', marginTop: 9 },
  back: { paddingVertical: 16 },
  backText: { color: '#8B4513', fontWeight: '800' },
});
