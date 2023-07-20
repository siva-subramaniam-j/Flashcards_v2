from application.database import Base
from flask_security import UserMixin, RoleMixin
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Boolean, DateTime, Column, Integer, \
                       String, ForeignKey
from flask_sqlalchemy import SQLAlchemy
import datetime as d
db=SQLAlchemy()

class RolesUsers(Base):
    __tablename__ = 'roles_users'
    __table_args__={'extend_existing':True}
    id = Column(Integer(), primary_key=True)
    user_id = Column('user_id', Integer(), ForeignKey('user.id'))
    role_id = Column('role_id', Integer(), ForeignKey('role.id'))

class Role(Base, RoleMixin):
    __tablename__ = 'role'
    __table_args__={'extend_existing':True}
    id = Column(Integer(), primary_key=True)
    name = Column(String(80), unique=True)
    description = Column(String(255))

class User(Base, UserMixin):
    __tablename__ = 'user'
    __table_args__={'extend_existing':True}
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True)
    username = Column(String(255), unique=True, nullable=True)
    password = Column(String(255), nullable=False)
    fs_uniquifier = Column(String(255), unique=True, nullable=False)
    active = Column(Boolean())
    decks=relationship('Decks')        
    
    roles = relationship('Role', secondary='roles_users',
                        backref=backref('users', lazy='dynamic'))

class Cards(Base):
    __tablename__='cards'
    card_id=Column(Integer(),primary_key=True,autoincrement=True)
    deck_id=Column(Integer(),ForeignKey("decks.deck_id"))
    front=Column(String,nullable=False)
    back=Column(String,nullable=False)
    score=Column(Integer(), default=0)
    time=Column(DateTime(), default=d.datetime.now())        

class Decks(Base):
    __tablename__='decks'
    user_id=Column(Integer(),ForeignKey("user.id"))
    deck_id=Column(Integer(),unique=True,primary_key=True,nullable=False)
    deck_name=Column(String,nullable=False)
    deck_description=Column(String(255))
    score=Column(Integer(), default=0)
    avg_score=Column(Integer(), default=0)
    time=Column(DateTime(), default=d.datetime.now())
    cards=relationship('Cards')

