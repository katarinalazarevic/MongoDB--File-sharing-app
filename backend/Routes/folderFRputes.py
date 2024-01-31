from db_config import mongo_db
from Models.FolderFront import Folder
from flask import request,jsonify, Blueprint

folder_routes = Blueprint("folder_routes", __name__)


@folder_routes.route("/NapraviFolder", methods=['POST'])
def NapraviFolder():
    try:
        data=request.get_json()
        roditelj=data['roditelj'] #naziv roditeljskog foldera
        naziv=data['naziv']
        vlasnik=data['vlasnik'] #emial korisnika
        postojeci = mongo_db.users.find_one({'email': vlasnik})
        if not postojeci:
            return jsonify({'message': 'Korisnik ne postoji'}), 400
        sfolder=mongo_db.foldersf.find_one({'naziv':naziv})
        if sfolder:
            return jsonify({'message': 'Folder sa datim nazivom vec postoji'}), 400

        noviFolder=Folder(naziv,vlasnik)
        mongo_db.foldersf.insert_one({
            'naziv':noviFolder.naziv,
            "vlasnik": noviFolder.vlasnik,
            "datumKreiranja": noviFolder.datumKreiranja,
            "files": [file for file in noviFolder.files],
            "subfolders": [subfolder for subfolder in noviFolder.subfolders]
       
        })
        
        rfolder=mongo_db.foldersf.find_one({'naziv':roditelj})
        if rfolder:
            mongo_db.foldersf.update_one(
                {'naziv': roditelj},
                {'$push': {'subfolders': noviFolder.naziv}}
            )

            return jsonify({'message': 'SUCCESS'}), 201

        return jsonify({'message': 'Doslo je do greske sa roditeljskim folderom'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@folder_routes.route("/ProcitajSveFoldere", methods=['GET'])
def ProcitajSveFoldere():
    svi_folderi = mongo_db.foldersf.find()
    rezultat = []

    for folder in svi_folderi:
        rezultat.append({
            'naziv': folder['naziv'],
            'subfolders': folder.get('subfolders', [])
        })

    return jsonify({'folders': rezultat})

@folder_routes.route("/ProcitajDecuFolder", methods=['POST'])
def ProcitajDecuFolder():
    data=request.get_json()
    naziv=data['naziv']
    folder = mongo_db.foldersf.find_one({"naziv":naziv})

    rezultat = {
            'naziv': folder['naziv'],
            'subfolders': folder.get('subfolders', [])
        }

    return jsonify( rezultat)