import { router, useLocalSearchParams } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PoojaConfirmationScreen() {
    const params = useLocalSearchParams<{
        sevaName?: string;
        amount?: string;
        category?: string;
        date?: string;
        name?: string;
    }>();

    const bookingId = 'SEVA-2026-00125';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Success */}
                <View style={styles.successSection}>
                    <View style={styles.successCircle}>
                        <Text style={styles.check}>✓</Text>
                    </View>

                    <Text style={styles.successTitle}>
                        Seva Booking Confirmed
                    </Text>

                    <Text style={styles.successText}>
                        Your seva has been successfully booked.
                        May the divine blessings be with you and
                        your family.
                    </Text>
                </View>

                {/* Booking ID */}
                <View style={styles.bookingIdCard}>
                    <Text style={styles.bookingIdLabel}>
                        BOOKING ID
                    </Text>

                    <Text style={styles.bookingId}>
                        {bookingId}
                    </Text>

                    <Text style={styles.bookingIdNote}>
                        Please keep this Booking ID for future reference.
                    </Text>
                </View>

                {/* Details */}
                <Text style={styles.sectionTitle}>
                    Booking Details
                </Text>

                <View style={styles.detailsCard}>
                    <DetailRow
                        label="Seva"
                        value={params.sevaName || 'Seva'}
                    />

                    <DetailRow
                        label="Category"
                        value={params.category || 'Temple Seva'}
                    />

                    <DetailRow
                        label="Date"
                        value={params.date || 'Not selected'}
                    />

                    <DetailRow
                        label="Devotee"
                        value={params.name || 'Devotee'}
                    />

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>
                            Amount Paid
                        </Text>

                        <Text style={styles.amount}>
                            {params.amount || '₹0'}
                        </Text>
                    </View>
                </View>

                {/* Confirmation */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>🙏</Text>

                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>
                            Thank you for your devotion
                        </Text>

                        <Text style={styles.infoText}>
                            Your seva details and confirmation will
                            be available under My Bookings once the
                            booking system is connected.
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push('/bookings')}
                >
                    <Text style={styles.primaryButtonText}>
                        View My Bookings
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.replace('/pooja')}
                >
                    <Text style={styles.secondaryButtonText}>
                        Book Another Seva
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.replace('/' as any)}
                >
                    <Text style={styles.homeButtonText}>
                        Back to Home
                    </Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                    Payment and real booking confirmation will be
                    connected when the backend and payment gateway
                    are implemented.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
                {label}
            </Text>

            <Text style={styles.detailValue}>
                {value}
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

    successSection: {
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 22,
    },

    successCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#B66A2C',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },

    check: {
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: '700',
    },

    successTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4A2C18',
        textAlign: 'center',
        marginBottom: 8,
    },

    successText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#777',
        textAlign: 'center',
        paddingHorizontal: 15,
    },

    bookingIdCard: {
        backgroundColor: '#F3DEC5',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 25,
    },

    bookingIdLabel: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1.2,
        color: '#A66A3D',
        marginBottom: 7,
    },

    bookingId: {
        fontSize: 21,
        fontWeight: '700',
        color: '#4A2C18',
        letterSpacing: 0.5,
    },

    bookingIdNote: {
        fontSize: 10,
        color: '#777',
        marginTop: 7,
        textAlign: 'center',
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#4A2C18',
        marginBottom: 12,
    },

    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        elevation: 2,
        marginBottom: 20,
    },

    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 7,
    },

    detailLabel: {
        fontSize: 12,
        color: '#777',
    },

    detailValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4A2C18',
        maxWidth: '60%',
        textAlign: 'right',
    },

    divider: {
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
        fontSize: 14,
        fontWeight: '700',
        color: '#4A2C18',
    },

    amount: {
        fontSize: 17,
        fontWeight: '700',
        color: '#B66A2C',
    },

    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 17,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
    },

    infoIcon: {
        fontSize: 27,
        marginRight: 13,
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
        fontSize: 11,
        lineHeight: 17,
        color: '#777',
    },

    primaryButton: {
        height: 50,
        borderRadius: 15,
        backgroundColor: '#B66A2C',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
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

    note: {
        textAlign: 'center',
        fontSize: 10,
        lineHeight: 16,
        color: '#999',
        marginTop: 14,
        paddingHorizontal: 10,
    },
});