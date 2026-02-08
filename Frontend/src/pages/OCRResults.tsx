import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Search, Camera, X, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { books } from "@/data/mockData";

const OCRResults = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Simulated OCR results - in real app, this would come from OCR API
  const matchedBooks = hasSearched ? books.slice(0, 3) : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setHasSearched(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    // Simulate OCR processing
    setTimeout(() => {
      setIsProcessing(false);
      setHasSearched(true);
    }, 2000);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setHasSearched(false);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">OCR Book Search</h1>
        <p className="mt-1 text-muted-foreground">
          Upload an image of a book cover to find matching books in our library
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Upload Area */}
            <div className="flex-1">
              {!uploadedImage ? (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <p className="mb-2 text-lg font-medium text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG or JPEG (max. 10MB)
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-secondary/30">
                    <img
                      src={uploadedImage}
                      alt="Uploaded book cover"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <X className="h-5 w-5 text-foreground" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Panel */}
            <div className="lg:w-72 flex flex-col justify-center gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  How it works
                </h3>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li>1. Upload a photo of a book cover</li>
                  <li>2. Our AI extracts title and author</li>
                  <li>3. View matching books from library</li>
                </ol>
              </div>

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleSearch}
                disabled={!uploadedImage || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Search Library
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/books")}
              >
                Back to All Books
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isProcessing && (
        <div className="text-center py-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Analyzing image...</h3>
          <p className="text-muted-foreground mt-1">
            Extracting text and searching our library
          </p>
        </div>
      )}

      {hasSearched && !isProcessing && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Search Results</h2>
              <p className="text-sm text-muted-foreground">
                Found {matchedBooks.length} matching book{matchedBooks.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {matchedBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {matchedBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No matches found</h3>
              <p className="text-muted-foreground mt-1">
                Try uploading a clearer image or search manually
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/books")}
              >
                Browse All Books
              </Button>
            </div>
          )}
        </div>
      )}

      {!hasSearched && !isProcessing && !uploadedImage && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Upload an image to get started</p>
        </div>
      )}
    </Layout>
  );
};

export default OCRResults;
