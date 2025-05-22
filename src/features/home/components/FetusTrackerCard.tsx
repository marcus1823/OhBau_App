import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../../../assets/styles/colorStyle';
import DateDisplay from './DateDisplay';
import FetusProgress from './FetusProgress';

interface FetusTrackerCardProps {
  weeks: number;
  name: string;
  startDate: string;
  endDate: string;
}

const FetusTrackerCard: React.FC<FetusTrackerCardProps> = ({ weeks, name, startDate, endDate }) => {
  return (
    <LinearGradient
      colors={Gradients.backgroundPrimaryDark}
      style={styles.cardContainer}
    >
      <DateDisplay />
      <FetusProgress weeks={weeks} name={name} startDate={startDate} endDate={endDate} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%', 
    height: '120%', 
    borderBottomLeftRadius: 130, 
    borderBottomRightRadius: 130,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20, 
  },
});

export default FetusTrackerCard;