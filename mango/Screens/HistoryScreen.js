import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  RefreshControl 
} from 'react-native';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs 
} from "firebase/firestore";
import { auth, app } from "../firebaseConfig";

const db = getFirestore(app);

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'loans', 'bookings'
  const [loanHistory, setLoanHistory] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      await Promise.all([loadLoanHistory(), loadBookingHistory()]);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLoanHistory = async () => {
    try {
      // Get all loans for the user (both active and returned)
      const loansRef = collection(db, "loans");
      const q = query(loansRef, where("userId", "==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      
      const loans = snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'loan',
        ...doc.data(),
        timestamp: doc.data().loanedDate || doc.data().due || new Date().toISOString(),
      }));

      // Sort by most recent first
      loans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setLoanHistory(loans);
    } catch (error) {
      console.error("Error loading loan history:", error);
    }
  };

  const loadBookingHistory = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const snapshot = await getDocs(bookingsRef);
      
      const bookings = [];
      const today = new Date().toISOString().split('T')[0];
      
      snapshot.forEach((doc) => {
        const date = doc.id;
        const data = doc.data();
        const slots = data.slots || {};
        
        Object.entries(slots).forEach(([time, slotData]) => {
          if (slotData && typeof slotData === "object" && slotData.userId === auth.currentUser.uid) {
            const bookingDateTime = new Date(`${date}T${time}`);
            const isUpcoming = date >= today;
            
            bookings.push({
              id: `${date}-${time}`,
              type: 'booking',
              date: date,
              time: time,
              status: isUpcoming ? 'upcoming' : 'completed',
              timestamp: bookingDateTime.toISOString(),
              title: 'Gym Slot'
            });
          }
        });
      });

      // Sort by most recent first
      bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setBookingHistory(bookings);
    } catch (error) {
      console.error("Error loading booking history:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString, time) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })} at ${time}`;
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return dueDate < today;
  };

  const getFilteredHistory = () => {
    let combined = [];
    
    if (activeTab === 'all' || activeTab === 'loans') {
      combined = [...combined, ...loanHistory];
    }
    
    if (activeTab === 'all' || activeTab === 'bookings') {
      combined = [...combined, ...bookingHistory];
    }
    
    // Sort combined array by timestamp
    return combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const renderLoanItem = (item) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeTag, { backgroundColor: '#e8f5e8' }]}>
          <Text style={[styles.typeText, { color: '#2d7d2d' }]}>Loan</Text>
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.dueText}>
          Due: {formatDate(item.due)}
          {isOverdue(item.due) && !item.returned && (
            <Text style={styles.overdueText}> ⚠️ Overdue</Text>
          )}
        </Text>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.returned ? '#d4edda' : '#fff3cd' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.returned ? '#155724' : '#856404' }
            ]}>
              {item.returned ? 'Returned' : 'Active'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderBookingItem = (item) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeTag, { backgroundColor: '#e3f2fd' }]}>
          <Text style={[styles.typeText, { color: '#1976d2' }]}>Booking</Text>
        </View>
        <Text style={styles.itemName}>{item.title}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.bookingTime}>
          {formatDateTime(item.date, item.time)}
        </Text>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'upcoming' ? '#d1ecf1' : '#d4edda' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'upcoming' ? '#0c5460' : '#155724' }
            ]}>
              {item.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderHistoryItem = ({ item }) => {
    return item.type === 'loan' ? renderLoanItem(item) : renderBookingItem(item);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading history...</Text>
      </View>
    );
  }

  const filteredHistory = getFilteredHistory();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'loans' && styles.activeTab]}
          onPress={() => setActiveTab('loans')}
        >
          <Text style={[styles.tabText, activeTab === 'loans' && styles.activeTabText]}>
            Loans ({loanHistory.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bookings' && styles.activeTab]}
          onPress={() => setActiveTab('bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>
            Bookings ({bookingHistory.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#388CFB']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'all' 
                ? 'No history found' 
                : `No ${activeTab} history found`
              }
            </Text>
            <Text style={styles.emptySubtext}>
              Pull down to refresh
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          filteredHistory.length === 0 && { flex: 1 }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#388CFB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#388CFB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  overdueText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  bookingTime: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});