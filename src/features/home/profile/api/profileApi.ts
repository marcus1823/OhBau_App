import rootApi from "../../../../apis/rootApi";

export const getProfileApi = async (accessToken: string) => {
    console.log('getProfileApi called');
    if (!accessToken) {
        throw new Error('Access token không tồn tại. Vui lòng đăng nhập lại.');
    }
    try {
        const response = await rootApi.get('/account/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                accept: 'application/json',
            },
        });

        console.log('getProfileApi response:', response);

        if (!response.data?.data) {
            throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
        }

        return response.data.data;
    }
    catch (error) {
        const errorDetails = {
            message: error instanceof Error ? error.message : 'Unknown error',
            response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
            status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
        };
        console.error('getProfileApi error:', errorDetails);
        throw new Error(
            error instanceof Error
                ? `Failed to get profile: ${error.message}`
                : 'Failed to get profile: Unknown error'
        );
    }
}