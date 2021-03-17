import os

db_URI = os.getenv("DATABASE_URL", "postgres+psycopg2://localhost:5432/interiorlist_db")
secret = os.getenv("SECRET", "Anybody Grudging Twisted Satiable Strongman Sprinkled")
