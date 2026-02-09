export interface Student {
  _id: string;
  name: string;
  redg: string;
  course: string;
  branch: string;
  profilepicurl: string;
  email: string;
  password: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  coverImageUrl: string;
  rating: number;
  reviewCount: number;
  totalcopies: number;
  availablecopies: number;
  keywords: string[];
  addedDate: string;
  expectedAvailability?: string;
}

export interface IssuedBook {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  isreturned: boolean;
  fine: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalBooks: number;
  booksIssued: number;
  overdueBooks: number;
  totalFineCollected: number;
}
