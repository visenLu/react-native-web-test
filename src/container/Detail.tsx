import * as React from 'react';
import { View, Text, Button } from 'react-native';

interface DetailProps {
}

const Detail: React.SFC<DetailProps> = (props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      {/* <Button
        title="Go to Details... again"
        onPress={() => props.navigation.navigate('Details')}
      />
      <Button
        title="Go back"
        onPress={() => props.navigation.goBack()}
      /> */}
    </View>
  );
};

export default Detail;