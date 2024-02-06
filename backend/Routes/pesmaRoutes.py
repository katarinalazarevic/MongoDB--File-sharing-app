import datetime
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
    playlista = mongo_db.playlists.find_one({'naziv': plejlista,'email': roditelj})
    if not playlista:
        return jsonify({'message': 'Nepostojeca playlista'}), 400
    
    
                                 
    vlasnik = mongo_db.users.find_one({'email': roditelj})
    if not vlasnik:
        return jsonify({'message': 'Nepostojeci korisnik'}), 400

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    muzika = Pesma(
        sadrzaj=url,
        roditelj=roditelj,
        datumPostavljanja=datetime.utcnow()
    )

    mongo_db.playlists.update_one({'naziv': plejlista,'email': roditelj},
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
    
@pesma_routes.route("/ObrisiPesmu",methods=['DELETE'])
def ObrisiPesmu():
    try:

        data=request.get_json()
        url=data.get('url')
        email=data.get('email') #korisnik
        pesma= mongo_db.pesme.find_one({'url':url})
        playlista = mongo_db.playlists.find_one({'email': email,'pesme': {'$elemMatch': {'url': url}}})
        if not pesma:
            return jsonify({'message': 'Nepostojeca pesma'}), 400
        if not playlista:
            return jsonify({'message': 'Nepostojeca playlista'}), 400
        mongo_db.pesme.delete_one({'url': url})

            # Izbrisi pesmu iz niza pesama u playlisti
        mongo_db.playlists.update_one(
                {'vlasnik': email, 'pesme.url': url},
                {'$pull': {'pesme': {'url': url}}}
            )

        return jsonify({'message': 'Pesma uspešno obrisana iz baze i playliste'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500