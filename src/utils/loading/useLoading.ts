import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { clearContextLoading, setContextLoading, setGlobalLoading } from "./loadingSlice";

export const useLoading = () => {
    const dispatch = useDispatch();
    const globalLoading = useSelector((state: RootState) => state.loading.globalLoading);
    const contextLoading = useSelector((state: RootState) => state.loading.contextLoading);

    const showGlobalLoading = () => {
        dispatch(setGlobalLoading(true));
    };

    const hideGlobalLoading = () => {
        dispatch(setGlobalLoading(false));
    };

    const showContextLoading = (context: string) => {
        dispatch(setContextLoading({ context, isLoading: true }));
    };

    const hideContextLoading = (context: string) => {
        dispatch(setContextLoading({ context, isLoading: false }));
        dispatch(clearContextLoading(context));
    };

    const isContextLoading = (context: string) => {
        return !!contextLoading[context];
    };

    return {
        showGlobalLoading,
        hideGlobalLoading,
        showContextLoading,
        hideContextLoading,
        isContextLoading,
        globalLoading,
        contextLoading,
    };
};