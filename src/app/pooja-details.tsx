import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { apiRequest } from '@/services/api';

type Seva = {
  id: number;
  name: string;
  description: string | null;
  amount: number | string;
  image_url: string | null;
  category_id: number;
  category_name: string | null;
};

export default function PoojaDetailsScreen() {
  const params = useLocalSearchParams<{
    category?: string;
    name?: string;
  }>();

  const categoryId = params.category || '';
  const categoryName = params.name || 'Pooja & Seva';

  const [sevas, setSevas] = useState<Seva[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);

  useEffect(() => {
    loadSevas();
  }, []);

  const loadSevas = async () => {
    try {
      setLoading(true);

      const response = await apiRequest('/sevas');

      if (response.success && Array.isArray(response.data)) {
        let allSevas: Seva[] = response.data;

        /*
         * categoryId comes from the Pooja screen.
         * Example:
         * Narasimha = 1
         * Sharada = 2
         * Shankaracharya = 3
         * Guru = 4
         * Other Sannidhi = 5
         */

        if (categoryId) {
          const numericCategoryId = Number(categoryId);

          if (!Number.isNaN(numericCategoryId)) {
            allSevas = allSevas.filter(
              (seva) => seva.category_id === numericCategoryId
            );
          }
        }

        setSevas(allSevas);
      } else {
        setSevas([]);
      }
    } catch (error) {
      console.error('Sevas loading error:', error);

      Alert.alert(
        'Unable to Load Sevas',
        'Please check the server connection and try again.'
      );

      setSevas([]);
    } finally {
      setLoading(false);
    }
  };

  const continueBooking = () => {
    if (!selectedSeva) {
      return;
    }

    router.push({
      pathname: '/pooja-date',
      params: {
        sevaId: String(selectedSeva.id),
        sevaName: selectedSeva.name,
        amount: String(selectedSeva.amount),
        category: categoryName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Pooja Details
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Category Banner */}
        <View style={styles.categoryBanner}>
          <Text style={styles.categoryOm}>ॐ</Text>

          <View style={styles.categoryContent}>
            <Text style={styles.categoryLabel}>
              SELECTED CATEGORY
            </Text>

            <Text style={styles.categoryName}>
              {categoryName}
            </Text>

            <Text style={styles.categoryDescription}>
              Choose a seva or offering below.
            </Text>
          </View>
        </View>

        {/* Booking Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>
            Booking Process
          </Text>

          <View style={styles.stepsRow}>
            <Step number="1" title="Seva" active />
            <Step number="2" title="Date" />
            <Step number="3" title="Details" />
            <Step number="4" title="Payment" />
          </View>
        </View>

        {/* Seva Section */}
        <Text style={styles.sectionTitle}>
          Select Seva / Offering
        </Text>

        <Text style={styles.sectionSubtitle}>
          Choose the devotional service you wish to book.
        </Text>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#B66A2C"
            />

            <Text style={styles.loadingText}>
              Loading Sevas...
            </Text>
          </View>
        ) : sevas.length > 0 ? (
          <View style={styles.sevaList}>
            {sevas.map((seva) => {
              const isSelected =
                selectedSeva?.id === seva.id;

              return (
                <TouchableOpacity
                  key={seva.id}
                  style={[
                    styles.sevaCard,
                    isSelected &&
                      styles.sevaCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedSeva(seva)}
                >
                  {/* Radio */}
                  <View
                    style={[
                      styles.radio,
                      isSelected &&
                        styles.radioSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  {/* Content */}
                  <View style={styles.sevaContent}>
                    <Text style={styles.sevaName}>
                      {seva.name}
                    </Text>

                    <Text style={styles.sevaDescription}>
                      {seva.description ||
                        'Temple seva offering for devotees.'}
                    </Text>
                  </View>

                  {/* Amount */}
                  <Text style={styles.sevaAmount}>
                    ₹{Number(seva.amount).toFixed(0)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🪔
            </Text>

            <Text style={styles.emptyTitle}>
              No Sevas Available
            </Text>

            <Text style={styles.emptyText}>
              No active sevas are currently available
              for this category.
            </Text>
          </View>
        )}

        {/* Selected Summary */}
        {selectedSeva && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              Selected Seva
            </Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Service
              </Text>

              <Text style={styles.summaryValue}>
                {selectedSeva.name}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Category
              </Text>

              <Text style={styles.summaryValue}>
                {selectedSeva.category_name ||
                  categoryName}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Amount
              </Text>

              <Text style={styles.summaryAmount}>
                ₹{Number(selectedSeva.amount).toFixed(0)}
              </Text>
            </View>
          </View>
        )}

        {/* Continue */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedSeva &&
              styles.continueDisabled,
          ]}
          disabled={!selectedSeva}
          onPress={continueBooking}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Text style={styles.continueArrow}>
            →
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Select a seva to continue with the booking
          process.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Booking Step */

function Step({
  number,
  title,
  active = false,
}: {
  number: string;
  title: string;
  active?: boolean;
}) {
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepCircle,
          active &&
            styles.stepCircleActive,
        ]}
      >
        <Text
          style={[
            styles.stepNumber,
            active &&
              styles.stepNumberActive,
          ]}
        >
          {number}
        </Text>
      </View>

      <Text
        style={[
          styles.stepTitle,
          active &&
            styles.stepTitleActive,
        ]}
      >
        {title}
      </Text>
    </View>
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

  /* Header */

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  backIcon: {
    fontSize: 31,
    color: '#4A2C18',
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
  },

  headerSpacer: {
    width: 40,
  },

  /* Category */

  categoryBanner: {
    backgroundColor: '#F3DEC5',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  categoryOm: {
    fontSize: 34,
    color: '#B66A2C',
    marginRight: 15,
  },

  categoryContent: {
    flex: 1,
  },

  categoryLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#A66A3D',
    marginBottom: 4,
  },

  categoryName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  categoryDescription: {
    fontSize: 11,
    color: '#6D5140',
  },

  /* Steps */

  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 24,
    elevation: 2,
  },

  stepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 15,
  },

  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  step: {
    alignItems: 'center',
    flex: 1,
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0E8DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  stepCircleActive: {
    backgroundColor: '#B66A2C',
  },

  stepNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A7B70',
  },

  stepNumberActive: {
    color: '#FFFFFF',
  },

  stepTitle: {
    fontSize: 9,
    color: '#999',
  },

  stepTitleActive: {
    color: '#B66A2C',
    fontWeight: '700',
  },

  /* Section */

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 15,
  },

  /* Loading */

  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 35,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 12,
    color: '#777',
  },

  /* Seva */

  sevaList: {
    marginBottom: 20,
  },

  sevaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE5DA',
  },

  sevaCardSelected: {
    borderColor: '#B66A2C',
    backgroundColor: '#FFF8F0',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C9BDB1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: '#B66A2C',
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#B66A2C',
  },

  sevaContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  sevaName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  sevaDescription: {
    fontSize: 11,
    color: '#777',
    lineHeight: 16,
  },

  sevaAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B66A2C',
  },

  /* Empty */

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  emptyIcon: {
    fontSize: 35,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    lineHeight: 17,
  },

  /* Summary */

  summaryCard: {
    backgroundColor: '#F7E8D4',
    borderRadius: 18,
    padding: 17,
    marginBottom: 18,
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 10,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },

  summaryLabel: {
    fontSize: 12,
    color: '#777',
  },

  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A2C18',
    maxWidth: '60%',
    textAlign: 'right',
  },

  summaryAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B66A2C',
  },

  /* Continue */

  continueButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueDisabled: {
    backgroundColor: '#D5C9BD',
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  continueArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
  },

  note: {
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    lineHeight: 16,
    marginTop: 14,
    paddingHorizontal: 10,
  },
});