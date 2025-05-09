import Toast from "react-native-toast-message"
import { toastStyles } from "../../assets/styles/toastStyle"


export const useToast = () => {
    const showSuccess = (message: string) => {
        Toast.show({
            ...toastStyles.successToast,
            text2: message,
        })
    }

    const showError = (message: string) => {
        Toast.show({
            ...toastStyles.errorToast,
            text2: message,
        })
    }

    const showWarning = (message: string) => {
        Toast.show({
            ...toastStyles.warningToast,
            text2: message,
        })
    }

    const showInfo = (message: string) => {
        Toast.show({
            ...toastStyles.infoToast,
            text2: message,
        })
    }



    return { showSuccess, showInfo, showError, showWarning }    
}