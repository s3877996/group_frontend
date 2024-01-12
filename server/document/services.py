from flask import request, make_response, current_app
from server.database.db import db
from server.database.models import Document
from server.database.schema import DocumentSchema
from sqlalchemy.sql import func
from docx import Document as DocxDocument
import requests
import os

document_schema = DocumentSchema()
documents_schema = DocumentSchema(many=True)

"""
    read_and_parse_docx function reads the content of the upload file and divide it into paragraphs.
    :param 1: path of the file in server/upload_file
    :return: divided paragraphs from the file contents
"""
def read_and_parse_docx(file_path):
    doc = DocxDocument(file_path)
    paragraphs = [para.text for para in doc.paragraphs if para.text.strip() != '']
    return paragraphs

"""
    correct_text_with_api function work with the LLM API to correct a paragraph.
    :param 1: a paragraph
    :return: corrected sentences of that paragraph
"""
def correct_text_with_api(paragraph):
    api_url = "https://polite-horribly-cub.ngrok-free.app/generate_code"
    prompt = f"Correct English of this text: {paragraph}. Here is the corrected version:"

    try:
        # Send the GET request with the prompt
        response = requests.get(api_url, params={"prompts": prompt})
        if response.status_code == 200:
            data = response.json()
            corrected_paragraph = data[0]
            corrected_sentence = corrected_paragraph.split('\n')[0]  # Extracts the first sentence
            return corrected_sentence
        else:
            print(f"Failed to correct text. Status code: {response.status_code}")
            return paragraph
    except Exception as e:
        # Handle exceptions for the API request
        print(f"An exception occurred: {e}")
        return paragraph

"""
    create_corrected_docx function will create a new document file with corrected content.
    :param 1: path of the upload file
    :param 2: corrected paragraphs
    :return: path of the corrected file
"""
def create_corrected_docx(original_file_path, corrected_paragraphs):
    doc = DocxDocument(original_file_path)
    for i, para in enumerate(doc.paragraphs):
        if i < len(corrected_paragraphs):  
            para.clear()  
            para.add_run(corrected_paragraphs[i])  
    corrected_file_name = os.path.basename(original_file_path).replace('.docx', '_corrected.docx')
    corrected_file_path = os.path.join(current_app.config['DOWNLOAD_FOLDER'], corrected_file_name)
    doc.save(corrected_file_path)
    return corrected_file_path


# Get all document by user ID
def get_all_documents_of_user_service(user_id):
    try:
        documents = Document.query.filter_by(user_id=user_id).all()
        if documents:
            return make_response(
                documents_schema.jsonify(documents),
                200
            )
        else:
            return make_response(
                {"message": "No documents found"},
                404 # Not Found
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find all documents"},
            400 # Bad Request
        )

# Get document of a user by document ID
def get_document_of_user_by_id_service(user_id, document_id):
    try:
        document = Document.query.filter_by(user_id=user_id, document_id=document_id).first()
        if document:
            return make_response(
                document_schema.jsonify(document), 
                200
            )
        else:
            return make_response(
                {"message": "Document not found"},
                404 # Not Found
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find document by id: " + document_id},
            400 # Bad Request
        )
    
# Get document of a user by document name
def get_document_of_user_by_name_service(user_id, document_name):
    try:
        data = document_name or request.args.get('name')

        if data:
            documents = Document.query.filter(
                Document.user_id == user_id,
                func.lower(Document.document_name).like('%' + data.lower() + '%')
            ).all()
            if documents:
                return make_response(
                    documents_schema.jsonify(documents),
                    200
                )
            else:
                return make_response(
                    {"message": "Document not found"},
                    404 # Not Found
                )
        else:
            return make_response(
                {"message": "Invalid request"},
                400 # Bad Request
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find document by name: " + str(document_name)},
            400 # Bad Request
        )