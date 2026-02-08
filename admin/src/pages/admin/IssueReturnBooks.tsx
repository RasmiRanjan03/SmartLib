import { useState } from 'react';
import { BookOpen, RotateCcw, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const IssueReturnBooks = () => {
  const { students, books, issuedBooks, issueBook, returnBook } = useAdminData();
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issueFormData, setIssueFormData] = useState({
    studentId: '',
    bookId: '',
  });

  const activeIssues = issuedBooks.filter((issue) => !issue.isreturned);
  const returnedIssues = issuedBooks.filter((issue) => issue.isreturned);

  const availableBooks = books.filter((book) => book.availablecopies > 0);

  const today = new Date();
  const overdueIssues = activeIssues.filter(
    (issue) => new Date(issue.dueDate) < today
  );

  const handleIssueBook = () => {
    if (issueFormData.studentId && issueFormData.bookId) {
      issueBook(issueFormData.studentId, issueFormData.bookId);
      setIsIssueDialogOpen(false);
      setIssueFormData({ studentId: '', bookId: '' });
    }
  };

  const handleReturnClick = (issueId: string) => {
    setSelectedIssueId(issueId);
    setIsReturnDialogOpen(true);
  };

  const handleConfirmReturn = () => {
    if (selectedIssueId) {
      returnBook(selectedIssueId);
    }
    setIsReturnDialogOpen(false);
    setSelectedIssueId(null);
  };

  const getStatusBadge = (issue: typeof issuedBooks[0]) => {
    if (issue.isreturned) {
      return <span className="status-badge-success">Returned</span>;
    }
    const dueDate = new Date(issue.dueDate);
    if (dueDate < today) {
      return <span className="status-badge-destructive">Overdue</span>;
    }
    return <span className="status-badge-warning">Issued</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const IssueTable = ({ issues }: { issues: typeof issuedBooks }) => (
    <div className="overflow-x-auto">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Book</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Fine</th>
            <th>Status</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td className="font-medium">{issue.studentName}</td>
              <td className="max-w-[150px] truncate">{issue.bookTitle}</td>
              <td className="text-muted-foreground">{formatDate(issue.issueDate)}</td>
              <td className="text-muted-foreground">{formatDate(issue.dueDate)}</td>
              <td className="text-muted-foreground">
                {issue.returnDate ? formatDate(issue.returnDate) : '-'}
              </td>
              <td>
                {issue.fine > 0 ? (
                  <span className="text-destructive font-medium">${issue.fine}</span>
                ) : (
                  <span className="text-muted-foreground">$0</span>
                )}
              </td>
              <td>{getStatusBadge(issue)}</td>
              <td>
                <div className="flex justify-end">
                  {!issue.isreturned && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturnClick(issue.id)}
                      className="gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Return
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {issues.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-8 text-muted-foreground">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Issue / Return Books</h2>
          <p className="text-sm text-muted-foreground">Manage book lending</p>
        </div>
        <Button onClick={() => setIsIssueDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Issue Book
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-warning/10">
            <BookOpen className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{activeIssues.length}</p>
            <p className="text-sm text-muted-foreground">Currently Issued</p>
          </div>
        </div>
        <div className="admin-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-destructive/10">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{overdueIssues.length}</p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
        </div>
        <div className="admin-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-success/10">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{returnedIssues.length}</p>
            <p className="text-sm text-muted-foreground">Returned</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="active" className="data-[state=active]:bg-card">
            Active Issues ({activeIssues.length})
          </TabsTrigger>
          <TabsTrigger value="returned" className="data-[state=active]:bg-card">
            Returned ({returnedIssues.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-card">
            All Records ({issuedBooks.length})
          </TabsTrigger>
        </TabsList>

        <div className="admin-card overflow-hidden">
          <TabsContent value="active" className="m-0">
            <IssueTable issues={activeIssues} />
          </TabsContent>
          <TabsContent value="returned" className="m-0">
            <IssueTable issues={returnedIssues} />
          </TabsContent>
          <TabsContent value="all" className="m-0">
            <IssueTable issues={issuedBooks} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Issue Book Dialog */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Book to Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Select Student</Label>
              <Select
                value={issueFormData.studentId}
                onValueChange={(value) =>
                  setIssueFormData({ ...issueFormData, studentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.registrationNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Select Book</Label>
              <Select
                value={issueFormData.bookId}
                onValueChange={(value) =>
                  setIssueFormData({ ...issueFormData, bookId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a book" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.map((book) => (
                    <SelectItem key={book._id} value={book._id}>
                      {book.title} ({book.availablecopies} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableBooks.length === 0 && (
                <p className="text-sm text-destructive">
                  No books available for issuing
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsIssueDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleIssueBook}
                disabled={!issueFormData.studentId || !issueFormData.bookId}
              >
                Issue Book
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Confirmation */}
      <AlertDialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this book as returned?
              {selectedIssueId && (() => {
                const issue = issuedBooks.find((i) => i.id === selectedIssueId);
                if (issue) {
                  const dueDate = new Date(issue.dueDate);
                  if (dueDate < today) {
                    const daysOverdue = Math.ceil(
                      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const fine = daysOverdue * 10;
                    return (
                      <span className="block mt-2 text-destructive font-medium">
                        This book is {daysOverdue} days overdue. Fine: ${fine}
                      </span>
                    );
                  }
                }
                return null;
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReturn}>
              Confirm Return
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IssueReturnBooks;
