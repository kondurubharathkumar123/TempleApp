import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { apiRequest } from '@/services/api';

type DarshanSlot = {
  id: number;
  name: string;
  description?: string;
  darshan_date: string;
  start_time: string;
  end_time: string;
  price: string | number;
  capacity: number;
  is_active: boolean;
};

export default function DarshanScreen() {
  const [slots, setSlots] = useState<DarshanSlot[]>([]);

  const [allSlots, setAllSlots] = useState<
    DarshanSlot[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [allLoading, setAllLoading] =
    useState(false);

  const [showAll, setShowAll] =
    useState(false);

  const [error, setError] =
    useState('');

  /*
   * =====================================================
   * LOAD TODAY'S DARSHAN
   * GET /api/darshan
   * =====================================================
   */

  async function loadDarshan() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: DarshanSlot[];
      }>('/darshan');

      setSlots(result.data || []);
    } catch (err) {
      console.error(
        'Darshan API error:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load Darshan slots'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * =====================================================
   * LOAD ALL ACTIVE DARSHAN
   * GET /api/darshan/all
   * =====================================================
   */

  async function loadAllDarshan() {
    try {
      setAllLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: DarshanSlot[];
      }>('/darshan/all');

      setAllSlots(result.data || []);

      setShowAll(true);
    } catch (err) {
      console.error(
        'All Darshan API error:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load all Darshan slots'
      );
    } finally {
      setAllLoading(false);
    }
  }

  /*
   * =====================================================
   * INITIAL LOAD
   * =====================================================
   */

  useEffect(() => {
    loadDarshan();
  }, []);

  /*
   * =====================================================
   * FORMAT TIME
   * =====================================================
   */

  function formatTime(value: string) {
    if (!value) return '';

    const [hourString, minute] =
      value.substring(0, 5).split(':');

    let hour = Number(hourString);

    const ampm =
      hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  }

  /*
   * =====================================================
   * FORMAT DATE
   * =====================================================
   */

  function formatDate(value: string) {
    if (!value) return '';

    const date = new Date(
      `${value.substring(
        0,
        10
      )}T00:00:00`
    );

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  }

  /*
   * =====================================================
   * DARSHAN ICON
   * =====================================================
   */

  function getIcon(name: string) {
    const lower =
      name.toLowerCase();

    if (
      lower.includes('morning')
    ) {
      return '🌅';
    }

    if (
      lower.includes('afternoon')
    ) {
      return '☀️';
    }

    if (
      lower.includes('evening')
    ) {
      return '🌇';
    }

    if (
      lower.includes('special')
    ) {
      return '🌸';
    }

    return '🙏';
  }

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <Text style={styles.smallTitle}>
            Temple Services
          </Text>

          <Text style={styles.title}>
            Darshan 🙏
          </Text>

          <Text style={styles.subtitle}>
            Plan your visit and receive divine
            blessings
          </Text>
        </View>

        {/* =================================================
            TODAY'S DARSHAN
        ================================================= */}

        <Text style={styles.sectionTitle}>
          Today's Darshan
        </Text>

        {loading ? (
          <View
            style={styles.loadingBox}
          >
            <ActivityIndicator
              size="large"
              color="#8B4513"
            />

            <Text
              style={styles.loadingText}
            >
              Loading Darshan slots...
            </Text>
          </View>
        ) : error &&
          slots.length === 0 ? (
          <View
            style={styles.errorBox}
          >
            <Text
              style={styles.errorText}
            >
              {error}
            </Text>

            <TouchableOpacity
              style={
                styles.retryButton
              }
              onPress={loadDarshan}
            >
              <Text
                style={styles.retryText}
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : slots.length === 0 ? (
          <View
            style={styles.emptyBox}
          >
            <Text
              style={styles.emptyIcon}
            >
              🙏
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No Darshan slots available
            </Text>

            <Text
              style={styles.emptyText}
            >
              Please check again later.
            </Text>
          </View>
        ) : (
          slots.map((slot) => (
            <DarshanCard
              key={slot.id}
              icon={getIcon(
                slot.name
              )}
              title={slot.name}
              time={`${formatTime(
                slot.start_time
              )} – ${formatTime(
                slot.end_time
              )}`}
              description={
                slot.description ||
                'Darshan available at the temple.'
              }
              date={
                slot.darshan_date
              }
              price={slot.price}
              capacity={
                slot.capacity
              }
            />
          ))
        )}

        {/* =================================================
            VIEW ALL DARSHANS BUTTON
        ================================================= */}

        <TouchableOpacity
          style={
            styles.viewAllButton
          }
          onPress={
            showAll
              ? loadAllDarshan
              : loadAllDarshan
          }
          disabled={allLoading}
        >
          <Text
            style={styles.viewAllText}
          >
            {allLoading
              ? 'Loading...'
              : showAll
              ? 'Refresh All Darshans'
              : 'View All Darshans'}
          </Text>
        </TouchableOpacity>

        {/* =================================================
            ALL DARSHANS
        ================================================= */}

        {showAll && (
          <>
            <Text
              style={
                styles.sectionTitle
              }
            >
              All Darshans
            </Text>

            {allSlots.length === 0 ? (
              <View
                style={
                  styles.emptyBox
                }
              >
                <Text
                  style={
                    styles.emptyIcon
                  }
                >
                  🙏
                </Text>

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No Darshan slots available
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Please check again later.
                </Text>
              </View>
            ) : (
              allSlots.map(
                (slot) => (
                  <DarshanCard
                    key={slot.id}
                    icon={getIcon(
                      slot.name
                    )}
                    title={
                      slot.name
                    }
                    time={`${formatTime(
                      slot.start_time
                    )} – ${formatTime(
                      slot.end_time
                    )}`}
                    description={
                      slot.description ||
                      'Darshan available at the temple.'
                    }
                    date={
                      slot.darshan_date
                    }
                    price={
                      slot.price
                    }
                    capacity={
                      slot.capacity
                    }
                  />
                )
              )
            )}
          </>
        )}

        {/* =================================================
            ERROR FOR ALL DARSHAN
        ================================================= */}

        {error &&
          showAll && (
            <View
              style={
                styles.errorBox
              }
            >
              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>

              <TouchableOpacity
                style={
                  styles.retryButton
                }
                onPress={
                  loadAllDarshan
                }
              >
                <Text
                  style={
                    styles.retryText
                  }
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {/* =================================================
            SPECIAL DARSHAN
        ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Special Darshan
        </Text>

        <View
          style={
            styles.specialCard
          }
        >
          <Text
            style={
              styles.specialIcon
            }
          >
            🌸
          </Text>

          <Text
            style={
              styles.specialTitle
            }
          >
            Special Darshan Booking
          </Text>

          <Text
            style={
              styles.specialText
            }
          >
            Reserve your Darshan slot in
            advance and enjoy a convenient
            temple visit.
          </Text>

          <TouchableOpacity
            style={
              styles.bookButton
            }
          >
            <Text
              style={
                styles.bookButtonText
              }
            >
              Book Darshan
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            TEMPLE GUIDELINES
        ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Temple Guidelines
        </Text>

        <View
          style={
            styles.guidelineCard
          }
        >
          <Guideline
            text="Please arrive 15 minutes before your slot."
          />

          <Guideline
            text="Maintain silence and follow temple instructions."
          />

          <Guideline
            text="Please follow the temple dress guidelines."
          />

          <Guideline
            text="Keep your booking confirmation ready."
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/*
 * =========================================================
 * DARSHAN CARD
 * =========================================================
 */

function DarshanCard({
  icon,
  title,
  time,
  description,
  date,
  price,
  capacity,
}: {
  icon: string;
  title: string;
  time: string;
  description: string;
  date: string;
  price: string | number;
  capacity: number;
}) {
  function formatDate(
    value: string
  ) {
    if (!value) return '';

    const date = new Date(
      `${value.substring(
        0,
        10
      )}T00:00:00`
    );

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  }

  return (
    <View
      style={
        styles.darshanCard
      }
    >

      {/* TOP */}

      <View
        style={
          styles.cardTop
        }
      >
        <View
          style={
            styles.cardContent
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            {title}
          </Text>

          <Text
            style={
              styles.cardTime
            }
          >
            {time}
          </Text>
        </View>

        <Text
          style={
            styles.cardIcon
          }
        >
          {icon}
        </Text>
      </View>

      {/* DATE */}

      <Text
        style={
          styles.cardDate
        }
      >
        {formatDate(date)}
      </Text>

      {/* DESCRIPTION */}

      <Text
        style={
          styles.cardDescription
        }
      >
        {description}
      </Text>

      {/* PRICE / CAPACITY */}

      <View
        style={
          styles.infoRow
        }
      >
        <Text
          style={
            styles.price
          }
        >
          ₹
          {Number(
            price
          ).toLocaleString(
            'en-IN'
          )}
        </Text>

        <Text
          style={
            styles.capacity
          }
        >
          Capacity: {capacity}
        </Text>
      </View>

    </View>
  );
}

/*
 * =========================================================
 * GUIDELINE
 * =========================================================
 */

function Guideline({
  text,
}: {
  text: string;
}) {
  return (
    <View
      style={
        styles.guidelineRow
      }
    >
      <Text
        style={
          styles.check
        }
      >
        ✓
      </Text>

      <Text
        style={
          styles.guidelineText
        }
      >
        {text}
      </Text>
    </View>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

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
    marginBottom: 24,
  },

  smallTitle: {
    fontSize: 13,
    color: '#9A7655',
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2C18',
    marginTop: 8,
    marginBottom: 14,
  },

  /*
   * DARSHAN CARD
   */

  darshanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 12,
    elevation: 2,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
  },

  cardTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A05216',
    marginTop: 6,
  },

  cardIcon: {
    fontSize: 30,
    marginLeft: 12,
  },

  cardDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9A7655',
    marginTop: 10,
  },

  cardDescription: {
    fontSize: 13,
    color: '#777',
    lineHeight: 19,
    marginTop: 8,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B4513',
  },

  capacity: {
    fontSize: 12,
    color: '#777',
  },

  /*
   * VIEW ALL
   */

  viewAllButton: {
    backgroundColor: '#8B4513',
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },

  viewAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /*
   * LOADING
   */

  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },

  loadingText: {
    marginTop: 10,
    color: '#777',
    fontSize: 13,
  },

  /*
   * ERROR
   */

  errorBox: {
    backgroundColor: '#FFF0ED',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  errorText: {
    color: '#B42318',
    fontSize: 13,
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /*
   * EMPTY
   */

  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
  },

  emptyText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },

  /*
   * SPECIAL DARSHAN
   */

  specialCard: {
    backgroundColor: '#F4E0C5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  specialIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  specialTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A2C18',
  },

  specialText: {
    fontSize: 13,
    color: '#6E5542',
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 17,
  },

  bookButton: {
    backgroundColor: '#8B4513',
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
  },

  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /*
   * GUIDELINES
   */

  guidelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },

  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  check: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B4513',
    width: 25,
  },

  guidelineText: {
    flex: 1,
    fontSize: 13,
    color: '#6E5542',
    lineHeight: 19,
  },
});