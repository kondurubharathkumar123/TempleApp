import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiRequest } from '@/services/api';

type RoomType = {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  price_per_night: string;
  image_url?: string | null;
  is_active: boolean;
};

type Room = {
  id: number;
  room_number: string;
  floor: string | null;
  status: string;
  description?: string | null;
  image_url?: string | null;
  room_type_id: number;
  room_type_name: string;
  capacity: number;
  price_per_night: string;
  building_id?: number;
  building_name?: string;
  building_code?: string;
};

export default function RoomsScreen() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const [showCheckInPicker, setShowCheckInPicker] =
    useState(false);

  const [showCheckOutPicker, setShowCheckOutPicker] =
    useState(false);

  const [checkingAvailability, setCheckingAvailability] =
    useState(false);

  const [availableRoomIds, setAvailableRoomIds] =
    useState<number[]>([]);

  const [datesSelected, setDatesSelected] =
    useState(false);

  /*
   * ----------------------------------------------------
   * LOAD ROOMS
   * ----------------------------------------------------
   */

  const loadRooms = async () => {
    try {
      setLoading(true);

      const [typesResponse, roomsResponse] =
        await Promise.all([
          apiRequest('/rooms/types'),
          apiRequest('/rooms'),
        ]);

      setRoomTypes(typesResponse?.data || []);
      setRooms(roomsResponse?.data || []);
    } catch (error: any) {
      console.error('Error loading rooms:', error);

      Alert.alert(
        'Unable to Load Rooms',
        error?.message ||
          'Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [])
  );

  /*
   * ----------------------------------------------------
   * DATE HELPERS
   * ----------------------------------------------------
   */

  const formatDate = (date: Date | null) => {
    if (!date) {
      return 'Select Date';
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatPrice = (value: string) => {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
      return `₹${value} / night`;
    }

    return `₹${amount.toLocaleString(
      'en-IN'
    )} / night`;
  };

  /*
   * ----------------------------------------------------
   * CHECK-IN DATE
   * ----------------------------------------------------
   */

  const handleCheckInChange = (
    _event: any,
    selectedDate?: Date
  ) => {
    setShowCheckInPicker(false);

    if (!selectedDate) {
      return;
    }

    setCheckIn(selectedDate);

    /*
     * If checkout is before/equal to new
     * check-in, reset checkout.
     */
    if (
      checkOut &&
      selectedDate >= checkOut
    ) {
      setCheckOut(null);
    }

    /*
     * New dates mean old availability
     * is no longer valid.
     */
    setDatesSelected(false);
    setAvailableRoomIds([]);
  };

  /*
   * ----------------------------------------------------
   * CHECK-OUT DATE
   * ----------------------------------------------------
   */

  const handleCheckOutChange = (
    _event: any,
    selectedDate?: Date
  ) => {
    setShowCheckOutPicker(false);

    if (!selectedDate) {
      return;
    }

    if (
      checkIn &&
      selectedDate <= checkIn
    ) {
      Alert.alert(
        'Invalid Check-out Date',
        'Check-out must be after the check-in date.'
      );
      return;
    }

    setCheckOut(selectedDate);

    /*
     * New dates mean old availability
     * is no longer valid.
     */
    setDatesSelected(false);
    setAvailableRoomIds([]);
  };

  /*
   * ----------------------------------------------------
   * CHECK ROOM AVAILABILITY
   * ----------------------------------------------------
   */

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      Alert.alert(
        'Select Dates',
        'Please select both check-in and check-out dates.'
      );
      return;
    }

    try {
      setCheckingAvailability(true);

      /*
       * Get currently active rooms.
       */
      const activeRooms = rooms.filter(
        (room) =>
          String(room.status).toLowerCase() ===
          'available'
      );

      if (activeRooms.length === 0) {
        setAvailableRoomIds([]);
        setDatesSelected(true);

        Alert.alert(
          'No Rooms Available',
          'There are currently no rooms available.'
        );

        return;
      }

      const availableIds: number[] = [];

      /*
       * Check every active room against
       * the selected dates.
       */
      for (const room of activeRooms) {
        try {
          const checkInDate =
            formatDateForApi(checkIn);

          const checkOutDate =
            formatDateForApi(checkOut);

          const endpoint =
            `/room-bookings/availability/${room.id}` +
            `?check_in=${checkInDate}` +
            `&check_out=${checkOutDate}`;

          console.log(
            'Checking room availability:',
            endpoint
          );

          const response =
            await apiRequest(endpoint);

          console.log(
            `Room ${room.id} availability response:`,
            response
          );

          /*
           * Current backend response:
           *
           * {
           *   available: true
           * }
           *
           * Also support:
           *
           * {
           *   success: true,
           *   available: true
           * }
           *
           * and:
           *
           * {
           *   success: true,
           *   data: {
           *     available: true
           *   }
           * }
           */
          const isAvailable =
            response?.available === true ||
            response?.data?.available === true;

          if (isAvailable) {
            availableIds.push(room.id);
          }
        } catch (error) {
          console.error(
            `Availability error for room ${room.id}:`,
            error
          );
        }
      }

      /*
       * Save availability result.
       */
      setAvailableRoomIds(availableIds);
      setDatesSelected(true);

      /*
       * No rooms found.
       */
      if (availableIds.length === 0) {
        Alert.alert(
          'No Rooms Available',
          `No rooms are available from ${formatDate(
            checkIn
          )} to ${formatDate(checkOut)}.`
        );

        return;
      }

      /*
       * Rooms found.
       *
       * Stay on this page so devotee can
       * select the required room type.
       */
      console.log(
        'Available room IDs:',
        availableIds
      );
    } catch (error: any) {
      console.error(
        'Availability check error:',
        error
      );

      Alert.alert(
        'Unable to Check Availability',
        error?.message ||
          'Please try again later.'
      );
    } finally {
      setCheckingAvailability(false);
    }
  };

  /*
   * ----------------------------------------------------
   * AVAILABLE ROOM COUNT
   * ----------------------------------------------------
   */

  const getAvailableRoomCount = (
    roomTypeId: number
  ) => {
    /*
     * Before checking dates:
     * show current room status.
     */
    if (!datesSelected) {
      return rooms.filter(
        (room) =>
          room.room_type_id === roomTypeId &&
          String(room.status).toLowerCase() ===
            'available'
      ).length;
    }

    /*
     * After checking dates:
     * show only rooms confirmed available
     * for selected dates.
     */
    return rooms.filter(
      (room) =>
        room.room_type_id === roomTypeId &&
        availableRoomIds.includes(room.id)
    ).length;
  };

  /*
   * ----------------------------------------------------
   * SELECT ROOM TYPE
   * ----------------------------------------------------
   */

  const handleRoomSelect = (
    roomType: RoomType
  ) => {
    if (!checkIn || !checkOut) {
      Alert.alert(
        'Select Dates First',
        'Please select check-in and check-out dates before selecting a room.'
      );
      return;
    }

    if (!datesSelected) {
      Alert.alert(
        'Check Availability',
        'Please tap "Check Room Availability" first.'
      );
      return;
    }

    /*
     * Get rooms available for this
     * particular room type.
     */
    const availableRooms = rooms.filter(
      (room) =>
        room.room_type_id === roomType.id &&
        availableRoomIds.includes(room.id)
    );

    if (availableRooms.length === 0) {
      Alert.alert(
        'No Rooms Available',
        `No ${roomType.name.toLowerCase()} is available for the selected dates.`
      );
      return;
    }

    /*
     * Navigate to room booking screen.
     */
    router.push({
      pathname: '/room-booking',
      params: {
        roomTypeId: String(roomType.id),

        roomTypeName:
          roomType.name,

        checkIn:
          formatDateForApi(checkIn),

        checkOut:
          formatDateForApi(checkOut),

        availableRoomIds:
          availableRooms
            .map((room) =>
              String(room.id)
            )
            .join(','),
      },
    });
  };

  /*
   * ----------------------------------------------------
   * RENDER
   * ----------------------------------------------------
   */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* HEADER */}

        <Text style={styles.label}>
          TEMPLE ACCOMMODATION
        </Text>

        <Text style={styles.title}>
          Rooms 🛏️
        </Text>

        <Text style={styles.subtitle}>
          Book comfortable accommodation for your
          temple visit.
        </Text>

        {/* DATES */}

        <Text style={styles.sectionTitle}>
          Select Dates
        </Text>

        <View style={styles.dateCard}>

          {/* CHECK-IN */}

          <TouchableOpacity
            style={styles.dateBox}
            activeOpacity={0.8}
            onPress={() =>
              setShowCheckInPicker(true)
            }
          >
            <Text style={styles.dateLabel}>
              CHECK-IN
            </Text>

            <Text
              style={[
                styles.dateValue,
                checkIn &&
                  styles.selectedDateValue,
              ]}
            >
              {formatDate(checkIn)}
            </Text>
          </TouchableOpacity>

          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>
              →
            </Text>
          </View>

          {/* CHECK-OUT */}

          <TouchableOpacity
            style={styles.dateBox}
            activeOpacity={0.8}
            onPress={() => {
              if (!checkIn) {
                Alert.alert(
                  'Select Check-in',
                  'Please select your check-in date first.'
                );
                return;
              }

              setShowCheckOutPicker(true);
            }}
          >
            <Text style={styles.dateLabel}>
              CHECK-OUT
            </Text>

            <Text
              style={[
                styles.dateValue,
                checkOut &&
                  styles.selectedDateValue,
              ]}
            >
              {formatDate(checkOut)}
            </Text>
          </TouchableOpacity>

        </View>

        {/* CHECK-IN PICKER */}

        {showCheckInPicker && (
          <DateTimePicker
            value={
              checkIn ||
              new Date()
            }
            mode="date"
            minimumDate={new Date()}
            display="default"
            onValueChange={
              handleCheckInChange
            }
            onDismiss={() =>
              setShowCheckInPicker(false)
            }
          />
        )}

        {/* CHECK-OUT PICKER */}

        {showCheckOutPicker && (
          <DateTimePicker
            value={
              checkOut ||
              new Date(
                checkIn
                  ? checkIn.getTime() +
                      24 *
                        60 *
                        60 *
                        1000
                  : Date.now()
              )
            }
            mode="date"
            minimumDate={
              checkIn
                ? new Date(
                    checkIn.getTime() +
                      24 *
                        60 *
                        60 *
                        1000
                  )
                : new Date()
            }
            display="default"
            onValueChange={
              handleCheckOutChange
            }
            onDismiss={() =>
              setShowCheckOutPicker(false)
            }
          />
        )}

        {/* CHECK AVAILABILITY BUTTON */}

        <TouchableOpacity
          style={[
            styles.availabilityButton,
            (!checkIn || !checkOut) &&
              styles.disabledButton,
          ]}
          disabled={
            !checkIn ||
            !checkOut ||
            checkingAvailability
          }
          onPress={checkAvailability}
          activeOpacity={0.8}
        >
          {checkingAvailability ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.availabilityButtonText
                }
              >
                Checking...
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.availabilityButtonText
              }
            >
              Check Room Availability
            </Text>
          )}
        </TouchableOpacity>

        {/* BUILDING */}

        <Text style={styles.sectionTitle}>
          Select Building / Block
        </Text>

        <TouchableOpacity
          style={styles.selectCard}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.selectLabel}>
              BUILDING
            </Text>

            <Text style={styles.selectValue}>
              All Buildings
            </Text>
          </View>

          <Text style={styles.selectArrow}>
            ⌄
          </Text>
        </TouchableOpacity>

        {/* AVAILABLE ROOMS */}

        <Text style={styles.sectionTitle}>
          Available Rooms
        </Text>

        {/* LOADING */}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#B66A2C"
            />

            <Text style={styles.loadingText}>
              Loading available rooms...
            </Text>
          </View>
        )}

        {/* ROOM TYPES */}

        {!loading &&
          roomTypes.map((roomType) => {
            const availableRooms =
              getAvailableRoomCount(
                roomType.id
              );

            const isAvailable =
              availableRooms > 0;

            /*
             * After availability check,
             * unavailable room types are still
             * displayed but cannot be selected.
             */
            return (
              <TouchableOpacity
                key={roomType.id}
                style={[
                  styles.roomCard,
                  datesSelected &&
                    !isAvailable &&
                    styles.unavailableCard,
                ]}
                activeOpacity={
                  isAvailable ? 0.8 : 1
                }
                disabled={
                  datesSelected &&
                  !isAvailable
                }
                onPress={() =>
                  handleRoomSelect(
                    roomType
                  )
                }
              >

                {/* IMAGE */}

                <View style={styles.roomImage}>
                  <Text style={styles.roomIcon}>
                    🛏️
                  </Text>
                </View>

                {/* CONTENT */}

                <View style={styles.roomContent}>

                  <Text style={styles.roomName}>
                    {roomType.name}
                  </Text>

                  <Text
                    style={
                      styles.roomDescription
                    }
                  >
                    {roomType.description ||
                      'Comfortable temple accommodation'}
                  </Text>

                  <View
                    style={styles.roomInfo}
                  >
                    <Text
                      style={styles.capacity}
                    >
                      👥 {roomType.capacity}{' '}
                      Guests
                    </Text>

                    <Text
                      style={styles.price}
                    >
                      {formatPrice(
                        roomType.price_per_night
                      )}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.selectRoom,
                      !isAvailable &&
                        styles.unavailableText,
                    ]}
                  >
                    {!datesSelected
                      ? `${availableRooms} ${
                          availableRooms === 1
                            ? 'Room'
                            : 'Rooms'
                        } Available`
                      : isAvailable
                      ? `${availableRooms} ${
                          availableRooms === 1
                            ? 'Room'
                            : 'Rooms'
                        } Available →`
                      : 'No Rooms Available'}
                  </Text>

                </View>

              </TouchableOpacity>
            );
          })}

        {/* NO ROOM TYPES */}

        {!loading &&
          roomTypes.length === 0 && (
            <View style={styles.emptyCard}>

              <Text style={styles.emptyIcon}>
                🛏️
              </Text>

              <Text
                style={styles.emptyTitle}
              >
                No Rooms Available
              </Text>

              <Text
                style={styles.emptyText}
              >
                There are currently no
                accommodation options available.
              </Text>

            </View>
          )}

        {/* INFO */}

        <View style={styles.infoCard}>

          <Text style={styles.infoIcon}>
            🙏
          </Text>

          <View style={styles.infoContent}>

            <Text style={styles.infoTitle}>
              Devotee Accommodation
            </Text>

            <Text style={styles.infoText}>
              Select your dates and check
              availability before choosing a room.
              Your booking confirmation and payment
              will be completed in the next step.
            </Text>

          </View>

        </View>

        {/* HOME */}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            router.replace('/(tabs)')
          }
          activeOpacity={0.8}
        >
          <Text
            style={styles.homeButtonText}
          >
            Back to Home
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/*
 * ====================================================
 * STYLES
 * ====================================================
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
    marginBottom: 23,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 12,
  },

  dateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
    color: '#777',
  },

  selectedDateValue: {
    color: '#4A2C18',
  },

  arrowContainer: {
    width: 35,
    alignItems: 'center',
  },

  arrow: {
    fontSize: 17,
    color: '#B66A2C',
  },

  availabilityButton: {
    height: 44,
    borderRadius: 13,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },

  disabledButton: {
    opacity: 0.5,
  },

  loadingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  availabilityButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  selectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 23,
    elevation: 2,
  },

  selectLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#A66A3D',
    letterSpacing: 0.8,
    marginBottom: 5,
  },

  selectValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A2C18',
  },

  selectArrow: {
    fontSize: 22,
    color: '#B66A2C',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 11,
    color: '#777',
  },

  roomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 13,
    flexDirection: 'row',
    marginBottom: 12,
    elevation: 2,
  },

  unavailableCard: {
    opacity: 0.65,
  },

  roomImage: {
    width: 92,
    height: 115,
    borderRadius: 14,
    backgroundColor: '#F3DEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  roomIcon: {
    fontSize: 36,
  },

  roomContent: {
    flex: 1,
    justifyContent: 'center',
  },

  roomName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 5,
  },

  roomDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: '#777',
  },

  roomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
  },

  capacity: {
    fontSize: 9,
    color: '#777',
  },

  price: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B66A2C',
  },

  selectRoom: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B66A2C',
    marginTop: 8,
  },

  unavailableText: {
    color: '#999',
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

  infoCard: {
    backgroundColor: '#F3DEC5',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  infoIcon: {
    fontSize: 27,
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2C18',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#6F6258',
  },

  homeButton: {
    height: 48,
    borderRadius: 15,
    backgroundColor: '#B66A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});