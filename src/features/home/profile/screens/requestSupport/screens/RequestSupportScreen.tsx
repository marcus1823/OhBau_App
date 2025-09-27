import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';

interface SupportInfoItemProps
{
  title: string;
  value: string;
  onPress?: () => void;
}

const SupportInfoItem: React.FC<SupportInfoItemProps> = ( { title, value, onPress } ) =>
{
  return (
    <TouchableOpacity style={ styles.infoContainer } onPress={ onPress } disabled={ !onPress }>
      <Text style={ styles.title }>{ title }</Text>
      <Text style={ [ styles.value, onPress && styles.linkValue ] }>{ value }</Text>
    </TouchableOpacity>
  );
};

const RequestSupportScreen = ( { navigation }: any ) =>
{
  const supportInfo = {
    phone: '038 4248930',
    email: 'ohbau.team@gmail.com',
    facebook: 'https://www.facebook.com/ohbau.family'
  };

  const handlePhonePress = () =>
  {
    Linking.openURL( `tel:${ supportInfo.phone }` );
  };

  const handleEmailPress = () =>
  {
    Linking.openURL( `mailto:${ supportInfo.email }` );
  };

  const handleFacebookPress = () =>
  {
    Linking.openURL( supportInfo.facebook );
  };

  return (
    <LinearGradient colors={ Gradients.backgroundPrimary } style={ styles.container }>
      <PrimaryHeader
        title="Hỗ trợ"
        onBackButtonPress={ () => navigation.goBack() }
      />
      <ScrollView contentContainerStyle={ styles.contentContainer } showsVerticalScrollIndicator={ false }>
        {/* Support Icon/Image */ }
        <View style={ styles.iconContainer }>
          <Image
            source={ require( '../../../../../../assets/images/skelector/doctorSkelector.jpg' ) } // You can replace with a support icon
            style={ styles.supportIcon }
          />
          <Text style={ styles.welcomeText }>Liên hệ với chúng tôi</Text>
          <Text style={ styles.descriptionText }>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ qua các kênh dưới đây:
          </Text>
        </View>

        {/* Support Information */ }
        <View style={ styles.mainContent }>
          <SupportInfoItem
            title="Số điện thoại"
            value={ supportInfo.phone }
            onPress={ handlePhonePress }
          />
          <SupportInfoItem
            title="Email"
            value={ supportInfo.email }
            onPress={ handleEmailPress }
          />
          <SupportInfoItem
            title="Facebook"
            value="ohbau.family"
            onPress={ handleFacebookPress }
          />
        </View>

        {/* Additional support text */ }
        <View style={ styles.footerContainer }>
          <Text style={ styles.footerText }>
            Thời gian hỗ trợ: 8:00 - 22:00 (Thứ 2 - Chủ nhật)
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default RequestSupportScreen;

const styles = StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  supportIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    lineHeight: 22,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 16,
    color: Colors.primaryDark,
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: Colors.textBlack,
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  linkValue: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textDarkGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
} );