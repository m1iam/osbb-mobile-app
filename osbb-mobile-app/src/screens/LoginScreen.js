import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import HomeScreen from './HomeScreen';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    console.log('Кнопка Увійти натиснута');

    if (!email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля');
      return;
    }

    Alert.alert('Успіх', 'Вхід виконано');
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <HomeScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.topSection}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ОСББ</Text>
              </View>

              <Text style={styles.headerText}>Об'єднання співвласників</Text>
              <Text style={styles.headerText}>багатоквартирного будинку</Text>

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
                placeholderTextColor="#B8B8B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Номер телефону"
                placeholderTextColor="#B8B8B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#B8B8B8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Увійти</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Ще немає акаунта? </Text>
              <TouchableOpacity>
                <Text style={styles.registerText}>Зареєструватись</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDF5F7',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EDF5F7',
    paddingBottom: 30,
  },
  topSection: {
    width: '100%',
    backgroundColor: '#D9EFF7',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 25,
  },
  badge: {
    backgroundColor: '#8AB8FF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 10,
  },
  badgeText: {
    color: '#204C98',
    fontSize: 14,
    fontWeight: '700',
  },
  headerText: {
    fontSize: 14,
    color: '#7F8B94',
    textAlign: 'center',
    lineHeight: 18,
  },
  image: {
    width: 250,
    height: 180,
    marginTop: 12,
  },
  card: {
    width: '88%',
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderRadius: 22,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#222222',
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#77C9F3',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#7F8B94',
  },
  registerText: {
    fontSize: 14,
    color: '#2E6FD8',
    fontWeight: '600',
  },
});