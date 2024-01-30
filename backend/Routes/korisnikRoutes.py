from flask import request,jsonify, Blueprint
from db_config import mongo_db
from Models.Korisnik import Korisnik
from werkzeug.security import check_password_hash
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