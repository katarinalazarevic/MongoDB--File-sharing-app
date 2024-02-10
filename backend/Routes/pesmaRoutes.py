from datetime import datetime
datetime.utcnow()

from flask import Blueprint, request, jsonify
from Models.Pesma import Pesma
from db_config import mongo_db

pesma_routes = Blueprint("pesma_routes", __name__)

@pesma_routes.route("/UploadPesmu", methods=['POST'])
def UploadPesmu():
    data = request.form.to_dict()
    roditelj = data.get('roditelj')
    url = data.get('url')
    plejlista=data.get('playlist')
    print(roditelj)
    print(plejlista)
    print(url)
    playlista = mongo_db.playlists.find_one({'naziv': plejlista,'vlasnik': roditelj})
    if not playlista:
        return jsonify({'message': 'Nepostojeca playlista'}), 400
    
    
                                 
    vlasnik = mongo_db.users.find_one({'email': roditelj})
    if not vlasnik:
        return jsonify({'message': 'Nepostojeci korisnik'}), 400

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    muzika = Pesma(
        url=url,
        roditelj=roditelj,
        datumPostavljanja=datetime.utcnow() 
    )

    mongo_db.playlists.update_one({'naziv': plejlista,'vlasnik': roditelj},
                                   {'$push': {'pesme': url}})
    muzika_id = mongo_db.pesma.insert_one(muzika.to_dict()).inserted_id

    return jsonify({'message': 'YouTube audio added successfully', 'muzika_id': str(muzika_id)})


@pesma_routes.route("/VratiPesmePleyliste",methods=['POST'])
def VratiPesmePleyliste():
    try:
        data = request.get_json
        roditelj = data.get('roditelj')
        plejlista=data.get('playlist')
        playlista = mongo_db.playlists.find_one({'naziv': plejlista,'email': roditelj})
        if not playlista:
            return jsonify({'message': 'Nepostojeca playlista'}), 400
        pesme_iz_playliste = playlista.get('pesme', [])
        
        return jsonify({'playlist': plejlista,'pesme':pesme_iz_playliste}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@pesma_routes.route("/ObrisiPesmu", methods=['DELETE'])
def ObrisiPesmu():
    try:
        # Dobijanje podataka iz tela zahteva
        data = request.get_json()
        url = data.get('url')
        email = data.get('email')  # Korisnik

        # Pronalaženje pesme po URL-u
        pesma = mongo_db.pesma.find_one({'url': url})

        # Pronalaženje playliste korisnika koja sadrži tu pesmu
        playliste = mongo_db.playlists.find({'pesme': url})
        print(playliste)
        # Iteriranje kroz rezultate pretrage
        for playlista in playliste:
            # Pronađena je playlista koja sadrži datu pesmu
            print("Pronađena playlista:", playlista)
            # Ovde možete dodati kod za brisanje pesme iz playliste

        print("Pesma je", pesma)
        print("Playlista je", playlista)

        # Provera da li je pesma i playlista pronađena
        if not pesma:
            return jsonify({'message': 'Nepostojeća pesma'}), 400
        if not playlista:
            return jsonify({'message': 'Pesma nije pridružena korisniku'}), 400

        # Brisanje pesme iz baze podataka
        mongo_db.pesme.delete_one({'url': url})

        # Izbrisi pesmu iz niza pesama u playlisti
        mongo_db.playlists.update_one(
            {'vlasnik': email, 'pesme.url': url},
            {'$pull': {'pesme': {'url': url}}}
        )

        return jsonify({'message': 'Pesma uspešno obrisana iz baze i playliste'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500