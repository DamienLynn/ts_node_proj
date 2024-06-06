interface StandardJsonFormat {
    status: string;
    status_code: number;
    message: string | '';
    errors: {
        message: string | null;
        data: object | null;
    } | null;
    payload: {
        data: object | null;
        metadata: object;
    } | null;
}

export const handleResponse = (
    statusCode: number,
    data: object | null,
    metadata: object,
    successMessage: string
): StandardJsonFormat => {
    const resFormat: StandardJsonFormat = {
        status: 'success',
        status_code: statusCode,
        message: successMessage,
        payload: {
            data: data,
            metadata: metadata
        },
        errors: null
    };

    return resFormat;
};

export const handleError = (
    statusCode: number,
    errorMessage: string | null,
    errorData: object | null
): StandardJsonFormat => {
    const resFormat: StandardJsonFormat = {
        status: 'error',
        status_code: statusCode,
        message: 'Error occurred',
        errors: {
            message: errorMessage,
            data: errorData
        },
        payload: null
    };

    return resFormat;
};