import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import CardInfoStatus from './CardInfoStatus';
import { FetusDetail } from '../types/family.type';

const cardColors = [
  { background: Colors.cardHome1, text: Colors.textCardHome1 },
  { background: Colors.cardHome2, text: Colors.textCardHome2 },
  { background: Colors.cardHome3, text: Colors.textCardHome3 },
  { background: Colors.cardHome4, text: Colors.textCardHome4 },
];

interface FetusInfoStatusProps {
  fetusDetails: FetusDetail[];
}

const FetusInfoStatus: React.FC<FetusInfoStatusProps> = ({ fetusDetails }) => {
  // Select the first fetusDetail
  const firstFetusDetail = fetusDetails[0] || null;

  // Log the fetusDetails and firstFetusDetail
  useEffect(() => {
    console.log('FetusInfoStatus - Received Fetus Details:', fetusDetails);
    console.log('FetusInfoStatus - First Fetus Detail:', firstFetusDetail);
  }, [fetusDetails, firstFetusDetail]);

  // Hardcoded data for UI (as requested, not using fetusDetails yet)
const fetusInfo = [
  { icon: 'scale', title: 'Cân nặng', value: `${firstFetusDetail?.weight || 0} kg` },
  { icon: 'straighten', title: 'Chiều dài', value: `${firstFetusDetail?.height || 0} cm` },
  { icon: 'graphic-eq', title: 'Nhịp tim', value: '120 - 160 lần/phút' },
  { icon: 'query-stats', title: 'Số lần đạp', value: '16 - 45 lần/ngày' },
];

  return (
    <View>
      {Array.from({ length: Math.ceil(fetusInfo.length / 2) }, (_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {fetusInfo.slice(rowIndex * 2, rowIndex * 2 + 2).map((info, index) => {
            const colorIndex = (rowIndex * 2 + index) % cardColors.length;
            const { background, text } = cardColors[colorIndex];
            return (
              <CardInfoStatus
                key={index}
                icon={info.icon}
                title={info.title}
                value={info.value}
                backgroundColor={background}
                textColor={text}
                onPressViewMore={() => console.log(`Xem thêm ${info.title}`)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default FetusInfoStatus;