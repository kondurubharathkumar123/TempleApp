import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GURUS = [
 

  {
    id: '3',
    name: 'Bhagavatpāda Śaṅkara',
    title: 'BHAGAVATPĀDA',
    image:
      'https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/shankaracharya.jpg',
    verse:
      'श्रुतिस्मृतिपुराणानामालयं करुणालयम् । नमामि भगवत्पादं शङ्करं लोकशङ्करम् ॥',
    transliteration:
      'śrutismṛtipurāṇānāmālayaṃ karuṇālayam ∣ namāmi bhagavatpādaṃ śaṅkaraṃ lokaśaṅkaram ∥3∥',
    translation:
      'I bow down to Bhagavatpāda Śaṅkara—the abode of the Śruti (Vedas), Smṛti, and Purāṇas, the very embodiment of compassion, and the one who brings auspiciousness to the entire world.',
  },
  {
    id: '4',
    name: 'Guru Sureśvara',
    title: 'GURU',
    image:
      'https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/sureshwaracharya.jpg',
    verse:
      'वन्देऽहं शङ्कराचार्यसच्छिष्यम् ज्ञानसागरम् । सुरेश्वरं गरुं धीरं धर्मब्रह्मविदुत्तमम् ॥',
    transliteration:
      'vande’haṃ śaṅkarācāryasacchiṣyaṃ jñānasāgaram ∣ sureśvaraṃ guruṃ dhīraṃ dharmabrahmaviduttamam ∥4∥',
    translation:
      'I bow to the noble Guru Sureśvara—the true disciple of Śrī Śaṅkarācārya, an ocean of wisdom, steadfast and composed, the supreme knower of Dharma and Brahman.',
  },
  {
    id: '5',
    name: 'Sri Swayamprakasha Krishna Yogeendra Saraswathi MahaSwamiji',
    title: 'MAHASWAMIJI',
    image:
      'https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/g1.jpg',
    verse:
      'सौराष्ट्रेषु जनिं प्राप्य दक्षाश्रममुपागताः तुङ्गातीरे तपोनुष्ठा: आदिशङ्करदीक्षिताः । अतोप्यधिकतेजसः श्री कृष्णयोगीन्द्रवराः सदा शिष्योपदेशकाः तान् विनीतो नमाम्यहम् ॥',
    transliteration:
      'saurāṣtreṣu janiṃ prāpya dakṣāśramamupāgatāḥ tuṅgātīre taponiṣṭhāḥ ādiśaṅkaradīkṣitāḥ ∣ atopyadhikatejasaḥ śrīkṛṣṇayogīndravarāḥ sadā śiṣyopadeśakāḥ tān vinīto namāmyaham ∥5∥',
    translation:
      'Born in the land of Saurāṣṭra and later arriving at the hermitage of Dakṣa, they performed intense austerities on the banks of the river Tuṅgā and were initiated by Ādi Śaṅkarācārya. Among them, the most radiant and exalted was Śrī Kṛṣṇa Yogīndra, ever engaged in mentoring disciples. To that venerable teacher, I bow down with humility.',
  },
  {
    id: '6',
    name: 'Sri Swayamprakasha Ramananda Saraswathi MahaSwamiji – III',
    title: 'MAHASWAMIJI',
    image:
      'https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/g3.jpg',
    verse:
      'शारदाकरुणापात्रं रामानन्दयतीश्वरम् । पुङ्गनूरुपुराधीशं सद्गुरुं तमहं भजे ॥',
    transliteration:
      'śāradākaruṇāpātraṃ rāmānandayatīśvaram ∣ puṅganūrupurādhīśaṃ sadguruṃ tamahaṃ bhaje ∥27∥',
    translation:
      'I worship that noble Guru, Śrī Rāmānanda Yatīśvara—the worthy recipient of Goddess Śāradā’s grace and compassion, the revered spiritual master and head of Puṅganūru.',
  },
  {
    id: '7',
    name: 'Sri Swayamprakasha Abhinava Ramananda Saraswathi MahaSwamiji',
    title: 'MAHASWAMIJI',
    image:
      'https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/g2.jpg',
    verse:
      'हरिहरपुराधीशं श्रीचक्रार्चनतत्परम् । सदाभिनवपूर्वं तं रामानन्दगरुं भजे ॥',
    transliteration:
      'hariharapurādhīśaṃ śrīcakrārcanatatparam ∣ sadābhinavapūrvaṃ taṃ rāmānandaguruṃ bhaje ∥28∥',
    translation:
      'I adore my Guru, Śrī Rāmānanda—the ever-youthful master of Hariharapura, who is deeply devoted to the worship of the sacred Śrīcakra.',
  },
];

export default function GuruParamparaScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF9F0"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>SACRED LINEAGE</Text>

            <Text style={styles.title}>
              Guru Parampara
            </Text>

            <Text style={styles.subtitle}>
              Walk through the sacred lineage of Gurus who
              preserved wisdom, devotion and tradition.
            </Text>
          </View>
        </View>

        {/* DIVIDER */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDiamond}>
            <Text style={styles.diamondText}>✦</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>

        {/* GURU CARDS */}
        <View style={styles.cardsContainer}>
          {GURUS.map((guru, index) => (
            <TouchableOpacity
              key={guru.id}
              activeOpacity={0.94}
              style={styles.card}
            >
              {/* IMAGE */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: guru.image }}
                  style={styles.image}
                  resizeMode="contain"
                />

                {/* IMAGE OVERLAY */}
                <View style={styles.imageOverlay} />

                <View style={styles.imageLabel}>
                  <Text style={styles.imageLabelText}>SACRED LINEAGE</Text>
                </View>

                {/* NUMBER */}
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>

                {/* ROLE */}
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>
                    {guru.title}
                  </Text>
                </View>
              </View>

              {/* CONTENT */}
              <View style={styles.cardContent}>
                <Text style={styles.name}>
                  {guru.name}
                </Text>

                <View style={styles.smallLine} />

                <Text style={styles.verse}>
                  {guru.verse}
                </Text>

                <Text style={styles.transliteration}>
                  {guru.transliteration}
                </Text>

                <Text style={styles.bio}>
                  “{guru.translation}”
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* BOTTOM MESSAGE */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomSymbol}>✦</Text>

          <Text style={styles.bottomTitle}>
            A Legacy of Wisdom
          </Text>

          <Text style={styles.bottomText}>
            The sacred lineage of Gurus continues to inspire
            devotion, knowledge and service for generations.
          </Text>
        </View>

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.bottomBackButton}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Text style={styles.bottomBackIcon}>‹</Text>
          <Text style={styles.bottomBackText}>
            Back
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 35,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBDCC9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginRight: 13,

    ...Platform.select({
      ios: {
        shadowColor: '#6B4226',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 7,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  backIcon: {
    fontSize: 31,
    lineHeight: 32,
    color: '#70401F',
    fontWeight: '300',
    marginTop: -2,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.7,
    color: '#C18427',
    marginBottom: 5,
  },

  title: {
    fontSize: width < 360 ? 27 : 31,
    lineHeight: width < 360 ? 34 : 38,
    fontWeight: '800',
    color: '#4A2B18',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#806F61',
    marginTop: 6,
    maxWidth: 330,
  },

  /* DIVIDER */

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 21,
    marginBottom: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D7C1',
  },

  dividerDiamond: {
    width: 28,
    height: 28,
    marginHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#F7E6CD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  diamondText: {
    fontSize: 12,
    color: '#B8781F',
  },

  /* CARDS */

  cardsContainer: {
    width: '100%',
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EBDCCA',

    ...Platform.select({
      ios: {
        shadowColor: '#5B351F',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.10,
        shadowRadius: 13,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  /* IMAGE */

imageContainer: {
    width: '100%',
    height: width < 360 ? 215 : 235,
    backgroundColor: '#F5E9D8',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#E8D4B8',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 45,
    backgroundColor: 'rgba(48, 27, 12, 0.08)',
  },

  imageLabel: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 250, 241, 0.92)',
    borderWidth: 1,
    borderColor: '#E8D4B8',
  },

  imageLabelText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: '#8B5A27',
  },

  numberBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    minWidth: 42,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 250, 241, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  numberText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#70401F',
  },

  roleBadge: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 248, 235, 0.95)',
  },

  roleText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.15,
    color: '#A96819',
  },

  /* CARD CONTENT */

  cardContent: {
    paddingHorizontal: 17,
    paddingTop: 16,
    paddingBottom: 17,
  },

  name: {
    fontSize: width < 360 ? 18 : 20,
    lineHeight: width < 360 ? 23 : 26,
    fontWeight: '800',
    color: '#452817',
    letterSpacing: -0.15,
  },

  smallLine: {
    width: 34,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#C58A2A',
    marginTop: 9,
    marginBottom: 10,
  },

  verse: {
    fontSize: width < 360 ? 15 : 16,
    lineHeight: width < 360 ? 25 : 27,
    color: '#4A2B18',
    marginBottom: 10,
    textAlign: 'left',
  },

  transliteration: {
    fontSize: 11.5,
    lineHeight: 18,
    color: '#9A6A37',
    fontStyle: 'italic',
    marginBottom: 10,
  },

  bio: {
    fontSize: width < 360 ? 12 : 12.5,
    lineHeight: width < 360 ? 18 : 19,
    color: '#76665A',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#F0E6D9',
  },

  actionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B4E1D',
    letterSpacing: 0.1,
  },

  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF2DD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    fontSize: 17,
    fontWeight: '700',
    color: '#8B4E1D',
    marginTop: -1,
  },

  /* BOTTOM */

  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 9,
    paddingBottom: 20,
  },

  bottomSymbol: {
    fontSize: 16,
    color: '#C58A2A',
    marginBottom: 7,
  },

  bottomTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4A2C18',
    marginBottom: 6,
  },

  bottomText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 19,
    color: '#877568',
  },

  bottomBackButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7D5C0',

    ...Platform.select({
      ios: {
        shadowColor: '#6B4226',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.07,
        shadowRadius: 7,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  bottomBackIcon: {
    fontSize: 25,
    lineHeight: 27,
    color: '#7C421B',
    marginRight: 6,
    marginTop: -2,
  },

  bottomBackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7C421B',
  },

  bottomSpace: {
    height: 15,
  },
});