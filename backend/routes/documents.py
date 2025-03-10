from flask import Blueprint, request, jsonify
from services.pdf_parser import extract_text_from_pdf
import os

documents_bp = Blueprint("documents", __name__)

UPLOAD_FOLDER = "data/legal_documents"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@documents_bp.route("/upload", methods=["POST"])
def upload_document():
    if "file" not in request.files or request.files["file"].filename == '':

        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Validate file type and size

    if not (file.filename.endswith('.pdf') and file.content_length <= 10 * 1024 * 1024):  # Limit to 10 MB

        return jsonify({"error": "Invalid file type. Only PDF files are allowed."}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    text = extract_text_from_pdf(file_path) if os.path.exists(file_path) else "Error: File not found."

    return jsonify({"text": text})
