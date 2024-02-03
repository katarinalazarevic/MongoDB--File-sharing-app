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

   
