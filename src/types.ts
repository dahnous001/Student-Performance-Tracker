export interface TeacherInfo {
  name: string;
  schoolLogo: string;
  appName: string;
}

export interface Grade {
  id: string;
  name: string;
  class?: string;
}

export interface Student {
  id: string;
  name: string;
  gradeId: string;
  email?: string;
  picture?: string;
}

export type AssignmentType = 'homework' | 'classwork' | 'worksheet' | 'project';

export interface Assignment {
  id: string;
  type: AssignmentType;
  name: string;
  number: string;
  date: string;
  weekNumber: number;
  gradeId: string;
  studentIds: string[];
}