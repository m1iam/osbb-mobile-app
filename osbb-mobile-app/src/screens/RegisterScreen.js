import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export default function RegisterScreen({ onBack }) {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 // ФУНКЦІЯ ДЛЯ ОТРИМАННЯ ТОКЕНІВ
  async function getDeviceTokens() {
    let token = null;
    let deviceId = Device.osInternalBuildId || Device.modelName;

    if (Device.isDevice) {
      // 1. Перевірка та запит дозволів
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Помилка: Немає дозволу на сповіщення');
        return { token: null, deviceId };
      }

      // 2. Отримання токена з обов'язковим projectId
      try {
        const tokenResponse = await Notifications.getExpoPushTokenAsync({
          projectId: "bf5d10c8-08e3-4223-839d-fdf7220bfdc7" // Твій ID з app.json
        });
        token = tokenResponse.data;
        console.log('✅ Реальний токен отримано:', token);
      } catch (error) {
        console.log('❌ Помилка при генерації токена:', error.message);
      }
      
    } else {
      console.log('Попередження: На симуляторі токен не працює');
    }

    return { token, deviceId };
  }

  const handleRegister = async () => {
    if (!fullName || !address || !phone || !email || !password) {
      Alert.alert("Помилка", "Будь ласка, заповніть усі поля");
      return;
    }

    const SERVER_IP = '192.168.1.9'; // ПЕРЕВІР IP ЧЕРЕЗ IPCONFIG!

    try {
      // Отримуємо токени перед відправкою
      const { token, deviceId } = await getDeviceTokens();

      console.log(`Надсилаю реєстрацію для ${phone} з токеном: ${token}`);

      const response = await fetch(`http://${SERVER_IP}:3000/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone,
          pib: fullName,
          flat_number: address,
          password: password,
          email: email,
          pushToken: token,    // ВІДПРАВЛЯЄМО ТОКЕН
          deviceId: deviceId   // ВІДПРАВЛЯЄМО ID ПРИСТРОЮ
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Успіх", "Ви успішно зареєструвалися!");
        onBack();
      } else {
        Alert.alert("Помилка", data.message || "Не вдалося зареєструватися");
      }
    } catch (error) {
      console.error("Помилка мережі:", error);
      Alert.alert("Помилка", "Немає зв'язку з сервером. Перевір IP.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ОСББ</Text>
          </View>
          <Text style={styles.headerText}>Об'єднання співвласників{"\n"}багатоквартирного будинку</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Реєстрація користувача</Text>

          <TextInput style={styles.input} placeholder="Прізвище, ім'я, по батькові" value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="Повна адреса (квартира)" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="Номер телефону" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <TextInput style={styles.input} placeholder="Електронна адреса" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Пароль" secureTextEntry value={password} onChangeText={setPassword} />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Зареєструватись</Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>Після реєстрації ми надішлемо Вам код у СМС-повідомлення</Text>

          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>Назад до входу</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingBottom: 30,
  },
  topSection: {
    width: '100%',
    backgroundColor: '#D9EFF7',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
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
  card: {
    width: '86%',
    backgroundColor: '#FFFFFF',
    marginTop: 40,
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 18,
  },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#222222',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#77C9F3',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  infoText: {
    marginTop: 18,
    fontSize: 12,
    color: '#7F8B94',
    textAlign: 'center',
    lineHeight: 18,
  },
  backText: {
    marginTop: 14,
    fontSize: 13,
    color: '#2E6FD8',
    fontWeight: '600',
    textAlign: 'center',
  },
});