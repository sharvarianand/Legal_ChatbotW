import fitz  # PyMuPDF

def extract_text_from_pdf(file_path):
    text = ""
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    except Exception as e:
        return f"Error extracting text: {str(e)}. Please ensure the PDF is not corrupted and is in a supported format."
