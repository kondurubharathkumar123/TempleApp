import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutSreemathScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85' }}
          style={styles.hero}
        />

        <View style={styles.content}>
          <Text style={styles.eyebrow}>OUR SPIRITUAL HERITAGE</Text>
          <Text style={styles.title}>About Sreemath</Text>
          <Text style={styles.body}>
            Sreemath is a sacred spiritual institution rooted in devotion,
            tradition, wisdom and service. This space can contain the complete
            history, purpose, traditions and important milestones of Sreemath.
          </Text>

          <View style={styles.quoteCard}>
            <Text style={styles.quote}>“Tradition becomes meaningful when it inspires devotion and service.”</Text>
          </View>

          <Text style={styles.heading}>Our Heritage</Text>
          <Text style={styles.body}>
            Add the detailed official Sreemath history, spiritual teachings,
            lineage information and other approved content here.
          </Text>
        </View>

        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>‹  Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  hero: { width: '100%', height: 270 },
  content: { padding: 22 },
  eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, color: '#C58A2A', marginBottom: 7 },
  title: { fontSize: 30, fontWeight: '800', color: '#4A2C18', marginBottom: 12 },
  body: { fontSize: 14, lineHeight: 23, color: '#6E5A49' },
  quoteCard: { backgroundColor: '#F3DEC5', borderRadius: 18, padding: 18, marginVertical: 22 },
  quote: { fontSize: 15, lineHeight: 23, fontWeight: '700', color: '#6F3518' },
  heading: { fontSize: 21, fontWeight: '800', color: '#4A2C18', marginBottom: 9 },
  back: { marginHorizontal: 22, marginBottom: 30, paddingVertical: 13 },
  backText: { color: '#8B4513', fontWeight: '800', fontSize: 14 },
});
