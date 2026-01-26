import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Camera, Star } from "lucide-react";
import Layout from "@/components/Layout";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { books, genres, authors } from "@/data/mockData";

const AllBooks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedAuthor, setSelectedAuthor] = useState("All Authors");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesSearch =
          searchQuery === "" ||
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.keywords.some((k) =>
            k.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesGenre =
          selectedGenre === "All Genres" || book.genre === selectedGenre;

        const matchesAuthor =
          selectedAuthor === "All Authors" || book.author === selectedAuthor;

        const matchesAvailability =
          selectedAvailability === "all" ||
          (selectedAvailability === "available" && book.availableCopies > 0) ||
          (selectedAvailability === "unavailable" && book.availableCopies === 0);

        const matchesRating =
          selectedRating === "all" ||
          (selectedRating === "4+" && book.rating >= 4) ||
          (selectedRating === "4.5+" && book.rating >= 4.5);

        return (
          matchesSearch &&
          matchesGenre &&
          matchesAuthor &&
          matchesAvailability &&
          matchesRating
        );
      })
      .sort(
        (a, b) =>
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      );
  }, [searchQuery, selectedGenre, selectedAuthor, selectedAvailability, selectedRating]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All Genres");
    setSelectedAuthor("All Authors");
    setSelectedAvailability("all");
    setSelectedRating("all");
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">All Books</h1>
        <p className="mt-1 text-muted-foreground">
          Browse our collection of {books.length} books
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button
          variant="outline"
          className="h-12 gap-2"
          onClick={() => navigate("/books/ocr")}
        >
          <Camera className="h-5 w-5" />
          <span className="hidden sm:inline">Search using Image (OCR)</span>
          <span className="sm:hidden">OCR</span>
        </Button>
        <Button
          variant="outline"
          className="h-12 gap-2 md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 ${
          showFilters ? "block" : "hidden md:grid"
        }`}
      >
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="h-10 bg-card">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
          <SelectTrigger className="h-10 bg-card">
            <SelectValue placeholder="Author" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {authors.map((author) => (
              <SelectItem key={author} value={author}>
                {author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
          <SelectTrigger className="h-10 bg-card">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRating} onValueChange={setSelectedRating}>
          <SelectTrigger className="h-10 bg-card">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <SelectValue placeholder="Rating" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="4+">4+ Stars</SelectItem>
            <SelectItem value="4.5+">4.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBooks.length} of {books.length} books
        </p>
        {(selectedGenre !== "All Genres" ||
          selectedAuthor !== "All Authors" ||
          selectedAvailability !== "all" ||
          selectedRating !== "all" ||
          searchQuery) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No books found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default AllBooks;
