import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  content: {
    padding: 18,
    paddingBottom: 45,
  },


  /* ==========================================================
     HERO
  ========================================================== */

  heroSection: {
    paddingTop: 12,
    paddingBottom: 18,
  },

  smallLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#A65D22',
    marginBottom: 8,
  },

  mainTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#4A2C18',
    lineHeight: 32,
  },

  highlightTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#B66A2C',
    marginTop: 3,
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 21,
    color: '#6F6258',
    marginTop: 12,
  },

  heroImage: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    marginBottom: 18,
  },


  /* ==========================================================
     INTRODUCTION
  ========================================================== */

  introductionCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginBottom: 28,
  },

  om: {
    fontSize: 42,
    color: '#A65D22',
    marginBottom: 5,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4A2C18',
    textAlign: 'center',
    marginBottom: 12,
  },


  /* ==========================================================
     SECTION HEADING
  ========================================================== */

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    marginTop: 5,
  },

  sectionNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B66A2C',
    backgroundColor: '#F3DEC5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 10,
  },

  sectionHeadingText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4A2C18',
  },

  sectionSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    color: '#8A7B70',
    marginTop: 3,
  },


  /* ==========================================================
     CARDS
  ========================================================== */

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  locationCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },


  /* ==========================================================
     TEXT
  ========================================================== */

  sectionIcon: {
    fontSize: 27,
    marginBottom: 8,
  },

  subTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A2C18',
    marginBottom: 4,
  },

  subHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B66A2C',
    marginBottom: 12,
  },

  bodyText: {
    fontSize: 13,
    lineHeight: 21,
    color: '#6F6258',
    marginBottom: 12,
  },

  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  featureTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4A2C18',
    marginBottom: 10,
  },


  /* ==========================================================
     IMAGES
  ========================================================== */

  sectionImage: {
    width: '100%',
    height: 190,
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 4,
  },

  swamijiImage: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 16,
  },


  /* ==========================================================
     GURU PARAMPARA
  ========================================================== */

  guruCard: {
    backgroundColor: '#FFF4E4',
    borderRadius: 22,
    padding: 20,
    marginBottom: 25,
  },

  guruLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#A65D22',
    textAlign: 'center',
    marginBottom: 14,
  },

  sanskrit: {
    fontSize: 15,
    lineHeight: 26,
    color: '#4A2C18',
    textAlign: 'center',
    fontWeight: '600',
  },

  guruImage: {
    width: '100%',
    height: 190,
    borderRadius: 15,
    marginTop: 18,
    marginBottom: 18,
  },

  guruItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },

  guruPortrait: {
    width: 115,
    height: 115,
    borderRadius: 58,
    marginBottom: 10,
  },

  guruName: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    color: '#4A2C18',
    textAlign: 'center',
  },


  /* ==========================================================
     SERVICES
  ========================================================== */

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE3D8',
  },

  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF4E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  serviceIcon: {
    fontSize: 20,
  },

  serviceContent: {
    flex: 1,
  },

  serviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A2C18',
    marginBottom: 3,
  },

  serviceDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#7C7067',
  },


  /* ==========================================================
     BOTTOM
  ========================================================== */

  bottomCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginTop: 5,
  },

  bottomOm: {
    fontSize: 38,
    color: '#A65D22',
    marginBottom: 5,
  },

  bottomTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4A2C18',
    marginBottom: 10,
  },

  bottomText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#6F6258',
    textAlign: 'center',
  },

  bottomPrayer: {
    fontSize: 13,
    fontWeight: '800',
    color: '#A65D22',
    marginTop: 15,
  },

});

export default styles;