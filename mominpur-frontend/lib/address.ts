"use client";

export interface ThanaData {
  id: number;
  thanaName: string;
  thana: string;
}

export interface DistrictData {
  desId: number;
  desname: string;
  district: string;
  thanas: ThanaData[];
}

export interface DivisionData {
  id: number;
  dname: string;
  division: string;
  districts: DistrictData[];
}

export const fetchDivisions = async (): Promise<DivisionData[]> => {
  try {
    const res = await fetch("/api/location/divisions");
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
