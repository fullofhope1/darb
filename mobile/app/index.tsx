import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../src/constants/theme';

export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}
