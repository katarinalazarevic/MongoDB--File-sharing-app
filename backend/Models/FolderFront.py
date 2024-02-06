from datetime import datetime

class Folder:
    def __init__(self, naziv, roditelj):
        self.naziv = naziv
        self.roditelj = roditelj
        self.datumKreiranja = datetime.utcnow()
        self.files = []
    
    def to_dict(self):
        return {
            "naziv": self.naziv,
            "roditelj": self.roditelj,
            "datumKreiranja": self.datumKreiranja,
            "files": [file for file in self.files]
        }