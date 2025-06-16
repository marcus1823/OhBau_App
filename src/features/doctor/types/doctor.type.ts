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
    totalPages: number; // int32
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

  export interface CreateBookingRequest {
    dotorSlotId: string;
    bookingModule?: string;
    description?: string;
    fullName?: string;
    yearOld?: number; // int32
    address?: string;
    phone?: string;
    date: string; //($date)
  }

  export interface CreateBookingResponse {
    id: string;
    parentId: string;
    doctorSlotId: string;
    type?: string; 
    bookingModule?: string;
    description?: string;
    fullName?: string;
    yearOld?: number; // int32
    address?: string;
    phone?: string;
    date: string; //($date)
  }

export interface CreateBookingResponseBaseResponse {
    status: string;
    message: string;
    data: CreateBookingResponse;
}

export interface GetBookingRequest {
  page: number;
  size: number;
}

export interface GetBookingResponse {
  id: string; // Add this field
  parent: GetParentResponse;
  type? : string; 
  bookingModule?: string;
  bookingCode?: string; // You might want to add this field as well from your JSON
  description?: string;
  date: string; //($date)
  doctor: GetDoctorResponse;
  slot: SlotResponse;
}


export interface GetParentResponse {
  id?: string;
  fullName?: string;
  dob?: string; //($date)
  getMotherHealthResponse?: GetMotherHealthResponse;
}

export interface GetMotherHealthResponse {
  weith?: number;
  bloodPressure?: number;
}

export interface FeedBackBookingRequest {
  bookingId: string;
  doctorId: string;
  rating: number; 
  content: string;
}

export interface FeedBackBookingResponse {
  id: string;
  bookingId: string;
  doctorId: string;
  rating: number; 
  content: string;
}