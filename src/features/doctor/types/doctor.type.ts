export interface GetDoctorResponse {
    id: string;
    fullName: string;
    avatar: string;
    address: string;
    major: string;
}

export interface GetDoctorRequest {
    pageSize: number; // int32
    pageNumber: number; // int32
    doctorName?: string;
}

export interface GetDoctorResponsePaginate {
    size: number; // int32
    page: number; // int32
    total: number; // int32
    totalPage: number; // int32
    items?: GetDoctorResponse[];
}


export interface GetDoctorsResponsePaginateBaseResponse {
    status: string;
    message: string;
    data: GetDoctorResponsePaginate;
}

export interface GetDoctorByIdRequest {
    doctorID: string;
}

export interface GetDoctorByIdResponse {
    id: string;
    fullName: string;
    avatar: string;
    majorId: string;
    major: string;
    dob: string;
    gender: string;
    content: string;
    address: string;
    email: string;
    phone: string;
    active: boolean;
}

export interface GetDoctorByIdResponseBaseResponse {
    status: string;
    message: string;
    data: GetDoctorByIdResponse;
  }