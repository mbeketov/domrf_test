import React, { useState, useEffect, useCallback } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import RangeSelector from './app/components/RangeSelector';

export default function App(): JSX.Element | null {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const loadResources = async (): Promise<void> => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Promise.all([
          Font.loadAsync({
            'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
            'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
          }),
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoaded(true);
      }
    };
    loadResources();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <RangeSelector
        initialMonths={[3, 5]}
        onChange={values => console.log(values)}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
