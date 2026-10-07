import {
  Stack,
  router,
  useSegments,
  useRootNavigationState,
} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';

import { useEffect, useState } from 'react';

import Constants from 'expo-constants';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

import {
  getToken,
  removeToken,
} from '@/services/authStorage';

import { apiRequest } from '@/services/api';

SplashScreen.preventAutoHideAsync();


// ========================================
// ROOT LAYOUT
// ========================================

export default function RootLayout() {

  const segments = useSegments();

  const rootNavigationState =
    useRootNavigationState();

  const [authChecking, setAuthChecking] =
    useState(true);


  // ========================================
  // AUTHENTICATION CHECK
  // ========================================

  useEffect(() => {

    if (!rootNavigationState?.key) {
      return;
    }

    checkAuthentication();

  }, [rootNavigationState?.key]);


  // ========================================
  // NOTIFICATIONS
  // ========================================

  useEffect(() => {

    const initializeNotifications =
      async () => {

        try {

          // --------------------------------
          // CHECK EXPO GO
          // --------------------------------

         const isExpoGo =
  Constants.appOwnership === 'expo';

          if (isExpoGo) {

            console.log(
              'Expo Go detected. Push notifications disabled.'
            );

            return;
          }


          // --------------------------------
          // LOAD NOTIFICATION SERVICE
          // --------------------------------

          const notificationService =
            await import(
              '@/services/notifications'
            );


          // --------------------------------
          // INITIAL NOTIFICATION
          // --------------------------------

          await notificationService
            .handleInitialNotification();


          // --------------------------------
          // NOTIFICATION LISTENER
          // --------------------------------

          const cleanup =
            await notificationService
              .initializeNotificationListener();


          return cleanup;

        } catch (error) {

          console.error(
            'Notification initialization failed:',
            error
          );

        }

      };


    let cleanup:
      (() => void) | undefined;


    initializeNotifications()
      .then((cleanupFunction) => {

        cleanup =
          cleanupFunction;

      });


    return () => {

      cleanup?.();

    };

  }, []);


  // ========================================
  // AUTHENTICATION
  // ========================================

  const checkAuthentication =
    async () => {

      try {

        // ----------------------------------
        // GET TOKEN
        // ----------------------------------

        const token =
          await getToken();


        // ----------------------------------
        // CURRENT ROUTE
        // ----------------------------------

        const firstSegment =
          segments[0];


        const isAuthScreen =
          firstSegment === 'login' ||
          firstSegment === 'register' ||
          firstSegment === 'forgot-password';


        // ==================================
        // NO TOKEN
        // ==================================

        if (!token) {

          if (isAuthScreen) {

            setAuthChecking(false);

            return;

          }


          router.replace('/login');

          setAuthChecking(false);

          return;

        }


        // ==================================
        // VALIDATE TOKEN
        // ==================================

        try {

          const response =
            await apiRequest('/auth/me');


          if (!response.success) {

            throw new Error(
              'Invalid session'
            );

          }


          // --------------------------------
          // USER IS ALREADY LOGGED IN
          // --------------------------------

          if (isAuthScreen) {

            router.replace('/(tabs)');

            setAuthChecking(false);

            return;

          }


          setAuthChecking(false);

        } catch (error) {

          console.log(
            'Session validation failed:',
            error
          );


          await removeToken();


          router.replace('/login');


          setAuthChecking(false);

        }

      } catch (error) {

        console.error(
          'Authentication check failed:',
          error
        );


        await removeToken();


        router.replace('/login');


        setAuthChecking(false);

      }

    };


  // ========================================
  // AUTH CHECK LOADING
  // ========================================

  if (authChecking) {

    return (
      <>
        <AnimatedSplashOverlay />
      </>
    );

  }


  // ========================================
  // APPLICATION
  // ========================================

  return (
    <>

      <AnimatedSplashOverlay />


      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >

        {/* Authentication */}

        <Stack.Screen
          name="login"
        />

        <Stack.Screen
          name="register"
        />
        <Stack.Screen
  name="forgot-password"
/>


        {/* Main Application */}

        <Stack.Screen
          name="(tabs)"
        />


        {/* Deities */}

        <Stack.Screen
          name="deity/[id]"
        />


        {/* Pooja / Seva */}

        <Stack.Screen
          name="pooja-details"
        />

        <Stack.Screen
          name="pooja-date"
        />

        <Stack.Screen
          name="pooja-devotee"
        />

        <Stack.Screen
          name="pooja-payment"
        />

        <Stack.Screen
          name="pooja-confirmation"
        />


        {/* Darshan */}

        <Stack.Screen
          name="darshan"
        />

        <Stack.Screen
          name="darshan-videos"
        />


        {/* Events */}

        <Stack.Screen
          name="events"
        />


        {/* Announcements */}

        <Stack.Screen
          name="announcements"
        />


        {/* Bookings */}

        <Stack.Screen
          name="bookings"
        />

        <Stack.Screen
          name="donations"
        />


        {/* Temple Information */}

        <Stack.Screen
          name="about"
        />

        <Stack.Screen
          name="publications"
        />

        <Stack.Screen
          name="gallery"
        />


        {/* Rooms */}

        <Stack.Screen
          name="rooms"
        />


        {/* Account */}

        <Stack.Screen
          name="profile"
        />

        <Stack.Screen
          name="account"
        />

        <Stack.Screen
          name="my-bookings"
        />


        {/* Other */}

        <Stack.Screen
          name="nearby"
        />

        <Stack.Screen
          name="contact"
        />

        <Stack.Screen
          name="policies"
        />

      </Stack>

    </>
  );

}