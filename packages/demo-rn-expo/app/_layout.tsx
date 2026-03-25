import { Stack } from 'expo-router';
import { enableScreens } from 'react-native-screens';

enableScreens(false);

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
