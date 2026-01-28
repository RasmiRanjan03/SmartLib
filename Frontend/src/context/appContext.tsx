// This file was renamed from backendContext.tsx to appContext.tsx
import React, { createContext, useContext, ReactNode,useState ,useEffect} from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
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
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:4000'; // Change to your backend URL
  const [token, settoken] = useState<Boolean>(false)
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
      const {data}=await axios.post("http://localhost:4000/api/student/login",{redg,password},{withCredentials:true});
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
  useEffect(() => {
    checkauth();


  }, [token])

  return (
    <AppContext.Provider value={{ baseUrl, token, settoken, checkauth, login }}>
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
