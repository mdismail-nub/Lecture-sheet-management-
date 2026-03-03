export interface Course {
  id: number;
  courseName: string;
  courseCode: string;
  department: string;
  description: string;
  materialCount?: number;
}

export interface Material {
  id: number;
  courseId: number;
  title: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  uploadedAt: string;
  courseName?: string;
  courseCode?: string;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface SearchResults {
  courses: Course[];
  materials: Material[];
}
