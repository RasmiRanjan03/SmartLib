export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  keywords: string[];
  addedDate: string;
  expectedAvailability?: string;
}

export interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  course: string;
  branch: string;
  image: string;
  email: string;
}

export interface IssuedBook {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  isreturned: boolean;
  fine: number;
}

export const books: Book[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    genre: "Computer Science",
    summary: "A comprehensive textbook covering a broad range of algorithms in depth. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels of readers.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 234,
    totalCopies: 15,
    availableCopies: 3,
    keywords: ["algorithms", "data structures", "programming"],
    addedDate: "2024-01-15"
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Software Engineering",
    summary: "A handbook of agile software craftsmanship. This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 456,
    totalCopies: 10,
    availableCopies: 0,
    keywords: ["clean code", "software", "best practices"],
    addedDate: "2024-01-20",
    expectedAvailability: "2024-02-15"
  },
  {
    id: "3",
    title: "Design Patterns",
    author: "Gang of Four",
    genre: "Software Engineering",
    summary: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 189,
    totalCopies: 8,
    availableCopies: 2,
    keywords: ["design patterns", "OOP", "software architecture"],
    addedDate: "2024-01-22"
  },
  {
    id: "4",
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    genre: "Software Engineering",
    summary: "Your journey to mastery. Filled with technical and professional wisdom, this book illuminates the best approaches and major pitfalls of many different aspects of software development.",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 567,
    totalCopies: 12,
    availableCopies: 5,
    keywords: ["programming", "software development", "career"],
    addedDate: "2024-01-25"
  },
  {
    id: "5",
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    genre: "Database",
    summary: "Comprehensive coverage of the fundamental concepts in database systems. The book provides a solid grounding in the foundations of database technology.",
    coverImage: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&h=400&fit=crop",
    rating: 4.4,
    reviewCount: 123,
    totalCopies: 20,
    availableCopies: 8,
    keywords: ["database", "SQL", "data management"],
    addedDate: "2024-01-10"
  },
  {
    id: "6",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell",
    genre: "Artificial Intelligence",
    summary: "The leading textbook in Artificial Intelligence, used in over 1400 universities in over 120 countries. It explores the full breadth of the field.",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 345,
    totalCopies: 18,
    availableCopies: 6,
    keywords: ["AI", "machine learning", "intelligent systems"],
    addedDate: "2024-01-28"
  },
  {
    id: "7",
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    genre: "Networking",
    summary: "A classic textbook that provides a comprehensive tour of the computer networking field. It covers everything from physical layer to application layer protocols.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 234,
    totalCopies: 14,
    availableCopies: 4,
    keywords: ["networking", "protocols", "internet"],
    addedDate: "2024-01-18"
  },
  {
    id: "8",
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    genre: "Operating Systems",
    summary: "The ninth edition of this best-selling operating systems book covers the most current innovations in operating systems technologies and design.",
    coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=300&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 278,
    totalCopies: 16,
    availableCopies: 7,
    keywords: ["OS", "systems programming", "processes"],
    addedDate: "2024-01-12"
  },
  {
    id: "9",
    title: "Machine Learning",
    author: "Tom Mitchell",
    genre: "Artificial Intelligence",
    summary: "This book covers the field of machine learning, which is the study of algorithms that allow computer programs to automatically improve through experience.",
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=400&fit=crop",
    rating: 1.5,
    reviewCount: 198,
    totalCopies: 10,
    availableCopies: 2,
    keywords: ["ML", "data science", "algorithms"],
    addedDate: "2024-01-30"
  },
  {
    id: "10",
    title: "Data Structures and Algorithms in Java",
    author: "Robert Lafore",
    genre: "Computer Science",
    summary: "A comprehensive guide to data structures and algorithms using Java. Perfect for students and professionals looking to strengthen their programming fundamentals.",
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=400&fit=crop",
    rating: 4.3,
    reviewCount: 156,
    totalCopies: 12,
    availableCopies: 4,
    keywords: ["Java", "data structures", "algorithms"],
    addedDate: "2024-02-01"
  }
];

export const currentStudent: Student = {
  id: "STU001",
  name: "John Doe",
  registrationNumber: "2024CS001",
  course: "B.Tech",
  branch: "Computer Science & Engineering",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  email: "john.doe@college.edu"
};

export const issuedBooks: IssuedBook[] = [
  {
    id: "ISS001",
    userId: "STU001",
    bookId: "1",
    bookTitle: "Introduction to Algorithms",
    issueDate: "2024-01-20",
    dueDate: "2026-01-29",
    isreturned: false,
    fine: 80
  },
  {
    id: "ISS002",
    userId: "STU001",
    bookId: "4",
    bookTitle: "The Pragmatic Programmer",
    issueDate: "2024-01-15",
    dueDate: "2024-01-29",
    isreturned: false,
    fine: 50
  }
];

export const borrowingHistory: IssuedBook[] = [
  {
    id: "ISS003",
    userId: "STU001",
    bookId: "5",
    bookTitle: "Database System Concepts",
    issueDate: "2023-12-01",
    dueDate: "2023-12-15",
    returnDate: "2023-12-14",
    isreturned: true,
    fine: 0
  },
  {
    id: "ISS004",
    userId: "STU001",
    bookId: "7",
    bookTitle: "Computer Networks",
    issueDate: "2023-11-10",
    dueDate: "2023-11-24",
    returnDate: "2023-11-26",
    isreturned: true,
    fine: 20
  },
  {
    id: "ISS005",
    userId: "STU001",
    bookId: "8",
    bookTitle: "Operating System Concepts",
    issueDate: "2023-10-05",
    dueDate: "2023-10-19",
    returnDate: "2023-10-18",
    isreturned: true,
    fine: 0
  }
];

export const genres = [
  "All Genres",
  "Computer Science",
  "Software Engineering",
  "Database",
  "Artificial Intelligence",
  "Networking",
  "Operating Systems"
];

export const authors = [
  "All Authors",
  "Thomas H. Cormen",
  "Robert C. Martin",
  "Gang of Four",
  "David Thomas",
  "Abraham Silberschatz",
  "Stuart Russell",
  "Andrew S. Tanenbaum",
  "Tom Mitchell",
  "Robert Lafore"
];
