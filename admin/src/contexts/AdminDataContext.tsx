import React, { createContext, useContext, useState, ReactNode,useEffect } from 'react';
import { Student, Book, IssuedBook, DashboardStats } from '@/types/admin';
import { toast } from 'sonner';
import axios from 'axios';
import { get } from 'http';

interface AdminDataContextType {
  atoken: boolean ;
  students: Student[];
  books: Book[];
  issuedBooks: IssuedBook[];
  stats: DashboardStats;
  addStudent: (student: FormData) => void;
  updateStudent: (id: string, student: FormData) => void;
  deleteStudent: (id: string) => void;
  addBook: (book: FormData) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  issueBook: (studentId: string, bookId: string) => void;
  returnBook: (issueId: string) => void;
  adminlogin: (email: string, password: string) => void;
  logoutadmin:()=>void;
  getstudents:()=>void;
  getissuedbooks:()=>void;
}

interface responce{
  success: boolean;
  token?: string;
  message?: string;
  data:string[];
}
interface studentsresponce{
  success: boolean;
  students?: Student[];
  message?: string;
}
interface booksresponce{
  success: boolean;
  books?: Book[];
  message?: string;
}
interface issuedbooksresponce{
  success: boolean;
  issuedBooks?: IssuedBook[];
  message?: string;
}
interface studentresponce{
  success: boolean;
  message?: string;
}
interface bookresponce{
  success: boolean;
  message?: string;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);

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
  const getstudents=async()=>{
    try{
      const {data}=await axios.get<studentsresponce>(backendUrl+"admin/getstudents",{withCredentials:true});
      if(data.success && data.students){
        setStudents(data.students);
      }else{
        toast.error(data.message || "Failed to fetch students.");
      }
    }catch(err){ 
      console.log(err);
      toast.error("Failed to fetch students. Please try again.");
    }
  }
  const getbooks=async()=>{
    try{
      const {data}=await axios.get<booksresponce>(backendUrl+"admin/getbooks",{withCredentials:true});
      if(data.success && data.books){
        setBooks(data.books);
      }else{
        toast.error(data.message || "Failed to fetch books.");
      }
    }catch(err){ 
      console.log(err);
      toast.error("Failed to fetch books. Please try again.");
    }
  }
  const getissuedbooks=async()=>{
    try{
      const {data}=await axios.get<issuedbooksresponce>(backendUrl+"admin/getissuedbooks",{withCredentials:true});
      if(data.success && data.issuedBooks){
        setIssuedBooks(data.issuedBooks);
      }else{
        toast.error(data.message || "Failed to fetch issued books.");
      }
    }catch(err){ 
      console.log(err);
      toast.error("Failed to fetch issued books. Please try again.");
    }
  }
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

  const addStudent = async(student: FormData) => {
    const {data}=await axios.post<studentresponce>(backendUrl+"admin/addstudent",student,{withCredentials:true});
    if(data.success){
      getstudents();
      toast.success("Student added successfully!");
    }else{
      toast.error(data.message || "Failed to add student.");
    }
  };

const updateStudent = async (id: string, formData: FormData) => {
    try {
      // Ensure _id is in the FormData
      if (!formData.has('_id')) {
        formData.append('_id', id);
      }

      const response = await axios.post(`${backendUrl}admin/updatestudent`, formData, {
        withCredentials: true
      });

     

      if (response.data.success) {
        getstudents(); // Refresh the list
      } else {
        throw new Error(response.data.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  const deleteStudent = (_id: string) => {
    setStudents((prev) => prev.filter((student) => student._id !== _id));
  };

  const addBook = async(book: FormData) => {
    const {data}=await axios.post<bookresponce>(backendUrl+"admin/addbook",book,{withCredentials:true});
    if(data.success){
      getbooks();
      toast.success("Book added successfully!");
    }else{
      toast.error(data.message || "Failed to add book.");
    }
  };

  const updateBook = (_id: string, bookData: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((book) => (book._id === _id ? { ...book, ...bookData } : book))
    );
  };


  const deleteBook = (_id: string) => {
    setBooks((prev) => prev.filter((book) => book._id !== _id));
  };

  const issueBook = async(studentId: string, bookId: string) => {
    try{
      const {data}= await axios.post(backendUrl+'admin/issuebook',{studentId,bookId},{withCredentials:true})
      if(data.success){
        toast.message("Book issued Successfully")
        getissuedbooks()

      }
      else{
        console.log(data.message)
        toast.message(data.message)
      }
      
    }catch(err){
      console.log(err)
      toast.error("Failed to issued a book")
    }
   
  };

  const returnBook = (issueId: string) => {
    const issue = issuedBooks.find((i) => i._id === issueId);
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
        i._id === issueId
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
  getstudents();
  getbooks();
  getissuedbooks();
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
        logoutadmin,
        getissuedbooks,
        getstudents
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
