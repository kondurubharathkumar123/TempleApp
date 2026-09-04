import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GURUS = [
  {
    name: 'Sri Guru',
    title: 'Paramaguru',
    bio: 'A guiding presence in the spiritual lineage, inspiring devotees through wisdom, devotion and service.',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1e3c5f7?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Sri Acharya',
    title: 'Acharya',
    bio: 'A revered teacher who carried the tradition forward through spiritual learning and compassionate guidance.',
    image: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Sri Swamiji',
    title: 'Spiritual Guide',
    bio: 'Known for devotional teachings, discipline and a life dedicated to the welfare of devotees.',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=900&q=85',
  },
];

export default function GuruParamparaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>SACRED SPIRITUAL LINEAGE</Text>
        <Text style={styles.title}>Guru Parampara</Text>
        <Text style={styles.subtitle}>
          Explore the spiritual lineage and the lives and teachings of the Gurus.
        </Text>

        {GURUS.map((guru) => (
          <TouchableOpacity key={guru.name} style={styles.card} activeOpacity={0.9}>
            <Image source={{ uri: guru.image }} style={styles.image} />
            <View style={styles.body}>
              <Text style={styles.role}>{guru.title}</Text>
              <Text style={styles.name}>{guru.name}</Text>
              <Text style={styles.bio}>{guru.bio}</Text>
              <Text style={styles.read}>View Biography  →</Text>
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
  content: { padding: 20, paddingBottom: 40 },
  eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, color: '#C58A2A', marginTop: 10, marginBottom: 6 },
  title: { fontSize: 31, fontWeight: '800', color: '#4A2C18', marginBottom: 7 },
  subtitle: { fontSize: 13, lineHeight: 20, color: '#7C6B5D', marginBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 22, overflow: 'hidden', marginBottom: 17, borderWidth: 1, borderColor: '#EADBC8', elevation: 3 },
  image: { width: '100%', height: 210, backgroundColor: '#F8E8D2' },
  body: { padding: 17 },
  role: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2, color: '#C58A2A', marginBottom: 3 },
  name: { fontSize: 20, fontWeight: '800', color: '#4A2C18', marginBottom: 7 },
  bio: { fontSize: 13, lineHeight: 20, color: '#7C6B5D' },
  read: { fontSize: 11, fontWeight: '800', color: '#8B4513', marginTop: 11 },
  back: { paddingVertical: 12 },
  backText: { color: '#8B4513', fontWeight: '800' },
});
