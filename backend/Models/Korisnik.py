from werkzeug.security import generate_password_hash, check_password_hash

class Korisnik:
    def __init__(self, ime, prezime, email,sifra):
        self.ime = ime
        self.prezime = prezime
        self.email = email
        self.sifra=generate_password_hash(sifra)