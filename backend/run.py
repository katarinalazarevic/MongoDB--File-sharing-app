import pymongo


client = pymongo.MongoClient("mongodb://admin:password@mongo:27017")
db = client.flask_db
todos = db.todos
print(db)