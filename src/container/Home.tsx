import * as React from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { Link } from 'react-router-dom';

interface HomeProps {
  history: any;
  navigation: any;
}

const Home: React.SFC<HomeProps> = (props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Homes Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          if (Platform.OS === 'web') {
            props.history.push('detail');
          } else {
            props.navigation.navigate('Detail');
          }
        }}
      />
    </View>
  );
};

export default Home;