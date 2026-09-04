import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiRequest } from '@/services/api';
import { getToken } from '@/services/authStorage';

type ServiceBooking = {
  id: number;
  booking_id: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  number_of_devotees: number;
  total_amount: string;
  booking_status: string;
  payment_status: string;
  special_requests?: string | null;
  created_at: string;
};

type RoomBooking = {
  id: number;
  booking_id: string;
  room_id: number;
  room_number: string;
  room_type_name: string;
  check_in: string;
  check_out: string;
  number_of_guests: number;
  total_amount: string;
  booking_status: string;
  payment_status: string;
  special_requests?: string | null;
  created_at: string;
};

export default function BookingsScreen() {
  const [activeTab, setActiveTab] =
    useState<'seva' | 'rooms'>('seva');

  const [serviceBookings, setServiceBookings] =
    useState<ServiceBooking[]>([]);

  const [roomBookings, setRoomBookings] =
    useState<RoomBooking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  /*
   * Load all bookings
   */
  const loadBookings = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace('/login');
        return;
      }

      const [
        serviceResponse,
        roomResponse,
      ] = await Promise.all([
        apiRequest('/service-bookings/my', {
          token,
        }),

        apiRequest('/room-bookings/my', {
          token,
        }),
      ]);

      setServiceBookings(
        serviceResponse?.data || []
      );

      setRoomBookings(
        roomResponse?.data || []
      );
    } catch (error: any) {
      console.error(
        'Error loading bookings:',
        error
      );

      Alert.alert(
        'Unable to load bookings',
        error?.message ||
          'Please try again later.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
   * Reload whenever screen gets focus
   */
  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  /*
   * Pull to refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  /*
   * Format date
   */
  const formatDate = (value: string) => {
    if (!value) {
      return '';
    }

    /*
     * Handle YYYY-MM-DD without
     * timezone shifting.
     */
    const dateOnly =
      value.includes('T')
        ? value.split('T')[0]
        : value;

    const parts =
      dateOnly.split('-');

    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);

      if (
        !Number.isNaN(year) &&
        !Number.isNaN(month) &&
        !Number.isNaN(day)
      ) {
        const date = new Date(
          year,
          month - 1,
          day
        );

        return date.toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        );
      }
    }

    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
    ) {
      return value;
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    );
  };

  /*
   * Format amount
   */
  const formatAmount = (
    value: string
  ) => {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
      return `₹${value}`;
    }

    return `₹${amount.toLocaleString(
      'en-IN'
    )}`;
  };

  /*
   * Format status
   */
  const formatStatus = (
    value: string
  ) => {
    if (!value) {
      return '';
    }

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );
  };

  /*
   * Open booking confirmation.
   *
   * IMPORTANT:
   * Confirmation screen expects:
   *
   * bookingId
   * type
   *
   * Therefore we use type here.
   */
  const openBookingDetails = (
    bookingId: string,
    type: 'service' | 'room'
  ) => {
    if (!bookingId) {
      Alert.alert(
        'Booking Error',
        'Booking ID is missing.'
      );
      return;
    }

    console.log(
      'Opening booking confirmation:',
      {
        bookingId,
        type,
      }
    );

    router.push({
      pathname:
        '/booking-confirmation',

      params: {
        bookingId:
          String(bookingId),

        type,
      },
    });
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Header */}

        <Text style={styles.label}>
          DEVOTEE SERVICES
        </Text>

        <Text style={styles.title}>
          My Bookings
        </Text>

        <Text style={styles.subtitle}>
          View your seva and room booking
          history.
        </Text>

        {/* Tabs */}

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'seva' &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab('seva')
            }
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'seva' &&
                  styles.activeTabText,
              ]}
            >
              Pooja / Seva
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'rooms' &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab('rooms')
            }
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'rooms' &&
                  styles.activeTabText,
              ]}
            >
              Rooms
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}

        {loading && (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="large"
              color="#B66A2C"
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading your bookings...
            </Text>
          </View>
        )}

        {/* ================================================= */}
        {/* SERVICE BOOKINGS */}
        {/* ================================================= */}

        {!loading &&
          activeTab === 'seva' &&
          serviceBookings.map(
            (booking) => (
              <TouchableOpacity
                key={booking.id}
                style={
                  styles.bookingCard
                }
                activeOpacity={0.85}
                onPress={() =>
                  openBookingDetails(
                    booking.booking_id,
                    'service'
                  )
                }
              >
                <View
                  style={
                    styles.bookingHeader
                  }
                >
                  <View
                    style={
                      styles.bookingIcon
                    }
                  >
                    <Text
                      style={
                        styles.iconText
                      }
                    >
                      🙏
                    </Text>
                  </View>

                  <View
                    style={
                      styles.headerContent
                    }
                  >
                    <Text
                      style={
                        styles.bookingName
                      }
                    >
                      {
                        booking.service_type
                      }
                    </Text>

                    <Text
                      style={
                        styles.bookingId
                      }
                    >
                      {
                        booking.booking_id
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.status
                    }
                  >
                    <Text
                      style={
                        styles.statusText
                      }
                    >
                      {formatStatus(
                        booking.booking_status
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.divider
                  }
                />

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Date
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {formatDate(
                      booking.booking_date
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Time
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {
                      booking.booking_time
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Devotees
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {
                      booking.number_of_devotees
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Payment
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {formatStatus(
                      booking.payment_status
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Amount
                  </Text>

                  <Text
                    style={
                      styles.amount
                    }
                  >
                    {formatAmount(
                      booking.total_amount
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailsButton
                  }
                >
                  <Text
                    style={
                      styles.detailsButtonText
                    }
                  >
                    View Booking Details
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}

        {/* No service bookings */}

        {!loading &&
          activeTab === 'seva' &&
          serviceBookings.length ===
            0 && (
            <View
              style={
                styles.emptyCard
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
                No Seva Bookings
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Your seva and pooja
                bookings will appear
                here.
              </Text>
            </View>
          )}

        {/* ================================================= */}
        {/* ROOM BOOKINGS */}
        {/* ================================================= */}

        {!loading &&
          activeTab === 'rooms' &&
          roomBookings.map(
            (booking) => (
              <TouchableOpacity
                key={booking.id}
                style={
                  styles.bookingCard
                }
                activeOpacity={0.85}
                onPress={() =>
                  openBookingDetails(
                    booking.booking_id,
                    'room'
                  )
                }
              >
                <View
                  style={
                    styles.bookingHeader
                  }
                >
                  <View
                    style={
                      styles.bookingIcon
                    }
                  >
                    <Text
                      style={
                        styles.iconText
                      }
                    >
                      🛏️
                    </Text>
                  </View>

                  <View
                    style={
                      styles.headerContent
                    }
                  >
                    <Text
                      style={
                        styles.bookingName
                      }
                    >
                      {
                        booking.room_type_name
                      }
                    </Text>

                    <Text
                      style={
                        styles.bookingId
                      }
                    >
                      {
                        booking.booking_id
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.status
                    }
                  >
                    <Text
                      style={
                        styles.statusText
                      }
                    >
                      {formatStatus(
                        booking.booking_status
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.divider
                  }
                />

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Room
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {
                      booking.room_number
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Check-in
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {formatDate(
                      booking.check_in
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Check-out
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {formatDate(
                      booking.check_out
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Guests
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {
                      booking.number_of_guests
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Payment
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {formatStatus(
                      booking.payment_status
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Amount
                  </Text>

                  <Text
                    style={
                      styles.amount
                    }
                  >
                    {formatAmount(
                      booking.total_amount
                    )}
                  </Text>
                </View>

                {/* Clickable details button */}
                <View
                  style={
                    styles.detailsButton
                  }
                >
                  <Text
                    style={
                      styles.detailsButtonText
                    }
                  >
                    View Booking Details
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}

        {/* No room bookings */}

        {!loading &&
          activeTab === 'rooms' &&
          roomBookings.length ===
            0 && (
            <View
              style={
                styles.emptyCard
              }
            >
              <Text
                style={
                  styles.emptyIcon
                }
              >
                🛏️
              </Text>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Room Bookings
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Your room bookings will
                appear here.
              </Text>
            </View>
          )}

        {/* Information */}

        <View
          style={styles.infoCard}
        >
          <Text
            style={styles.infoIcon}
          >
            ℹ️
          </Text>

          <View
            style={styles.infoContent}
          >
            <Text
              style={styles.infoTitle}
            >
              Booking Information
            </Text>

            <Text
              style={styles.infoText}
            >
              Your bookings are loaded
              directly from the temple
              backend. Confirmation
              details and QR codes are
              available from each booking.
            </Text>
          </View>
        </View>

        {/* Book Seva */}

        <TouchableOpacity
          style={
            styles.primaryButton
          }
          onPress={() =>
            router.push('/pooja')
          }
          activeOpacity={0.8}
        >
          <Text
            style={
              styles.primaryButtonText
            }
          >
            Book a Seva
          </Text>
        </TouchableOpacity>

        {/* Book Room */}

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={() =>
            router.push('/rooms')
          }
          activeOpacity={0.8}
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Book a Room
          </Text>
        </TouchableOpacity>

        {/* Home */}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            router.replace('/(tabs)')
          }
          activeOpacity={0.8}
        >
          <Text
            style={
              styles.homeButtonText
            }
          >
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ========================================================= */
/* STYLES */
/* ========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: '#B66A2C',
    marginBottom: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A2C18',
  },

  subtitle: {
    fontSize: 11,
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
  },

  /* Tabs */

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3DEC5',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },

  tab: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },

  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A7565',
  },

  activeTabText: {
    color: '#B66A2C',
    fontWeight: '700',
  },

  /* Loading */

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 11,
    color: '#777',
  },

  /* Booking Card */

  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bookingIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 23,
  },

  headerContent: {
    flex: 1,
  },

  bookingName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  bookingId: {
    fontSize: 9,
    color: '#888',
  },

  status: {
    backgroundColor: '#E9F4E8',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4D7A4A',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEE3D8',
    marginVertical: 13,
  },

  /* Details */

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },

  detailLabel: {
    fontSize: 10,
    color: '#888',
  },

  detailValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A2C18',
    textAlign: 'right',
    maxWidth: '65%',
  },

  amount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B66A2C',
  },

  /* Details Button */

  detailsButton: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  detailsButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B4D20',
  },

  /* Empty */

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  emptyIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
    lineHeight: 15,
  },

  /* Information */

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    elevation: 2,
  },

  infoIcon: {
    fontSize: 23,
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
  },

  /* Buttons */

  primaryButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  secondaryButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  secondaryButtonText: {
    color: '#8B4D20',
    fontSize: 13,
    fontWeight: '700',
  },

  homeButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D5C8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    color: '#4A2C18',
    fontSize: 13,
    fontWeight: '600',
  },
});