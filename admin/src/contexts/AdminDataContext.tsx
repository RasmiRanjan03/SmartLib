import React, { createContext, useContext, useState, ReactNode,useEffect } from 'react';
import { Student, Book, IssuedBook, DashboardStats } from '@/types/admin';
import { mockStudents, mockBooks, mockIssuedBooks } from '@/data/mockData';
import { toast } from 'sonner';
import axios from 'axios';

interface AdminDataContextType {
  atoken: boolean ;
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
  adminlogin: (email: string, password: string) => void;
  logoutadmin:()=>void;
}
interface responce{
  success: boolean;
  token?: string;
  message?: string;
  data:string[];
}
const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const backendUrl = "http://localhost:4000/api/";
  const [atoken, setAtoken] = useState(false);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>(mockIssuedBooks);

  const adminlogin = async (email: string, password: string) => {
    
    try{
      const {data}=await axios.post(backendUrl+"admin/adminlogin",{email,password},{withCredentials:true});
      if(data.success){
        setAtoken(true);
        toast.success("Login successful!");
      }else{
        toast.error(data.message || "Login failed.");
      }
    }catch(err){
      console.error("Login failed:", err);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };
const logoutadmin=async()=>{ 
  try{
    await axios.get(backendUrl+"admin/logoutadmin",{withCredentials:true});
    setAtoken(false);
    toast.success("Logged out successfully!");
  }catch(err){
    console.error("Logout failed:", err);
    toast.error("Logout failed. Please try again.");
  }
}
  const checkadmin = async () => {
    try{
      const {data}=await axios.get(backendUrl+"admin/checkadmin",{withCredentials:true});
      if(data.success){
        setAtoken(true);
      }else{
        setAtoken(false);
      }
    }catch(err){
      console.error("Admin check failed:", err);
      setAtoken(false);
    }
  };
  
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

  const addStudent = (student: Omit<Student, '_id'>) => {
    const newStudent: Student = {
      ...student,
      _id: `${Date.now()}`,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (_id: string, studentData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) => (student._id === _id ? { ...student, ...studentData } : student))
    );
  };

  const deleteStudent = (_id: string) => {
    setStudents((prev) => prev.filter((student) => student._id !== _id));
  };

  const addBook = (book: Omit<Book, '__id' | 'addedDate' | 'rating' | 'reviewCount'>) => {
    const newBook: Book = {
      ...book,
      _id: `${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0],
      rating: 0,
      reviewCount: 0,
    };
    setBooks((prev) => [...prev, newBook]);
  };

  const updateBook = (_id: string, bookData: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((book) => (book._id === _id ? { ...book, ...bookData } : book))
    );
  };

  const deleteBook = (_id: string) => {
    setBooks((prev) => prev.filter((book) => book._id !== _id));
  };

  const issueBook = (studentId: string, bookId: string) => {
    const student = students.find((s) => s._id === studentId);
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
useEffect(() => {
  checkadmin();
}, [atoken])

  return (
    <AdminDataContext.Provider
      value={{
        atoken,
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
        adminlogin,
        logoutadmin
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
