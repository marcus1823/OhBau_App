import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import RenderHtml from 'react-native-render-html';


interface ChapterContentDetailCardProps {
  content: string; 
}

const ChapterContentDetailCard: React.FC<ChapterContentDetailCardProps> = ({ content }) => {

const htmlContent = content || '<p>Không có nội dung</p>';

const source = {
    html: htmlContent,
  };

  // const customStyles = {
  //   p: {
  //     color: Colors.textBlack,
  //     fontSize: 16,
  //     lineHeight: 24,
  //     marginBottom: 10,
  //   },
  //   h1: {
  //     color: Colors.primary,
  //     fontSize: 24,
  //     fontWeight: 'bold' as const,
  //     marginBottom: 10,
  //   },
  //   h2: {
  //     color: Colors.textBlack,
  //     fontSize: 20,
  //     fontWeight: '600' as const,
  //     marginBottom: 8,
  //   },
  //   ul: {
  //     marginLeft: 20,
  //     marginBottom: 10,
  //   },
  //   li: {
  //     color: Colors.textBlack,
  //     fontSize: 16,
  //     lineHeight: 24,
  //   },
  // };
  return (
    <View style={styles.card}>
      {/* Nội dung bài học */}
      <RenderHtml
        contentWidth={300} // Độ rộng tối đa, có thể điều chỉnh theo thiết bị
        source={source}
        // tagsStyles={customStyles}
      />
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