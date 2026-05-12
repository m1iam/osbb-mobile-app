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

export default function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleContinue = () => {
    if (!email.trim() || !phone.trim()) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля');
      return;
    }

    Alert.alert('Успіх', 'Інструкції для відновлення доступу надіслано');
  };

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
              <Text style={styles.cardTitle}>Відновлення доступу</Text>

              <Text style={styles.infoText}>
                Введіть дані у відповідне поле, куди буде надіслано код для відновлення
              </Text>

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

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>Продовжити</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onBack}>
                <Text style={styles.backText}>Назад до входу</Text>
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
  image: {
    width: 220,
    height: 170,
    marginTop: 12,
  },
  card: {
    width: '86%',
    backgroundColor: '#FFFFFF',
    marginTop: -10,
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
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#7F8B94',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
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
  backText: {
    marginTop: 14,
    fontSize: 13,
    color: '#2E6FD8',
    fontWeight: '600',
    textAlign: 'center',
  },
});