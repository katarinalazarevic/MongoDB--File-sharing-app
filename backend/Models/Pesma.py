from datetime import datetime
from db_config import mongo_db

class Pesma:
    def __init__(self, url, roditelj, datumPostavljanja=None):
        
        self.url = url 
        self.roditelj = roditelj
        self.datumPostavljanja = datumPostavljanja or datetime.utcnow()

    def to_dict(self):
        return {
            'url': self.url,
            'roditelj': self.roditelj,
            'datumPostavljanja': self.datumPostavljanja
        }