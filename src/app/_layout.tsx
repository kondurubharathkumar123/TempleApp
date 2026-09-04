import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <>
      <AnimatedSplashOverlay />

      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="deity/[id]" />

        <Stack.Screen name="pooja-details" />
        <Stack.Screen name="pooja-date" />
        <Stack.Screen name="pooja-devotee" />
        <Stack.Screen name="pooja-payment" />
        <Stack.Screen name="pooja-confirmation" />

        <Stack.Screen name="darshan" />
        <Stack.Screen name="events" />
        <Stack.Screen name="bookings" />
        <Stack.Screen name="donations" />
        <Stack.Screen name="about" />
        <Stack.Screen name="publications" />
        <Stack.Screen name="rooms" />
        <Stack.Screen name="gallery" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="account" />
        <Stack.Screen name="my-bookings" />
        <Stack.Screen name="nearby" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="policies" />
      
      </Stack>
    </>
  );
}