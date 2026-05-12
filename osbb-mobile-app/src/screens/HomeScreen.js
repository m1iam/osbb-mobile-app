import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ContactsScreen from './ContactsScreen';
import PaymentsScreen from './PaymentsScreen';
import ProfileScreen from './ProfileScreen';
import RequestsScreen from './RequestsScreen';
import VotingScreen from './VotingScreen';

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const [requests, setRequests] = useState([
    {
      id: 1,
      title: 'Несправність ліфту',
      description: 'Ліфт не працює у 2 під’їзді.',
      status: 'В процесі',
      date: '17 березня',
    },
    {
      id: 2,
      title: 'Перегоріла лампа у під’їзді',
      description: 'Потрібна заміна лампи біля входу.',
      status: 'Нова',
      date: '24 березня',
    },
  ]);

  const latestNews = [
    {
      id: 1,
      title: 'Прорив труби',
      text: 'Сьогодні о 14:00 буде тимчасово відключено воду та електропостачання у зв’язку з аварією труби в підвалі будинку. Орієнтовний час відновлення — 3 години.',
    },
    {
      id: 2,
      title: 'Планове відключення світла',
      text: 'Завтра з 10:00 до 16:00 буде відсутнє електропостачання у зв’язку з проведенням технічних робіт. Просимо завчасно підготуватись.',
    },
  ];

  if (currentScreen === 'announcements') {
  return (
    <ContactsScreen setCurrentScreen={setCurrentScreen} />
  );
}
  if (currentScreen === 'requests') {
    return (
      <RequestsScreen
        goBack={() => setCurrentScreen('home')}
        requests={requests}
      />
    );
  }

  if (currentScreen === 'payments') {
    return <PaymentsScreen goBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'voting') {
    return <VotingScreen goBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'profile') {
    return <ProfileScreen goBack={() => setCurrentScreen('home')} />;
  }

  const getStatusStyle = (status) => {
    if (status === 'В процесі') return styles.statusProcess;
    if (status === 'Нова') return styles.statusNew;
    return styles.statusNew;
  };

  const getStatusTextStyle = (status) => {
    if (status === 'В процесі') return styles.statusProcessText;
    if (status === 'Нова') return styles.statusNewText;
    return styles.statusNewText;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>

        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>ОСББ</Text>
            <Text style={styles.userName}>Олещук Олександра</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setCurrentScreen('profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionMainTitle}>Оберіть потрібний розділ</Text>

          <View style={styles.cardsGrid}>
            <TouchableOpacity style={[styles.menuCard, styles.greenCard]} onPress={() => setCurrentScreen('payments')}>
              <Text style={styles.menuIcon}>💳</Text>
              <View>
                <Text style={styles.menuTitle}>Платежі</Text>
                <Text style={styles.menuSubtitle}>борг: 1200 грн</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuCard, styles.blueCard]} onPress={() => setCurrentScreen('requests')}>
              <Text style={styles.menuIcon}>📋</Text>
              <View>
                <Text style={styles.menuTitle}>Мої заявки</Text>
                <Text style={styles.menuSubtitle}>2 активні</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuCard, styles.peachCard]} onPress={() => setCurrentScreen('announcements')}>
              <Text style={styles.menuIcon}>❗</Text>
              <Text style={styles.menuTitle}>Терміново</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuCard, styles.purpleCard]} onPress={() => setCurrentScreen('voting')}>
              <Text style={styles.menuIcon}>🗳️</Text>
              <Text style={styles.menuTitle}>Голосування</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lightSection}>
            <Text style={styles.sectionTitle}>Останні заявки</Text>

            {requests.map((request) => (
              <View key={request.id} style={styles.requestRow}>
                <View style={styles.leftDot} />

                <View style={styles.requestCard}>
                  <View>
                    <Text style={styles.requestTitle}>{request.title}</Text>
                    <Text style={styles.requestDate}>{request.date}</Text>
                  </View>

                  <View style={[styles.statusBadge, getStatusStyle(request.status)]}>
                    <Text style={[styles.statusText, getStatusTextStyle(request.status)]}>
                      {request.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.newsSection}>
            <Text style={styles.sectionTitle}>Останні новини</Text>

            {latestNews.map((item) => (
              <View key={item.id} style={styles.newsCard}>
                <Text style={styles.newsIcon}>📰</Text>
                <View>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navTextActive}>Головна</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('profile')}>
            <Text style={styles.navIcon}>⚙️</Text>
            <Text style={styles.navText}>Налаштування</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8F8F8',
  },

  header: {
    backgroundColor: '#C6E2EC',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#244C97',
  },

  userName: {
    fontSize: 14,
    color: '#8A8A8A',
  },

  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#8FC2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    padding: 14,
  },

  sectionMainTitle: {
    fontSize: 16,
    marginBottom: 10,
  },

  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  menuCard: {
    width: '48%',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  greenCard: { backgroundColor: '#CDEFD9' },
  blueCard: { backgroundColor: '#BFD5FF' },
  peachCard: { backgroundColor: '#F6D7C5' },
  purpleCard: { backgroundColor: '#DDD0F1' },

  menuIcon: {
    fontSize: 24,
    marginRight: 10,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  menuSubtitle: {
    fontSize: 12,
  },

  lightSection: {
    backgroundColor: '#E7F0F1',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  leftDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#999',
    marginRight: 10,
  },

  requestCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  requestTitle: {
    fontSize: 14,
  },

  requestDate: {
    fontSize: 12,
    color: '#777',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 12,
  },

  statusProcess: { backgroundColor: '#F5E08A' },
  statusProcessText: { color: '#4B3B00' },

  statusNew: { backgroundColor: '#AFC9FF' },
  statusNewText: { color: '#1C4291' },

  newsSection: {
    marginTop: 10,
  },

  newsCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
  },

  newsIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  newsTitle: {
    fontWeight: '700',
  },

  newsText: {
    fontSize: 12,
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#C6E2EC',
  },

  navItem: {
    alignItems: 'center',
  },

  navIcon: {
    fontSize: 20,
  },

  navText: {
    fontSize: 12,
  },

  navTextActive: {
    fontSize: 12,
    fontWeight: '700',
  },
});