
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ContactScreen() {
  const phoneNumber = 'tel:+919019977466';
  const guestHouseNumber = 'tel:+919448187559';
  const bangaloreNumber = 'tel:08026426116';
  const email = 'mailto:hhpuraoff@gmail.com';

  const mapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Hariharapura%2C+Chikmagalur+district%2C+Karnataka%2C+India+577120';

  const openPhone = () => {
    Linking.openURL(phoneNumber);
  };

  const openGuestHouse = () => {
    Linking.openURL(guestHouseNumber);
  };

  const openBangalore = () => {
    Linking.openURL(bangaloreNumber);
  };

  const openEmail = () => {
    Linking.openURL(email);
  };

  const openMaps = () => {
    Linking.openURL(mapsUrl);
  };

  const ContactRow = ({
    icon,
    iconBg,
    title,
    value,
    description,
    onPress,
    last = false,
  }: {
    icon: string;
    iconBg: string;
    title: string;
    value: string;
    description: string;
    onPress: () => void;
    last?: boolean;
  }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[styles.contactRow, last && styles.contactRowLast]}
      onPress={onPress}
    >
      <View style={[styles.contactIcon, { backgroundColor: iconBg }]}>
        <Text style={styles.contactIconText}>{icon}</Text>
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>

        <Text
          style={styles.contactValue}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {value}
        </Text>

        <Text style={styles.contactDescription}>{description}</Text>
      </View>

      <View style={styles.actionCircle}>
        <Text style={styles.actionArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces
      >
        {/* ---------------------------------------------------------
            PREMIUM HEADER
        --------------------------------------------------------- */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlowOne} />
          <View style={styles.heroGlowTwo} />

          <View style={styles.heroTopRow}>
            <View style={styles.templeBadge}>
              <Text style={styles.templeBadgeIcon}>ॐ</Text>
            </View>

            <View style={styles.heroTag}>
              <View style={styles.statusDot} />
              <Text style={styles.heroTagText}>OFFICIAL CONTACT</Text>
            </View>
          </View>

          <Text style={styles.overline}>SRI MATHA HARIHARAPURA</Text>

          <Text style={styles.heroTitle}>
            Connect With
            {'\n'}
            Sreemath
          </Text>

          <Text style={styles.heroSubtitle}>
            Reach us for temple services, accommodation,
            branch information and devotee assistance.
          </Text>

          <View style={styles.heroBottom}>
            <View>
              <Text style={styles.heroLocationLabel}>MAIN LOCATION</Text>
              <Text style={styles.heroLocation}>
                Hariharapura • Karnataka
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.heroMapButton}
              onPress={openMaps}
            >
              <Text style={styles.heroMapIcon}>⌖</Text>
              <Text style={styles.heroMapText}>MAP</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------------------------------------------------------
            QUICK ACTIONS
        --------------------------------------------------------- */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.quickAction}
            onPress={openPhone}
          >
            <View style={[styles.quickIcon, styles.callIcon]}>
              <Text style={styles.quickIconText}>☎</Text>
            </View>
            <Text style={styles.quickText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.quickAction}
            onPress={openGuestHouse}
          >
            <View style={[styles.quickIcon, styles.stayIcon]}>
              <Text style={styles.quickIconText}>⌂</Text>
            </View>
            <Text style={styles.quickText}>Guest House</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.quickAction}
            onPress={openEmail}
          >
            <View style={[styles.quickIcon, styles.emailIcon]}>
              <Text style={styles.quickIconText}>✉</Text>
            </View>
            <Text style={styles.quickText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.quickAction}
            onPress={openMaps}
          >
            <View style={[styles.quickIcon, styles.mapIcon]}>
              <Text style={styles.quickIconText}>⌖</Text>
            </View>
            <Text style={styles.quickText}>Directions</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------------------------
            CONTACT SECTION
        --------------------------------------------------------- */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>GET IN TOUCH</Text>
            <Text style={styles.sectionTitle}>Contact Sreemath</Text>
          </View>

          <View style={styles.sectionLine} />
        </View>

        <View style={styles.contactCard}>
          <ContactRow
            icon="☎"
            iconBg="#F9E8D7"
            title="Sreemath Hariharapura"
            value="+91 901 997 7466"
            description="Tap to call the Sreemath office"
            onPress={openPhone}
          />

          <ContactRow
            icon="⌂"
            iconBg="#F4E6CE"
            title="Guest House"
            value="+91 944 818 7559"
            description="For guest house enquiries"
            onPress={openGuestHouse}
          />

          <ContactRow
            icon="☎"
            iconBg="#EFE3D4"
            title="Sreemath Bangalore Branch"
            value="080-26426116"
            description="Tap to call the Bengaluru branch"
            onPress={openBangalore}
          />

          <ContactRow
            icon="✉"
            iconBg="#F7E7E0"
            title="Email Address"
            value="hhpuraoff@gmail.com"
            description="Send us your enquiry by email"
            onPress={openEmail}
            last
          />
        </View>

        {/* ---------------------------------------------------------
            HARIHARAPURA ADDRESS
        --------------------------------------------------------- */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>VISIT US</Text>
            <Text style={styles.sectionTitle}>Sreemath Address</Text>
          </View>

          <View style={styles.sectionLine} />
        </View>

        <View style={styles.addressCard}>
          <View style={styles.addressPatternOne} />
          <View style={styles.addressPatternTwo} />

          <View style={styles.addressTop}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>⌖</Text>
            </View>

            <View style={styles.addressHeading}>
              <Text style={styles.addressLabel}>HARIHARAPURA</Text>
              <Text style={styles.addressSmall}>
                Chikmagalur District
              </Text>
            </View>
          </View>

          <View style={styles.addressDivider} />

          <Text style={styles.addressText}>
            Hariharapura, Chikmagalur district,
            {'\n'}
            Karnataka, India - 577120
          </Text>

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.directionButton}
            onPress={openMaps}
          >
            <View style={styles.directionIcon}>
              <Text style={styles.directionIconText}>⌖</Text>
            </View>

            <View style={styles.directionContent}>
              <Text style={styles.directionTitle}>Get Directions</Text>
              <Text style={styles.directionSubtitle}>
                Open this location in Google Maps
              </Text>
            </View>

            <Text style={styles.directionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------------------------
            BANGALORE BRANCH
        --------------------------------------------------------- */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>CITY BRANCH</Text>
            <Text style={styles.sectionTitle}>Bengaluru Office</Text>
          </View>

          <View style={styles.sectionLine} />
        </View>

        <View style={styles.branchCard}>
          <View style={styles.branchHeader}>
            <View style={styles.branchIcon}>
              <Text style={styles.branchIconText}>⌂</Text>
            </View>

            <View style={styles.branchHeading}>
              <Text style={styles.branchName}>
                Sreemath Bangalore Branch
              </Text>

              <View style={styles.branchStatus}>
                <View style={styles.branchStatusDot} />
                <Text style={styles.branchStatusText}>
                  BENGALURU
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.branchAddress}>
            1370/M, Nehru Road,
            {'\n'}
            1st phase Girinagar,
            {'\n'}
            Bengaluru, Karnataka 560085
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.branchCallButton}
            onPress={openBangalore}
          >
            <Text style={styles.branchCallIcon}>☎</Text>
            <Text style={styles.branchCallText}>
              080-26426116
            </Text>
            <Text style={styles.branchCallArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------------------------
            EMAIL FEATURE
        --------------------------------------------------------- */}
        <View style={styles.emailFeature}>
          <View style={styles.emailFeatureGlow} />

          <View style={styles.emailFeatureIcon}>
            <Text style={styles.emailFeatureIconText}>✉</Text>
          </View>

          <View style={styles.emailFeatureContent}>
            <Text style={styles.emailFeatureEyebrow}>
              WRITE TO US
            </Text>

            <Text style={styles.emailFeatureTitle}>
              hhPura Office
            </Text>

            <Text style={styles.emailFeatureAddress}>
              hhpuraoff@gmail.com
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.emailSendButton}
            onPress={openEmail}
          >
            <Text style={styles.emailSendText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------------------------
            DEVOTEE NOTE
        --------------------------------------------------------- */}
        <View style={styles.noteCard}>
          <View style={styles.noteIcon}>
            <Text style={styles.noteIconText}>ॐ</Text>
          </View>

          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>For Devotees</Text>
            <Text style={styles.noteText}>
              For temple visits, accommodation and other
              enquiries, please contact the appropriate
              number above.
            </Text>
          </View>
        </View>

        {/* ---------------------------------------------------------
            BACK HOME
        --------------------------------------------------------- */}
        <TouchableOpacity
          activeOpacity={0.86}
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeButtonIcon}>‹</Text>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Sreemath Hariharapura
          {'  •  '}
          Karnataka
        </Text>

        <View style={styles.bottomOrnament}>
          <View style={styles.ornamentLine} />
          <Text style={styles.ornamentSymbol}>✦</Text>
          <View style={styles.ornamentLine} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7F0',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 36,
  },

  // ---------------------------------------------------------------
  // HERO
  // ---------------------------------------------------------------

  heroCard: {
    minHeight: 285,
    borderRadius: 30,
    padding: 22,
    overflow: 'hidden',
    backgroundColor: '#4B2618',
    marginBottom: 15,

    ...Platform.select({
      ios: {
        shadowColor: '#5A2D1B',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.22,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  heroGlowOne: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: 'rgba(214,157,76,0.14)',
    right: -70,
    top: -55,
  },

  heroGlowTwo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: 'rgba(255,226,172,0.08)',
    left: -65,
    bottom: -55,
  },

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  templeBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(255,226,172,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  templeBadgeIcon: {
    fontSize: 24,
    color: '#F3D59C',
    fontWeight: '600',
  },

  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DDB16A',
    marginRight: 7,
  },

  heroTagText: {
    fontSize: 8,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: '#E9D5B1',
  },

  overline: {
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '800',
    color: '#D8A968',
    marginBottom: 9,
  },

  heroTitle: {
    fontSize: width < 370 ? 32 : 36,
    lineHeight: width < 370 ? 38 : 42,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#FFF8EC',
  },

  heroSubtitle: {
    fontSize: 12,
    lineHeight: 19,
    color: '#D9C6B4',
    marginTop: 12,
    maxWidth: 315,
  },

  heroBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 23,
  },

  heroLocationLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: '#AA8D77',
    marginBottom: 4,
  },

  heroLocation: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E9D9C9',
  },

  heroMapButton: {
    width: 57,
    height: 57,
    borderRadius: 19,
    backgroundColor: '#D29A4A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroMapIcon: {
    fontSize: 21,
    color: '#3D2115',
    lineHeight: 22,
  },

  heroMapText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#4A2918',
    marginTop: 1,
  },

  // ---------------------------------------------------------------
  // QUICK ACTIONS
  // ---------------------------------------------------------------

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 26,

    ...Platform.select({
      ios: {
        shadowColor: '#8A654B',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  quickAction: {
    width: '25%',
    alignItems: 'center',
  },

  quickIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  callIcon: {
    backgroundColor: '#F7E4D3',
  },

  stayIcon: {
    backgroundColor: '#F4EAD5',
  },

  emailIcon: {
    backgroundColor: '#F2E4E0',
  },

  mapIcon: {
    backgroundColor: '#E9E7DA',
  },

  quickIconText: {
    fontSize: 19,
    color: '#694127',
    fontWeight: '700',
  },

  quickText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#684C3A',
    textAlign: 'center',
  },

  // ---------------------------------------------------------------
  // SECTION
  // ---------------------------------------------------------------

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 2,
  },

  sectionEyebrow: {
    fontSize: 8,
    letterSpacing: 1.5,
    fontWeight: '900',
    color: '#B2793F',
    marginBottom: 3,
  },

  sectionTitle: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '800',
    color: '#432619',
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5D8C9',
    marginLeft: 13,
    marginBottom: 5,
  },

  // ---------------------------------------------------------------
  // CONTACT CARD
  // ---------------------------------------------------------------

  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    paddingHorizontal: 15,
    marginBottom: 27,

    ...Platform.select({
      ios: {
        shadowColor: '#745038',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 13,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  contactRow: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DE',
  },

  contactRowLast: {
    borderBottomWidth: 0,
  },

  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  contactIconText: {
    fontSize: 21,
    color: '#70472B',
    fontWeight: '700',
  },

  contactInfo: {
    flex: 1,
    paddingVertical: 13,
  },

  contactTitle: {
    fontSize: 10,
    letterSpacing: 0.3,
    fontWeight: '800',
    color: '#8D725F',
    marginBottom: 3,
  },

  contactValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    color: '#4A2B1B',
    marginBottom: 2,
  },

  contactDescription: {
    fontSize: 9,
    lineHeight: 14,
    color: '#A29489',
  },

  actionCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  actionArrow: {
    fontSize: 22,
    lineHeight: 23,
    color: '#AD7640',
    marginTop: -2,
  },

  // ---------------------------------------------------------------
  // ADDRESS
  // ---------------------------------------------------------------

  addressCard: {
    backgroundColor: '#F0DFC6',
    borderRadius: 25,
    padding: 19,
    overflow: 'hidden',
    marginBottom: 27,
    borderWidth: 1,
    borderColor: '#E4CCAB',
  },

  addressPatternOne: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 80,
    borderWidth: 20,
    borderColor: 'rgba(164,112,56,0.07)',
    right: -55,
    top: -45,
  },

  addressPatternTwo: {
    position: 'absolute',
    width: 95,
    height: 95,
    borderRadius: 60,
    borderWidth: 12,
    borderColor: 'rgba(164,112,56,0.06)',
    left: -45,
    bottom: -35,
  },

  addressTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFF9F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  locationIconText: {
    fontSize: 23,
    color: '#80512D',
  },

  addressHeading: {
    flex: 1,
  },

  addressLabel: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '900',
    color: '#53311F',
  },

  addressSmall: {
    fontSize: 9,
    color: '#876A52',
    marginTop: 3,
  },

  addressDivider: {
    height: 1,
    backgroundColor: 'rgba(116,78,45,0.15)',
    marginVertical: 15,
  },

  addressText: {
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '600',
    color: '#5E493A',
  },

  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A2A1B',
    borderRadius: 17,
    padding: 10,
    marginTop: 17,
  },

  directionIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#D8A15A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  directionIconText: {
    fontSize: 19,
    color: '#4B2918',
  },

  directionContent: {
    flex: 1,
    marginLeft: 11,
  },

  directionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF8ED',
  },

  directionSubtitle: {
    fontSize: 8,
    color: '#CBB9A9',
    marginTop: 2,
  },

  directionArrow: {
    fontSize: 20,
    color: '#E2B46F',
    marginRight: 7,
  },

  // ---------------------------------------------------------------
  // BANGALORE BRANCH
  // ---------------------------------------------------------------

  branchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 18,
    marginBottom: 27,

    ...Platform.select({
      ios: {
        shadowColor: '#76543D',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.07,
        shadowRadius: 13,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  branchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  branchIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: '#F1E5D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  branchIconText: {
    fontSize: 23,
    color: '#71472C',
  },

  branchHeading: {
    flex: 1,
  },

  branchName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4A2B1C',
    lineHeight: 18,
  },

  branchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  branchStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B78A50',
    marginRight: 6,
  },

  branchStatusText: {
    fontSize: 7,
    letterSpacing: 1.1,
    fontWeight: '900',
    color: '#A08064',
  },

  branchAddress: {
    fontSize: 11,
    lineHeight: 18,
    color: '#78695E',
    marginTop: 17,
    paddingLeft: 2,
  },

  branchCallButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F8F1E8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginTop: 16,
  },

  branchCallIcon: {
    fontSize: 17,
    color: '#71472A',
    marginRight: 10,
  },

  branchCallText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: '#553423',
  },

  branchCallArrow: {
    fontSize: 21,
    color: '#B27A42',
  },

  // ---------------------------------------------------------------
  // EMAIL FEATURE
  // ---------------------------------------------------------------

  emailFeature: {
    minHeight: 94,
    borderRadius: 23,
    backgroundColor: '#5A3020',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },

  emailFeatureGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 80,
    right: -60,
    top: -40,
    backgroundColor: 'rgba(222,170,95,0.1)',
  },

  emailFeatureIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: '#D59C53',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emailFeatureIconText: {
    fontSize: 21,
    color: '#4C2919',
  },

  emailFeatureContent: {
    flex: 1,
    marginLeft: 12,
  },

  emailFeatureEyebrow: {
    fontSize: 7,
    letterSpacing: 1.3,
    fontWeight: '900',
    color: '#C7A886',
    marginBottom: 3,
  },

  emailFeatureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF7EA',
  },

  emailFeatureAddress: {
    fontSize: 10,
    color: '#D8C4B1',
    marginTop: 3,
  },

  emailSendButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  emailSendText: {
    fontSize: 21,
    color: '#E2B16A',
  },

  // ---------------------------------------------------------------
  // NOTE
  // ---------------------------------------------------------------

  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#FBF6EE',
    borderWidth: 1,
    borderColor: '#EDE1D3',
    borderRadius: 20,
    padding: 14,
    marginBottom: 21,
  },

  noteIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#F1E3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  noteIconText: {
    fontSize: 18,
    color: '#83532F',
  },

  noteContent: {
    flex: 1,
  },

  noteTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#563524',
    marginBottom: 3,
  },

  noteText: {
    fontSize: 9,
    lineHeight: 14,
    color: '#89786A',
  },

  // ---------------------------------------------------------------
  // HOME
  // ---------------------------------------------------------------

  homeButton: {
    height: 52,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5D9CB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonIcon: {
    fontSize: 23,
    color: '#9B6A3D',
    marginRight: 7,
    marginTop: -2,
  },

  homeButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4E3021',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 8,
    letterSpacing: 0.7,
    color: '#AA9A8D',
    marginTop: 18,
  },

  bottomOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
    paddingHorizontal: 55,
  },

  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E3D7CA',
  },

  ornamentSymbol: {
    fontSize: 9,
    color: '#B38A5A',
    marginHorizontal: 9,
  },
});
