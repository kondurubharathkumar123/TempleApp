import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  background: '#FBF7F0',
  surface: '#FFFFFF',
  surfaceSoft: '#F7EFE5',
  primary: '#9B4B1E',
  primaryDark: '#713315',
  gold: '#C88A32',
  goldSoft: '#E9C98D',
  text: '#352218',
  textSoft: '#76665D',
  border: '#E9DED2',
  white: '#FFFFFF',
};

const programs = [
  {
    icon: 'ॐ',
    title: 'Dharmayatra',
    description: 'Join spiritual journeys, pilgrimages and meaningful temple programs.',
    meta: 'SPIRITUAL JOURNEY',
  },
  {
    icon: '✦',
    title: 'Special Programs',
    description: 'Discover upcoming gatherings, celebrations and spiritual programs.',
    meta: 'UPCOMING',
  },
];

const videos = [
  {
    icon: '▶',
    title: 'Live Darshan',
    description: 'Experience live darshan and stay connected with the divine presence.',
    label: 'LIVE NOW',
    url: 'https://youtu.be/51x9iP4UVik?si=LPEBV5d4IicFU4ks',
  },
  {
    icon: '◉',
    title: 'Devotional Videos',
    description: 'Watch spiritual talks, devotional content and temple programs.',
    label: 'WATCH',
    url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
  },
];

const insights = [
  'Daily spiritual message and blessings',
  'Important announcements and updates',
  'Devotional thoughts and messages',
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionHeadingLeft}>
        {eyebrow ? <Text style={styles.sectionEyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export default function ActivitiesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Premium hero */}
        <FadeIn>
          <LinearGradient
            colors={['#7A3516', '#A65321', '#C27B31']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroGlowOne} />
            <View style={styles.heroGlowTwo} />

            <View style={styles.heroTopRow}>
              <View style={styles.heroPill}>
                <View style={styles.liveDot} />
                <Text style={styles.heroPillText}>SPIRITUAL • COMMUNITY • SERVICE</Text>
              </View>

              <View style={styles.omBadge}>
                <Text style={styles.omText}>ॐ</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>Activities</Text>
            <Text style={styles.heroSubtitle}>
              Discover spiritual programs, seva, celebrations and moments of devotion.
            </Text>

            <View style={styles.heroBottom}>
              <View>
                <Text style={styles.heroSmallLabel}>A SPACE TO</Text>
                <Text style={styles.heroSmallValue}>Connect • Learn • Serve</Text>
              </View>
              <Text style={styles.heroSparkle}>✦</Text>
            </View>
          </LinearGradient>
        </FadeIn>

        {/* Intro */}
        <FadeIn delay={80}>
          <View style={styles.introCard}>
            <View style={styles.introIconWrap}>
              <Text style={styles.introIcon}>ॐ</Text>
            </View>
            <View style={styles.introCopy}>
              <Text style={styles.introTitle}>A living tradition</Text>
              <Text style={styles.introText}>
                Explore experiences that bring devotion, knowledge and community together.
              </Text>
            </View>
            <Text style={styles.introArrow}>↗</Text>
          </View>
        </FadeIn>

        {/* Main activity categories */}
        <FadeIn delay={140}>
          <SectionHeading eyebrow="EXPLORE" title="Spiritual Activities" />

          <Pressable
            style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
            onPress={() => router.push('/activities/yearly')}
          >
            <LinearGradient
              colors={['#FFF9F1', '#F5E4D0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureGradient}
            >
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>◷</Text>
              </View>

              <View style={styles.featureContent}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>Yearly Activities</Text>
                  <Text style={styles.featureArrow}>→</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Annual festivals, celebrations and important spiritual occasions.
                </Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>FESTIVALS & CELEBRATIONS</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
            onPress={() => router.push('/activities/social')}
          >
            <View style={styles.featurePlain}>
              <View style={[styles.featureIcon, styles.featureIconGold]}>
                <Text style={styles.featureIconText}>♧</Text>
              </View>

              <View style={styles.featureContent}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>Social Activities</Text>
                  <Text style={styles.featureArrow}>→</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Initiatives that encourage Sanatana Dharma, learning and community participation.
                </Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>COMMUNITY</Text>
                </View>
              </View>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
            onPress={() => router.push('/activities/services')}
          >
            <LinearGradient
              colors={['#FDF7EE', '#F1DDC7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureGradient}
            >
              <View style={[styles.featureIcon, styles.featureIconDark]}>
                <Text style={styles.featureIconText}>✦</Text>
              </View>

              <View style={styles.featureContent}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>Services</Text>
                  <Text style={styles.featureArrow}>→</Text>
                </View>
                <Text style={styles.featureDescription}>
                  Educational, charitable and community-service initiatives.
                </Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>SEVA</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </FadeIn>

        {/* Swamy Vani */}
        <FadeIn delay={220}>
          <SectionHeading eyebrow="DAILY REFLECTION" title="Swamy Vani" />

          <LinearGradient
            colors={['#2F2018', '#503225']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.vaniCard}
          >
            <View style={styles.vaniPattern}>
              <Text style={styles.vaniPatternText}>ॐ</Text>
            </View>

            <View style={styles.vaniTop}>
              <View style={styles.vaniBadge}>
                <Text style={styles.vaniBadgeText}>TODAY'S MESSAGE</Text>
              </View>
              <Text style={styles.vaniMark}>✦</Text>
            </View>

            <Text style={styles.vaniQuote}>
              “Walk with devotion and let faith guide every step.”
            </Text>

            <View style={styles.vaniDivider} />

            <Text style={styles.vaniDescription}>
              Daily sacred thoughts and spiritual messages for a peaceful beginning.
            </Text>
          </LinearGradient>
        </FadeIn>

        {/* Programs */}
        <FadeIn delay={300}>
          <SectionHeading
            eyebrow="DISCOVER"
            title="Dharmayatra & Programs"
            action="View all"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {programs.map((program) => (
              <Pressable
                key={program.title}
                style={({ pressed }) => [styles.programCard, pressed && styles.pressed]}
              >
                <View style={styles.programVisual}>
                  <View style={styles.programOrbLarge} />
                  <View style={styles.programOrbSmall} />
                  <Text style={styles.programIcon}>{program.icon}</Text>
                </View>

                <Text style={styles.programMeta}>{program.meta}</Text>
                <Text style={styles.programTitle}>{program.title}</Text>
                <Text style={styles.programDescription}>{program.description}</Text>

                <View style={styles.programFooter}>
                  <Text style={styles.programLink}>Explore</Text>
                  <Text style={styles.programArrow}>↗</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </FadeIn>

        {/* Seva CTA */}
        <FadeIn delay={360}>
          <LinearGradient
            colors={['#914417', '#B66024']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sevaCard}
          >
            <View style={styles.sevaDecorOne} />
            <View style={styles.sevaDecorTwo} />

            <View style={styles.sevaIconWrap}>
              <Text style={styles.sevaIcon}>✦</Text>
            </View>

            <Text style={styles.sevaEyebrow}>OFFER YOUR SERVICE</Text>
            <Text style={styles.sevaTitle}>Serve with devotion</Text>
            <Text style={styles.sevaText}>
              Participate in seva and contribute your time, skills and presence.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.sevaButton, pressed && styles.buttonPressed]}
              onPress={() => router.push('/pooja')}
            >
              <Text style={styles.sevaButtonText}>Explore Seva</Text>
              <Text style={styles.sevaButtonArrow}>→</Text>
            </Pressable>
          </LinearGradient>
        </FadeIn>

        {/* Videos */}
        <FadeIn delay={420}>
          <SectionHeading eyebrow="WATCH & EXPERIENCE" title="Darshan & Videos" />

          {videos.map((video, index) => (
            <Pressable
              key={video.title}
              style={({ pressed }) => [styles.videoCard, pressed && styles.pressed]}
              onPress={() => Linking.openURL(video.url)}>
            
              <LinearGradient
                colors={index === 0 ? ['#4D2112', '#9B4B1E'] : ['#EED9C1', '#F8EFE5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.videoVisual}
              >
                <Text
                  style={[
                    styles.videoIcon,
                    index !== 0 && styles.videoIconDark,
                  ]}
                >
                  {video.icon}
                </Text>
                {index === 0 ? (
                  <View style={styles.videoLiveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.videoLiveText}>LIVE</Text>
                  </View>
                ) : null}
              </LinearGradient>

              <View style={styles.videoContent}>
                <Text style={styles.videoLabel}>{video.label}</Text>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoDescription}>{video.description}</Text>
                <Text style={styles.watchText}>Watch now  →</Text>
              </View>
            </Pressable>
          ))}
        </FadeIn>

        {/* Event */}
        <FadeIn delay={480}>
          <SectionHeading eyebrow="MARK YOUR CALENDAR" title="Upcoming Event" />

          <Pressable
            style={({ pressed }) => [styles.eventCard, pressed && styles.pressed]}
          >
            <View style={styles.eventDate}>
              <Text style={styles.eventMonth}>SEP</Text>
              <Text style={styles.eventDay}>07</Text>
              <Text style={styles.eventYear}>2026</Text>
            </View>

            <View style={styles.eventContent}>
              <View style={styles.eventTag}>
                <Text style={styles.eventTagText}>SPIRITUAL GATHERING</Text>
              </View>
              <Text style={styles.eventTitle}>Temple Festival</Text>
              <Text style={styles.eventDescription}>
                Celebrate together with the spiritual community in an atmosphere of devotion.
              </Text>
              <Text style={styles.eventLink}>View event  →</Text>
            </View>
          </Pressable>
        </FadeIn>

        {/* Insights */}
        <FadeIn delay={540}>
          <SectionHeading eyebrow="STAY CONNECTED" title="Insights & Messages" />

          <View style={styles.insightsCard}>
            {insights.map((item, index) => (
              <Pressable
                key={item}
                style={({ pressed }) => [
                  styles.insightRow,
                  index !== insights.length - 1 && styles.insightBorder,
                  pressed && styles.rowPressed,
                ]}
              >
                <View style={styles.insightNumber}>
                  <Text style={styles.insightNumberText}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>

                <Text style={styles.insightText}>{item}</Text>
                <Text style={styles.insightArrow}>↗</Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

        <Text style={styles.bottomNote}>
          More activities, programs and live updates can be connected through the backend later.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 44,
  },

  hero: {
    minHeight: 285,
    borderRadius: 30,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 18,
  },

  heroGlowOne: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -60,
    top: -70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  heroGlowTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    left: -65,
    bottom: -70,
    backgroundColor: 'rgba(255,214,151,0.08)',
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F4C46C',
    marginRight: 7,
  },

  heroPillText: {
    color: '#FCE9D0',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  omBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  omText: {
    color: '#FFF5E7',
    fontSize: 25,
    fontWeight: '500',
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: Math.min(44, SCREEN_WIDTH * 0.115),
    lineHeight: 52,
    fontWeight: '800',
    letterSpacing: -1.3,
    marginTop: 38,
  },

  heroSubtitle: {
    color: '#F9EBDD',
    fontSize: 12,
    lineHeight: 19,
    maxWidth: 300,
    marginTop: 7,
  },

  heroBottom: {
    marginTop: 28,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  heroSmallLabel: {
    color: '#EBC59C',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  heroSmallValue: {
    color: '#FFF7EC',
    fontSize: 11,
    fontWeight: '700',
  },

  heroSparkle: {
    color: '#F4C46C',
    fontSize: 25,
  },

  introCard: {
    minHeight: 88,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 27,
  },

  introIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  introIcon: {
    fontSize: 29,
    color: COLORS.primary,
  },

  introCopy: {
    flex: 1,
    paddingRight: 8,
  },

  introTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },

  introText: {
    color: COLORS.textSoft,
    fontSize: 10.5,
    lineHeight: 16,
  },

  introArrow: {
    color: COLORS.primary,
    fontSize: 22,
  },

  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionHeadingLeft: {
    flex: 1,
  },

  sectionEyebrow: {
    color: COLORS.gold,
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 4,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.35,
  },

  sectionAction: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 3,
  },

  featureCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  featureGradient: {
    padding: 15,
    flexDirection: 'row',
  },

  featurePlain: {
    padding: 15,
    flexDirection: 'row',
  },

  featureIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#EBD0B2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  featureIconGold: {
    backgroundColor: '#F0E2C8',
  },

  featureIconDark: {
    backgroundColor: '#E4C19D',
  },

  featureIconText: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '500',
  },

  featureContent: {
    flex: 1,
  },

  featureTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  featureTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },

  featureArrow: {
    color: COLORS.primary,
    fontSize: 19,
    marginLeft: 8,
  },

  featureDescription: {
    color: COLORS.textSoft,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },

  chip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(155,75,30,0.08)',
  },

  chipText: {
    color: COLORS.primary,
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  vaniCard: {
    minHeight: 220,
    borderRadius: 26,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 28,
  },

  vaniPattern: {
    position: 'absolute',
    right: -22,
    bottom: -28,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,210,149,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  vaniPatternText: {
    color: 'rgba(255,220,170,0.13)',
    fontSize: 85,
  },

  vaniTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  vaniBadge: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },

  vaniBadgeText: {
    color: '#EFC68F',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },

  vaniMark: {
    color: '#EFC68F',
    fontSize: 17,
  },

  vaniQuote: {
    color: COLORS.white,
    fontSize: 20,
    lineHeight: 29,
    fontWeight: '700',
    letterSpacing: -0.25,
    marginTop: 27,
    maxWidth: 315,
  },

  vaniDivider: {
    width: 42,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 18,
    marginBottom: 11,
    borderRadius: 2,
  },

  vaniDescription: {
    color: '#D6C5B8',
    fontSize: 10,
    lineHeight: 16,
    maxWidth: 300,
  },

  horizontalList: {
    paddingBottom: 8,
    paddingRight: 4,
  },

  programCard: {
    width: Math.min(245, SCREEN_WIDTH * 0.68),
    minHeight: 292,
    backgroundColor: COLORS.surface,
    borderRadius: 23,
    marginRight: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  programVisual: {
    height: 126,
    borderRadius: 17,
    backgroundColor: '#F3E3D1',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  programOrbLarge: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: '#E5C6A2',
    top: 18,
    left: 50,
  },

  programOrbSmall: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#D5A66E',
    top: 12,
    left: 17,
  },

  programIcon: {
    color: COLORS.primary,
    fontSize: 50,
    zIndex: 2,
  },

  programMeta: {
    color: COLORS.gold,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  programTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 5,
  },

  programDescription: {
    color: COLORS.textSoft,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 6,
  },

  programFooter: {
    marginTop: 'auto',
    paddingTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  programLink: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },

  programArrow: {
    color: COLORS.primary,
    fontSize: 18,
  },

  sevaCard: {
    borderRadius: 27,
    padding: 20,
    marginTop: 20,
    marginBottom: 29,
    overflow: 'hidden',
  },

  sevaDecorOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -75,
    top: -80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  sevaDecorTwo: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    right: -35,
    bottom: -55,
    backgroundColor: 'rgba(255,211,145,0.09)',
  },

  sevaIconWrap: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },

  sevaIcon: {
    color: '#FFD89D',
    fontSize: 20,
  },

  sevaEyebrow: {
    color: '#F1C98E',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  sevaTitle: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: '800',
    marginTop: 4,
  },

  sevaText: {
    color: '#F3DDD0',
    fontSize: 10.5,
    lineHeight: 17,
    marginTop: 7,
    maxWidth: 310,
  },

  sevaButton: {
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    marginTop: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sevaButtonText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '900',
  },

  sevaButtonArrow: {
    color: COLORS.primary,
    fontSize: 20,
  },

  videoCard: {
    minHeight: 112,
    backgroundColor: COLORS.surface,
    borderRadius: 21,
    padding: 10,
    flexDirection: 'row',
    marginBottom: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  videoVisual: {
    width: 102,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },

  videoIcon: {
    color: COLORS.white,
    fontSize: 29,
  },

  videoIconDark: {
    color: COLORS.primary,
  },

  videoLiveBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: 'rgba(0,0,0,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  videoLiveText: {
    color: COLORS.white,
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  videoContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 5,
  },

  videoLabel: {
    color: COLORS.gold,
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },

  videoTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },

  videoDescription: {
    color: COLORS.textSoft,
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 4,
  },

  watchText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    marginTop: 7,
  },

  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
  },

  eventDate: {
    width: 73,
    minHeight: 100,
    borderRadius: 16,
    backgroundColor: '#F3E2CE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  eventMonth: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  eventDay: {
    color: COLORS.text,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '900',
  },

  eventYear: {
    color: COLORS.textSoft,
    fontSize: 7,
    fontWeight: '800',
  },

  eventContent: {
    flex: 1,
    justifyContent: 'center',
  },

  eventTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8EEE3',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    marginBottom: 5,
  },

  eventTagText: {
    color: COLORS.primary,
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  eventTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },

  eventDescription: {
    color: COLORS.textSoft,
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 4,
  },

  eventLink: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    marginTop: 7,
  },

  insightsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  insightRow: {
    minHeight: 67,
    flexDirection: 'row',
    alignItems: 'center',
  },

  insightBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  insightNumber: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  insightNumberText: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: '900',
  },

  insightText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '600',
  },

  insightArrow: {
    color: COLORS.primary,
    fontSize: 19,
    marginLeft: 9,
  },

  bottomNote: {
    textAlign: 'center',
    color: '#A69A91',
    fontSize: 9,
    lineHeight: 14,
    paddingHorizontal: 25,
    marginTop: 24,
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  rowPressed: {
    opacity: 0.65,
  },
});
