import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { getToken } from './authStorage';



// ========================================
// EXPO GO DETECTION
// ========================================
const IS_EXPO_GO =
  Constants.executionEnvironment === 'storeClient';

// ========================================
// BACKEND URL
// ========================================

const API_BASE_URL =
   'https://templeapp-s96e.onrender.com/api';
  //'http://192.168.0.107:5000/api';

// ========================================
// REGISTER PUSH NOTIFICATIONS
// ========================================

export async function registerForPushNotificationsAsync() {
  // ------------------------------------
  // EXPO GO
  // ------------------------------------

  if (IS_EXPO_GO) {
    console.log(
      'Push notifications are disabled in Expo Go.'
    );

    console.log(
      'Use an Android development build for push notifications.'
    );

    return null;
  }

  // ------------------------------------
  // LOAD NOTIFICATIONS MODULE
  // ------------------------------------

  const Notifications =
    await import('expo-notifications');

  // ------------------------------------
  // PHYSICAL DEVICE CHECK
  // ------------------------------------

  if (!Device.isDevice) {
    console.log(
      'Push notifications require a physical Android/iOS device.'
    );

    return null;
  }

  // ------------------------------------
  // NOTIFICATION HANDLER
  // ------------------------------------

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // ------------------------------------
  // PERMISSION
  // ------------------------------------

  const {
    status: existingStatus,
  } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const {
      status,
    } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log(
      'Push notification permission was not granted.'
    );

    return null;
  }

  // ------------------------------------
  // ANDROID CHANNEL
  // ------------------------------------

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(
      'default',
      {
        name: 'Temple Notifications',

        importance:
          Notifications.AndroidImportance.MAX,

        vibrationPattern: [
          0,
          250,
          250,
          250,
        ],

        sound: 'default',
      }
    );
  }

  // ------------------------------------
  // EAS PROJECT ID
  // ------------------------------------

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.error(
      'EAS Project ID not found.'
    );

    return null;
  }

  console.log(
    'EAS Project ID:',
    projectId
  );

  // ------------------------------------
  // GET EXPO PUSH TOKEN
  // ------------------------------------

  try {
    const token =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    console.log(
      '================================='
    );

    console.log(
      'EXPO PUSH TOKEN:',
      token.data
    );

    console.log(
      '================================='
    );

    // ------------------------------------
    // GET LOGIN JWT
    // ------------------------------------

    const jwtToken = await getToken();

    if (!jwtToken) {
      console.log(
        'User is not logged in.'
      );

      console.log(
        'Device token was not sent to backend.'
      );

      return token.data;
    }

    // ------------------------------------
    // REGISTER DEVICE WITH BACKEND
    // ------------------------------------

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/notifications/register-device`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${jwtToken}`,
            },

            body: JSON.stringify({
              expoPushToken:
                token.data,

              platform:
                Platform.OS,

              deviceName:
                Device.deviceName ??
                null,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          'Device registration failed:',
          data
        );

        return token.data;
      }

      console.log(
        'Device successfully registered:',
        data
      );

    } catch (error) {
      console.error(
        'Failed to register device with backend:',
        error
      );
    }

    return token.data;

  } catch (error) {
    console.error(
      'Failed to get Expo push token:',
      error
    );

    return null;
  }
}

// ========================================
// HANDLE NOTIFICATION TAP
// ========================================

export function handleNotificationResponse(
  response: any
) {
  try {
    const data =
      response.notification.request
        .content.data as any;

    console.log(
      'Notification tapped:',
      data
    );

    if (!data) {
      return;
    }

    // ------------------------------------
    // ANNOUNCEMENT
    // ------------------------------------

    if (data.type === 'announcement') {
      router.push({
        pathname:
          '/announcements' as any,

        params: {
          id: String(
            data.announcementId
          ),
        },
      });

      return;
    }

    // ------------------------------------
    // DARSHAN VIDEO
    // ------------------------------------

    if (data.type === 'darshan_video') {
      router.push(
        '/darshan-videos' as any
      );

      return;
    }

    // ------------------------------------
    // DEITY
    // ------------------------------------

    if (data.type === 'deity') {
      router.push({
        pathname:
          '/deity/[id]' as any,

        params: {
          id: String(
            data.deityId
          ),
        },
      });

      return;
    }

    // ------------------------------------
    // TEST NOTIFICATION
    // ------------------------------------

    if (data.type === 'test') {
      router.push(
        '/(tabs)'
      );

      return;
    }

    // ------------------------------------
    // OTHER NOTIFICATIONS
    // ------------------------------------

    if (data.screen) {
      router.push(
        data.screen as any
      );
    }

  } catch (error) {
    console.error(
      'Notification tap handling error:',
      error
    );
  }
}

// ========================================
// INITIAL NOTIFICATION CHECK
// ========================================

export async function handleInitialNotification() {
  if (IS_EXPO_GO) {
    return;
  }

  try {
    const Notifications =
      await import('expo-notifications');

    const response =
      await Notifications
        .getLastNotificationResponseAsync();

    if (!response) {
      return;
    }

    handleNotificationResponse(
      response
    );

  } catch (error) {
    console.error(
      'Initial notification handling error:',
      error
    );
  }
}

// ========================================
// NOTIFICATION LISTENER
// ========================================

export async function initializeNotificationListener() {
  if (IS_EXPO_GO) {
    console.log(
      'Notification listener disabled in Expo Go.'
    );

    return () => {};
  }

  try {
    const Notifications =
      await import('expo-notifications');

    const subscription =
      Notifications
        .addNotificationResponseReceivedListener(
          handleNotificationResponse
        );

    return () => {
      subscription.remove();
    };

  } catch (error) {
    console.error(
      'Notification listener initialization failed:',
      error
    );

    return () => {};
  }
}