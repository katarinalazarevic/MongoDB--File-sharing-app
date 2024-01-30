import pymongo
mongo_uri = 'mongodb://localhost:27017/MongoDB'
mongo_client = pymongo.MongoClient(mongo_uri)
mongo_db = mongo_client.get_database()