import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Mock Data
const mockData = {
  user: {
    name: 'John Tan',
    email: 'john_tan@2024.ssts.edu.sg',
    house: 'Blue House',
    points: 3021,
    streak: 3,
  },
  houseRankings: [
    { name: 'Green House', points: 3250, color: '#27AE60' },
    { name: 'Blue House', points: 3021, color: '#4A90E2' },
    { name: 'Red House', points: 2890, color: '#E74C3C' },
    { name: 'Yellow House', points: 2654, color: '#F1C40F' },
  ],
  equipment: [
    { id: 1, name: 'Basketball', available: 5, total: 10, icon: 'sports-basketball' },
    { id: 2, name: 'Volleyball', available: 3, total: 8, icon: 'sports-volleyball' },
    { id: 3, name: 'Tennis Racket', available: 2, total: 6, icon: 'sports-tennis' },
  ],
  events: [
    { id: 1, title: 'Inter-House Games', date: '5 May', time: '9:00AM - 1:00PM' },
    { id: 2, title: 'Blue vs Red House', date: '14 July', time: '2:00PM - 5:00PM' },
  ],
  gymSlots: [
    { id: 1, name: 'Gym Slot 1', time: '10:00 AM - 11:00 AM' },
    { id: 2, name: 'Gym Slot 2', time: '11:00 AM - 12:00 PM' },
    { id: 3, name: 'Gym Slot 3', time: '12:00 PM - 1:00 PM' },
    { id: 4, name: 'Gym Slot 4', time: '1:00 PM - 2:00 PM' },
  ],
  loanHistory: [
    { id: 1, type: 'Basketball', dueDate: '2024-08-15', icon: 'sports-basketball' },
    { id: 2, type: 'Volleyball', dueDate: '2024-08-16', icon: 'sports-volleyball' },
  ],
};

// Home Screen Component
const HomeScreen = ({ navigation }) => {
  const [pollVote, setPollVote] = useState(null);
  
  const quickActions = [
    { id: 1, title: 'Loan Equipment', icon: 'inventory', screen: 'LoanEquipment' },
    { id: 2, title: 'Book Gym', icon: 'fitness-center', screen: 'Activities' },
    { id: 3, title: 'View Events', icon: 'event', screen: 'Events' },
    { id: 4, title: 'House Points', icon: 'emoji-events', screen: 'Home' },
    { id: 5, title: 'Calendar', icon: 'calendar-today', screen: 'Activities' },
    { id: 6, title: 'Profile', icon: 'person', screen: 'Profile' },
  ];

  const pollOptions = [
    'Basketball Tournament',
    'Volleyball Match',
    'Swimming Competition',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* House Status Card */}
        <View style={styles.houseCard}>
          <Text style={styles.houseTitle}>{mockData.user.house}</Text>
          <Text style={styles.housePoints}>{mockData.user.points} points</Text>
          <Text style={styles.houseRank}>2nd Place</Text>
        </View>

        {/* House Rankings */}
        <View style={styles.rankingsSection}>
          <View style={styles.rankingsHeader}>
            <Icon name="emoji-events" size={24} color="#FFD700" />
            <Text style={styles.rankingsTitle}>House Rankings</Text>
          </View>
          
          {mockData.houseRankings.map((house, index) => (
            <View key={index} style={styles.rankingItem}>
              <Text style={styles.rankingPosition}>{index + 1}</Text>
              <View style={[styles.houseColorDot, { backgroundColor: house.color }]} />
              <Text style={styles.houseName}>{house.name}</Text>
              <Text style={styles.housePointsRanking}>{house.points}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionButton}
                onPress={() => navigation.navigate(action.screen)}
              >
                <Icon name={action.icon} size={24} color="#4A90E2" />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Next Event Countdown */}
        <View style={styles.countdownSection}>
          <Text style={styles.sectionTitle}>Next Event</Text>
          <View style={styles.countdownCard}>
            <Text style={styles.eventTitle}>Inter-House Games</Text>
            <View style={styles.countdownContainer}>
              <View style={styles.timeBox}>
                <Text style={styles.timeNumber}>15</Text>
                <Text style={styles.timeLabel}>Days</Text>
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.timeNumber}>4</Text>
                <Text style={styles.timeLabel}>Hours</Text>
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.timeNumber}>23</Text>
                <Text style={styles.timeLabel}>Min</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Poll Section */}
        <View style={styles.pollSection}>
          <Text style={styles.sectionTitle}>Vote for Next Activity</Text>
          <View style={styles.pollCard}>
            {pollOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pollOption,
                  pollVote === index && styles.pollOptionSelected
                ]}
                onPress={() => setPollVote(index)}
              >
                <View style={[
                  styles.radioButton,
                  pollVote === index && styles.radioButtonSelected
                ]} />
                <Text style={styles.pollOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.voteButton}>
              <Text style={styles.voteButtonText}>Vote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Activities Screen (Gym Booking)
const ActivitiesScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2024-10-07');

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#4A90E2',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gym Booking</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            current="2024-10-01"
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: '#4A90E2',
              todayTextColor: '#4A90E2',
              arrowColor: '#4A90E2',
            }}
          />
        </View>

        <View style={styles.slotsContainer}>
          <Text style={styles.slotsTitle}>Available Slots</Text>
          
          {mockData.gymSlots.map((slot) => (
            <View key={slot.id} style={styles.slotCard}>
              <View style={styles.slotInfo}>
                <Text style={styles.slotName}>{slot.name}</Text>
                <Text style={styles.slotTime}>{slot.time}</Text>
              </View>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => Alert.alert('Success', 'Gym slot booked!')}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Events Screen
const EventsScreen = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 2,
    hours: 12,
    minutes: 30,
    seconds: 7,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Events</Text>
        </View>

        <View style={styles.happeningNowSection}>
          <Text style={styles.sectionTitle}>Happening Now</Text>
          
          <View style={styles.eventImagePlaceholder}>
            <Text style={styles.eventTitle}>House Basketball Tournament</Text>
          </View>

          <View style={styles.countdownContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.timeNumber}>{timeRemaining.days}</Text>
              <Text style={styles.timeLabel}>Days</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeNumber}>{timeRemaining.hours}</Text>
              <Text style={styles.timeLabel}>Hours</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeNumber}>{timeRemaining.minutes}</Text>
              <Text style={styles.timeLabel}>Minutes</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeNumber}>{timeRemaining.seconds}</Text>
              <Text style={styles.timeLabel}>Seconds</Text>
            </View>
          </View>
        </View>

        <View style={styles.upcomingSection}>
          <View style={styles.upcomingHeader}>
            <Text style={styles.upcomingTitle}>Upcoming Events</Text>
          </View>
          
          {mockData.events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.dateCircle}>
                <Text style={styles.dateText}>{event.date.split(' ')[0]}</Text>
                <Text style={styles.monthText}>{event.date.split(' ')[1]}</Text>
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventName}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
              <TouchableOpacity 
                style={styles.rsvpButton}
                onPress={() => Alert.alert('RSVP', 'Successfully registered for event!')}
              >
                <Text style={styles.rsvpButtonText}>RSVP</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Profile Screen
const ProfileScreen = () => {
  const achievements = [
    { id: 1, icon: 'emoji-events', color: '#FFD700', earned: false },
    { id: 2, icon: 'local-fire-department', color: '#FF6B35', earned: true },
    { id: 3, icon: 'calendar-today', color: '#666', earned: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, John</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="settings" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <View style={styles.textInfo}>
            <Text style={styles.profileName}>{mockData.user.name}</Text>
            <Text style={styles.profileEmail}>{mockData.user.email}</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{mockData.user.streak} Day Streak</Text>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="person" size={30} color="#999" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.achievementsSection}>
        <Text style={styles.achievementsTitle}>Achievements:</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={[
                styles.achievementIcon,
                { backgroundColor: achievement.earned ? achievement.color : '#E0E0E0' }
              ]}
            >
              <Icon
                name={achievement.icon}
                size={30}
                color={achievement.earned ? 'white' : '#999'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Loan Equipment Screen
const LoanEquipmentScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loan Equipment</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Equipment</Text>
          
          {mockData.equipment.map((item) => (
            <View key={item.id} style={styles.equipmentCard}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={24} color="#4A90E2" />
              </View>
              <View style={styles.equipmentInfo}>
                <Text style={styles.equipmentName}>{item.name}</Text>
                <Text style={styles.equipmentAvailability}>
                  Available: {item.available}/{item.total}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.loanButton}
                onPress={() => Alert.alert('Success', `${item.name} loaned successfully!`)}
              >
                <Text style={styles.loanButtonText}>Loan</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Loans</Text>
          
          {mockData.loanHistory.map((loan) => (
            <View key={loan.id} style={styles.loanCard}>
              <View style={styles.iconContainer}>
                <Icon name={loan.icon} size={24} color="#4A90E2" />
              </View>
              <View style={styles.loanInfo}>
                <Text style={styles.loanType}>{loan.type}</Text>
                <Text style={styles.dueDate}>Due: {loan.dueDate}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Stack Navigator for nested screens
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="LoanEquipment" component={LoanEquipmentScreen} />
    </Stack.Navigator>
  );
};

// Main App Component
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Activities') {
              iconName = 'fitness-center';
            } else if (route.name === 'Events') {
              iconName = 'event';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Activities" component={ActivitiesScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  
  // House Card Styles
  houseCard: {
    backgroundColor: '#4A90E2',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  houseTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  housePoints: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  houseRank: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  
  // Rankings Styles
  rankingsSection: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 16,
  },
  rankingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rankingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rankingPosition: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
    color: '#333',
  },
  houseColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  houseName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  housePointsRanking: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  
  // Quick Actions Styles
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: -50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: 'white',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Countdown Styles
  countdownSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  countdownCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeBox: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  timeNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  
  // Poll Styles
  pollSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pollCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  pollOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  pollOptionSelected: {
    backgroundColor: '#E8F4FD',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#4A90E2',
  },
  pollOptionText: {
    fontSize: 16,
    color: '#333',
  },
  voteButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  voteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Calendar Styles
  calendarContainer: {
    backgroundColor: '#E8F4FD',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  
  // Slots Styles
  slotsContainer: {
    paddingHorizontal: 20,
  },
  slotsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  slotCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotInfo: {
    flex: 1,
  },
  slotName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  slotTime: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Events Styles
  happeningNowSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  eventImagePlaceholder: {
    height: 200,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  upcomingSection: {
    paddingHorizontal: 20,
  },
  upcomingHeader: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  upcomingTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateCircle: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthText: {
    color: 'white',
    fontSize: 10,
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  rsvpButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  rsvpButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  
  // Profile Styles
  profileCard: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInfo: {
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 10,
  },
  streakBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  streakText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarContainer: {
    marginLeft: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementsSection: {
    paddingHorizontal: 20,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  
  // Equipment Styles
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  equipmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  equipmentAvailability: {
    fontSize: 14,
    color: '#666',
  },
  loanButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loanButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  loanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanInfo: {
    flex: 1,
  },
  loanType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default App;
