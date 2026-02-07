import { User, Mail, BookOpen, GraduationCap, Building2, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  issuedBooks, borrowingHistory, books } from "@/data/mockData";
import {useApp} from "../context/appContext";


const Profile = () => {
  const totalFine = [...issuedBooks, ...borrowingHistory].reduce(
    (sum, book) => sum + book.fine,
    0
  );
  const { token, student } = useApp();

  if (!student) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <span className="text-lg text-muted-foreground">Loading profile...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Profile Header */}
      <div className="mb-8">
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary to-primary/60" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
                <AvatarImage src={student.profilepicurl} alt={student.name} />
                <AvatarFallback className="text-2xl">
                  {student.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left pb-4">
                <h1 className="text-2xl font-bold text-foreground">
                  {student.name}
                </h1>
                <p className="text-muted-foreground">
                  {student.redg}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration No</p>
              <p className="font-semibold text-foreground">
                {student.redg}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-semibold text-foreground">{student.course}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Branch</p>
              <p className="font-semibold text-foreground truncate max-w-[150px]">
                {student.branch}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Fine</p>
              <p className="font-semibold text-foreground">₹{totalFine}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currently Issued Books */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Currently Issued Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issuedBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issuedBooks.map((issued) => {
                    const book = books.find((b) => b._id === issued.bookId);
                    const isOverdue = new Date(issued.dueDate) < new Date();
                    return (
                      <TableRow key={issued.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {book && (
                              <img
                                src={book.coverImageUrl}
                                alt={book.title}
                                className="h-12 w-9 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-foreground">
                                {issued.bookTitle}
                              </p>
                              {book && (
                                <p className="text-sm text-muted-foreground">
                                  {book.author}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(issued.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(issued.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              isOverdue
                                ? "bg-destructive/10 text-destructive"
                                : "bg-success/10 text-success"
                            }`}
                          >
                            {isOverdue ? "Overdue" : "Active"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={issued.fine > 0 ? "text-destructive font-medium" : ""}>
                            ₹{issued.fine}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No books currently issued</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Borrowing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Borrowing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {borrowingHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead className="text-right">Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowingHistory.map((history) => {
                    const book = books.find((b) => b._id === history.bookId);
                    return (
                      <TableRow key={history.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {book && (
                              <img
                                src={book.coverImageUrl}
                                alt={book.title}
                                className="h-12 w-9 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-foreground">
                                {history.bookTitle}
                              </p>
                              {book && (
                                <p className="text-sm text-muted-foreground">
                                  {book.author}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(history.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(history.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {history.returnDate
                            ? new Date(history.returnDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={history.fine > 0 ? "text-destructive font-medium" : ""}>
                            ₹{history.fine}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No borrowing history yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Profile;
