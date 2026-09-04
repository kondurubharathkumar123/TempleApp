import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import { apiRequest } from '@/services/api';
import { getToken } from '@/services/authStorage';

type BookingData = {
  booking_id: string;
  booking_type: 'room' | 'service';

  devotee?: {
    full_name?: string;
    email?: string;
    phone?: string;
  };

  room?: {
    room_number?: string;
    room_type_name?: string;
  };

  service?: {
    service_type?: string;
    booking_date?: string;
    booking_time?: string;
    number_of_devotees?: number;
  };

  check_in?: string;
  check_out?: string;
  number_of_guests?: number;

  total_amount?: string;
  booking_status?: string;
  payment_status?: string;
  special_requests?: string;
  qr_code?: string;
};

export default function BookingConfirmationScreen() {
  const params = useLocalSearchParams<{
    bookingId?: string;
    bookingType?: string;
  }>();

  const bookingId = Array.isArray(
    params.bookingId
  )
    ? params.bookingId[0]
    : params.bookingId;

 const bookingTypeParam = Array.isArray(
  params.bookingType
)
  ? params.bookingType[0]
  : params.bookingType;

/*
 * Room booking IDs always start with ROOM-.
 * This also protects against bookingType being
 * missing or incorrectly passed during navigation.
 */
const bookingType =
  bookingTypeParam === 'room' ||
  bookingId?.startsWith('ROOM-')
    ? 'room'
    : 'service';

  const [booking, setBooking] =
    useState<BookingData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadBooking();
  }, [bookingId, bookingType]);

  const loadBooking = async () => {
    if (!bookingId) {
      setError('Booking ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = await getToken();

      if (!token) {
        throw new Error(
          'Authentication token missing. Please login again.'
        );
      }

      /*
       * Use the correct endpoint based on booking type.
       */
      const endpoint =
        bookingType === 'room'
          ? `/room-bookings/${encodeURIComponent(
              bookingId
            )}`
          : `/service-bookings/${encodeURIComponent(
              bookingId
            )}`;

      console.log(
        'Loading booking:',
        endpoint
      );

      const result = await apiRequest(
        endpoint,
        {
          method: 'GET',
          token,
        }
      );

      console.log(
        'Booking response:',
        result
      );

      if (!result?.success) {
        throw new Error(
          result?.message ||
            'Failed to load booking'
        );
      }

      if (!result?.data) {
        throw new Error(
          'Booking details were not returned by the server.'
        );
      }

      const data = result.data;

      /*
       * ROOM BOOKING
       */
      if (bookingType === 'room') {
        setBooking({
          booking_id: data.booking_id,

          booking_type: 'room',

          devotee: {
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
          },

          room: {
            room_number:
              data.room_number,
            room_type_name:
              data.room_type_name,
          },

          check_in: data.check_in,

          check_out: data.check_out,

          number_of_guests:
            data.number_of_guests,

          total_amount: String(
            data.total_amount ?? ''
          ),

          booking_status:
            data.booking_status,

          payment_status:
            data.payment_status,

          special_requests:
            data.special_requests,

          qr_code:
            data.booking_id,
        });

        return;
      }

      /*
       * SERVICE / SEVA BOOKING
       *
       * Backend currently returns:
       *
       * data.booking_id
       * data.service_type
       * data.booking_date
       * data.booking_time
       * data.number_of_devotees
       * data.total_amount
       * data.booking_status
       * data.payment_status
       * data.special_requests
       * data.full_name
       * data.email
       * data.phone
       */
      setBooking({
        booking_id: data.booking_id,

        booking_type: 'service',

        devotee: {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
        },

        service: {
          service_type:
            data.service_type,

          booking_date:
            data.booking_date,

          booking_time:
            data.booking_time,

          number_of_devotees:
            data.number_of_devotees,
        },

        total_amount: String(
          data.total_amount ?? ''
        ),

        booking_status:
          data.booking_status,

        payment_status:
          data.payment_status,

        special_requests:
          data.special_requests,

        qr_code:
          data.booking_id,
      });
    } catch (err: any) {
      console.error(
        'Booking confirmation error:',
        err
      );

      setError(
        err?.message ||
          'Unable to load booking details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (
    value?: string
  ) => {
    if (!value) {
      return '-';
    }

    /*
     * PostgreSQL date may arrive as:
     * 2026-09-02
     *
     * Avoid timezone shifting for plain dates.
     */
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      const [
        year,
        month,
        day,
      ] = value.split('-');

      return `${day}-${month}-${year}`;
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
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

  const formatAmount = (
    value?: string
  ) => {
    if (!value) {
      return '₹0';
    }

    const numericValue =
      Number(value);

    if (
      Number.isNaN(numericValue)
    ) {
      return value;
    }

    return `₹${numericValue.toLocaleString(
      'en-IN'
    )}`;
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#B66A2C"
          />

          <Text
            style={styles.loadingText}
          >
            Loading booking details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * Error
   */
  if (error || !booking) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <Text
            style={styles.errorIcon}
          >
            !
          </Text>

          <Text
            style={styles.errorTitle}
          >
            Unable to load booking
          </Text>

          <Text
            style={styles.errorText}
          >
            {error ||
              'Booking details could not be found.'}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={loadBooking}
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Try Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.secondaryButtonText
              }
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isRoom =
    booking.booking_type === 'room';

  const isPaid =
    String(
      booking.payment_status || ''
    ).toLowerCase() === 'paid';

  const isConfirmed =
    String(
      booking.booking_status || ''
    ).toLowerCase() ===
    'confirmed';

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
      >
        {/* Header */}

        <Text style={styles.label}>
          BOOKING CONFIRMATION
        </Text>

        <Text style={styles.title}>
          {isConfirmed
            ? 'Booking Confirmed'
            : 'Booking Created'}
        </Text>

        <Text style={styles.subtitle}>
          Keep this booking proof for
          your temple visit.
        </Text>

        {/* Success */}

        <View
          style={styles.successCard}
        >
          <View
            style={styles.successCircle}
          >
            <Text
              style={
                styles.successCheck
              }
            >
              ✓
            </Text>
          </View>

          <View
            style={styles.successContent}
          >
            <Text
              style={styles.successTitle}
            >
              {isRoom
                ? 'Room Booking'
                : 'Seva Booking'}
            </Text>

            <Text
              style={styles.successText}
            >
              {isConfirmed
                ? 'Your booking has been confirmed successfully.'
                : 'Your booking has been created successfully.'}
            </Text>
          </View>
        </View>

        {/* Booking ID */}

        <View
          style={styles.bookingIdCard}
        >
          <Text
            style={styles.bookingIdLabel}
          >
            BOOKING ID
          </Text>

          <Text
            style={styles.bookingId}
          >
            {booking.booking_id}
          </Text>
        </View>

        {/* QR / Verification */}

<View style={styles.qrCard}>
  <Text style={styles.sectionTitle}>
    Booking Verification
  </Text>

  <View style={styles.qrPlaceholder}>
    <QRCode
      value={booking.qr_code || booking.booking_id}
      size={160}
      color="#4A2C18"
      backgroundColor="#FFFFFF"
    />
  </View>

  <Text style={styles.qrCodeText}>
    {booking.qr_code || booking.booking_id}
  </Text>

  <Text style={styles.qrHint}>
    Scan this QR code to verify your booking.
  </Text>
</View>

        {/* Devotee Details */}

        <View style={styles.card}>
          <Text
            style={styles.sectionTitle}
          >
            Devotee Details
          </Text>

          <DetailRow
            label="Name"
            value={
              booking.devotee
                ?.full_name
            }
          />

          <DetailRow
            label="Email"
            value={
              booking.devotee?.email
            }
          />

          <DetailRow
            label="Phone"
            value={
              booking.devotee?.phone
            }
          />
        </View>

        {/* Room Details */}

        {isRoom &&
          booking.room && (
            <View
              style={styles.card}
            >
              <Text
                style={styles.sectionTitle}
              >
                Room Details
              </Text>

              <DetailRow
                label="Room"
                value={
                  booking.room
                    .room_number
                }
              />

              <DetailRow
                label="Room Type"
                value={
                  booking.room
                    .room_type_name
                }
              />

              <DetailRow
                label="Check-in"
                value={formatDate(
                  booking.check_in
                )}
              />

              <DetailRow
                label="Check-out"
                value={formatDate(
                  booking.check_out
                )}
              />

              <DetailRow
                label="Guests"
                value={String(
                  booking.number_of_guests ||
                    '-'
                )}
              />
            </View>
          )}

        {/* Service Details */}

        {!isRoom &&
          booking.service && (
            <View
              style={styles.card}
            >
              <Text
                style={styles.sectionTitle}
              >
                Seva Details
              </Text>

              <DetailRow
                label="Service"
                value={
                  booking.service
                    .service_type
                }
              />

              <DetailRow
                label="Date"
                value={formatDate(
                  booking.service
                    .booking_date
                )}
              />

              <DetailRow
                label="Time"
                value={
                  booking.service
                    .booking_time
                }
              />

              <DetailRow
                label="Devotees"
                value={String(
                  booking.service
                    .number_of_devotees ||
                    '-'
                )}
              />
            </View>
          )}

        {/* Payment Details */}

        <View style={styles.card}>
          <Text
            style={styles.sectionTitle}
          >
            Payment Details
          </Text>

          <DetailRow
            label="Amount"
            value={formatAmount(
              booking.total_amount
            )}
            highlight
          />

          <DetailRow
            label="Payment Status"
            value={
              booking.payment_status ||
              'Pending'
            }
            status
          />

          <DetailRow
            label="Booking Status"
            value={
              booking.booking_status ||
              'Pending'
            }
            status
          />
        </View>

        {/* Special Requests */}

        {booking.special_requests ? (
          <View style={styles.card}>
            <Text
              style={styles.sectionTitle}
            >
              Special Requests
            </Text>

            <Text
              style={
                styles.specialRequest
              }
            >
              {booking.special_requests}
            </Text>
          </View>
        ) : null}

        {/* Buttons */}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push(
              '/my-bookings'
            )
          }
        >
          <Text
            style={
              styles.primaryButtonText
            }
          >
            View My Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            router.replace(
              '/(tabs)'
            )
          }
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
  highlight,
  status,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
  status?: boolean;
}) {
  return (
    <View
      style={styles.detailRow}
    >
      <Text
        style={styles.detailLabel}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.detailValue,
          highlight &&
            styles.amount,
          status &&
            styles.statusValue,
        ]}
      >
        {value || '-'}
      </Text>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 12,
    color: '#777',
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

  successCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  successCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  successCheck: {
    fontSize: 25,
    fontWeight: '700',
    color: '#B66A2C',
  },

  successContent: {
    flex: 1,
  },

  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 3,
  },

  successText: {
    fontSize: 10,
    color: '#777',
    lineHeight: 15,
  },

  bookingIdCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },

  bookingIdLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#999',
    marginBottom: 7,
  },

  bookingId: {
    fontSize: 17,
    fontWeight: '800',
    color: '#B66A2C',
    letterSpacing: 0.5,
  },

  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    alignItems: 'center',
    marginBottom: 18,
    elevation: 2,
  },

  sectionTitle: {
    width: '100%',
    fontSize: 16,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 14,
  },

qrPlaceholder: {
  width: 190,
  height: 190,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E5DED7',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
},

  qrCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A2C18',
    textAlign: 'center',
  },

  qrHint: {
    fontSize: 9,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 18,
    elevation: 2,
  },

  detailRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8E0',
  },

  detailLabel: {
    flex: 1,
    fontSize: 10,
    color: '#888',
  },

  detailValue: {
    flex: 1.5,
    fontSize: 11,
    fontWeight: '600',
    color: '#4A2C18',
    textAlign: 'right',
  },

  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B66A2C',
  },

  statusValue: {
    color: '#4B8B55',
    textTransform: 'capitalize',
  },

  specialRequest: {
    fontSize: 11,
    color: '#666',
    lineHeight: 17,
  },

  primaryButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
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
    width: '100%',
    marginTop: 10,
  },

  secondaryButtonText: {
    color: '#7A4A25',
    fontSize: 13,
    fontWeight: '700',
  },

  errorIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3DEC5',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: '#B66A2C',
    marginBottom: 15,
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 8,
  },

  errorText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 20,
  },
});