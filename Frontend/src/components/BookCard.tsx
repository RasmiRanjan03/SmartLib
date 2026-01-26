import { Link } from "react-router-dom";
import { Star, BookOpen } from "lucide-react";
import { Book } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  variant?: "default" | "compact";
}

const BookCard = ({ book, variant = "default" }: BookCardProps) => {
  const isAvailable = book.availableCopies > 0;

  if (variant === "compact") {
    return (
      <Link
        to={`/book/${book.id}`}
        className="group flex-shrink-0 w-40"
      >
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="p-3">
            <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
            <div className="mt-2 flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  isAvailable
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/book/${book.id}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{book.author}</p>
          
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium text-foreground">{book.rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{book.reviewCount} reviews</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">{book.availableCopies}/{book.totalCopies}</span>
            </div>
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                isAvailable
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
