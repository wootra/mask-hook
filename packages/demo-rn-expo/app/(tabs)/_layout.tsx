import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8a4b2d',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'SSN' }} />
      <Tabs.Screen name="ein" options={{ title: 'EIN' }} />
    </Tabs>
  );
}