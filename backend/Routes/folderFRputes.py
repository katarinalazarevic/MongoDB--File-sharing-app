import datetime
from db_config import mongo_db
from Models.FolderFront import Folder
from flask import request,jsonify, Blueprint

folder_routes = Blueprint("folder_routes", __name__)


@folder_routes.route("/NapraviFolder", methods=['POST'])
def NapraviFolder():
    try:
        data=request.get_json()
        roditelj=data['roditelj']
        naziv=data['naziv']
        sfolder=mongo_db.foldersf.find_one({'naziv':naziv})
        if sfolder:
            return jsonify({'message': 'Folder sa datim nazivom vec postoji'}), 400
        postojeci = mongo_db.foldersf.find_one({'naziv': roditelj})
        if (roditelj == '#'):
            noviFolder=Folder(naziv,roditelj)
            mongo_db.foldersf.insert_one({
            'naziv': naziv,
            "roditelj": 'null',
          #  "datumKreiranja": datetime.utcnow(), 
            "files": [file for file in noviFolder.files],
        })
        else:
            if not postojeci:
                return jsonify({'message': 'Folder roditelj ne postoji'}), 400
       
            noviFolder=Folder(naziv,roditelj)

            mongo_db.foldersf.insert_one({
                'naziv': naziv,
                "roditelj": postojeci.get('naziv'),
            #  "datumKreiranja": datetime.utcnow(),  
                "files": [file for file in noviFolder.files],
            })
            return jsonify({'message': 'SUCCESS'}), 201
        return jsonify({'message': 'SUCCESS'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
   
    #     return jsonify({'error': str(e)}), 500

def proba(naziv):
    x = mongo_db.foldersf.find_one({ 'naziv': naziv })

    if not x:
        return None  

    p = {
        'naziv': x.get('naziv', ''),
        'subfolders': []
    }
    
    subfolders_query = mongo_db.foldersf.find({'roditelj': x.get('naziv', '')})

    for y in subfolders_query:
        if y.get('naziv'):
            p['subfolders'].append(proba(y['naziv']) or [])

    print(p)
    return p

@folder_routes.route("/ProcitajSveFoldereZaKorisnika", methods=['POST'])
def ProcitajSveFoldereZaKorisnika():
    data=request.get_json()
    naziv=data['naziv']    
    return proba(naziv)

    

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

def obrisi_podfoldere(naziv_foldera):
            # Pronalaženje podfoldera koji imaju roditelja 'naziv_foldera'
            podfolderi = mongo_db.foldersf.find({'rodjitelj': naziv_foldera})
            # Brisanje podfoldera
            for podfolder in podfolderi:
                # Rekurzivno pozivanje funkcije za brisanje podfoldera
                obrisi_podfoldere(podfolder['naziv'])
                # Brisanje podfoldera
                mongo_db.foldersf.delete_one({'naziv': podfolder['naziv']})

@folder_routes.route("/ObrisiFolder/<naziv_foldera>", methods=['DELETE'])
def ObrisiFolder(naziv_foldera):
    try:
        folder = mongo_db.foldersf.find_one({'naziv': naziv_foldera})
        if not folder:
            return jsonify({'message': 'Folder ne postoji'}), 404
        
        # Pozivanje rekurzivne funkcije za brisanje podfoldera
        def obrisi_podfoldere(naziv_foldera):
            # Pronalaženje podfoldera koji imaju roditelja 'naziv_foldera'
            podfolderi = mongo_db.foldersf.find({'rodjitelj': naziv_foldera})
            print(podfolderi)
            # Brisanje podfoldera
            for podfolder in podfolderi:
                print("usao")
                # Rekurzivno pozivanje funkcije za brisanje podfoldera
                obrisi_podfoldere(podfolder['naziv'])
                # Brisanje podfoldera
                mongo_db.foldersf.delete_one({'naziv': podfolder['naziv']})

        
        obrisi_podfoldere(naziv_foldera)

        # Brisanje samog foldera
        mongo_db.foldersf.delete_one({'naziv': naziv_foldera})

        return jsonify({'message': 'Folder uspešno obrisan'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@folder_routes.route("/IzmeniFolder", methods=['PUT'])
def IzmeniFolder():
    try:
        data = request.get_json()

        trenutno_ime = data.get('trenutno_ime')
        novo_ime = data.get('novo_ime')

        if not trenutno_ime or not novo_ime:
            return jsonify({'error': 'Potrebno je proslediti trenutno i novo ime'}), 400

        folder = mongo_db.foldersf.find_one({'naziv': trenutno_ime})
        if not folder:
            return jsonify({'message': 'Folder ne postoji'}), 404
        novifolder = mongo_db.foldersf.find_one({'naziv': novo_ime})
        if  novifolder:
            return jsonify({'message': 'Folder sa datim nazivom vec postoji'}), 404

        mongo_db.foldersf.update_one({'_id': folder['_id']}, {'$set': {'naziv': novo_ime}})

        return jsonify({'message': 'Playlista uspešno izmenjena'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@folder_routes.route("/vratiSadrzajFoldera", methods=['POST'])
def vratiSadrzajFoldera():
    try:
        data = request.get_json()
        nazivFoldera = data.get('naziv')
        
        folder = mongo_db.foldersf.find_one({'naziv': nazivFoldera})
        
        if not folder:
            return jsonify({'message': "Nije pronađen folder"}), 404

        files = folder.get('files', [])
        return jsonify({'files': files}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
