import os
from db_config import mongo_db
from Models.Slika import Image
from flask import  request, jsonify, session
from werkzeug.utils import secure_filename
from flask import request,jsonify, Blueprint

slika_routes = Blueprint("slika_routes", __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@slika_routes.route("/UploadSliku",methods=['POST'])
def UploadSliku():
    folder=request.form.get('folder')
    print("vrednosti su ", request.form)
    email = request.form.get('email')
    if not email:
        return jsonify({'error': 'No email provided'}), 400
    print(email)
    folder=request.form.get('folder')
    if not folder:
        return jsonify({'error': 'No folder provided'}), 400
    print(folder)
    
    # if 'file' not in request.files:
    #     return jsonify({'error': 'No file part'}), 400
    
    vlasnikl = mongo_db.users.find_one({'email':email})
    folderl= mongo_db.foldersf.find_one({'naziv':folder}) 
    print("Pronadjieni i vlasnik i folder")
    if not vlasnikl:
        return jsonify({'message': 'Nepostojeci email'}), 400
    if not folderl:
        return jsonify({'message': 'Nepostojeci folder'}), 400
    
    file = request.files.get('file')
    print(file)
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if any(filename in file_entry for file_entry in folderl.get('files', [])):
            return jsonify({'error': 'Image already exists in the folder'}), 400
        print(file_path)
        file.save(file_path)

        
        mongo_db.foldersf.update_one(
                {'naziv': folder},
                {'$push': {'files': filename}}
            )

        return jsonify({'message': 'Image uploaded successfully'}),201
    else:
        return jsonify({'error': 'Invalid file type'}), 400


@slika_routes.route("/ObrisiSliku", methods=['DELETE'])
def ObrisiSliku():
    data=request.get_json()
    email = data['email']
    folder = data['folder'] #ime foldera
    filename = data['fajl'] #ime fajla

    if not email or not folder or not filename:
        return jsonify({'error': 'Missing required parameters'}), 400

    folder_entry = mongo_db.foldersf.find_one({'naziv': folder})
    if not folder_entry:
        return jsonify({'error': 'Folder not found'}), 400

    files = folder_entry.get('files', [])
    if filename not in files:
        return jsonify({'error': 'File not found in the folder'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    else:
        return jsonify({'error': 'File not found in the file system'}), 400

    updated_files = [file_entry for file_entry in files if file_entry != filename]
    mongo_db.foldersf.update_one({'naziv': folder}, {'$set': {'files': updated_files}})

    mongo_db.files.delete_one({'imeFajla': filename, 'vlasnik': email})

    return jsonify({'message': 'File deleted successfully'}),200

@slika_routes.route("/VratiFajloveZaFolder", methods=['GET'])
def VratiFajloveZaFolder():
    folder = request.args.get('folder')
    print(folder)
    if not folder:
        return jsonify({'error': 'Missing required parameter "folder"'}), 400

    folder_entry = mongo_db.foldersf.find_one({'naziv': folder})
    if not folder_entry:
        return jsonify({'error': 'Folder not found'}), 404

    files = folder_entry.get('files', [])
    return jsonify({'folder': folder, 'files': files})
@slika_routes.route("/probaj")
def probaj():
     return ("Hello"),200

from flask import send_from_directory

@slika_routes.route("/DownloadSliku/<path:filename>", methods=['GET'])
def DownloadSliku(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
