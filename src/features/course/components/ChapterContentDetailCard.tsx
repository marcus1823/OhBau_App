import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';



interface ChapterContentDetailCardProps {
  content: string; 
}

const ChapterContentDetailCard: React.FC<ChapterContentDetailCardProps> = ({ content }) => {


  return (
    <View style={styles.card}>
      {/* Nội dung bài học */}
      <Text style={styles.contentText}>
        {content || 'Không có nội dung'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 13,
    padding: 30,
    marginBottom: 15,
    backgroundColor: Colors.textWhite,
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 14,
    color: Colors.textBlack,
  },
});

export default ChapterContentDetailCard;