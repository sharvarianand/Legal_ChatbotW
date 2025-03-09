from flask import Blueprint, request, jsonify
from services.pdf_parser import extract_text_from_pdf
import os

documents_bp = Blueprint("documents", __name__)

UPLOAD_FOLDER = "data/legal_documents"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@documents_bp.route("/upload", methods=["POST"])
def upload_document():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Validate file type
    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "Invalid file type. Only PDF files are allowed."}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    text = extract_text_from_pdf(file_path)
    return jsonify({"text": text})
