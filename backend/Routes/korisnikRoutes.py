import collections
from typing import Collection
from flask import request,jsonify, Blueprint
from db_config import mongo_db
from Models.Korisnik import Korisnik
from werkzeug.security import check_password_hash,generate_password_hash
from bson import json_util



korisnik_routes = Blueprint("korisnik_routes", __name__)

@korisnik_routes.route('/Register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        ime = data['ime']
        prezime=data['prezime']
        email = data['email']
        sifra = data['sifra']

        postojeci = mongo_db.users.find_one({'email': email})
        if postojeci:
            return jsonify({'message': 'Email already registered'}), 400

        noviKorisnik = Korisnik(ime,prezime, email, sifra)

        # Save user to MongoDB
        user_id = mongo_db.users.insert_one({
            'ime': noviKorisnik.ime,
            'prezime':noviKorisnik.prezime,
            'email': noviKorisnik.email,
            'sifra': noviKorisnik.sifra
        }).inserted_id

        return jsonify({'message': 'SUCCESS'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@korisnik_routes.route('/Login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        email = data['email']
        sifra = data['sifra']

        korisnik = mongo_db.users.find_one({'email': email})

        if korisnik and check_password_hash(korisnik['sifra'], sifra):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@korisnik_routes.route('/VratiKorisnike', methods=['GET'])
def get_all_users():
    try:
        korisnici = list(mongo_db.users.find({}, {'_id': 0}))
        return jsonify(json_util.dumps(korisnici)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@korisnik_routes.route('/updateKorisnik', methods=['PUT']) #za menjanje sifre
def  updateKorisnik():
    data = request.get_json()
    email_korisnika = data['email']
    nova_sifra = data['nova_sifra']

    Hashnova_sifra= generate_password_hash(nova_sifra)

    
    korisnik=mongo_db.users.find_one({'email': email_korisnika})

    if korisnik:
        id_korisnika = korisnik["_id"]

        
        novi_podaci = {
            "$set": {
                "sifra": Hashnova_sifra
            }
        }

       
        rezultat = mongo_db.users.update_one({"_id": id_korisnika}, novi_podaci)

        if rezultat.modified_count > 0:
             return jsonify({'message': 'SUCCESS'}), 201
        else:
            return jsonify({"status": "error", "message": "Nema promena u šifri"})
    else:
        return jsonify({"status": "error", "message": "Korisnik sa datim emailom nije pronađen"})




@korisnik_routes.route('/deleteKorisnik', methods=['DELETE'])
def obrisiKorisnika():
    data = request.get_json()
    emailKorisnika = data['email']
    
   
    korisnik = mongo_db.users.find_one({"email": emailKorisnika})

    if korisnik:
        
        id_korisnika = korisnik["_id"]

        
        rezultat = mongo_db.users.delete_one({"_id": id_korisnika})

        if rezultat.deleted_count > 0:
            return jsonify({"status": "success", "message": "Korisnik uspešno obrisan"})
        else:
            return jsonify({"status": "error", "message": "Nema promena, korisnik nije obrisan"})
    else:
        return jsonify({"status": "error", "message": "Korisnik sa datim emailom nije pronađen"})


