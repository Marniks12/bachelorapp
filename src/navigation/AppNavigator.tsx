import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AnalysisOverviewScreen } from '../screens/AnalysisOverviewScreen';
import { useAuth } from '../context/AuthContext';
import { CameraScreen } from '../screens/CameraScreen';
import { DashboardNewUserScreen } from '../screens/DashboardNewUserScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ErrorScreen } from '../screens/ErrorScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { InfoCarouselScreen } from '../screens/InfoCarouselScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OldAnalysisScreen } from '../screens/OldAnalysisScreen';
import { ResultDetailScreen } from '../screens/ResultDetailScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { loading, isAuthenticated, entryPoint } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#0F2A44" size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      key={isAuthenticated ? `auth-${entryPoint ?? 'unknown'}` : 'guest'}
      initialRouteName={
        isAuthenticated ? (entryPoint === 'signup' ? 'Home' : 'Dashboard') : 'Login'
      }
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="InfoCarousel" component={InfoCarouselScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Error" component={ErrorScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="AnalysisDetails" component={ResultDetailScreen} />
          <Stack.Screen name="ResultDetail" component={ResultDetailScreen} />
          <Stack.Screen name="OldAnalysis" component={OldAnalysisScreen} />
          <Stack.Screen name="AnalysisOverview" component={AnalysisOverviewScreen} />
          <Stack.Screen name="DashboardNewUser" component={DashboardNewUserScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
