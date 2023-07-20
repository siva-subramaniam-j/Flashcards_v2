import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
    DEBUG = True
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR = os.path.join(basedir, "../db_directory")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "cards.sqlite3")
    
    SECRET_KEY='234ASEF234ROASDFJKL23451'
    SECURITY_PASSWORD_HASH="bcrypt"
    SECURITY_PASSWORD_SALT="RLWKEJRLKWJ"
    SECURITY_REGISTERABLE=True
    



