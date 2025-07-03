import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import RenderHtml from 'react-native-render-html';


interface ChapterContentDetailCardProps {
  content: string; 
}

const ChapterContentDetailCard: React.FC<ChapterContentDetailCardProps> = ({ content }) => {

  // Xử lý nội dung để chuyển \n thành <br>
  const processContent = (rawContent: string) => {
    if (!rawContent) {return '<p>Không có nội dung</p>';}
    
    const processedContent = rawContent
      .replace(/\n/g, '<br>')
      .trim();
    
    return `<div>${processedContent}</div>`;
  };

  const htmlContent = processContent(content);

  const source = {
    html: htmlContent,
  };

  const customStyles = {
    div: {
      color: Colors.textBlack,
      fontSize: 16,
      lineHeight: 24,
    },
    p: {
      color: Colors.textBlack,
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 10,
    },
    br: {
      height: 10,
    },
  };

  return (
    <View style={styles.card}>
      {/* Nội dung bài học */}
      <RenderHtml
        contentWidth={300} // Độ rộng tối đa, có thể điều chỉnh theo thiết bị
        source={source}
        tagsStyles={customStyles}
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