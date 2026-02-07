// This file was renamed from backendContext.tsx to appContext.tsx
import React, { createContext, useContext, ReactNode,useState ,useEffect} from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';
interface checkauthresponse{
  success:boolean;
  message:string;
}
interface AppContextProps {
  baseUrl: string;
  token: Boolean;
  settoken: React.Dispatch<React.SetStateAction<Boolean>>;
  checkauth:()=>Promise<void>;
  login:(redg:string,password:string)=>Promise<void>;
  logout:()=>Promise<void>;
  student:student | null;
  setstudent:React.Dispatch<React.SetStateAction<student | null>>;
  getstudentdata:()=>Promise<void>;
  books:book[] | null;
  setbooks:React.Dispatch<React.SetStateAction<book[] | null>>;
  getallbooks:()=>Promise<void>;
}
interface student{
  name:string;
  redg:string;
  email:string;
  branch:string;
  course:string;
  profilepicurl:string;
}
interface getstudentdataresponse{
  success:boolean;
  message:string;
  data:student;
}
interface book{
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
}
interface getallbooksresponse{
  success:boolean;
  message:string;
  data:book[];
}
const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:4000'; // Change to your backend URL
  const [token, settoken] = useState<Boolean>(false)
  const [student, setstudent] = useState<student >()
  const [books, setbooks] = useState<book[]>([])
  const checkauth=async()=>{
    try{
      const {data}=await axios.get<checkauthresponse>(`${baseUrl}/api/student/checkauth`,{withCredentials:true});
      if(data.success){
        settoken(true);
        console.log("User is authenticated");
      }else{
        settoken(false);
      }
    }catch(err){
      console.log(err);
    }
  }
  const login=async(redg:string,password:string)=>{
    try{
      const {data}=await axios.post(`${baseUrl}/api/student/login`,{redg,password},{withCredentials:true});
      if(data.success){
        settoken(true);
        toast.success("Login successful! Welcome to SmartLib.");
        navigate("/dashboard");
      }else{
        toast.error("Login failed");
      }
    }catch(err){
      console.log(err);
    }
  }
  const logout=async()=>{
    try{
      const {data}=await axios.get(`${baseUrl}/api/student/logout`,{withCredentials:true});
      if(data.success){
        settoken(false);
        toast.success("Logout successful!");
        navigate("/login");
      }else{
        toast.error("Logout failed");
      }
    }catch(err){
      console.log(err);
    }
  }
  const getstudentdata=async()=>{
    try{
      const {data}=await axios.get<getstudentdataresponse>(`${baseUrl}/api/student/studentdetails`,{withCredentials:true});
      if(data.success){
        setstudent(data.data);
      }else{
        toast.error("Failed to fetch student data");
      }
    }catch(err){
      console.log(err);
    }
  }
  const getallbooks=async()=>{
    try{
      const {data}=await axios.get<getallbooksresponse>(`${baseUrl}/api/student/allbooks`);
      if(data.success){
        // Normalize book properties for frontend compatibility
        const normalizedBooks = data.data.map((book: any) => ({
          _id: book._id || book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          summary: book.summary,
          coverImageUrl: book.coverImageUrl || book.coverImage,
          rating: book.rating,
          reviewCount: book.reviewCount,
          totalcopies: book.totalcopies ?? book.totalCopies ?? 0,
          availablecopies: book.availablecopies ?? book.availableCopies ?? 0,
          keywords: book.keywords,
          addedDate: book.addedDate,
          expectedAvailability: book.expectedAvailability
        }));
        setbooks(normalizedBooks);
      }else{
        toast.error("Failed to fetch books data");
      }
    }catch(err){
      toast.error("Failed to fetch books data");
      console.log(err);
    }
  }
  useEffect(() => {
    checkauth();
    getstudentdata();

  }, [token])
  useEffect(() => {
      getallbooks();
     }, [])

  return (
    <AppContext.Provider value={{ baseUrl, token, settoken, checkauth, login,logout, student, getstudentdata ,setstudent,books,getallbooks,setbooks}}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
