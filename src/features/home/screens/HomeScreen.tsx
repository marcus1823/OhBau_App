import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import LinearGradient from 'react-native-linear-gradient';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';
import FetusTrackerCard from '../components/FetusTrackerCard';
// import FetusInfoStatus from '../components/FetusInfoStatus';
import MotherInfoStatus from '../components/MotherInfoStatus';
import { RootState } from '../../../stores/store';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';

import { Fetus } from '../types/family.type';
import { useParentRelationQuery } from '../profile/hooks/useParentRelationQuery';
import { useFetusByCodeQuery } from '../profile/hooks/useFetusByCodeQuery';
import FetusInfoStatus from '../components/FetusInfoStatus';

const HomeScreen = ( { navigation }: any ) =>
{
  const accessToken = useSelector( ( state: RootState ) => state.auth.accessToken || '' );

  const { data: parentRelationData, isLoading: isRelationLoading } = useParentRelationQuery( accessToken );

  const fetusCode = parentRelationData?.data?.fetuses?.[ 0 ]?.code || '';

  const { data: fetusData, isLoading: isFetusLoading } = useFetusByCodeQuery( fetusCode, accessToken );

  // Fallback fetus data when no data is available
  const fallbackFetusData: Fetus = {
    id: '',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    name: 'Chưa có dữ liệu',
    code: '',
    fetusDetails: [],
  };


  // Handle loading state
  if ( isRelationLoading || isFetusLoading )
  {
    return <LoadingOverlay visible={ true } />;
  }

  // Use fetus data or fallback
  const fetus = fetusData?.data || fallbackFetusData;
  console.log( 'fetus', fetus );

  // Calculate weeks
  const startDate = new Date( fetus.startDate );
  const currentDate = new Date( '' );
  const diffTime = Math.abs( currentDate.getTime() - startDate.getTime() );
  const diffDays = Math.ceil( diffTime / ( 1000 * 60 * 60 * 24 ) );
  const weeks = Math.floor( diffDays / 7 );


  return (
    <LinearGradient colors={ Gradients.backgroundPrimary } style={ styles.container }>
      <SecondaryHeader
        unreadMessages={ 5 }
      />
      <ScrollView
        contentContainerStyle={ styles.scrollContainer }
        showsVerticalScrollIndicator={ false }
      >
        <View style={ styles.trackerCardWrapper }>
          <FetusTrackerCard
            weeks={ weeks }
            name={ fetus.name }
            startDate={ fetus.startDate }
            endDate={ fetus.endDate }
          />
        </View>
        <View style={ styles.content }>
          <Text style={ styles.title }>Thông tin của con đây ạ</Text>
          <FetusInfoStatus fetusDetails={ fetus.fetusDetails } navigation={ navigation } />
          <Text style={ styles.title }>Thông tin của mẹ đây ạ</Text>
          <MotherInfoStatus />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create( {
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  trackerCardWrapper: {
    marginBottom: 20,
  },
  content: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: 'League Spartan',
    marginVertical: 20,
  },
} );

export default HomeScreen;