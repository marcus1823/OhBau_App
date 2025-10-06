import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../../../../components/common/Header/PrimaryHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../stores/store';
import FormInput from '../../../../../auth/components/FormInput';
import DatePickerComponent from '../../../../../auth/components/DatePicker';
import ButtonAction from '../../../../../auth/components/ButtonAction';
import
    {
        validateRequired,
        validateDateRequired,
        formatDateToString,
    } from '../../../../../../utils/validations/validations';
import { useToast } from '../../../../../../utils/toasts/useToast';
import { useCreateParentMutation } from '../../../hooks/useCreateParentMutation';
import { useCreateFetusMutation } from '../../../hooks/useCreateFetusMutation';
import { RegisterParentRequest } from '../../../../../auth/types/auth.types';
import { CreateFetusRequest } from '../../../../types/family.type';
import { useQueryClient } from '@tanstack/react-query';

const AddFamilyMemberScreen = ( { navigation }: any ) =>
{

    const queryClient = useQueryClient();
    // Default to Fetus if role is MOTHER
    const role = useSelector( ( state: RootState ) => state.auth.role );
    const [ formType, setFormType ] = useState<'Parent' | 'Fetus'>( role === 'FATHER' ? 'Parent' : 'Fetus' );
    const [ fullName, setFullName ] = useState( '' );
    const [ dob, setDob ] = useState<Date | null>( null );
    const [ name, setName ] = useState( '' );
    const [ startDate, setStartDate ] = useState<Date | null>( null );
    const [ endDate, setEndDate ] = useState<Date | null>( null );
    const [ weight, setWeight ] = useState<string>( '' );
    const [ height, setHeight ] = useState<string>( '' );

    const { showError, showSuccess } = useToast();
    const accessToken = useSelector( ( state: RootState ) => state.auth.accessToken );

    // Mutations
    const { mutateAsync: createParent, isPending: isParentPending } = useCreateParentMutation();
    const { mutateAsync: createFetus, isPending: isFetusPending } = useCreateFetusMutation();

    // Validation for Parent form
    const validateParentForm = (): boolean =>
    {
        if ( !accessToken )
        {
            showError( 'Vui lòng đăng nhập để tiếp tục' );
            return false;
        }
        if ( role !== 'FATHER' )
        {
            showError( 'Chỉ có vai trò Bố mới có thể thêm phụ huynh' );
            return false;
        }
        const fullNameError = validateRequired( fullName, 'họ và tên' );
        const dobError = validateDateRequired( dob, 'ngày sinh' );

        if ( fullNameError )
        {
            showError( fullNameError );
            return false;
        }
        if ( dobError )
        {
            showError( dobError );
            return false;
        }
        return true;
    };

    // Validation for Fetus form
    const validateFetusForm = (): boolean =>
    {
        if ( !accessToken )
        {
            showError( 'Vui lòng đăng nhập để tiếp tục' );
            return false;
        }
        const nameError = validateRequired( name, 'tên thai nhi' );
        const startDateError = validateDateRequired( startDate, 'ngày bắt đầu mang thai' );
        const endDateError = validateDateRequired( endDate, 'ngày dự sinh' );
        const weightError =
            weight && ( isNaN( parseFloat( weight ) ) || parseFloat( weight ) <= 0 )
                ? 'Cân nặng phải là số dương hợp lệ'
                : null;
        const heightError =
            height && ( isNaN( parseFloat( height ) ) || parseFloat( height ) <= 0 )
                ? 'Chiều cao phải là số dương hợp lệ'
                : null;

        if ( nameError )
        {
            showError( nameError );
            return false;
        }
        if ( startDateError )
        {
            showError( startDateError );
            return false;
        }
        if ( endDateError )
        {
            showError( endDateError );
            return false;
        }
        if ( weightError )
        {
            showError( weightError );
            return false;
        }
        if ( heightError )
        {
            showError( heightError );
            return false;
        }
        if ( startDate && endDate && endDate <= startDate )
        {
            showError( 'Ngày dự sinh phải sau ngày bắt đầu mang thai' );
            return false;
        }
        return true;
    };

    const handleCreateFamilyMember = async () =>
    {
        if ( !validateParentForm() ) { return; }

        const request: RegisterParentRequest = {
            fullName,
            dob: formatDateToString( dob! ),
        };

        await createParent(
            { request, accessToken: accessToken! },
            {
                onSuccess: () =>
                {
                    showSuccess( 'Thêm phụ huynh thành công!' );
                    queryClient.invalidateQueries( { queryKey: [ 'parentRelation' ] } );
                    navigation.goBack();
                },
                onError: ( error ) =>
                {
                    showError( 'Lỗi khi thêm phụ huynh: ' + error.message );
                },
            }
        );
    };

    const handleCreateFetus = async () =>
    {
        if ( !validateFetusForm() ) { return; }

        const request: CreateFetusRequest = {
            name,
            startDate: formatDateToString( startDate! ),
            endDate: formatDateToString( endDate! ),
            weight: weight ? parseFloat( weight ) : undefined,
            height: height ? parseFloat( height ) : undefined,
        };

        await createFetus(
            { request, accessToken: accessToken! },
            {
                onSuccess: () =>
                {
                    showSuccess( 'Thêm thai nhi thành công!' );
                    queryClient.invalidateQueries( { queryKey: [ 'fetusByCode' ] } );
                    navigation.goBack();
                },
                onError: ( error ) =>
                {
                    showError( 'Lỗi khi thêm thai nhi: ' + error.message );
                },
            }
        );
    };

    return (
        <LinearGradient colors={ Gradients.backgroundPrimary } style={ styles.container }>
            <PrimaryHeader
                title="Thêm thành viên"
                onBackButtonPress={ () => navigation.goBack() }
            />
            <ScrollView contentContainerStyle={ styles.scrollContent }>
                <View style={ styles.contentContainer }>
                    { role === 'FATHER' && (
                        <View style={ styles.toggleContainer }>
                            <TouchableOpacity
                                style={ [
                                    styles.toggleButton,
                                    formType === 'Parent' && styles.toggleButtonActive,
                                ] }
                                onPress={ () => setFormType( 'Parent' ) }
                            >
                                <Text
                                    style={ [
                                        styles.toggleText,
                                        formType === 'Parent' && styles.toggleTextActive,
                                    ] }
                                >
                                    Thêm phụ huynh
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ [
                                    styles.toggleButton,
                                    formType === 'Fetus' && styles.toggleButtonActive,
                                ] }
                                onPress={ () => setFormType( 'Fetus' ) }
                            >
                                <Text
                                    style={ [
                                        styles.toggleText,
                                        formType === 'Fetus' && styles.toggleTextActive,
                                    ] }
                                >
                                    Thêm thai nhi
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) }

                    <View style={ styles.formContainer }>
                        { formType === 'Parent' && role === 'FATHER' ? (
                            <>
                                <FormInput
                                    title="Họ và tên"
                                    placeholder="Nhập họ và tên"
                                    keyboardType="default"
                                    onChangeText={ ( text ) => setFullName( text ) }
                                    value={ fullName }
                                />
                                <DatePickerComponent
                                    selectedDate={ dob || new Date() }
                                    onDateChange={ ( date ) => setDob( date ) }
                                    title="Ngày sinh"
                                    placeholder="Chọn ngày sinh"
                                    allowFutureDates={ false }
                                />
                            </>
                        ) : (
                            <>
                                <FormInput
                                    title="Tên thai nhi"
                                    placeholder="Nhập tên thai nhi"
                                    keyboardType="default"
                                    onChangeText={ ( text ) => setName( text ) }
                                    value={ name }
                                />
                                <DatePickerComponent
                                    selectedDate={ startDate || new Date() }
                                    onDateChange={ ( date ) => setStartDate( date ) }
                                    title="Ngày bắt đầu mang thai"
                                    placeholder="Chọn ngày bắt đầu"
                                    allowFutureDates={ false }
                                />
                                <DatePickerComponent
                                    selectedDate={ endDate || new Date() }
                                    onDateChange={ ( date ) => setEndDate( date ) }
                                    title="Ngày dự sinh"
                                    placeholder="Chọn ngày dự sinh"
                                    allowFutureDates={ true }
                                />
                                <FormInput
                                    title="Cân nặng (kg)"
                                    placeholder="Nhập cân nặng"
                                    keyboardType="numeric"
                                    onChangeText={ ( text ) => setWeight( text ) }
                                    value={ weight }
                                />
                                <FormInput
                                    title="Chiều cao (cm)"
                                    placeholder="Nhập chiều cao"
                                    keyboardType="numeric"
                                    onChangeText={ ( text ) => setHeight( text ) }
                                    value={ height }
                                />
                            </>
                        ) }
                    </View>

                    <View style={ styles.actionContainer }>
                        <ButtonAction
                            title={ formType === 'Parent' && role === 'FATHER' ? 'Thêm phụ huynh' : 'Thêm thai nhi' }
                            backgroundColor={ Colors.primary }
                            color={ Colors.textWhite }
                            onPress={ formType === 'Parent' && role === 'FATHER' ? handleCreateFamilyMember : handleCreateFetus }
                            disabled={ formType === 'Parent' && role === 'FATHER' ? isParentPending : isFetusPending }
                        />
                        { ( isParentPending || isFetusPending ) && (
                            <Text style={ styles.loadingText }>Đang xử lý...</Text>
                        ) }
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default AddFamilyMemberScreen;

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginTop: 50,
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    toggleButtonActive: {
        backgroundColor: Colors.primary,
    },
    toggleText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    toggleTextActive: {
        color: Colors.textWhite,
        fontWeight: 'bold',
    },
    formContainer: {
        width: '100%',
        marginBottom: 20,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: Colors.primary,
        fontSize: 16,
    },
} );