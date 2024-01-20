from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from server.database.db import db
from server.database.models import Document
from server.database.models import CorrectedDocument
from server.database.models import Subscription 
from server.auth.auth_middleware import token_required
from .services import read_and_parse_docx, correct_text_with_api, create_corrected_docx, get_all_documents_of_user_service, get_document_of_user_by_id_service, get_document_of_user_by_name_service
import logging

documents = Blueprint('document', __name__)

ALLOWED_EXTENSIONS = {'doc', 'docx'}

def allowed_file(filename):
    """Check if the file has one of the allowed extensions."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@documents.route('/upload-files/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@documents.route('/download-files/<filename>')
def serve_download_file(filename):
    return send_from_directory(current_app.config['DOWNLOAD_FOLDER'], filename)

@documents.route('/upload', methods=['POST'])
@token_required(required_role='user')
def upload(current_user):
    # Check if the user can upload more documents
    can_upload, message = Subscription.can_upload_document(current_user.user_id)
    if not can_upload:
        return jsonify({"error": message}), 403
    
    # Fetch the current subscription to update available documents
    current_subscription = Subscription.query.filter_by(user_id=current_user.user_id).order_by(Subscription.start_time.desc()).first()
    if current_subscription is None or current_subscription.available_doc <= 0:
        return jsonify({"error": "No available documents in your subscription"}), 403

    if 'file' not in request.files:
        return jsonify(error="No file part"), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(error="No selected file"), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        try:
            logging.debug("Processing file upload")

            file.save(file_path)

            # Process the file to get the content
            paragraphs = read_and_parse_docx(file_path)
            original_content = '\n\n'.join([para['text'] for para in paragraphs])

            # Correct each paragraph with the API
            corrected_paragraphs = [correct_text_with_api(para['text']) for para in paragraphs]
            #corrected_paragraphs = [correct_text_with_api(para) for para in paragraphs]

            corrected_content = '\n'.join(corrected_paragraphs)

            # Save the corrected document in DOWNLOAD_FOLDER
            corrected_file_path = create_corrected_docx(file_path, corrected_paragraphs)

            # Extract the corrected file name for database storage or response
            corrected_file_name = os.path.basename(corrected_file_path)

            original_file_url = request.url_root + 'upload-files/' + filename
            corrected_file_url = request.url_root + 'download-files/' + corrected_file_name

            if current_subscription:
                current_subscription.available_doc -= 1
                db.session.commit()

            # Create and save the document metadata in the database
            new_document = Document(
                document_name=filename,
                user_id=current_user.user_id,
                original_content=original_content,
                corrected_content=corrected_content,  # This will be updated after correction
                start_time=datetime.now(),
                adjusted_time=datetime.now(),
                file_path=original_file_url
            )
            db.session.add(new_document)
            db.session.commit()

            corrected_document = CorrectedDocument(
                original_document_id=new_document.document_id,
                corrected_content=corrected_content,
                correction_time=datetime.now(),
                version=1,  # Set the version or increment if needed
                file_path=corrected_file_url,  # Path of the corrected file
                corrected_document_name=corrected_file_name
            )
            db.session.add(corrected_document)
            db.session.commit()

        except Exception as e:
            logging.error(f"Error in upload route: {e}")
            db.session.rollback()
            return jsonify(error=f"An error occurred while saving the file: {str(e)}"), 500
        return jsonify(success = "File successfully uploaded", 
                       document_id = new_document.document_id,
                       corrected_document_id = corrected_document.corrected_document_id,
                       original_content = original_content,
                       corrected_content = corrected_content,
                       original_file_path = original_file_url, 
                       corrected_file_path = corrected_file_url,
                       original_file_name = filename,
                       corrected_file_name=corrected_file_name),200
    else:
        return jsonify(error="File type not allowed")
    
@documents.route('/download/<filename>', methods=['GET'])
def download_corrected_document(filename):
    # Ensure the filename is safe and not an absolute path or contains ".."
    filename = secure_filename(filename)
    
    # Send the file from the DOWNLOAD_FOLDER
    try:
        print("Download folder:", current_app.config['DOWNLOAD_FOLDER'])
        print("Filename:", filename)

        return send_from_directory(current_app.config['DOWNLOAD_FOLDER'], 
                                   filename, 
                                   as_attachment=True)
    except FileNotFoundError:
        return jsonify(error="File not found"), 404

# Get all documents
@documents.route('/user_documents', methods=['GET'])
@token_required(required_role='user')
def get_all_documents_of_user(current_user):
    page = request.args.get('page', default=1, type=int)
    per_page = 5  # Set the number of documents per page
    return get_all_documents_of_user_service(current_user.user_id, page, per_page)
    # return get_all_documents_of_user_service(current_user.user_id)

# Get document by id
@documents.route('/user_documents/document/<int:document_id>', methods=['GET'])
@token_required(required_role='user')
def get_document_of_user_by_id(current_user, document_id):
    return get_document_of_user_by_id_service(current_user.user_id,document_id)

# # Get document by name
# @documents.route('/user_documents/get_document', methods=['GET'])
# def get_document_of_user_by_name(current_user, document_name):
#     return get_document_of_user_by_name_service(current_user.user_id,document_name)
