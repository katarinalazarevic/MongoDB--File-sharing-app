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
        postojeci = mongo_db.foldersf.find_one({'naziv': roditelj})
        print(postojeci)
        if not postojeci:
            return jsonify({'message': 'Folder roditelj ne postoji'}), 400
        mongo_db.foldersf.insert_one({
            'naziv': naziv,
            "roditelj": postojeci.get('naziv'),
            # "datumKreiranja": noviFolder.datumKreiranja,
            # "files": [file for file in noviFolder.files],
            # "subfolders": [subfolder for subfolder in noviFolder.subfolders]
        })
        return jsonify({'message': 'SUCCESS'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
    # try:
    #     data=request.get_json()
    #     roditelj=data['roditelj'] #naziv roditeljskog foldera
    #     naziv=data['naziv']
    #     roditelj=data['vlasnik'] #emial korisnika
    #     postojeci = mongo_db.users.find_one({'email': vlasnik})
    #     if not postojeci:
    #         return jsonify({'message': 'Korisnik ne postoji'}), 400
    #     sfolder=mongo_db.foldersf.find_one({'naziv':naziv})
    #     if sfolder:
    #         return jsonify({'message': 'Folder sa datim nazivom vec postoji'}), 400

    #     noviFolder=Folder(naziv,vlasnik)
    #     mongo_db.foldersf.insert_one({
    #         'naziv':noviFolder.naziv,
    #         "vlasnik": noviFolder.vlasnik,
    #         "datumKreiranja": noviFolder.datumKreiranja,
    #         "files": [file for file in noviFolder.files],
    #         "subfolders": [subfolder for subfolder in noviFolder.subfolders]
       
    #     })
    #     if roditelj == '#':
    # # Ovdje ide kod koji se izvršava ako je roditelj "#"
    #      return jsonify({'message': 'SUCCESS'}), 201
    #     else: 
    #         # Ovdje ide kod koji se izvršava ako roditelj nije "#"
    #         rfolder = mongo_db.foldersf.find_one({'naziv': roditelj})
    #         if rfolder:
    #             mongo_db.foldersf.update_one(
    #                 {'naziv': roditelj},
    #                 {'$push': {'subfolders': noviFolder.naziv}}
    #             )
    #             return jsonify({'message': 'SUCCESS'}), 201
    #         else:
    #             return jsonify({'message': 'Doslo je do greske sa roditeljskim folderom'}), 400


    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500

def proba(naziv):
    x = mongo_db.foldersf.find_one({ 'naziv': naziv })

    if not x:
        return None  # Dodajte odgovarajući tretman kada ne postoji dokument sa datim nazivom

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

    rezultat = []

    for folder in svi_folderi:
        rezultat.append({
            'naziv': folder['naziv'],
            'subfolders': list(map(lambda x: x.get('naziv'), folder['subfolders']))
        })
    #print(rezultat)
    return jsonify({'folders': rezultat})
#     db.employees.aggregate( [
#    {
#       $graphLookup: {
#          from: "employees",
#          startWith: "$reportsTo",
#          connectFromField: "reportsTo",
#          connectToField: "name",
#          as: "reportingHierarchy"
#       }
#    }
# ] )

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

@folder_routes.route("/ObrisiFolder/<naziv_foldera>", methods=['DELETE'])
def ObrisiFolder(naziv_foldera):
    try:
        playlist = mongo_db.foldersf.find_one({'naziv': naziv_foldera})
        if not playlist:
            return jsonify({'message': 'Folder ne postoji'}), 404

        # Brisanje same playliste
        mongo_db.playlists.delete_one({'naziv': naziv_foldera})

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