import { apiRequest } from '@/services/api';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  bg: '#FFF9F0',
  brown: '#4A2C18',
  darkBrown: '#6F3518',
  gold: '#C58A2A',
  cream: '#F8E8D2',
  white: '#FFFFFF',
  muted: '#7C6B5D',
  line: '#EADCCB',
};

const GURU_DATA = [
  {
    id: '1',
    name: 'Sri Guru',
    title: 'Paramaguru',
    bio: 'A guiding presence in the spiritual lineage, inspiring devotees through wisdom, devotion and service.',
    image:
      'https://images.unsplash.com/photo-1604608672516-f1b9b1e3c5f7?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: '2',
    name: 'Sri Acharya',
    title: 'Acharya',
    bio: 'A revered teacher who carried the tradition forward through spiritual learning and compassionate guidance.',
    image:
      'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: '3',
    name: 'Sri Swamiji',
    title: 'Spiritual Guide',
    bio: 'Known for devotional teachings, discipline and a life dedicated to the welfare of devotees.',
    image:
      'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=700&q=85',
  },
];

export default function HomeScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await apiRequest('/events');

      if (response.success && Array.isArray(response.data)) {
        setEvents(response.data.slice(0, 2));
      }
    } catch (error) {
      console.error('Home events error:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome 🙏</Text>
            <Text style={styles.title}>Temple App</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.banner}>
          <Text style={styles.om}>ॐ</Text>
          <Text style={styles.bannerEyebrow}>DIVINE • DEVOTION • SERVICE</Text>
          <Text style={styles.bannerTitle}>Welcome to Our Temple</Text>
          <Text style={styles.bannerText}>
            Connect with devotion, events, spiritual wisdom and temple
            services.
          </Text>

          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => router.push('/darshan')}
            activeOpacity={0.85}
          >
            <Text style={styles.bannerButtonText}>Explore Temple</Text>
            <Text style={styles.bannerButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <View style={styles.grid}>
          <QuickAction icon="🙏" title="Darshan" onPress={() => router.push('/darshan')} />
          <QuickAction icon="📅" title="Events" onPress={() => router.push('/events')} />
          <QuickAction icon="🎫" title="Bookings" onPress={() => router.push('/bookings')} />
          <QuickAction icon="💰" title="Donations" onPress={() => router.push('/donations')} />
          <QuickAction icon="🛕" title="Deities" onPress={() => router.push('/deities')} />
          <QuickAction icon="🪔" title="Seva Registration" onPress={() => router.push('/seva-registration')} />
        </View>

        {/* About Sreemath */}
        <SectionHeading title="About Sreemath" />

        <TouchableOpacity
          style={styles.aboutCard}
          onPress={() => router.push('/about-sreemath')}
          activeOpacity={0.9}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
            }}
            style={styles.aboutImage}
          />

          <View style={styles.aboutOverlay}>
            <Text style={styles.aboutLabel}>OUR SPIRITUAL HERITAGE</Text>
            <Text style={styles.aboutTitle}>Sreemath</Text>
            <Text style={styles.aboutText}>
              Discover the history, traditions, values and spiritual
              significance of Sreemath.
            </Text>

            <View style={styles.readMore}>
              <Text style={styles.readMoreText}>Read Full Story</Text>
              <Text style={styles.readMoreArrow}>→</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Agasthya */}
        <SectionHeading title="Agasthya" />

        <TouchableOpacity
          style={styles.agasthyaCard}
          onPress={() => router.push('/agasthya')}
          activeOpacity={0.9}
        >
          <View style={styles.agasthyaIconCircle}>
            <Text style={styles.agasthyaIcon}>ॐ</Text>
          </View>

          <View style={styles.agasthyaContent}>
            <Text style={styles.cardEyebrow}>DEVOTIONAL STORIES</Text>
            <Text style={styles.agasthyaTitle}>
              Stories, wisdom & spiritual content
            </Text>
            <Text style={styles.agasthyaText}>
              Explore inspiring devotional stories, teachings and timeless
              spiritual reflections.
            </Text>

            <View style={styles.smallLink}>
              <Text style={styles.smallLinkText}>Explore Agasthya</Text>
              <Text style={styles.smallLinkArrow}>›</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Guru Parampara */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Guru Parampara</Text>

          <TouchableOpacity onPress={() => router.push('/guru-parampara')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionIntro}>
          Walk through the sacred spiritual lineage and learn about the Gurus.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.guruScroll}
        >
          {GURU_DATA.map((guru) => (
            <TouchableOpacity
              key={guru.id}
              style={styles.guruCard}
              onPress={() => router.push('/guru-parampara')}
              activeOpacity={0.9}
            >
              <Image source={{ uri: guru.image }} style={styles.guruImage} />

              <View style={styles.guruBody}>
                <Text style={styles.guruTitle}>{guru.title}</Text>
                <Text style={styles.guruName}>{guru.name}</Text>
                <Text style={styles.guruBio} numberOfLines={3}>
                  {guru.bio}
                </Text>

                <Text style={styles.guruRead}>Read Biography  →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Room Booking */}
        <View style={styles.roomBookingCard}>
          <View style={styles.roomBookingContent}>
            <Text style={styles.roomBookingLabel}>TEMPLE STAY</Text>
            <Text style={styles.roomBookingTitle}>Room Booking</Text>
            <Text style={styles.roomBookingText}>
              Book a comfortable room for your temple visit.
            </Text>

            <TouchableOpacity
              style={styles.roomBookingButton}
              onPress={() => router.push('/rooms')}
            >
              <Text style={styles.roomBookingButtonText}>Book a Room</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.roomBookingIcon}>🏨</Text>
        </View>

        {/* Upcoming Events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>

          <TouchableOpacity onPress={() => router.push('/events')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {eventsLoading ? (
          <Text style={styles.loadingText}>Loading events...</Text>
        ) : events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              date={
                event.event_date
                  ? new Date(event.event_date)
                      .toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                      })
                      .toUpperCase()
                  : 'DATE'
              }
              title={event.title}
              description={
                event.description || 'Join us for this temple event.'
              }
              onPress={() => router.push('/events')}
            />
          ))
        ) : (
          <Text style={styles.loadingText}>No upcoming events.</Text>
        )}

        {/* Devotional */}
        <Text style={styles.sectionTitle}>Devotional</Text>

        <TouchableOpacity
          style={styles.devotionalCard}
          onPress={() => router.push('/darshan')}
        >
          <Text style={styles.devotionalIcon}>🪔</Text>

          <View style={styles.devotionalContent}>
            <Text style={styles.devotionalTitle}>Daily Prayer</Text>
            <Text style={styles.devotionalText}>
              Start your day with prayer and blessings.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Temple Services */}
        <Text style={styles.sectionTitle}>Temple Services</Text>

        <View style={styles.serviceCard}>
          <ServiceRow
            icon="🛕"
            title="Temple Information"
            onPress={() => router.push('/darshan')}
          />
          <ServiceRow
            icon="📿"
            title="Pooja Services"
            onPress={() => router.push('/pooja')}
          />
          <ServiceRow
            icon="🪔"
            title="Seva Registration"
            onPress={() => router.push('/seva-registration')}
          />
          <ServiceRow
            icon="📍"
            title="Temple Location"
            onPress={() => router.push('/darshan')}
          />
          <ServiceRow
            icon="☎️"
            title="Contact Temple"
            onPress={() => router.push('/contact')}
            last
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeading({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function QuickAction({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.actionIconWrap}>
        <Text style={styles.actionIcon}>{icon}</Text>
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

function EventCard({
  date,
  title,
  description,
  onPress,
}: {
  date: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventDescription}>{description}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

function ServiceRow({
  icon,
  title,
  onPress,
  last,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.serviceRow, last && styles.lastServiceRow]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.serviceIcon}>{icon}</Text>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.brown,
  },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 3,
  },
  notificationIcon: {
    fontSize: 21,
  },
  banner: {
    backgroundColor: COLORS.darkBrown,
    borderRadius: 26,
    padding: 24,
    marginBottom: 26,
    overflow: 'hidden',
  },
  om: {
    fontSize: 40,
    color: '#FFD98A',
    marginBottom: 4,
  },
  bannerEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: '#EBCB9C',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#F9E9D5',
    marginBottom: 19,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF8ED',
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerButtonText: {
    color: COLORS.darkBrown,
    fontWeight: '800',
    fontSize: 12,
  },
  bannerButtonArrow: {
    color: COLORS.gold,
    fontSize: 18,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 13,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 19,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#F0E5D8',
    elevation: 2,
  },
  actionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 23,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brown,
  },
  aboutCard: {
    height: 270,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 22,
    backgroundColor: '#6E4025',
    elevation: 4,
  },
  aboutImage: {
    width: '100%',
    height: '100%',
  },
  aboutOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingTop: 70,
    backgroundColor: 'rgba(55, 28, 12, 0.72)',
  },
  aboutLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#F2D29D',
    marginBottom: 4,
  },
  aboutTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#FFF3E5',
    marginBottom: 12,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: '#FFD98A',
    fontWeight: '800',
    fontSize: 12,
  },
  readMoreArrow: {
    color: '#FFD98A',
    fontSize: 18,
    marginLeft: 7,
  },
  agasthyaCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderRadius: 23,
    padding: 17,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: '#EADBC8',
    elevation: 2,
  },
  agasthyaIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  agasthyaIcon: {
    fontSize: 28,
    color: COLORS.gold,
  },
  agasthyaContent: {
    flex: 1,
  },
  cardEyebrow: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: COLORS.gold,
    marginBottom: 4,
  },
  agasthyaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 5,
  },
  agasthyaText: {
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.muted,
  },
  smallLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  smallLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkBrown,
  },
  smallLinkArrow: {
    fontSize: 20,
    color: COLORS.gold,
    marginLeft: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAll: {
    color: COLORS.gold,
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 13,
  },
  sectionIntro: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -7,
    marginBottom: 13,
  },
  guruScroll: {
    paddingRight: 8,
    paddingBottom: 5,
    marginBottom: 22,
  },
  guruCard: {
    width: 225,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 13,
    borderWidth: 1,
    borderColor: '#EADBC8',
    elevation: 3,
  },
  guruImage: {
    width: '100%',
    height: 145,
    backgroundColor: COLORS.cream,
  },
  guruBody: {
    padding: 14,
  },
  guruTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.gold,
    marginBottom: 3,
  },
  guruName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 6,
  },
  guruBio: {
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.muted,
    minHeight: 50,
  },
  guruRead: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.darkBrown,
    marginTop: 10,
  },
  roomBookingCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomBookingContent: {
    flex: 1,
  },
  roomBookingLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#A66A3D',
    marginBottom: 5,
  },
  roomBookingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 5,
  },
  roomBookingText: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.muted,
    marginBottom: 12,
  },
  roomBookingButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.darkBrown,
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 9,
  },
  roomBookingButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  roomBookingIcon: {
    fontSize: 48,
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 18,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E5D8',
    elevation: 2,
  },
  dateBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkBrown,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 18,
  },
  devotionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 19,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E8D4BB',
  },
  devotionalIcon: {
    fontSize: 30,
    marginRight: 14,
  },
  devotionalContent: {
    flex: 1,
  },
  devotionalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 4,
  },
  devotionalText: {
    fontSize: 12,
    color: '#6E5542',
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 19,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#F0E5D8',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E9E0',
  },
  lastServiceRow: {
    borderBottomWidth: 0,
  },
  serviceIcon: {
    fontSize: 21,
    width: 40,
  },
  serviceTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brown,
  },
  arrow: {
    fontSize: 28,
    color: '#A89483',
    marginLeft: 8,
  },
});
