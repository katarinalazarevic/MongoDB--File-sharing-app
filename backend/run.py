from flask_cors import CORS
from flask_restful import Api, Resource
from flask import Flask
from Routes.korisnikRoutes import korisnik_routes

app = Flask(__name__)
api = Api(app)


CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

app.register_blueprint(korisnik_routes)

if __name__ == "__main__":
    app.run(debug=True)