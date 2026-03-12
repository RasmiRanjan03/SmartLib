import Tesseract from 'tesseract.js';
import Book from '../Model/bookmodel.js';
import fs from 'fs';

const ocrSearch = async (req, res) => {
    try {
        console.log("OCR Search Request Received");
        if (!req.file) {
            console.log("No file found in request");
            return res.json({ success: false, message: "No image uploaded" });
        }

        const imagePath = req.file.path;
        console.log("Processing image at:", imagePath);

        // Perform OCR using Tesseract.js
        console.log("Starting Tesseract recognition...");
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'eng',
            { logger: m => console.log("Tesseract Progress:", m) }
        );

        console.log("Extracted Text:", text);

        if (!text || text.trim().length === 0) {
            console.log("No text extracted from image");
            return res.json({ success: true, message: "No text recognized", data: [] });
        }

        // Simple fuzzy search logic: split extracted text into words and search in book titles and authors
        const searchTerms = text.split(/\s+/).filter(word => word.length > 2);
        console.log("Search Terms:", searchTerms);
        
        if (searchTerms.length === 0) {
            console.log("No searchable terms found in extracted text");
            return res.json({ success: true, message: "No significant text recognized", data: [] });
        }

        // Search for books matching any of the recognized terms
        const searchQuery = {
            $or: [
                { title: { $regex: searchTerms.join('|'), $options: 'i' } },
                { author: { $regex: searchTerms.join('|'), $options: 'i' } }
            ]
        };

        console.log("Database Search Query:", JSON.stringify(searchQuery));
        const matchedBooks = await Book.find(searchQuery);
        console.log("Found matched books count:", matchedBooks.length);

        // Delete the temporary file
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("Temporary image file deleted");
        }

        res.json({
            success: true,
            message: "OCR Search Successful",
            data: matchedBooks,
            extractedText: text
        });

    } catch (error) {
        console.error("CRITICAL ERROR during OCR search:", error);
        res.status(500).json({ success: false, message: "OCR Processing Error: " + error.message });
    }
};

export { ocrSearch };
