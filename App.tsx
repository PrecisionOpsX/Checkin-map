import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RootNavigator } from '@/navigation/RootNavigator';

// Keep the native splash visible until our React-side animated splash is
// ready to take over. The two share the same slate background so the
// transition is invisible.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { initializing } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  // Hide the native splash as soon as React has rendered something. The
  // animated splash overlay covers the gap, so the user never sees a flash.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <>
      <RootNavigator />
      {!splashFinished ? (
        <AnimatedSplash
          ready={!initializing}
          onFinish={() => setSplashFinished(true)}
        />
      ) : null}
      <StatusBar
        style={splashFinished ? 'dark' : 'light'}
        translucent
        backgroundColor="transparent"
      />
    </>
  );
}
