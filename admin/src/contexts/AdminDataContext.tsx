import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Book, IssuedBook, DashboardStats } from '@/types/admin';
import { mockStudents, mockBooks, mockIssuedBooks } from '@/data/mockData';

interface AdminDataContextType {
  students: Student[];
  books: Book[];
  issuedBooks: IssuedBook[];
  stats: DashboardStats;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addBook: (book: Omit<Book, '_id' | 'addedDate' | 'rating' | 'reviewCount'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  issueBook: (studentId: string, bookId: string) => void;
  returnBook: (issueId: string) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>(mockIssuedBooks);

  const calculateStats = (): DashboardStats => {
    const today = new Date();
    const overdueBooks = issuedBooks.filter(
      (issue) => !issue.isreturned && new Date(issue.dueDate) < today
    ).length;
    const totalFineCollected = issuedBooks.reduce((acc, issue) => acc + issue.fine, 0);
    const booksIssued = issuedBooks.filter((issue) => !issue.isreturned).length;

    return {
      totalStudents: students.length,
      totalBooks: books.reduce((acc, book) => acc + book.totalcopies, 0),
      booksIssued,
      overdueBooks,
      totalFineCollected,
    };
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: `${Date.now()}`,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, ...studentData } : student))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const addBook = (book: Omit<Book, '_id' | 'addedDate' | 'rating' | 'reviewCount'>) => {
    const newBook: Book = {
      ...book,
      _id: `${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0],
      rating: 0,
      reviewCount: 0,
    };
    setBooks((prev) => [...prev, newBook]);
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((book) => (book._id === id ? { ...book, ...bookData } : book))
    );
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book._id !== id));
  };

  const issueBook = (studentId: string, bookId: string) => {
    const student = students.find((s) => s.id === studentId);
    const book = books.find((b) => b._id === bookId);

    if (!student || !book || book.availablecopies <= 0) return;

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days lending period

    const newIssue: IssuedBook = {
      id: `${Date.now()}`,
      userId: studentId,
      bookId,
      bookTitle: book.title,
      studentName: student.name,
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      isreturned: false,
      fine: 0,
    };

    setIssuedBooks((prev) => [...prev, newIssue]);
    setBooks((prev) =>
      prev.map((b) =>
        b._id === bookId ? { ...b, availablecopies: b.availablecopies - 1 } : b
      )
    );
  };

  const returnBook = (issueId: string) => {
    const issue = issuedBooks.find((i) => i.id === issueId);
    if (!issue) return;

    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    let fine = 0;

    if (today > dueDate) {
      const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      fine = daysOverdue * 10; // $10 per day
    }

    setIssuedBooks((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? { ...i, isreturned: true, returnDate: today.toISOString().split('T')[0], fine }
          : i
      )
    );

    setBooks((prev) =>
      prev.map((b) =>
        b._id === issue.bookId ? { ...b, availablecopies: b.availablecopies + 1 } : b
      )
    );
  };

  return (
    <AdminDataContext.Provider
      value={{
        students,
        books,
        issuedBooks,
        stats: calculateStats(),
        addStudent,
        updateStudent,
        deleteStudent,
        addBook,
        updateBook,
        deleteBook,
        issueBook,
        returnBook,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
