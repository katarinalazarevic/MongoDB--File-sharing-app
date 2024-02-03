from datetime import datetime

class Playlist:
    def __init__(self, naziv, vlasnik):
        self.naziv = naziv
        self.vlasnik = vlasnik
        self.datumKreiranja = datetime.utcnow()
        self.pesme = []
        
    
    def to_dict(self):
        return {
            "naziv": self.naziv,
            "vlasnik": self.vlasnik,
            "datumKreiranja": self.datumKreiranja,
            "pesme": [pesma for pesma in self.pesme]
        }