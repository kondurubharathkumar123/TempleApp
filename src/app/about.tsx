import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './about.styles.ts';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* =====================================================
            HERO
        ====================================================== */}

        <View style={styles.heroSection}>

          <Text style={styles.smallLabel}>
            DIVYAKSHETRA HARIHARAPURA
          </Text>

          <Text style={styles.mainTitle}>
            A Sacred Convergence of
          </Text>

          <Text style={styles.highlightTitle}>
            Yaga • Tapo • Jnana
          </Text>

          <Text style={styles.heroDescription}>
            Welcome to Divyakshetra Hariharapura, a sacred
            spiritual destination on the banks of the
            Uttaravahini Tunga River in Karnataka.
          </Text>

        </View>


        {/* =====================================================
            HERO IMAGE
        ====================================================== */}

        <Image
          source={{
            uri: 'https://www.divyakshetrahariharapura.com/web/assets/img/others/11.jpg',
          }}
          style={styles.heroImage}
        />


        {/* =====================================================
            INTRODUCTION
        ====================================================== */}

        <View style={styles.introductionCard}>

          <Text style={styles.om}>
            ॐ
          </Text>

          <Text style={styles.cardTitle}>
            Divyakshetra Hariharapura
          </Text>

          <Text style={styles.bodyText}>
            Nestled in the lush landscapes of Chikmagalur
            District, Karnataka, Hariharapura is a divine
            epicenter revered across ancient scriptures and
            sacred traditions.
          </Text>

          <Text style={styles.bodyText}>
            It is a rare spiritual ground where history,
            mythology and supreme cosmic energy merge.
            The sacred kshetra is especially renowned as
            the meeting ground of Yaga Bhoomi, Tapo Bhoomi
            and Jnana Bhoomi.
          </Text>

        </View>


        {/* =====================================================
            SECTION 1
        ====================================================== */}

        <SectionHeading
          number="01"
          title="About the Kshetra"
          subtitle="The Divine Trinity — Yaga, Tapo & Jnana Bhoomi"
        />

        {/* YAGA BHOOMI */}

        <View style={styles.sectionCard}>

          <Text style={styles.sectionIcon}>
            🔥
          </Text>

          <Text style={styles.subTitle}>
            Yaga Bhoomi
          </Text>

          <Text style={styles.subHeading}>
            The Land of Sacred Sacrifice
          </Text>

          <Text style={styles.bodyText}>
            In ancient times, this sacred region was known
            as Daksha Kshetra or Kapalam. According to the
            Skanda Purana and sacred traditions, it was here
            that Lord Daksha Prajapati performed a monumental
            Maha Yagna.
          </Text>

          <Text style={styles.bodyText}>
            Following the divine events surrounding the
            sacrifice, Lord Shiva manifested from the
            sacred Yagna Kunda as Swayambhu Dakshahara
            Someshwara, blessing the land with divine
            presence.
          </Text>

          <Text style={styles.bodyText}>
            The ancient Swayambhu Sri Dakshahara Someshwara
            temple continues to stand as a testimony to this
            sacred legend.
          </Text>

          <Image
            source={{
              uri: 'https://www.divyakshetrahariharapura.com/web/assets/img/about/yagabhumi.png',
            }}
            style={[styles.sectionImage, { width: '100%', height: 220, alignSelf: 'center' }]}
            resizeMode="contain"
          />

        </View>


        {/* TAPO BHOOMI */}

        <View style={styles.sectionCard}>

          <Text style={styles.sectionIcon}>
            🧘
          </Text>

          <Text style={styles.subTitle}>
            Tapo Bhoomi
          </Text>

          <Text style={styles.subHeading}>
            The Land of Divine Penance
          </Text>

          <Text style={styles.bodyText}>
            During the Treta Yuga, the revered Sage Agastya
            Maharishi travelled south and chose Hariharapura
            as the place for his intense spiritual penance.
          </Text>

          <Text style={styles.bodyText}>
            Agastya Maharishi worshipped Lord Sri Lakshmi
            Narasimha and a sacred Shaligrama. His profound
            tapas is believed to have filled this land with
            powerful spiritual vibrations.
          </Text>

          <Text style={styles.bodyText}>
            The sacred Lakshmi Narasimha Shaligrama and
            vigraha associated with Sage Agastya continue
            to be worshipped at the temple.
          </Text>

          <Image
            source={{
              uri: 'https://www.divyakshetrahariharapura.com/web/assets/img/about/tapobhumi.png',
            }}
            style={styles.sectionImage}
          />

        </View>


        {/* JNANA BHOOMI */}

        <View style={styles.sectionCard}>

          <Text style={styles.sectionIcon}>
            📖
          </Text>

          <Text style={styles.subTitle}>
            Jnana Bhoomi
          </Text>

          <Text style={styles.subHeading}>
            The Land of Divine Wisdom
          </Text>

          <Text style={styles.bodyText}>
            Jagadguru Adi Shankaracharya Bhagavatpada visited
            this sacred region during his Dharma Yatra and
            recognized the immense spiritual potency of
            Hariharapura.
          </Text>

          <Text style={styles.bodyText}>
            Here, the revered Acharya installed the sacred
            Sri Chakra Maha Yantram and consecrated Goddess
            Sri Sharada Parameshwari, establishing a powerful
            centre of Jnana and Bhakti.
          </Text>

          <Text style={styles.bodyText}>
            Adi Shankaracharya also initiated Sri Swayamprakasha
            Krishna Yogeendra Saraswathi into Sanyasa. The
            Guru-Shishya tradition that began through this
            divine lineage continues to inspire devotees and
            seekers to this day.
          </Text>

          <Image
            source={{
              uri: 'https://www.divyakshetrahariharapura.com/web/assets/img/about/jnanabhumi-1.png',
            }}
            style={[styles.sectionImage, { width: '100%', height: 220, alignSelf: 'center' }]}
            resizeMode="contain"
          />

        </View>


        {/* =====================================================
            SECTION 2
        ====================================================== */}

        <SectionHeading
          number="02"
          title="Temple History & Lineage"
          subtitle="A sacred heritage preserved through generations"
        />

        <View style={styles.sectionCard}>

          <Text style={styles.subTitle}>
            The Legacy of the Deities
          </Text>

          <Text style={styles.bodyText}>
            The sacred Lakshmi Narasimha idol and Shaligrama
            worshipped by Sage Agastya were preserved through
            a Guru-Shishya lineage and eventually returned to
            Hariharapura through the spiritual tradition of
            Sri Govinda Yogi and the first Peetadhipathi,
            Sri Swayamprakasha Krishna Yogendra Saraswathi.
          </Text>

        </View>


        {/* ROYAL PATRONAGE */}

        <View style={styles.sectionCard}>

          <Text style={styles.subTitle}>
            Royal Patronage
          </Text>

          <Text style={styles.bodyText}>
            Historical inscriptions from the medieval period
            record the importance of Hariharapura as an
            Agrahara associated with the Vijayanagara
            tradition.
          </Text>

          <Text style={styles.bodyText}>
            Historical sources mention Harihara Maharaya,
            the second ruler of the Vijayanagara Empire, in
            connection with the development and recognition
            of this sacred settlement.
          </Text>

          <Text style={styles.bodyText}>
            The religious and cultural traditions connected
            with Sringeri and the Vijayanagara kingdom played
            an important role in the history of this sacred
            region.
          </Text>

        </View>


        {/* PEETAM TODAY */}

        <View style={styles.sectionCard}>

          <Text style={styles.subTitle}>
            The Peetam Today
          </Text>

          <Text style={styles.bodyText}>
            The sacred Peetam has been carried forward through
            a long and illustrious Guru Parampara, preserving
            Sanatana Dharma, spiritual knowledge and devotional
            traditions.
          </Text>

          <Text style={styles.bodyText}>
            Under the guidance of the present Peethadhipati,
            Parama Poojya Jagadguru Shankaracharya Sri Sri
            Swayamprakasha Sachidananda Saraswathi Mahaswamiji,
            the ancient temple has undergone a monumental
            transformation and reconstruction.
          </Text>

        </View>


        {/* =====================================================
            GURU PARAMPARA
        ====================================================== */}

        <View style={styles.guruCard}>

          <Text style={styles.guruLabel}>
            GURU PARAMPARA
          </Text>

          <Text style={styles.sanskrit}>
            सदाशिवसमारम्भां शङ्कराचार्यमध्यमाम् ।
          </Text>

          <Text style={styles.sanskrit}>
            अस्मदाचार्यपर्यन्तां वन्दे गुरुपरम्पराम् ॥
          </Text>

          <Image
            source={{
              uri: 'https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/guru-parampara-1920.jpg',
            }}
            style={styles.guruImage}
          />

          <GuruItem
            name="Sri Swayamprakasha Krishna Yogeendra Saraswathi MahaSwamiji"
            image="https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/g1.jpg"
          />

          <GuruItem
            name="Sri Swayamprakasha Abhinava Ramananda Saraswathi MahaSwamiji"
            image="https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/g2.jpg"
          />

          <GuruItem
            name="Sri Swayamprakasha Ramananda Saraswathi MahaSwamiji – III"
            image="https://www.divyakshetrahariharapura.com/web/assets/img/guru-parampara/g3.jpg"
          />

        </View>


        {/* =====================================================
            PRESENT JAGADGURU
        ====================================================== */}

        <SectionHeading
          number="03"
          title="The Present Jagadguru"
          subtitle="Guiding the sacred Peetam today"
        />

        <View style={styles.sectionCard}>

          <Image
            source={{
              uri: 'https://www.divyakshetrahariharapura.com/web/assets/img/about/swamiji.jpg',
            }}
            style={styles.swamijiImage}
          />

          <Text style={styles.subTitle}>
            Parama Poojya Sri Sri Swayamprakasha
            Sachidananda Saraswati Mahaswamiji
          </Text>

          <Text style={styles.bodyText}>
            Anantha Sri Vibushita Jagadguru Shankaracharya
            Parama Pujya Sri Sri Swayamprakasha Sachidananda
            Saraswati Mahaswamiji is the present Peethadipati
            of this esteemed Dharma Peetham.
          </Text>

          <Text style={styles.bodyText}>
            Mahaswamiji has transformed the ancient mutt into
            a magnificent temple complex and has continued
            the sacred traditions of Sri Sharada, Lakshmi
            Narasimha and the Guru Parampara.
          </Text>

          <Text style={styles.bodyText}>
            The teachings of the Peetam emphasize spiritual
            unity, equality, devotion and service. Mahaswamiji
            inspires devotees to follow the path of devotion,
            Dharma and service to society and the Motherland.
          </Text>

        </View>


        {/* =====================================================
            SECTION 4
        ====================================================== */}

        <SectionHeading
          number="04"
          title="Architectural & Spiritual Marvels"
          subtitle="Sacred features of Divyakshetra Hariharapura"
        />


        {/* TUNGA */}

        <View style={styles.featureCard}>

          <Text style={styles.featureIcon}>
            🌊
          </Text>

          <Text style={styles.featureTitle}>
            Uttaravahini Tunga River
          </Text>

          <Text style={styles.bodyText}>
            At Hariharapura, the sacred river Tunga flows
            northward and is therefore known as Uttaravahini.
            According to sacred traditions, rivers flowing
            northward are considered especially auspicious
            for spiritual practices.
          </Text>

        </View>


        {/* VAJRASTHAMBHA */}

        <View style={styles.featureCard}>

          <Text style={styles.featureIcon}>
            🛕
          </Text>

          <Text style={styles.featureTitle}>
            Vajrasthambha Lakshmi Narasimha Maha Yantram
          </Text>

          <Text style={styles.bodyText}>
            One of the unique spiritual highlights of the
            temple is the magnificent 32-foot Lakshmi
            Narasimha Maha Yantra in the form of a pillar
            known as Vajrasthambha.
          </Text>

          <Text style={styles.bodyText}>
            At the Bindu-staana at the top of the powerful
            Vajrasthambha resides an auspicious Lakshmi
            Narasimha Swamy idol carved from Maragatha
            stone.
          </Text>

        </View>


        {/* DUAL SANCTUMS */}

        <View style={styles.featureCard}>

          <Text style={styles.featureIcon}>
            🪔
          </Text>

          <Text style={styles.featureTitle}>
            Dual Sanctums
          </Text>

          <Text style={styles.bodyText}>
            The temple complex uniquely brings together
            Shaivite and Vaishnavite traditions.
          </Text>

          <Text style={styles.bodyText}>
            The sacred Swayambhu Someshwara shrine exists
            alongside the glorious Lakshmi Narasimha and
            Sharadamba sanctums, creating a distinctive
            spiritual environment.
          </Text>

        </View>


        {/* =====================================================
            SECTION 5
        ====================================================== */}

        <SectionHeading
          number="05"
          title="Visitor Information & Sevas"
          subtitle="Experience the sacred traditions of the Kshetra"
        />

        <View style={styles.locationCard}>

          <Text style={styles.featureIcon}>
            📍
          </Text>

          <Text style={styles.featureTitle}>
            Location
          </Text>

          <Text style={styles.bodyText}>
            Hariharapura, Koppa Taluk,
            Chikmagalur District, Karnataka.
          </Text>

          <Text style={styles.bodyText}>
            The sacred Kshetra is situated on the banks of
            the Tunga River between Koppa and Sringeri.
          </Text>

        </View>


        {/* DAILY RITUALS */}

        <View style={styles.sectionCard}>

          <Text style={styles.subTitle}>
            Daily Rituals & Sevas
          </Text>

          <ServiceRow
            icon="🪔"
            title="Special Pujas"
            description="Traditional worship and devotional rituals."
          />

          <ServiceRow
            icon="🔥"
            title="Homas & Havanas"
            description="Sacred fire rituals connected with the Yaga Bhoomi tradition."
          />

          <ServiceRow
            icon="🍚"
            title="Annadaana"
            description="Food service offered to pilgrims and devotees."
          />

          <ServiceRow
            icon="🐄"
            title="Go Samrakshana"
            description="Initiatives dedicated to the protection and care of cows."
          />

        </View>


        {/* PILGRIMAGE */}

        <View style={styles.sectionCard}>

          <Text style={styles.subTitle}>
            Significance of Pilgrimage
          </Text>

          <Text style={styles.bodyText}>
            Devotees visit Divyakshetra Hariharapura seeking
            spiritual peace, divine blessings and an
            opportunity to experience the sacred traditions
            of this ancient Kshetra.
          </Text>

          <Text style={styles.bodyText}>
            Taking a dip in the sacred Tunga River, offering
            prayers and participating in spiritual practices
            are regarded by devotees as deeply auspicious.
          </Text>

        </View>


        {/* =====================================================
            CLOSING
        ====================================================== */}

        <View style={styles.bottomCard}>

          <Text style={styles.bottomOm}>
            ॐ
          </Text>

          <Text style={styles.bottomTitle}>
            Yaga • Tapo • Jnana
          </Text>

          <Text style={styles.bottomText}>
            May the divine blessings of Sri Sharada,
            Lakshmi Narasimha and the sacred Guru Parampara
            be with all devotees.
          </Text>

          <Text style={styles.bottomPrayer}>
            🙏 Om Tat Sat 🙏
          </Text>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


/* ============================================================
   SECTION HEADING
============================================================ */

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeading}>

      <Text style={styles.sectionNumber}>
        {number}
      </Text>

      <View style={styles.sectionHeadingText}>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Text style={styles.sectionSubtitle}>
          {subtitle}
        </Text>

      </View>

    </View>
  );
}


/* ============================================================
   SERVICE ROW
============================================================ */

function ServiceRow({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.serviceRow}>

      <View style={styles.serviceIconContainer}>
        <Text style={styles.serviceIcon}>
          {icon}
        </Text>
      </View>

      <View style={styles.serviceContent}>

        <Text style={styles.serviceTitle}>
          {title}
        </Text>

        <Text style={styles.serviceDescription}>
          {description}
        </Text>

      </View>

    </View>
  );
}


/* ============================================================
   GURU ITEM
============================================================ */

function GuruItem({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
  return (
    <View style={styles.guruItem}>

      <Image
        source={{ uri: image }}
        style={styles.guruPortrait}
      />

      <Text style={styles.guruName}>
        {name}
      </Text>

    </View>
  );
}