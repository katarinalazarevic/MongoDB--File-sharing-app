from flask_pymongo import PyMongo
from bson import ObjectId
from datetime import datetime



class Image:
    def __init__(self, imeFajla, sadrzaj, vlasnik):
        self.imeFajla = imeFajla
        self.sadrzaj = sadrzaj
        self.vlasnik = vlasnik
        self.datumPostavljanja =  datetime.utcnow()

    @staticmethod
    def from_dict(data):
        return Image(
            imeFajla=data['imeFajla'],
            sadrzaj=data['sadrzaj'],
            vlasnik=data['vlasnik'],
            datumPostavljanja=data['datumPostavljanja']
        )

    def to_dict(self):
        return {
            'imeFajla': self.imeFajla,
            'sadrzaj': self.sadrzaj,
            'vlasnik': self.vlasnik,
            'datumPostavljanja': self.datumPostavljanja
        }

    # @staticmethod
    # def find_by_id(image_id):
    #     image_collection = mongo.db.images
    #     image_data = image_collection.find_one({'_id': ObjectId(image_id)})
    #     return Image.from_dict(image_data) if image_data else None

    # @staticmethod
    # def save_to_db(image):
    #     image_collection = mongo.db.images
    #     result = image_collection.insert_one(image.to_dict())
    #     return str(result.inserted_id)
