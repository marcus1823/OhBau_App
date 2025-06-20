import React from 'react';
import { Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

interface QuoteProps {
  quote: string;
  source?: string;
  style?: object;
}

const Quote: React.FC<QuoteProps> = ({ quote, source, style }) => {
  const handlePress = () => {
    if (source && typeof source === 'string') {
      // Check if the source is a valid URL
      if (source.startsWith('http://') || source.startsWith('https://')) {
        Linking.openURL(source).catch(err => 
          console.error('Failed to open URL:', err)
        );
      }
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      disabled={!source}
      activeOpacity={source ? 0.7 : 1}
    >
      <Text 
        style={[
          styles.quote, 
          source && styles.clickableQuote,
          style
        ]}
      >
        {quote || 'Không có trích dẫn'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quote: {
    fontSize: 12,
    marginBottom: 20,
    fontStyle: 'italic',
    color: Colors.textDarkGray,
  },
  clickableQuote: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});

export default Quote;
