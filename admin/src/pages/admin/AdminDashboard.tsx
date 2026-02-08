import { Users, BookOpen, BookCheck, AlertTriangle, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { useAdminData } from '@/contexts/AdminDataContext';

export const AdminDashboard = () => {
  const { stats, issuedBooks, books } = useAdminData();

  // Get recent activity
  const recentActivity = issuedBooks
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

  // Get low stock books
  const lowStockBooks = books.filter((book) => book.availablecopies <= 2);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          variant="info"
        />
        <StatCard
          title="Books Issued"
          value={stats.booksIssued}
          icon={BookCheck}
          variant="success"
        />
        <StatCard
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Fine Collected"
          value={`$${stats.totalFineCollected}`}
          icon={DollarSign}
          variant="destructive"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.isreturned ? 'bg-success' : 'bg-warning'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.bookTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.studentName} • {activity.isreturned ? 'Returned' : 'Issued'} on{' '}
                    {new Date(activity.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={
                    activity.isreturned ? 'status-badge-success' : 'status-badge-warning'
                  }
                >
                  {activity.isreturned ? 'Returned' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Low Stock Books</h2>
          <div className="space-y-4">
            {lowStockBooks.length === 0 ? (
              <p className="text-sm text-muted-foreground">All books are well stocked!</p>
            ) : (
              lowStockBooks.map((book) => (
                <div
                  key={book._id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {book.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <span className="status-badge-destructive">
                    {book.availablecopies} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href="/admin/students"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
          >
            <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Add Student</span>
          </a>
          <a
            href="/admin/books"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-info/5 hover:bg-info/10 transition-colors group"
          >
            <div className="p-3 rounded-full bg-info/10 group-hover:bg-info/20 transition-colors">
              <BookOpen className="w-6 h-6 text-info" />
            </div>
            <span className="text-sm font-medium text-foreground">Add Book</span>
          </a>
          <a
            href="/admin/issues"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-success/5 hover:bg-success/10 transition-colors group"
          >
            <div className="p-3 rounded-full bg-success/10 group-hover:bg-success/20 transition-colors">
              <BookCheck className="w-6 h-6 text-success" />
            </div>
            <span className="text-sm font-medium text-foreground">Issue Book</span>
          </a>
          <a
            href="/admin/issues"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-warning/5 hover:bg-warning/10 transition-colors group"
          >
            <div className="p-3 rounded-full bg-warning/10 group-hover:bg-warning/20 transition-colors">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <span className="text-sm font-medium text-foreground">View Overdue</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
