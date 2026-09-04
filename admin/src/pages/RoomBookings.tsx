import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type RoomBooking = {
  id: number;
  booking_id: string;

  user_id: number;
  room_id: number;

  room_number?: string;

  building_id?: number;
  building_name?: string;
  building_code?: string;

  room_type_id?: number;
  room_type_name?: string;

  check_in: string;
  check_out: string;

  number_of_guests: number;
  total_amount: string | number;

  booking_status: string;
  payment_status: string;

  special_requests?: string | null;

  devotee_name?: string;
  devotee_email?: string;
  devotee_phone?: string;

  created_at?: string;
  updated_at?: string;
};

type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled';

type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export default function RoomBookings() {
  const [items, setItems] = useState<RoomBooking[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedBooking, setSelectedBooking] =
    useState<RoomBooking | null>(null);

  const [updating, setUpdating] = useState(false);

  /*
   * Load all room bookings
   */
  async function loadBookings() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: RoomBooking[];
      }>('/admin/room-bookings');

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load room bookings'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Initial load
   */
  useEffect(() => {
    loadBookings();
  }, []);

  /*
   * Format date
   */
  function formatDate(date?: string) {
    if (!date) {
      return '—';
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  /*
   * Format price
   */
  function formatPrice(
    price?: string | number
  ) {
    if (
      price === undefined ||
      price === null
    ) {
      return '—';
    }

    const value = Number(price);

    if (Number.isNaN(value)) {
      return '—';
    }

    return `₹${value.toLocaleString('en-IN')}`;
  }

  /*
   * Booking status class
   */
  function bookingStatusClass(
    status: string
  ) {
    if (status === 'confirmed') {
      return 'badge';
    }

    if (status === 'pending') {
      return 'badge badge-warning';
    }

    if (status === 'cancelled') {
      return 'badge badge-danger';
    }

    return 'badge';
  }

  /*
   * Payment status class
   */
  function paymentStatusClass(
    status: string
  ) {
    if (status === 'paid') {
      return 'badge';
    }

    if (status === 'pending') {
      return 'badge badge-warning';
    }

    if (
      status === 'failed' ||
      status === 'refunded'
    ) {
      return 'badge badge-danger';
    }

    return 'badge';
  }

  /*
   * Update booking status
   */
  async function updateBookingStatus(
    bookingId: string,
    booking_status: BookingStatus
  ) {
    try {
      setUpdating(true);
      setError('');

      await apiRequest(
        `/admin/room-bookings/${bookingId}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({
            booking_status,
          }),
        }
      );

      await loadBookings();

      /*
       * Refresh selected booking
       */
      const refreshed =
        await apiRequest<{
          success: boolean;
          data: RoomBooking;
        }>(
          `/admin/room-bookings/${bookingId}`
        );

      setSelectedBooking(
        refreshed.data
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update booking status'
      );
    } finally {
      setUpdating(false);
    }
  }

  /*
   * Update payment status
   */
  async function updatePaymentStatus(
    bookingId: string,
    payment_status: PaymentStatus
  ) {
    try {
      setUpdating(true);
      setError('');

      await apiRequest(
        `/admin/room-bookings/${bookingId}/payment-status`,
        {
          method: 'PUT',
          body: JSON.stringify({
            payment_status,
          }),
        }
      );

      await loadBookings();

      const refreshed =
        await apiRequest<{
          success: boolean;
          data: RoomBooking;
        }>(
          `/admin/room-bookings/${bookingId}`
        );

      setSelectedBooking(
        refreshed.data
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update payment status'
      );
    } finally {
      setUpdating(false);
    }
  }

  /*
   * Open booking details
   */
  async function openBooking(
    bookingId: string
  ) {
    try {
      setError('');

      const result =
        await apiRequest<{
          success: boolean;
          data: RoomBooking;
        }>(
          `/admin/room-bookings/${bookingId}`
        );

      setSelectedBooking(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load booking details'
      );
    }
  }

  /*
   * Close booking details
   */
  function closeBooking() {
    setSelectedBooking(null);
  }

  return (
    <div className="page">

      {/* PAGE HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Room Bookings
          </h1>

          <p>
            Manage devotee room bookings
          </p>
        </div>

        <div className="actions">

          <button
            type="button"
            className="secondary-button"
            onClick={loadBookings}
            disabled={loading}
          >
            {loading
              ? 'Refreshing...'
              : 'Refresh'}
          </button>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* BOOKING DETAILS */}
      {selectedBooking && (
        <div className="card">

          <div className="section-header">

            <div>
              <h2>
                Booking Details
              </h2>

              <p>
                {selectedBooking.booking_id}
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={closeBooking}
            >
              Close
            </button>

          </div>

          <div className="form-grid">

            {/* DEVOTEE */}
            <div className="form-field">
              <label>
                Devotee
              </label>

              <strong>
                {selectedBooking.devotee_name ||
                  '—'}
              </strong>
            </div>

            {/* EMAIL */}
            <div className="form-field">
              <label>
                Email
              </label>

              <span>
                {selectedBooking.devotee_email ||
                  '—'}
              </span>
            </div>

            {/* PHONE */}
            <div className="form-field">
              <label>
                Phone
              </label>

              <span>
                {selectedBooking.devotee_phone ||
                  '—'}
              </span>
            </div>

            {/* ROOM */}
            <div className="form-field">
              <label>
                Room
              </label>

              <strong>
                {selectedBooking.room_number ||
                  '—'}
              </strong>
            </div>

            {/* BUILDING */}
            <div className="form-field">
              <label>
                Building
              </label>

              <span>
                {selectedBooking.building_name ||
                  selectedBooking.building_code ||
                  '—'}
              </span>
            </div>

            {/* ROOM TYPE */}
            <div className="form-field">
              <label>
                Room Type
              </label>

              <span>
                {selectedBooking.room_type_name ||
                  '—'}
              </span>
            </div>

            {/* CHECK IN */}
            <div className="form-field">
              <label>
                Check-in
              </label>

              <span>
                {formatDate(
                  selectedBooking.check_in
                )}
              </span>
            </div>

            {/* CHECK OUT */}
            <div className="form-field">
              <label>
                Check-out
              </label>

              <span>
                {formatDate(
                  selectedBooking.check_out
                )}
              </span>
            </div>

            {/* GUESTS */}
            <div className="form-field">
              <label>
                Guests
              </label>

              <span>
                {selectedBooking.number_of_guests}
              </span>
            </div>

            {/* AMOUNT */}
            <div className="form-field">
              <label>
                Total Amount
              </label>

              <strong>
                {formatPrice(
                  selectedBooking.total_amount
                )}
              </strong>
            </div>

          </div>

          {/* SPECIAL REQUESTS */}
          {selectedBooking.special_requests && (
            <div className="form-field">
              <label>
                Special Requests
              </label>

              <p>
                {selectedBooking.special_requests}
              </p>
            </div>
          )}

          {/* STATUS MANAGEMENT */}
          <div className="form-grid">

            <div className="form-field">

              <label>
                Booking Status
              </label>

              <select
                value={
                  selectedBooking.booking_status
                }
                disabled={updating}
                onChange={(event) =>
                  updateBookingStatus(
                    selectedBooking.booking_id,
                    event.target.value as BookingStatus
                  )
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

            </div>

            <div className="form-field">

              <label>
                Payment Status
              </label>

              <select
                value={
                  selectedBooking.payment_status
                }
                disabled={updating}
                onChange={(event) =>
                  updatePaymentStatus(
                    selectedBooking.booking_id,
                    event.target.value as PaymentStatus
                  )
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="failed">
                  Failed
                </option>

                <option value="refunded">
                  Refunded
                </option>
              </select>

            </div>

          </div>

        </div>
      )}

      {/* BOOKINGS LIST */}
      <div className="card">

        <div className="section-header">

          <div>
            <h2>
              Room Bookings
            </h2>

            <p>
              Existing room bookings from the backend
            </p>
          </div>

        </div>

        {loading && items.length === 0 ? (

          <p>
            Loading room bookings...
          </p>

        ) : items.length === 0 ? (

          <p>
            No room bookings found.
          </p>

        ) : (

          <div className="table-wrap">

            <table>

              <thead>

                <tr>

                  <th>
                    Booking ID
                  </th>

                  <th>
                    Devotee
                  </th>

                  <th>
                    Room
                  </th>

                  <th>
                    Building
                  </th>

                  <th>
                    Room Type
                  </th>

                  <th>
                    Check-in
                  </th>

                  <th>
                    Check-out
                  </th>

                  <th>
                    Guests
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Booking Status
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((booking) => (

                  <tr
                    key={booking.id}
                  >

                    {/* BOOKING ID */}
                    <td>
                      <strong>
                        {booking.booking_id}
                      </strong>
                    </td>

                    {/* DEVOTEE */}
                    <td>

                      <strong>
                        {booking.devotee_name ||
                          '—'}
                      </strong>

                      {booking.devotee_phone && (
                        <small
                          style={{
                            display: 'block',
                          }}
                        >
                          {booking.devotee_phone}
                        </small>
                      )}

                    </td>

                    {/* ROOM */}
                    <td>
                      {booking.room_number ||
                        '—'}
                    </td>

                    {/* BUILDING */}
                    <td>
                      {booking.building_name ||
                        booking.building_code ||
                        '—'}
                    </td>

                    {/* ROOM TYPE */}
                    <td>
                      {booking.room_type_name ||
                        '—'}
                    </td>

                    {/* CHECK IN */}
                    <td>
                      {formatDate(
                        booking.check_in
                      )}
                    </td>

                    {/* CHECK OUT */}
                    <td>
                      {formatDate(
                        booking.check_out
                      )}
                    </td>

                    {/* GUESTS */}
                    <td>
                      {booking.number_of_guests}
                    </td>

                    {/* AMOUNT */}
                    <td>
                      {formatPrice(
                        booking.total_amount
                      )}
                    </td>

                    {/* BOOKING STATUS */}
                    <td>

                      <span
                        className={bookingStatusClass(
                          booking.booking_status
                        )}
                      >
                        {booking.booking_status}
                      </span>

                    </td>

                    {/* PAYMENT STATUS */}
                    <td>

                      <span
                        className={paymentStatusClass(
                          booking.payment_status
                        )}
                      >
                        {booking.payment_status}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td>

                      <button
                        type="button"
                        className="table-action-button"
                        onClick={() =>
                          openBooking(
                            booking.booking_id
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}