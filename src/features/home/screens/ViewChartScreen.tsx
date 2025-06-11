import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { LineChart } from 'react-native-gifted-charts';

const ViewChartScreen = ({ navigation, route }: any) => {
  const { property, values } = route.params;
  // Reverse the values array to place the latest data first
  const reversedValues = [...values].reverse();
  // Map to dataPoints with labels starting from "Lần 1" to "Lần n"
  const dataPoints = reversedValues.map((value: number, index: number) => ({
    value,
    label: `Lần ${index + 1}`, // e.g., "Lần 1", "Lần 2", "Lần 3"
  }));

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Biểu đồ"
        onBackButtonPress={() => navigation.goBack()}
      />
      <View style={styles.chartContainer}>
        <LineChart
          data={dataPoints}
          height={300}
          width={300}
          yAxisTextStyle={Colors.textBlack}
          xAxisTextStyle={Colors.primaryDark}
          yAxisLabelTexts={['0', '1', '2', '3', '4']} // Adjust range based on max value
          xAxisLabelTexts={dataPoints.map(d => d.label)}
          color={Colors.primary}
          thickness={2}
        />
        <Text style={styles.title}>{`Biểu đồ ${property}`}</Text>
      </View>
    </LinearGradient>
  );
};

export default ViewChartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.primaryDark,
    fontSize: 18,
    marginTop: 10,
  },
});