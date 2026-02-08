import { BookOpen, BookCheck, AlertTriangle, DollarSign, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import SummaryCard from "@/components/SummaryCard";
import BookCard from "@/components/BookCard";
import {  issuedBooks } from "@/data/mockData";
import { useApp } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  // Calculate summary data
  const {books,student,currentlyissuedBooks}=useApp();
  const totalBooks = books.length;
  const booksIssuedByStudent = currentlyissuedBooks.length;
  const overdueBooks = currentlyissuedBooks.filter(
    (book) => new Date(book.dueDate) < new Date() && !book.isreturned
  ).length;
  const totalFine = currentlyissuedBooks.reduce((sum, book) => sum + book.fine, 0);
  const recentBooks = [...books].sort(
    (a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
  ).slice(0, 6);

   if (!student || !books) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <span className="text-lg text-muted-foreground">Loading Dashboard...</span>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to SmartLib
        </h1>
        <p className="mt-1 text-muted-foreground">
          Hello, {student.name}! Explore our digital library collection.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="Total Books"
          value={totalBooks}
          icon={BookOpen}
          variant="primary"
        />
        <SummaryCard
          title="Books Issued by You"
          value={booksIssuedByStudent}
          icon={BookCheck}
          variant="success"
        />
        <SummaryCard
          title="Overdue Books"
          value={overdueBooks}
          icon={AlertTriangle}
          variant={overdueBooks > 0 ? "destructive" : "default"}
        />
        <SummaryCard
          title="Total Fine"
          value={`₹${totalFine}`}
          icon={DollarSign}
          variant={totalFine > 0 ? "warning" : "default"}
        />
      </div>

      {/* Currently Issued Section */}
      {currentlyissuedBooks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Currently Issued</h2>
          </div>
          <div className="grid gap-4">
            {currentlyissuedBooks.map((issued) => {
              const book = books.find((b) => b._id === issued.bookId);
              const isOverdue = new Date(issued.dueDate) < new Date();
              return (
                <div
                  key={issued._id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm"
                >
                  {book && (
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="h-16 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(issued.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        isOverdue
                          ? "bg-destructive/10 text-destructive"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {isOverdue ? "Overdue" : "Active"}
                    </span>
                    {issued.fine > 0 && (
                      <p className="text-sm text-destructive mt-1">Fine: ₹{issued.fine}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recently Added Books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recently Added Books</h2>
          <button
            onClick={() => navigate("/books")}
            className="text-sm font-medium text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
            type="button"
          >
            View All →
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recentBooks.map((book) => (
            <BookCard key={book._id} book={book} variant="compact" />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
