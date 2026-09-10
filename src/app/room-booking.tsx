import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import { apiRequest } from '@/services/api';
import { getToken } from '@/services/authStorage';

type Room = {
  id: number;
  room_number: string;
  floor: string;
  status: string;
  description?: string | null;
  image_url?: string | null;
  room_type_id: number;
  building_id?: number;
  building_name?: string;
  room_type_name: string;
  capacity: number;
  price_per_night: string | number;
};

type ApiResponse<T = any> = {
  success?: boolean;
  message?: string;
  data?: T;
  available?: boolean;
};

export default function RoomBookingScreen() {
  const params = useLocalSearchParams<{
    roomTypeId?: string;
    roomTypeName?: string;
    checkIn?: string;
    checkOut?: string;
  }>();

  const roomTypeId = Number(
    params.roomTypeId || 0
  );

  const roomTypeName =
    params.roomTypeName || 'Room';

  const checkIn =
    params.checkIn || '';

  const checkOut =
    params.checkOut || '';

  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [selectedRoom, setSelectedRoom] =
    useState<Room | null>(null);

  const [guests, setGuests] =
    useState('1');

  const [specialRequests, setSpecialRequests] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  /*
   * ----------------------------------------
   * DATE HELPERS
   * ----------------------------------------
   */

  const calculateNights = useCallback(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const startParts =
      checkIn.split('-').map(Number);

    const endParts =
      checkOut.split('-').map(Number);

    if (
      startParts.length !== 3 ||
      endParts.length !== 3 ||
      startParts.some(Number.isNaN) ||
      endParts.some(Number.isNaN)
    ) {
      return 0;
    }

    /*
     * Use UTC so the calculation does not
     * change because of device timezone/DST.
     */
    const start = Date.UTC(
      startParts[0],
      startParts[1] - 1,
      startParts[2]
    );

    const end = Date.UTC(
      endParts[0],
      endParts[1] - 1,
      endParts[2]
    );

    const difference =
      end - start;

    if (difference <= 0) {
      return 0;
    }

    return Math.round(
      difference /
        (1000 * 60 * 60 * 24)
    );
  }, [checkIn, checkOut]);

  const nights =
    calculateNights();

  /*
   * ----------------------------------------
   * PRICE
   * ----------------------------------------
   */

  const totalAmount = useMemo(() => {
    if (!selectedRoom || nights <= 0) {
      return 0;
    }

    const price =
      Number(
        selectedRoom.price_per_night
      );

    if (!Number.isFinite(price)) {
      return 0;
    }

    return price * nights;
  }, [selectedRoom, nights]);

  const formatAmount = (
    amount: number
  ) => {
    return `₹${amount.toLocaleString(
      'en-IN',
      {
        maximumFractionDigits: 2,
      }
    )}`;
  };

  /*
   * ----------------------------------------
   * LOAD AVAILABLE ROOMS
   * ----------------------------------------
   */

  const loadRooms = useCallback(
    async () => {
      try {
        setLoading(true);

        const response =
          await apiRequest('/rooms');

        const allRooms: Room[] =
          Array.isArray(response?.data)
            ? response.data
            : [];

        const filteredRooms =
          allRooms.filter(
            (room) =>
              Number(
                room.room_type_id
              ) === roomTypeId &&
              room.status
                ?.toLowerCase()
                .trim() ===
                'available'
          );

        setRooms(
          filteredRooms
        );

        /*
         * Clear old selection whenever
         * rooms are refreshed.
         */
        setSelectedRoom(null);
      } catch (error: any) {
        console.error(
          'Error loading rooms:',
          error
        );

        Alert.alert(
          'Unable to Load Rooms',
          error?.message ||
            'Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    },
    [roomTypeId]
  );

  /*
   * Reload whenever this screen
   * receives focus.
   */
  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [loadRooms])
  );

  /*
   * ----------------------------------------
   * ROOM SELECTION
   * ----------------------------------------
   */

  const handleSelectRoom = (
    room: Room
  ) => {
    if (bookingLoading) {
      return;
    }

    setSelectedRoom(room);
  };

  /*
   * ----------------------------------------
   * CHECK ROOM AVAILABILITY
   * ----------------------------------------
   *
   * Confirmed backend route:
   *
   * GET
   * /room-bookings/availability/:roomId
   *
   * with:
   * ?check_in=YYYY-MM-DD
   * &check_out=YYYY-MM-DD
   */

 /*
 * ----------------------------------------
 * CHECK ROOM AVAILABILITY
 * ----------------------------------------
 *
 * Backend route:
 *
 * GET
 * /room-bookings/:roomId/availability
 *
 * with:
 * ?check_in=YYYY-MM-DD
 * &check_out=YYYY-MM-DD
 */

const checkSelectedRoomAvailability =
  async (
    roomId: number
  ): Promise<boolean> => {
    console.log(
      'Checking selected room availability:',
      roomId
    );

    const endpoint =
      `/room-bookings/${roomId}/availability` +
      `?check_in=${encodeURIComponent(
        checkIn
      )}` +
      `&check_out=${encodeURIComponent(
        checkOut
      )}`;

    console.log(
      'Availability endpoint:',
      endpoint
    );

    const response =
      await apiRequest(
        endpoint
      );

    console.log(
      'Selected room availability response:',
      response
    );

    return (
      response?.available === true
    );
  };
  /*
   * ----------------------------------------
   * BOOK ROOM
   * ----------------------------------------
   */

  const handleBooking = async () => {
    /*
     * Room validation
     */
    if (!selectedRoom) {
      Alert.alert(
        'Select Room',
        'Please select a room before continuing.'
      );

      return;
    }

    /*
     * Date validation
     */
    if (!checkIn || !checkOut) {
      Alert.alert(
        'Select Dates',
        'Please select check-in and check-out dates.'
      );

      return;
    }

    /*
     * Night validation
     */
    if (nights <= 0) {
      Alert.alert(
        'Invalid Dates',
        'Check-out date must be after check-in date.'
      );

      return;
    }

    /*
     * Guest validation
     */
    const guestCount =
      Number(
        guests.trim()
      );

    if (
      !Number.isInteger(
        guestCount
      ) ||
      guestCount < 1
    ) {
      Alert.alert(
        'Invalid Guests',
        'Please enter at least 1 guest.'
      );

      return;
    }

    /*
     * Capacity validation
     */
    if (
      guestCount >
      Number(
        selectedRoom.capacity
      )
    ) {
      Alert.alert(
        'Guest Limit',
        `This room can accommodate up to ${selectedRoom.capacity} guests.`
      );

      return;
    }

    /*
     * Price validation
     */
    const roomPrice =
      Number(
        selectedRoom.price_per_night
      );

    if (
      !Number.isFinite(
        roomPrice
      ) ||
      roomPrice < 0
    ) {
      Alert.alert(
        'Invalid Room Price',
        'The selected room has an invalid price. Please select another room.'
      );

      return;
    }

    try {
      setBookingLoading(true);

      /*
       * ------------------------------------
       * AUTHENTICATION CHECK
       * ------------------------------------
       */

      const token =
        await getToken();

      if (!token) {
        Alert.alert(
          'Login Required',
          'Please login to continue with room booking.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Login',
              onPress: () =>
                router.replace(
                  '/login'
                ),
            },
          ]
        );

        return;
      }

      /*
       * ------------------------------------
       * STEP 1
       * CHECK CURRENT ROOM AVAILABILITY
       * ------------------------------------
       */

      let roomIsAvailable =
        false;

      try {
        roomIsAvailable =
          await checkSelectedRoomAvailability(
            selectedRoom.id
          );
      } catch (
        availabilityError: any
      ) {
        console.error(
          'Availability check failed:',
          availabilityError
        );

        Alert.alert(
          'Unable to Check Availability',
          availabilityError?.message ||
            'Unable to verify this room. Please try again.'
        );

        return;
      }

      /*
       * Room is no longer available
       */
      if (!roomIsAvailable) {
        Alert.alert(
          'Room Unavailable',
          `Room ${selectedRoom.room_number} is no longer available for ${checkIn} to ${checkOut}. Please select another room.`
        );

        setRooms(
          (currentRooms) =>
            currentRooms.filter(
              (room) =>
                room.id !==
                selectedRoom.id
            )
        );

        setSelectedRoom(
          null
        );

        return;
      }

      /*
       * ------------------------------------
       * STEP 2
       * CREATE BOOKING
       * ------------------------------------
       */

      const bookingPayload = {
        room_id:
          selectedRoom.id,

        check_in:
          checkIn,

        check_out:
          checkOut,

        number_of_guests:
          guestCount,

        total_amount:
          totalAmount,

        special_requests:
          specialRequests.trim() ||
          null,
      };

      console.log(
        'Creating room booking:',
        bookingPayload
      );

      const response: ApiResponse =
        await apiRequest(
          '/room-bookings',
          {
            method: 'POST',
            token,
            body:
              bookingPayload,
          }
        );

      console.log(
        'Room booking response:',
        response
      );

      /*
       * Backend success validation
       */
      if (
        !response?.success
      ) {
        throw new Error(
          response?.message ||
            'Failed to create room booking.'
        );
      }

      /*
       * ------------------------------------
       * GET BOOKING ID
       * ------------------------------------
       */

      const bookingId =
        response?.data
          ?.booking_id;

      if (
        bookingId === undefined ||
        bookingId === null ||
        bookingId === ''
      ) {
        throw new Error(
          'Booking was created but booking ID was not returned by the server.'
        );
      }

      /*
       * ------------------------------------
       * SUCCESS
       * ------------------------------------
       */

      Alert.alert(
        'Booking Created',
        `Room booking ${bookingId} has been created successfully.`,
        [
          {
            text: 'View Booking',
            onPress: () => {
              router.replace({
                pathname:
                  '/booking-confirmation',
                params: {
                  bookingId:
                    String(
                      bookingId
                    ),
                  type: 'room',
                },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        'Room booking error:',
        error
      );

      Alert.alert(
        'Booking Failed',
        error?.message ||
          'Unable to create room booking. Please try again.'
      );
    } finally {
      setBookingLoading(
        false
      );
    }
  };

  /*
   * ----------------------------------------
   * UI
   * ----------------------------------------
   */

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
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <Text
          style={styles.label}
        >
          TEMPLE ACCOMMODATION
        </Text>

        <Text
          style={styles.title}
        >
          Book Room 🛏️
        </Text>

        <Text
          style={styles.subtitle}
        >
          Complete your accommodation
          booking.
        </Text>

        {/* SELECTED ROOM TYPE */}

        <View
          style={
            styles.summaryCard
          }
        >
          <Text
            style={
              styles.summaryLabel
            }
          >
            SELECTED ROOM TYPE
          </Text>

          <Text
            style={
              styles.summaryName
            }
          >
            {roomTypeName}
          </Text>

          <Text
            style={
              styles.summaryDates
            }
          >
            {checkIn || '—'} →{' '}
            {checkOut || '—'}
          </Text>
        </View>

        {/* BOOKING DATES */}

        <Text
          style={styles.sectionTitle}
        >
          Booking Dates
        </Text>

        <View
          style={styles.dateCard}
        >
          <View
            style={styles.dateBox}
          >
            <Text
              style={styles.dateLabel}
            >
              CHECK-IN
            </Text>

            <Text
              style={styles.dateValue}
            >
              {checkIn ||
                'Not selected'}
            </Text>
          </View>

          <Text
            style={styles.arrow}
          >
            →
          </Text>

          <View
            style={styles.dateBox}
          >
            <Text
              style={styles.dateLabel}
            >
              CHECK-OUT
            </Text>

            <Text
              style={styles.dateValue}
            >
              {checkOut ||
                'Not selected'}
            </Text>
          </View>
        </View>

        {/* NIGHTS */}

        {nights > 0 && (
          <View
            style={
              styles.nightsBadge
            }
          >
            <Text
              style={
                styles.nightsBadgeText
              }
            >
              {nights}{' '}
              {nights === 1
                ? 'Night'
                : 'Nights'}
            </Text>
          </View>
        )}

        {/* GUESTS */}

        <Text
          style={styles.sectionTitle}
        >
          Number of Guests
        </Text>

        <View
          style={styles.inputCard}
        >
          <Text
            style={styles.inputLabel}
          >
            GUESTS
          </Text>

          <TextInput
            value={guests}
            onChangeText={
              setGuests
            }
            keyboardType="number-pad"
            maxLength={2}
            style={styles.input}
            placeholder="Enter number of guests"
            placeholderTextColor="#AAA"
            editable={
              !bookingLoading
            }
          />
        </View>

        {/* ROOMS */}

        <Text
          style={styles.sectionTitle}
        >
          Select Room
        </Text>

        {loading ? (
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
              Loading available
              rooms...
            </Text>
          </View>
        ) : rooms.length === 0 ? (
          <View
            style={styles.emptyCard}
          >
            <Text
              style={styles.emptyIcon}
            >
              🛏️
            </Text>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No Rooms Available
            </Text>

            <Text
              style={styles.emptyText}
            >
              There are currently no
              available rooms of this
              type.
            </Text>

            <TouchableOpacity
              style={
                styles.retryButton
              }
              onPress={
                loadRooms
              }
              disabled={
                loading ||
                bookingLoading
              }
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Refresh Rooms
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          rooms.map(
            (room) => {
              const selected =
                selectedRoom?.id ===
                room.id;

              return (
                <TouchableOpacity
                  key={room.id}
                  style={[
                    styles.roomCard,
                    selected &&
                      styles.selectedRoomCard,
                  ]}
                  onPress={() =>
                    handleSelectRoom(
                      room
                    )
                  }
                  activeOpacity={
                    0.8
                  }
                  disabled={
                    bookingLoading
                  }
                >
                  <View
                    style={
                      styles.roomIconBox
                    }
                  >
                    <Text
                      style={
                        styles.roomIcon
                      }
                    >
                      🛏️
                    </Text>
                  </View>

                  <View
                    style={
                      styles.roomContent
                    }
                  >
                    <Text
                      style={
                        styles.roomName
                      }
                    >
                      Room{' '}
                      {
                        room.room_number
                      }
                    </Text>

                    <Text
                      style={
                        styles.roomFloor
                      }
                    >
                      {room.floor ||
                        'Floor not specified'}
                    </Text>

                    <Text
                      style={
                        styles.roomDescription
                      }
                    >
                      {room.description ||
                        room.room_type_name}
                    </Text>

                    <View
                      style={
                        styles.roomBottom
                      }
                    >
                      <Text
                        style={
                          styles.capacity
                        }
                      >
                        👥 Up to{' '}
                        {
                          room.capacity
                        }
                      </Text>

                      <Text
                        style={
                          styles.price
                        }
                      >
                        {formatAmount(
                          Number(
                            room.price_per_night
                          )
                        )}
                        {' / night'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      selected &&
                        styles.radioSelected,
                    ]}
                  >
                    {selected && (
                      <View
                        style={
                          styles.radioDot
                        }
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }
          )
        )}

        {/* SPECIAL REQUESTS */}

        <Text
          style={styles.sectionTitle}
        >
          Special Requests
        </Text>

        <View
          style={
            styles.requestCard
          }
        >
          <TextInput
            value={
              specialRequests
            }
            onChangeText={
              setSpecialRequests
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={
              styles.requestInput
            }
            placeholder="Any special requirements? (Optional)"
            placeholderTextColor="#AAA"
            editable={
              !bookingLoading
            }
          />
        </View>

        {/* PRICE SUMMARY */}

        {selectedRoom && (
          <View
            style={styles.priceCard}
          >
            <Text
              style={styles.priceTitle}
            >
              Booking Summary
            </Text>

            <View
              style={
                styles.summaryRow
              }
            >
              <Text
                style={
                  styles.summaryRowLabel
                }
              >
                Room
              </Text>

              <Text
                style={
                  styles.summaryRowValue
                }
              >
                Room{' '}
                {
                  selectedRoom.room_number
                }
              </Text>
            </View>

            <View
              style={
                styles.summaryRow
              }
            >
              <Text
                style={
                  styles.summaryRowLabel
                }
              >
                Room Type
              </Text>

              <Text
                style={
                  styles.summaryRowValue
                }
              >
                {
                  selectedRoom.room_type_name
                }
              </Text>
            </View>

            <View
              style={
                styles.summaryRow
              }
            >
              <Text
                style={
                  styles.summaryRowLabel
                }
              >
                Price / Night
              </Text>

              <Text
                style={
                  styles.summaryRowValue
                }
              >
                {formatAmount(
                  Number(
                    selectedRoom.price_per_night
                  )
                )}
              </Text>
            </View>

            <View
              style={
                styles.summaryRow
              }
            >
              <Text
                style={
                  styles.summaryRowLabel
                }
              >
                Nights
              </Text>

              <Text
                style={
                  styles.summaryRowValue
                }
              >
                {nights}
              </Text>
            </View>

            <View
              style={
                styles.summaryRow
              }
            >
              <Text
                style={
                  styles.summaryRowLabel
                }
              >
                Guests
              </Text>

              <Text
                style={
                  styles.summaryRowValue
                }
              >
                {guests}
              </Text>
            </View>

            <View
              style={
                styles.summaryDivider
              }
            />

            <View
              style={styles.totalRow}
            >
              <Text
                style={
                  styles.totalLabel
                }
              >
                Total Amount
              </Text>

              <Text
                style={
                  styles.totalAmount
                }
              >
                {formatAmount(
                  totalAmount
                )}
              </Text>
            </View>
          </View>
        )}

        {/* CONFIRM BOOKING */}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!selectedRoom ||
              bookingLoading) &&
              styles.disabledButton,
          ]}
          onPress={
            handleBooking
          }
          disabled={
            bookingLoading ||
            !selectedRoom
          }
          activeOpacity={0.8}
        >
          {bookingLoading ? (
            <>
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.loadingButtonText
                }
              >
                Creating Booking...
              </Text>
            </>
          ) : (
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Confirm Room Booking
            </Text>
          )}
        </TouchableOpacity>

        {/* BACK */}

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={() =>
            router.back()
          }
          disabled={
            bookingLoading
          }
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Back to Rooms
          </Text>
        </TouchableOpacity>

        {/* INFORMATION */}

        <View
          style={styles.infoCard}
        >
          <Text
            style={styles.infoIcon}
          >
            🙏
          </Text>

          <View
            style={
              styles.infoContent
            }
          >
            <Text
              style={styles.infoTitle}
            >
              Booking Information
            </Text>

            <Text
              style={styles.infoText}
            >
              Your room booking will
              be saved securely to your
              temple account. Confirmation
              details will be available
              after booking.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/*
 * ========================================
 * STYLES
 * ========================================
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

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 10,
  },

  summaryCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },

  summaryLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#A66A3D',
    marginBottom: 5,
  },

  summaryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
  },

  summaryDates: {
    fontSize: 10,
    color: '#6F6258',
    marginTop: 6,
  },

  dateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },

  dateBox: {
    flex: 1,
    backgroundColor: '#F8EBDD',
    borderRadius: 12,
    padding: 12,
  },

  dateLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#A66A3D',
    marginBottom: 5,
  },

  dateValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A2C18',
  },

  arrow: {
    width: 32,
    textAlign: 'center',
    fontSize: 16,
    color: '#B66A2C',
  },

  nightsBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#F3DEC5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 22,
  },

  nightsBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8B4D20',
  },

  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 14,
    marginBottom: 22,
    elevation: 2,
  },

  inputLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#A66A3D',
    marginBottom: 4,
  },

  input: {
    height: 38,
    fontSize: 13,
    fontWeight: '600',
    color: '#4A2C18',
  },

  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 35,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 11,
    color: '#777',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 15,
  },

  retryButton: {
    backgroundColor: '#F3DEC5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  retryButtonText: {
    color: '#8B4D20',
    fontSize: 11,
    fontWeight: '700',
  },

  roomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE3D8',
    elevation: 2,
  },

  selectedRoomCard: {
    borderWidth: 2,
    borderColor: '#B66A2C',
    backgroundColor: '#FFF9F0',
  },

  roomIconBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  roomIcon: {
    fontSize: 25,
  },

  roomContent: {
    flex: 1,
  },

  roomName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
  },

  roomFloor: {
    fontSize: 9,
    color: '#A66A3D',
    marginTop: 2,
  },

  roomDescription: {
    fontSize: 9,
    color: '#777',
    marginTop: 4,
  },

  roomBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },

  capacity: {
    fontSize: 9,
    color: '#777',
  },

  price: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B66A2C',
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D7C6B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  radioSelected: {
    borderColor: '#B66A2C',
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B66A2C',
  },

  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
  },

  requestInput: {
    minHeight: 90,
    fontSize: 11,
    color: '#4A2C18',
  },

  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },

  priceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  summaryRowLabel: {
    fontSize: 10,
    color: '#888',
  },

  summaryRowValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A2C18',
    maxWidth: '60%',
    textAlign: 'right',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#EEE3D8',
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A2C18',
  },

  totalAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B66A2C',
  },

  primaryButton: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  loadingButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  secondaryButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  secondaryButtonText: {
    color: '#8B4D20',
    fontSize: 12,
    fontWeight: '700',
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  infoIcon: {
    fontSize: 25,
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
});