import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';



interface ChapterContentDetailCardProps {
  content: string; // Nội dung bài học
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
    // shadowColor: Colors.textBlack,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
  },
  contentText: {
    fontSize: 14,
    color: Colors.textBlack,
  },
});

export default ChapterContentDetailCard;