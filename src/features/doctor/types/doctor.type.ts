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
    experence: string[];
    focus: string[];
    medicalProfile: string[];
    careerPath: string[];
    outStanding: string[];
    totalFeedbacks: number; 
    rating: number; 
    workSchedule: string[]
}

export interface GetDoctorByIdResponseBaseResponse {
    status: string;
    message: string;
    data: GetDoctorByIdResponse;
  }

//   https://ohbau.cloud/api/v1/doctor-slot/3c26ab90-01e2-47f6-882f-3da0d93ba57d/user?date=2025%2F04%2F25
  export interface GetDoctorSlotRequest {
      doctorID: string;
      date: string;
  }

  export interface SlotResponse {
        id: string;
        name?: string; 
        startTime: string; //($time)
        endTime: string; //($time)
  }

  export interface GetDoctorSlotResponse {
    id: string;
    slot: SlotResponse;
    isBooking: boolean; 
  }

  export interface GetDoctorSlotForUserResponse {
    name?: string;
    doctorSlots : GetDoctorSlotResponse[];
  }

  export interface GetDoctorSlotForUserResponseBaseResponse {
    status: string;
    message: string;
    data: GetDoctorSlotForUserResponse;
  }