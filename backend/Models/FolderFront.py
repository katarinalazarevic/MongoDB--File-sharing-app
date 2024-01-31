from datetime import datetime

class Folder:
    def __init__(self, naziv, vlasnik):
        self.naziv = naziv
        self.vlasnik = vlasnik
        self.datumKreiranja = datetime.utcnow()
        self.files = []
        self.subfolders = []
    
    def to_dict(self):
        return {
            "naziv": self.naziv,
            "vlasnik": self.vlasnik,
            "datumKreiranja": self.datumKreiranja,
            "files": [file for file in self.files],
            "subfolders": [subfolder for subfolder in self.subfolders]
        }