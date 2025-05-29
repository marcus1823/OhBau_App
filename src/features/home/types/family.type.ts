
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
  crl: number;
  bpd: number;
  fl: number;
  hc: number;
  ac: number;
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