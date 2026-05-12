import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function OtpScreen({ onBack, onSuccess, phone }) {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleInput = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Автоматичний перехід до наступного поля
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }

    // Якщо всі цифри введені, автоматично перевіряємо код
    if (newCode.every(digit => digit !== '')) {
      verifyOtp(newCode.join(''));
    }
  };

  const verifyOtp = async (fullCode) => {
    try {
      // ВИКОРИСТОВУЄМО ЗМІННУ З .env
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: fullCode }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        onSuccess();
      } else {
        Alert.alert('Помилка', data.message || 'Код невірний');
        // Очищуємо поля, якщо код невірний
        setCode(['', '', '', '']);
        inputs.current[0].focus();
      }
    } catch (error) {
      console.log('OTP Verification Error:', error);
      Alert.alert('Помилка', 'Не вдалося з’єднатися з сервером. Перевірте мережу.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>ОСББ</Text>
        </View>
        <Text style={styles.subtitle}>
          Об'єднання співвласників{'\n'}багатоквартирного будинку
        </Text>
      </View>

      {/* ШЛЯХ ВИПРАВЛЕНО */}
      <Image 
        source={require('../../assets/images/otp.png')} 
        style={styles.image} 
        resizeMode="contain" 
      />

      <View style={styles.card}>
        <Text style={styles.cardText}>
          Введіть код, який було Вам{'\n'}надіслано на електронну пошту
        </Text>
        <View style={styles.codeRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={styles.input}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleInput(text, index)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={() => {/* Тут буде логіка повторного відправлення через сервер */}}>
        <Text style={styles.resend}>Надіслати код ще раз</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFFCFC', alignItems: 'center' },
  header: { width: '100%', backgroundColor: '#CFF3FF', alignItems: 'center', paddingTop: 38, paddingBottom: 18 },
  badgeContainer: { backgroundColor: '#8DBBFF', paddingHorizontal: 14, paddingVertical: 3, borderRadius: 12, marginBottom: 12 },
  badge: { color: '#0B2A55', fontSize: 15, fontWeight: '700' },
  subtitle: { color: '#7C8A92', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  image: { width: 230, height: 180, marginTop: 30, marginBottom: 10 },
  card: { width: '86%', backgroundColor: '#fff', borderRadius: 18, paddingVertical: 25, paddingHorizontal: 20, alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardText: { textAlign: 'center', color: '#111', fontSize: 14, fontWeight: '600', marginBottom: 22 },
  codeRow: { flexDirection: 'row', gap: 12 },
  input: { width: 42, height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0', textAlign: 'center', fontSize: 22, borderRadius: 6, elevation: 2 },
  resend: { marginTop: 18, color: '#4B6FAE', fontSize: 14, fontWeight: '500' },
  backButton: { position: 'absolute', left: 25, bottom: 40 },
  backText: { fontSize: 35, color: '#8AA6BD' },
});