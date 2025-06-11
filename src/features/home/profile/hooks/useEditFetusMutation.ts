import { useMutation } from "@tanstack/react-query";
import { EditFetusBaseResponse, EditFetusRequest } from "../../types/family.type";

import { EditFetusDetailBaseResponse, EditFetusDetailRequest } from "../../types/family.type";
import { editFetusDetailApi } from "../../api/familyApi";
import { editFetusApi } from "../../api/familyApi";


export const useEditFetusMutation = () => {
    return useMutation<
        EditFetusBaseResponse,
        Error,
        { id: string; request: EditFetusRequest; accessToken: string }
    >({
        mutationFn: ({ id, request, accessToken }) =>
            editFetusApi(id, accessToken, request), 
    });
};

export const useEditFetusDetailMutation = () => {
    return useMutation<
        EditFetusDetailBaseResponse,
        Error,
        { id: string; request: EditFetusDetailRequest; accessToken: string }
    >({
        mutationFn: ({ id, request, accessToken }) =>
            editFetusDetailApi(id, accessToken, request),
    });
};