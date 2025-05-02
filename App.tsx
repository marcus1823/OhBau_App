import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bạn là</Text>
      <Text style={styles.sectionTitleNoFont}>Section Title No use Font</Text>
      <Text style={styles.sectionDescription}>
        This is a description with League Spartan font.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 54,
    fontWeight: '600',
    fontFamily: 'LeagueSpartan-Bold', // Đảm bảo khớp với tên tệp
  },
  sectionTitleNoFont: {
    fontSize: 54,
    fontWeight: '600',
    color: 'red', // Thêm màu để dễ phân biệt
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'LeagueSpartan-Regular', // Đảm bảo khớp với tên tệp
  },
});
export default App;