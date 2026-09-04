import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type ServiceBooking = {
  id: number;
  booking_id?: string;
  user_id?: number;

  full_name?: string;
  email?: string;
  phone?: string;

  service_type?: string;
  booking_date?: string;
  booking_time?: string;
  number_of_devotees?: number;

  total_amount?: string | number;

  booking_status?: string;
  payment_status?: string;

  special_requests?: string;

  created_at?: string;
  updated_at?: string;
};

export default function Bookings() {
  const [items, setItems] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadBookings() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: ServiceBooking[];
      }>('/admin/service-bookings');

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load service bookings'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function formatDate(value?: string) {
    if (!value) return '—';

    return value.substring(0, 10);
  }

  function formatAmount(value?: string | number) {
    if (value === undefined || value === null) {
      return '—';
    }

    return `₹${Number(value).toLocaleString('en-IN')}`;
  }

  function formatTime(value?: string) {
    if (!value) return '—';

    return value.substring(0, 5);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Bookings</h1>

          <p>
            Manage Darshan and Pooja service bookings
            from devotees
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={loadBookings}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Service Bookings</h2>

            <p>
              Darshan and Pooja bookings received
              from devotees
            </p>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <p>Loading service bookings...</p>
        ) : items.length === 0 ? (
          <p>No service bookings found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Devotee</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Devotees</th>
                  <th>Amount</th>
                  <th>Booking Status</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {items.map((booking) => (
                  <tr key={booking.id}>
                    {/* Booking ID */}
                    <td>
                      <strong>
                        {booking.booking_id ||
                          `#${booking.id}`}
                      </strong>
                    </td>

                    {/* Devotee */}
                    <td>
                      <strong>
                        {booking.full_name || '—'}
                      </strong>

                      {booking.email && (
                        <small
                          style={{
                            display: 'block',
                            marginTop: '4px',
                            color: '#81776d',
                          }}
                        >
                          {booking.email}
                        </small>
                      )}

                      {booking.phone && (
                        <small
                          style={{
                            display: 'block',
                            marginTop: '2px',
                            color: '#81776d',
                          }}
                        >
                          {booking.phone}
                        </small>
                      )}
                    </td>

                    {/* Service */}
                    <td>
                      <strong>
                        {booking.service_type || '—'}
                      </strong>
                    </td>

                    {/* Date */}
                    <td>
                      {formatDate(
                        booking.booking_date
                      )}
                    </td>

                    {/* Time */}
                    <td>
                      {formatTime(
                        booking.booking_time
                      )}
                    </td>

                    {/* Number of devotees */}
                    <td>
                      {booking.number_of_devotees ??
                        '—'}
                    </td>

                    {/* Amount */}
                    <td>
                      {formatAmount(
                        booking.total_amount
                      )}
                    </td>

                    {/* Booking status */}
                    <td>
                      <span className="badge">
                        {booking.booking_status ||
                          '—'}
                      </span>
                    </td>

                    {/* Payment status */}
                    <td>
                      <span className="badge">
                        {booking.payment_status ||
                          '—'}
                      </span>
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