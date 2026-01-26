import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, BookOpen, Calendar, User, Tag, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { books } from "@/data/mockData";
import { toast } from "sonner";

const BookDetails = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground">Book Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The book you're looking for doesn't exist.
          </p>
          <Link to="/books">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Books
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const recommendedBooks = books
    .filter((b) => b.id !== book.id && b.genre === book.genre)
    .slice(0, 5);

  const handleIssueBook = () => {
    if (isAvailable) {
      toast.success(`"${book.title}" has been added to your issued books!`);
    } else {
      toast.error("This book is currently unavailable.");
    }
  };

  return (
    <Layout>
      {/* Back Button */}
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Books
      </Link>

      {/* Book Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-border shadow-lg">
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Book Info */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Title & Author */}
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                {book.genre}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {book.title}
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">by {book.author}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(book.rating)
                          ? "fill-warning text-warning"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {book.rating}
                </span>
              </div>
              <span className="text-muted-foreground">
                ({book.reviewCount} reviews)
              </span>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">Total Copies</span>
                </div>
                <p className="text-xl font-bold text-foreground">{book.totalCopies}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">Available</span>
                </div>
                <p className={`text-xl font-bold ${isAvailable ? "text-success" : "text-destructive"}`}>
                  {book.availableCopies}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">Added</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(book.addedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Tag className="h-4 w-4" />
                  <span className="text-xs">Genre</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{book.genre}</p>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Summary</h2>
              <p className="text-muted-foreground leading-relaxed">{book.summary}</p>
            </div>

            {/* Keywords */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {book.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Issue Button */}
            <div className="pt-4">
              {isAvailable ? (
                <Button size="lg" className="w-full sm:w-auto" onClick={handleIssueBook}>
                  <BookOpen className="h-5 w-5 mr-2" />
                  Issue Book
                </Button>
              ) : (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-semibold text-destructive">
                        Currently Unavailable
                      </p>
                      {book.expectedAvailability && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Expected availability:{" "}
                          {new Date(book.expectedAvailability).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Books */}
      {recommendedBooks.length > 0 && (
        <div className="border-t border-border pt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Recommended Books
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {recommendedBooks.map((recBook) => (
              <BookCard key={recBook.id} book={recBook} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BookDetails;
