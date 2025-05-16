import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../assets/styles/colorStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DoctorDetailCardProps {
    fullName?: string;
    avatar?: string;
    address?: string;
    major?: string;
    experience?: string;
    focus?: string;
    rating?: number;
    comment?: string;
    schedule?: string;
    bookingDoctorPress?: () => void;
}

const DoctorDetailCard = ({ fullName, avatar, address, major, experience, focus, rating, comment, schedule, bookingDoctorPress }: DoctorDetailCardProps) => {
    const iconExperience = require('../../../assets/icons/iconExperienceDoctorDetail.png');

    return (
        <View style={styles.cardContainer}>
            <View style={styles.innerContainer}>

                {/* Avatar && experience + focus (row + column) */}
                <View style={styles.headerSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: avatar }} style={styles.avatarImage} />
                    </View>

                    <View style={styles.headerInfo}>
                        <View style={styles.experienceContainer}>
                            <Image source={iconExperience} style={styles.experienceIcon} />
                            <Text style={styles.headerText} numberOfLines={2} ellipsizeMode="tail">{experience}</Text>
                        </View>
                        <View style={styles.focusContainer}>
                            <Text style={styles.focusLabel}>Trọng tâm:</Text>
                            <Text style={styles.headerText} numberOfLines={6} ellipsizeMode="tail">{focus}</Text>
                        </View>
                    </View>
                </View>

                {/* fullname + major + address (column) */}
                <View style={styles.infoSection}>
                    <Text style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">{fullName}</Text>
                    <Text style={styles.specialtyText} numberOfLines={1} ellipsizeMode="tail">{major}</Text>
                    <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">{address}</Text>
                </View>

                {/* rating + comment + schedule (row) */}
                <View style={styles.statsSection}>
                    <View style={styles.ratingCommentContainer}>
                        <View style={styles.statItemSmall}>
                            <Icon name="star" size={12} color={Colors.primary} />
                            <Text style={styles.statText}>{rating}</Text>
                        </View>
                        <View style={styles.statItemSmall}>
                            <Icon name="comment" size={12} color={Colors.primary} />
                            <Text style={styles.statText}>{comment}</Text>
                        </View>
                    </View>
                    <View style={styles.statItemLarge}>
                        <Icon name="access-alarm" size={12} color={Colors.primary} />
                        <Text style={styles.statText} numberOfLines={1} ellipsizeMode="tail">{schedule}</Text>
                    </View>
                </View>

                {/* icon book + star & favorite */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.bookingButton} onPress={bookingDoctorPress}>
                        <Icon name="calendar-month" size={14} color={Colors.textWhite} />
                        <Text style={styles.bookingText}>Đặt Lịch</Text>
                    </TouchableOpacity>
                    <View style={styles.actionsRight}>
                        <View style={styles.actionIcon}>
                            <Icon name="star-outline" size={14} color={Colors.primary} />
                        </View>
                        <View style={styles.actionIcon}>
                            <Icon name="favorite-outline" size={14} color={Colors.primary} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default DoctorDetailCard

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: Colors.textLightGray,
        width: 360,
        height: 360,
        borderRadius: 20,
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 30,
        marginVertical: 20,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    avatarContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        backgroundColor: Colors.textWhite,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
        resizeMode: 'contain',
    },
    headerInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 5,
        maxWidth: 130,
    },
    experienceContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 5,
        maxWidth: 130,
        borderRadius: 18,
        backgroundColor: Colors.primary,
    },
    experienceIcon: {
        marginRight: 5,
        resizeMode: 'cover',
        width: 25,
        height: 25,
    },
    headerText: {
        fontSize: 12,
        color: Colors.textWhite,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    focusLabel: {
        fontSize: 12,
        color: Colors.textWhite,
        fontWeight: 'bold',
    },
    focusContainer: {
        backgroundColor: Colors.primary,
        borderRadius: 18,
        padding: 10,
        maxWidth: 130,
        maxHeight: 130,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    infoSection: {
        flexDirection: 'column',
        backgroundColor: Colors.textWhite,
        borderRadius: 13,
        padding: 10,
        marginTop: 10,
        maxHeight: 70,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'medium',
        color: Colors.primary,
    },
    specialtyText: {
        fontSize: 12,
        color: Colors.textBlack,
        fontWeight: 'light',
    },
    locationText: {
        fontSize: 12,
        color: Colors.textBlack,
        fontWeight: 'medium',
        paddingTop: 3,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        gap: 10,
    },
    ratingCommentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    statItemSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: Colors.textWhite,
        borderRadius: 13,
        paddingHorizontal: 8,
        paddingVertical: 8,
        flex: 1,
        justifyContent: 'center',
        maxHeight: 30,
    },
    statItemLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: Colors.textWhite,
        borderRadius: 13,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1.5,
        justifyContent: 'center',
        maxHeight: 30,
    },
    statText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: 'light',
    },
    actionsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
    },
    bookingButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        backgroundColor: Colors.primary,
        borderRadius: 13,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    bookingText: {
        fontSize: 13,
        color: Colors.textWhite,
        fontWeight: 'light',
    },
    actionsRight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    actionIcon: {
        backgroundColor: Colors.textWhite,
        borderRadius: '50%',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
})