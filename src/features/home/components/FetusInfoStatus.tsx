import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import CardInfoStatus from './CardInfoStatus';
import { FetusDetail } from '../types/family.type';



type AllowedProperties = 'weight' | 'height' | 'bpm' | 'movement' | 'gsd' | 'crl' | 'bpd' | 'fl' | 'hc' | 'ac';

const cardColors = [
  { background: Colors.cardHome1, text: Colors.textCardHome1 },
  { background: Colors.cardHome2, text: Colors.textCardHome2 },
  { background: Colors.cardHome3, text: Colors.textCardHome3 },
  { background: Colors.cardHome4, text: Colors.textCardHome4 },
];

interface FetusInfoStatusProps {
  fetusDetails: FetusDetail[];
  navigation?: any;
}

const FetusInfoStatus: React.FC<FetusInfoStatusProps> = ({ fetusDetails, navigation }) => {
  console.log('FetusInfoStatus - Received fetusDetails:', fetusDetails);

  // Select the first fetusDetail
  const firstFetusDetail = fetusDetails[0] || null;

  // Log the fetusDetails and firstFetusDetail
  useEffect(() => {
    console.log('FetusInfoStatus - Received Fetus Details:', fetusDetails);
    console.log('FetusInfoStatus - First Fetus Detail:', firstFetusDetail);
  }, [fetusDetails, firstFetusDetail]);

  // Hardcoded data for UI with typed property
  const fetusInfo = [
    { icon: 'scale', title: 'Cân nặng', value: `${firstFetusDetail?.weight || 0} kg`, property: 'weight' as AllowedProperties, valueStandard: 3.0 },
    { icon: 'straighten', title: 'Chiều dài', value: `${firstFetusDetail?.height || 0} cm`, property: 'height' as AllowedProperties, valueStandard: 50.0 },
    { icon: 'graphic-eq', title: 'Nhịp tim', value: `${firstFetusDetail?.bpm || '120 - 160'} lần/phút`, property: 'bpm' as AllowedProperties, valueStandard: 140.0 },
    { icon: 'query-stats', title: 'Số lần đạp', value: `${firstFetusDetail?.movement || '16 - 45'} lần/ngày`, property: 'movement' as AllowedProperties, valueStandard: 30.0 },
  ];

  // Handle "Xem biểu đồ" click, log array of values for the specified property
  const handleViewChart = (property: AllowedProperties) => {
    const values = fetusDetails.map(detail => detail[property] || 0);
    const valueStandard = fetusInfo.find(info => info.property === property)?.valueStandard || 0;
    console.log(`Xem biểu đồ - ${property}:`, values);

    navigation.navigate('ViewChartScreen', { property, values, valueStandard });
  };

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
                onPressViewMore={() => handleViewChart(info.property)}
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