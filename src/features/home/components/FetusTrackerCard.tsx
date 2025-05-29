// src/components/FetusTrackerCard.tsx
import React, { useEffect } from 'react';
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
  // Log props
  useEffect(() => {
    console.log('FetusTrackerCard - Props:', { weeks, name, startDate, endDate });
  }, [weeks, name, startDate, endDate]);

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
    height: 450,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

export default FetusTrackerCard;