import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ-6RobdXXlYX8YL0OQV67AVq7Da7Sp2A",
  authDomain: "stop-tracker-v1.firebaseapp.com",
  projectId: "stop-tracker-v1",
  storageBucket: "stop-tracker-v1.firebasestorage.app",
  messagingSenderId: "183138392477",
  appId: "1:183138392477:web:408e779b7276ed51897774"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Data sync functions
export const syncData = {
  // Delivery logs
  async saveDeliveryLogs(userId, logs) {
    try {
      await setDoc(doc(db, 'users', userId, 'data', 'deliveryLogs'), { logs });
      return true;
    } catch (error) {
      console.error('Error saving delivery logs:', error);
      return false;
    }
  },

  async getDeliveryLogs(userId) {
    try {
      const docRef = doc(db, 'users', userId, 'data', 'deliveryLogs');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().logs : [];
    } catch (error) {
      console.error('Error getting delivery logs:', error);
      return [];
    }
  },

  // Expenses
  async saveExpenses(userId, expenses) {
    try {
      await setDoc(doc(db, 'users', userId, 'data', 'expenses'), { expenses });
      return true;
    } catch (error) {
      console.error('Error saving expenses:', error);
      return false;
    }
  },

  async getExpenses(userId) {
    try {
      const docRef = doc(db, 'users', userId, 'data', 'expenses');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().expenses : [];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  },

  // User Settings
  async saveSettings(userId, settings) {
    try {
      await setDoc(doc(db, 'users', userId, 'data', 'settings'), settings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  async getSettings(userId) {
    try {
      const docRef = doc(db, 'users', userId, 'data', 'settings');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  },

  // Real-time sync subscriptions
  subscribeToDeliveryLogs(userId, callback) {
    const docRef = doc(db, 'users', userId, 'data', 'deliveryLogs');
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().logs);
      } else {
        callback([]);
      }
    });
  },

  subscribeToExpenses(userId, callback) {
    const docRef = doc(db, 'users', userId, 'data', 'expenses');
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().expenses);
      } else {
        callback([]);
      }
    });
  },

  // Backup and restore
  async backupAllData(userId) {
    try {
      const [logs, expenses, settings] = await Promise.all([
        this.getDeliveryLogs(userId),
        this.getExpenses(userId),
        this.getSettings(userId)
      ]);

      return {
        logs,
        expenses,
        settings,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  },

  async restoreFromBackup(userId, backupData) {
    try {
      await Promise.all([
        this.saveDeliveryLogs(userId, backupData.logs),
        this.saveExpenses(userId, backupData.expenses),
        this.saveSettings(userId, backupData.settings)
      ]);
      return true;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }
};

export default app;
