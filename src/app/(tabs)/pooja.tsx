import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { apiRequest } from '@/services/api';

type SevaCategory = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
};

type Seva = {
  id: number;
  name: string;
  description: string | null;
  amount: number | string;
  image_url: string | null;
  category_id: number;
  category_name: string | null;
};

export default function PoojaScreen() {
  const [categories, setCategories] = useState<SevaCategory[]>([]);
  const [sevas, setSevas] = useState<Seva[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<number | 'all'>('all');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSevaData();
  }, []);

  const loadSevaData = async () => {
    try {
      setLoading(true);

      const [categoryResponse, sevaResponse] =
        await Promise.all([
          apiRequest('/sevas/categories'),
          apiRequest('/sevas'),
        ]);

      if (
        categoryResponse.success &&
        Array.isArray(categoryResponse.data)
      ) {
        setCategories(categoryResponse.data);
      }

      if (
        sevaResponse.success &&
        Array.isArray(sevaResponse.data)
      ) {
        setSevas(sevaResponse.data);
      }
    } catch (error) {
      console.error('Seva loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return categories;
    }

    return categories.filter(
      (category) => category.id === selectedCategory
    );
  }, [categories, selectedCategory]);

  const selectedSevas = useMemo(() => {
    if (selectedCategory === 'all') {
      return sevas;
    }

    return sevas.filter(
      (seva) => seva.category_id === selectedCategory
    );
  }, [sevas, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.eyebrow}>
              DIVINE SERVICES
            </Text>

            <Text style={styles.title}>
              Pooja & Seva
            </Text>

            <Text style={styles.subtitle}>
              Choose a seva or offering with devotion
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.om}>ॐ</Text>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introCard}>
          <Text style={styles.introIcon}>
            🪔
          </Text>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>
              Seva & Offerings
            </Text>

            <Text style={styles.introText}>
              Participate in temple poojas and sevas by
              selecting the service you wish to offer.
            </Text>
          </View>
        </View>

        {/* Sannidhi */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Sannidhi
          </Text>

          <Text style={styles.sectionCount}>
            {categories.length} categories
          </Text>
        </View>

        {/* Category Filters */}
        {loading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingIcon}>
              🙏
            </Text>

            <Text style={styles.loadingTitle}>
              Loading Sevas...
            </Text>

            <Text style={styles.loadingText}>
              Please wait while we load the temple sevas.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {/* All */}
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedCategory === 'all' &&
                    styles.filterButtonActive,
                ]}
                onPress={() =>
                  setSelectedCategory('all')
                }
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedCategory === 'all' &&
                      styles.filterTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              {/* Categories */}
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterButton,
                    selectedCategory === category.id &&
                      styles.filterButtonActive,
                  ]}
                  onPress={() =>
                    setSelectedCategory(category.id)
                  }
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedCategory === category.id &&
                        styles.filterTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Category Cards */}
            <Text style={styles.sectionTitle}>
              Temple Sannidhis
            </Text>

            {visibleCategories.length > 0 ? (
              <View style={styles.categoryList}>
                {visibleCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryCard}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: '/pooja-details',
                        params: {
                          categoryId: String(category.id),
                          name: category.name,
                        },
                      })
                    }
                  >
                    <View style={styles.categoryIcon}>
                      <Text style={styles.categoryEmoji}>
                        {getCategoryIcon(category.name)}
                      </Text>
                    </View>

                    <View style={styles.categoryContent}>
                      <Text style={styles.categoryName}>
                        {category.name}
                      </Text>

                      <Text
                        style={styles.categoryDescription}
                        numberOfLines={2}
                      >
                        {category.description ||
                          'Devotional offerings and sevas.'}
                      </Text>

                      <Text style={styles.viewText}>
                        View Sevas →
                      </Text>
                    </View>

                    <Text style={styles.arrow}>
                      ›
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>
                  🙏
                </Text>

                <Text style={styles.emptyTitle}>
                  No Categories Available
                </Text>

                <Text style={styles.emptyText}>
                  No active seva categories are available.
                </Text>
              </View>
            )}

            {/* Sevas */}
            <View style={styles.sevaHeader}>
              <Text style={styles.sectionTitle}>
                Available Sevas
              </Text>

              <Text style={styles.sevaCount}>
                {selectedSevas.length}
              </Text>
            </View>

            {selectedSevas.length > 0 ? (
              <View style={styles.sevaList}>
                {selectedSevas.map((seva) => (
                  <TouchableOpacity
                    key={seva.id}
                    style={styles.sevaCard}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: '/pooja-details',
                        params: {
                          sevaId: String(seva.id),
                          categoryId: String(
                            seva.category_id
                          ),
                          name: seva.name,
                        },
                      })
                    }
                  >
                    <View style={styles.sevaIcon}>
                      <Text style={styles.sevaEmoji}>
                        🪔
                      </Text>
                    </View>

                    <View style={styles.sevaContent}>
                      <Text style={styles.sevaTitle}>
                        {seva.name}
                      </Text>

                      <Text
                        style={styles.sevaDescription}
                        numberOfLines={2}
                      >
                        {seva.description ||
                          'Devotional seva offering.'}
                      </Text>

                      <Text style={styles.amount}>
                        ₹
                        {Number(seva.amount).toFixed(2)}
                      </Text>
                    </View>

                    <Text style={styles.arrow}>
                      ›
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>
                  🪔
                </Text>

                <Text style={styles.emptyTitle}>
                  No Sevas Available
                </Text>

                <Text style={styles.emptyText}>
                  No active sevas are available for this
                  selection.
                </Text>
              </View>
            )}
          </>
        )}

        {/* Booking CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaOm}>
            ॐ
          </Text>

          <Text style={styles.ctaTitle}>
            Offer Your Seva
          </Text>

          <Text style={styles.ctaText}>
            Select a devotional service and continue
            through the seva booking process.
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => {
              if (categories.length > 0) {
                router.push({
                  pathname: '/pooja-details',
                  params: {
                    categoryId: String(categories[0].id),
                    name: categories[0].name,
                  },
                });
              }
            }}
          >
            <Text style={styles.ctaButtonText}>
              Explore Sevas
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Category icon helper */
function getCategoryIcon(name: string) {
  const value = name.toLowerCase();

  if (value.includes('narasimha')) {
    return '🦁';
  }

  if (value.includes('sharada')) {
    return '🪷';
  }

  if (value.includes('shankaracharya')) {
    return '🙏';
  }

  if (value.includes('guru')) {
    return '🕉️';
  }

  return '🛕';
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  headerContent: {
    flex: 1,
    paddingRight: 12,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#B66A2C',
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  om: {
    fontSize: 28,
    color: '#B66A2C',
    fontWeight: '700',
  },

  introCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  introIcon: {
    fontSize: 30,
    marginRight: 14,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  introText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6D5140',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  sectionCount: {
    fontSize: 11,
    color: '#999',
  },

  filterContainer: {
    paddingBottom: 15,
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9DDD0',
  },

  filterButtonActive: {
    backgroundColor: '#B66A2C',
    borderColor: '#B66A2C',
  },

  filterText: {
    fontSize: 12,
    color: '#6D5140',
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  categoryList: {
    marginBottom: 25,
  },

  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  categoryIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F8EBDD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryEmoji: {
    fontSize: 27,
  },

  categoryContent: {
    flex: 1,
    marginLeft: 14,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  categoryDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#777',
  },

  viewText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B66A2C',
    marginTop: 6,
  },

  arrow: {
    fontSize: 25,
    color: '#B66A2C',
    marginLeft: 8,
  },

  sevaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sevaCount: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E8C59E',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#4A2C18',
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
  },

  sevaList: {
    marginBottom: 25,
  },

  sevaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  sevaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8EBDD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sevaEmoji: {
    fontSize: 23,
  },

  sevaContent: {
    flex: 1,
    marginLeft: 13,
  },

  sevaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  sevaDescription: {
    fontSize: 11,
    color: '#777',
    lineHeight: 17,
  },

  amount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B66A2C',
    marginTop: 5,
  },

  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 35,
    alignItems: 'center',
    marginBottom: 25,
  },

  loadingIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  loadingText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    marginBottom: 25,
  },

  emptyIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
  },

  ctaCard: {
    backgroundColor: '#F7E8D4',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
  },

  ctaOm: {
    fontSize: 32,
    color: '#B66A2C',
    marginBottom: 5,
  },

  ctaTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 7,
  },

  ctaText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6D5140',
    textAlign: 'center',
    marginBottom: 16,
  },

  ctaButton: {
    height: 46,
    paddingHorizontal: 25,
    borderRadius: 13,
    backgroundColor: '#B66A2C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});