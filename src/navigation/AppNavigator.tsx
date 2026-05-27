import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AnalysisOverviewScreen } from '../screens/AnalysisOverviewScreen';
import { useAuth } from '../auth/AuthContext';
import { CameraScreen } from '../screens/CameraScreen';
import { DashboardNewUserScreen } from '../screens/DashboardNewUserScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { InfoCarouselScreen } from '../screens/InfoCarouselScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OldAnalysisScreen } from '../screens/OldAnalysisScreen';
import { ResultDetailScreen } from '../screens/ResultDetailScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#E60F30" size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="InfoCarousel" component={InfoCarouselScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
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
          <Stack.Screen name="SignUp" component={SignUpScreen} />
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
