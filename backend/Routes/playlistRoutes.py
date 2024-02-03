from db_config import mongo_db
from Models.Playlist import Playlist
from flask import request,jsonify, Blueprint

playlist_routes = Blueprint("playlist_routes", __name__)


@playlist_routes.route("/NapraviPlaylistu", methods=['POST'])
def NapraviPlaylistu():
    try:
        data=request.get_json()
    
        naziv=data['naziv']
        vlasnik=data['vlasnik'] #emial korisnika
        postojeci = mongo_db.users.find_one({'email': vlasnik})
        if not postojeci:
            return jsonify({'message': 'Korisnik ne postoji'}), 400
        sfolder=mongo_db.playlists.find_one({'naziv':naziv,'vlasnik':vlasnik})
        if sfolder:
            return jsonify({'message': 'Playlista sa datim nazivom vec postoji'}), 400

        novaPlaylista=Playlist(naziv,vlasnik)
        mongo_db.playlists.insert_one({
            'naziv':novaPlaylista.naziv,
            "vlasnik": novaPlaylista.vlasnik,
            "datumKreiranja": novaPlaylista.datumKreiranja,
            "pesme": [pesma for pesma in novaPlaylista.pesme]
       
        })
        
        
        return jsonify({'message': 'SUCCESS'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@playlist_routes.route("/PrikaziPesmePlayliste",methods=['POST'])
def PrikaziPesmePlayliste():
    data=request.get_json()
    vlasnik=data['vlasnik']
    naziv=data['naziv']
    playlista = mongo_db.playlists.find_one({'naziv': naziv,'vlasnik':vlasnik})
    if not playlista:
        return jsonify({'message': 'Playlista ne postoji'}), 404
    rezultat = {
            'naziv': playlista['naziv'],
            'pesme': playlista.get('pesme', [])
        }

    return jsonify( rezultat), 201


@playlist_routes.route("/ObrisiPlaylistu", methods=['DELETE'])
def ObrisiPlaylistu():
    try:
        data=request.get_json()
        vlasnik=data['vlasnik'] #email korisnika
        naziv=data['naziv']
        playlist = mongo_db.playlists.find_one({'naziv': naziv,'vlasnik':vlasnik})
        if not playlist:
            return jsonify({'message': 'Playlista ne postoji'}), 404

        # Brisanje same playliste
        mongo_db.playlists.delete_one({'naziv': naziv,'vlasnik':vlasnik})

        return jsonify({'message': 'Playlista uspešno obrisana'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@playlist_routes.route("/IzmeniPlaylistu", methods=['PUT'])
def IzmeniPlaylistu():
    try:
        data = request.get_json()

        trenutno_ime = data.get('trenutno_ime')
        novo_ime = data.get('novo_ime')
        vlasnik=data['vlasnik'] #email korisnika

        if not trenutno_ime or not novo_ime:
            return jsonify({'error': 'Potrebno je proslediti trenutno i novo ime'}), 400

        playlist = mongo_db.playlists.find_one({'naziv': trenutno_ime, 'vlasnik': vlasnik})
        if not playlist:
            return jsonify({'message': 'Playlista ne postoji'}), 404

        novaplaylist = mongo_db.playlists.find_one({'naziv': novo_ime, 'vlasnik': vlasnik})
        if  novaplaylist:
            return jsonify({'message': 'Playlista sa datim nazivom vec postoji'}), 404
        # Ažuriranje imena playliste
        mongo_db.playlists.update_one({'_id': playlist['_id']}, {'$set': {'naziv': novo_ime}})

        return jsonify({'message': 'Playlista uspešno izmenjena'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

#get metode !!!!