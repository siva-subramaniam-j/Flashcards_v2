
from flask_sqlalchemy import SQLAlchemy

import os


from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

db=SQLAlchemy()
base=os.path.dirname(os.path.realpath(__file__))
basedirr=os.path.dirname(base)
path=r'sqlite:///'+basedirr+r'\db_directory\cards.sqlite3'
engine = create_engine(path,connect_args={'check_same_thread': False})
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    from application import models
        
    Base.metadata.create_all(bind=engine)

    
'''

import os

base=os.path.dirname(os.path.realpath(__file__))
basedirr=os.path.dirname(base)
type(


based=os.path.join(basedirr,r'\db_directory\cards.sqlite3')
print(based)'''
