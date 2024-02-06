from flask_cors import CORS
from flask_restful import Api, Resource
from flask import Flask

app = Flask(__name__)
api = Api(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
def register_blueprint():
    from Routes.korisnikRoutes import korisnik_routes
    from Routes.folderFRputes import folder_routes
    from Routes.slikaRoutes import slika_routes
    from Routes.playlistRoutes import playlist_routes
    from Routes.pesmaRoutes import pesma_routes
    app.register_blueprint(korisnik_routes)
    app.register_blueprint(folder_routes)
    app.register_blueprint(slika_routes)
    app.register_blueprint(playlist_routes)
    app.register_blueprint(pesma_routes)

register_blueprint()
if __name__ == "__main__":
    app.run(debug=True)