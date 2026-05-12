import React, { useState } from 'react';
import {
  Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, 
  TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import * as Notifications from 'expo-notifications';

import HomeScreen from './HomeScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import OtpScreen from './OtpScreen';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  async function getDeviceTokens() {
    let token = null;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return null;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'bf5d10c8-08e3-4223-839d-fdf7220bfdc7', // Твій ID проекту
      });
      token = tokenData.data;
    } catch (error) {
      console.log('Помилка токена:', error);
    }
    return token;
  }

  const handleLogin = async () => {
    // Чистимо email від випадкових пробілів
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля');
      return;
    }

    const deviceToken = await getDeviceTokens();

    try {
      // ВИКОРИСТОВУЄМО ЗМІННУ З .env
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: cleanEmail, 
          password: password, 
          deviceToken 
        }),
      });

      const data = await response.json();

      if (response.ok && data.requireOTP) {
        setUserPhone(data.phone);
        setShowOtpScreen(true);
      } else {
        Alert.alert('Помилка', data.message || 'Невірні дані');
      }
    } catch (error) {
      console.log('Login Error:', error);
      Alert.alert('Помилка', 'Не вдалося з’єднатися з сервером. Перевірте IP у файлі .env');
    }
  };

  if (showRegister) return <RegisterScreen onBack={() => setShowRegister(false)} />;
  if (showForgotPassword) return <ForgotPasswordScreen onBack={() => setShowForgotPassword(false)} />;
  
  if (showOtpScreen) {
    return (
      <OtpScreen 
        phone={userPhone} 
        onBack={() => setShowOtpScreen(false)} 
        onSuccess={() => {
          setShowOtpScreen(false);
          setIsLoggedIn(true);
        }} 
      />
    );
  }

  if (isLoggedIn) return <SafeAreaView style={{ flex: 1 }}><HomeScreen /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.topSection}>
              <View style={styles.badge}><Text style={styles.badgeText}>ОСББ</Text></View>
              <Text style={styles.headerText}>Об'єднання співвласників</Text>
              <Text style={styles.headerText}>багатоквартирного будинку</Text>
              
              {/* ВИПРАВЛЕНИЙ ШЛЯХ ДО КАРТИНКИ */}
              <Image 
                source={require('../../assets/images/osbb-login.png')} 
                style={styles.image} 
                resizeMode="contain" 
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Вхід в систему</Text>
              <TextInput
                style={styles.input}
                placeholder="Електронна адреса"
                placeholderTextColor="#888888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#888888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Увійти</Text>
              </TouchableOpacity>
              
              <View style={styles.footer}>
                <Text style={styles.footerText}>Ще немає акаунта? </Text>
                <TouchableOpacity onPress={() => setShowRegister(true)}>
                  <Text style={styles.registerText}>Зареєструватись</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
                <Text style={styles.forgotPasswordText}>Забули пароль?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EDF5F7' },
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, alignItems: 'center', backgroundColor: '#EDF5F7', paddingBottom: 30 },
  topSection: { width: '100%', backgroundColor: '#D9EFF7', alignItems: 'center', paddingTop: 20, paddingBottom: 20 },
  badge: { backgroundColor: '#8AB8FF', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 4, marginBottom: 10 },
  badgeText: { color: '#204C98', fontSize: 14, fontWeight: '700' },
  headerText: { fontSize: 14, color: '#7F8B94', textAlign: 'center', lineHeight: 18 },
  image: { width: 230, height: 170, marginTop: 12 },
  card: { width: '86%', backgroundColor: '#FFFFFF', marginTop: -10, borderRadius: 22, paddingVertical: 24, paddingHorizontal: 20, elevation: 6, alignItems: 'center' },
  cardTitle: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#222222', marginBottom: 18 },
  input: { width: '100%', height: 46, borderWidth: 1, borderColor: '#E3E3E3', borderRadius: 20, backgroundColor: '#FAFAFA', paddingHorizontal: 16, fontSize: 14, marginBottom: 12 },
  button: { marginTop: 8, backgroundColor: '#77C9F3', width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  buttonText: { color: '#111111', fontSize: 17, fontWeight: '700' },
  footer: { flexDirection: 'row', marginTop: 18, alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 13, color: '#7F8B94' },
  registerText: { fontSize: 13, color: '#2E6FD8', fontWeight: '600' },
  forgotPasswordText: { marginTop: 18, fontSize: 13, color: '#4B6FAE', textAlign: 'center' },
});