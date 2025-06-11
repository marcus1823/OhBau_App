import React, { useState } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';

const { width } = Dimensions.get('window');

const BANNERS = [
  { id: '1', image: 'https://i.pinimg.com/736x/de/50/3d/de503d9450148feab4b14eb24ab2af7a.jpg' },
  { id: '2', image: 'https://i.pinimg.com/736x/80/4c/83/804c83fedd17f49f0b126fdfd2bc1a4a.jpg' },
  { id: '3', image: 'https://i.pinimg.com/736x/bc/e9/4f/bce94fec87f85e4e72ef3a8cd15b1f85.jpg' },
];

const BannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderBanner = ({ item }: { item: { id: string; image: string } }) => (
    <View style={styles.bannerContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </View>
  );

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {BANNERS.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            activeIndex === index ? styles.paginationDotActive : styles.paginationDotInactive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={BANNERS}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
      />
      {renderPagination()}
    </View>
  );
};

export default BannerCarousel;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  bannerContainer: {
    width: width,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: width - 32,
    height: '100%',
    borderRadius: 12,
  },
  flatListContent: {
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
  },
  paginationDotInactive: {
    backgroundColor: '#E0E0E0',
  },
});