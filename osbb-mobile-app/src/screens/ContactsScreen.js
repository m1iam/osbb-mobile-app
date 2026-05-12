import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const contactsData = {
  administration: [
    { title: 'Голова ОСББ', phone: '+380671123456' },
    { title: 'Охорона', phone: '+380674456789' },
  ],
  technical: [
    { title: 'Сантехнік', phone: '+380675567890' },
    { title: 'Електрик', phone: '+380676678901' },
    { title: 'Ліфтер', phone: '+380677789012' },
  ],
  emergency: [
    { title: 'Газова служба', phone: '104' },
    { title: 'Поліція', phone: '102' },
    { title: 'Швидка допомога', phone: '103' },
  ],
};

const ContactCard = ({ title, phone }) => {
  const callPhone = async () => {
    const url = `tel:${phone}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Помилка', 'Неможливо відкрити набір номера');
      }
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося здійснити дзвінок');
    }
  };

  return (
    <View style={styles.contactCard}>
      <View>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactPhone}>{phone}</Text>
      </View>

      <TouchableOpacity style={styles.callButton} onPress={callPhone}>
        <Ionicons name="call-outline" size={20} color="#2F80FF" />
      </TouchableOpacity>
    </View>
  );
};

const Section = ({ title, icon, color, data }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Ionicons name={icon} size={21} color={color} />
    </View>

    {data.map((item, index) => (
      <ContactCard key={index} title={item.title} phone={item.phone} />
    ))}
  </View>
);

export default function ContactsScreen({ setCurrentScreen }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>ОСББ</Text>
          <Text style={styles.userName}>Олещук Олександра</Text>
        </View>

        <View style={styles.profileButton}>
          <Ionicons name="person" size={21} color="#000" />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.urgentBlock}>
          <Text style={styles.urgentText}>Терміново</Text>
          <View style={styles.warningCircle}>
            <Text style={styles.warningText}>!</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Швидкий доступ до контактів аварійних служб та відповідальних осіб будинку.
        </Text>

        <Section
          title="Контакти адміністрації"
          icon="accessibility-outline"
          color="#FF6B6B"
          data={contactsData.administration}
        />

        <Section
          title="Технічні служби"
          icon="construct-outline"
          color="#2F80FF"
          data={contactsData.technical}
        />

        <Section
          title="Аварійні служби"
          icon="alarm-outline"
          color="#FF3B30"
          data={contactsData.emergency}
        />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen && setCurrentScreen('home')}
        >
          <Ionicons name="home-outline" size={31} color="#1F3B4D" />
          <Text style={styles.navText}>Головна</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen && setCurrentScreen('settings')}
        >
          <Ionicons name="settings-outline" size={31} color="#1F3B4D" />
          <Text style={styles.navText}>Налаштування</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FFFF',
  },

  header: {
    height: 98,
    backgroundColor: '#BFEFFF',
    paddingTop: 26,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoText: {
    alignSelf: 'flex-start',
    backgroundColor: '#8BC6FF',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    fontSize: 16,
    color: '#000',
  },

  userName: {
    marginTop: 4,
    color: '#777',
    fontSize: 12,
  },

  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8BC6FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 95,
  },

  urgentBlock: {
    backgroundColor: '#FFD8BF',
    height: 45,
    paddingHorizontal: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },

  urgentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },

  warningCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },

  warningText: {
    fontSize: 22,
    color: '#555',
    fontWeight: '600',
  },

  description: {
    marginTop: 14,
    marginHorizontal: 26,
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
    lineHeight: 17,
  },

  section: {
    marginTop: 12,
    paddingHorizontal: 22,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },

  contactCard: {
    minHeight: 38,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 28,
    paddingVertical: 7,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },

  contactTitle: {
    fontSize: 11,
    color: '#000',
  },

  contactPhone: {
    marginTop: 2,
    fontSize: 11,
    color: '#555',
  },

  callButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2F80FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 62,
    backgroundColor: '#C8F3FF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  navText: {
    fontSize: 11,
    color: '#4A4A4A',
    marginTop: 1,
  },
});