import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';

interface PrimaryHeaderProps {
    roleTitle?: string;
    title?: string;
    disableBackButton?: boolean;
    onBackButtonPress?: () => void;
    searchButton?: boolean;
    onSearchButtonPress?: () => void;
    filterButton?: boolean;
    onFilterButtonPress?: () => void;
}

const PrimaryHeader: React.FC<PrimaryHeaderProps> = ({
    roleTitle,
    title = '',
    disableBackButton = false,
    onBackButtonPress,
    searchButton = false,
    onSearchButtonPress,
    filterButton = false,
    onFilterButtonPress,
}) => {
    // Dynamic title construction
    const displayTitle = roleTitle ? `${roleTitle} ơi, ${title}` : title;

    return (
        <View style={styles.headerContainer}>
            {/* Back Button */}
            {!disableBackButton && (
                <TouchableOpacity onPress={onBackButtonPress} style={styles.backButton}>
                    <Icon name="arrow-left" size={42} color={Colors.primary} />
                </TouchableOpacity>
            )}

            {/* Title */}
            <Text style={styles.title}>{displayTitle}</Text>

            {/* Right-side Buttons (Search and Filter) */}
            <View style={styles.rightButtons}>
                {searchButton && (
                    <TouchableOpacity onPress={onSearchButtonPress} style={styles.iconButton}>
                        <Icon name="search" size={20} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                )}
                {filterButton && (
                    <TouchableOpacity onPress={onFilterButtonPress} style={styles.iconButton}>
                        <Icon name="filter-list" size={20} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default PrimaryHeader;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    backButton: {
        // padding: 5,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: Colors.primary,
        flex: 1,
        textAlign: 'center',
        marginLeft: -20,
    },
    rightButtons: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    icon: {
        textAlign: 'center',
    },
});