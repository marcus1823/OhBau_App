
export interface Fetus {
  id: string;
  startDate: string;
  endDate: string;
  name: string;
  code: string;
  fetusDetails: FetusDetail[];
}

export interface FetusDetail {
  id: string;
  weekly: number;
  weight: number;
  height: number;
  gsd: number;
  bpm: number;
  movement: number | null;
  crl: number;
  bpd: number;
  fl: number;
  hc: number;
  ac: number;
}

export interface EditFetusRequest {
  startDate?: string; // $date
  endDate?: string; // $date
  name?: string; // nullable: true
}

export interface EditFetusResponse {
  startDate: string; // $date
  endDate: string; // $date
  name: string; // nullable: true
  code: string; // nullable: true
}
export interface EditFetusBaseResponse {
  status: string; // nullable: true
  message: string; // nullable: true
  data?: EditFetusResponse; // nullable: true
}


export interface EditFetusDetailRequest {
  weekly?: number; // nullable: true
  weight?: number; // nullable: true
  height?: number; // nullable: true
  bpm?: number; // nullable: true
  gsd?: number; // nullable: true
  movement?: number; // nullable: true
  crl?: number; // nullable: true
  bpd?: number; // nullable: true
  fl?: number; // nullable: true
  hc?: number; // nullable: true
  ac?: number; // nullable: true
}

export interface EditFetusDetailResponse {
  id: string; // $uuid
  weekly: number; // nullable: true
  weight: number; // nullable: true
  height: number; // nullable: true
  bpm: number; // nullable: true
  gsd: number; // nullable: true
  movement: number; // nullable: true
  crl: number; // nullable: true
  bpd: number; // nullable: true
  fl: number; // nullable: true
  hc: number; // nullable: true
  ac: number; // nullable: true  
}

export interface EditFetusDetailBaseResponse {
  status: string; // nullable: true
  message: string; // nullable: true
  data?: EditFetusDetailResponse; // nullable: true
}

export interface ParentRelationResponse {
  status: string;
  message: string;
  data: {
    father: null | unknown;
    mother: null | unknown;
    fetuses: Fetus[];
  };
}

export interface FetusDetailResponse {
  status: string;
  message: string;
  data: Fetus;
}

export interface CreateFetusRequest {
  startDate?: string; // $date
  endDate?: string; // $date
  name?: string; // nullable: true
  weight?: number; // nullable: true
  height?: number; // nullable: true
}

export interface CreateFetusResponse {
  id: string; // $uuid
  startDate: string; // $date
  endDate: string; // $date
  name: string; // nullable: true
  code: string; // nullable: true
}

export interface CreateFetusResponseBaseResponse {
  status: string; // nullable: true
  message: string; // nullable: true
  data?: CreateFetusResponse; // nullable: true
}