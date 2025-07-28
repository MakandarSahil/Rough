import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import axios from 'axios';

const ONESIGNAL_APP_ID = 'a8739f4c-e910-4903-a466-d32c44a7ede8';

async function getExternalId(onesignalId: string): Promise<string | null> {
  try {
    const res = await axios.get('http://192.168.50.32:3000/noti/externalId', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.data.externalId) {
      return res.data.externalId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting externalId:', error);
    return null;
  }
}

async function getOnesignalId(): Promise<string | null> {
  const onesignalId = await OneSignal.User.getOnesignalId();
  return onesignalId;
}

const initOneSignal = async () => {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(ONESIGNAL_APP_ID);

  // In production, you might want to request permission later
  OneSignal.Notifications.requestPermission(true);

  const onesignalId = await getOnesignalId();
  console.log('OneSignal ID:', onesignalId);

};

function App() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
  },
});

export default App;
