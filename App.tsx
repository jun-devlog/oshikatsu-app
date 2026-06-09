import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { OshiProvider, useOshiContext } from './src/contexts/OshiContext';
import { ActivityIndicator, View, Text, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeTab from './src/screens/HomeTab';
import CalendarTab from './src/screens/CalendarTab';
import GoodsTab from './src/screens/GoodsTab';
import BudgetTab from './src/screens/BudgetTab';
import MyPageTab from './src/screens/MyPageTab';
import LogDetailScreen from './src/screens/LogDetailScreen';
import GoodsDetailScreen from './src/screens/GoodsDetailScreen';
import { COLORS } from './src/styles/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          elevation: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeTab} options={{ tabBarLabel: 'ホーム', tabBarIcon: () => <Text style={{fontSize: 20}}>🏠</Text> }} />
      <Tab.Screen name="Calendar" component={CalendarTab} options={{ tabBarLabel: 'カレンダー', tabBarIcon: () => <Text style={{fontSize: 20}}>📅</Text> }} />
      <Tab.Screen name="Goods" component={GoodsTab} options={{ tabBarLabel: 'グッズ', tabBarIcon: () => <Text style={{fontSize: 20}}>🛍️</Text> }} />
      <Tab.Screen name="Budget" component={BudgetTab} options={{ tabBarLabel: '収支', tabBarIcon: () => <Text style={{fontSize: 20}}>💰</Text> }} />
      <Tab.Screen name="MyPage" component={MyPageTab} options={{ tabBarLabel: 'マイページ', tabBarIcon: () => <Text style={{fontSize: 20}}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { loading } = useOshiContext();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <View style={styles.loadingInner}>
          <Text style={styles.loadingAppName}>推しログ</Text>
          <Text style={styles.loadingHeart}>💕</Text>
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 24 }} />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerStyle: { backgroundColor: COLORS.headerBg }, 
            headerTintColor: COLORS.accentDark,
            headerBackTitle: '戻る',
            headerTitleStyle: { fontWeight: '700' }
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="LogDetail" component={LogDetailScreen} options={{ title: '推し活詳細' }} />
          <Stack.Screen name="GoodsDetail" component={GoodsDetailScreen} options={{ title: 'グッズ詳細' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <OshiProvider>
      <StatusBar style="dark" backgroundColor={COLORS.headerBg} />
      <RootNavigator />
    </OshiProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: { flex: 1, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' },
  loadingInner: { alignItems: 'center' },
  loadingAppName: { fontSize: 32, fontWeight: '800', color: COLORS.primaryDark },
  loadingHeart: { fontSize: 40, marginTop: 10 },
  loadingText: { marginTop: 16, fontSize: 14, color: COLORS.primary, fontWeight: '600' },
});
