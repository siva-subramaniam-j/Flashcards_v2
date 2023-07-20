import os
from flask import render_template
from flask import Flask, render_template_string
from flask_security import Security, current_user, auth_required, \
     SQLAlchemySessionUserDatastore
from application.database import db_session, init_db
from flask_security.utils import hash_password
from application.models import User, Role
from flask_restful import Resource,Api
from flask_sqlalchemy import SQLAlchemy
# Create app
app = Flask(__name__)
app.config['DEBUG'] = True

# Generate a nice key using secrets.token_urlsafe()
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
# Bcrypt is set as default SECURITY_PASSWORD_HASH, which requires a salt
# Generate a good salt using: secrets.SystemRandom().getrandbits(128)
app.config['SECURITY_PASSWORD_SALT'] = os.environ.get("SECURITY_PASSWORD_SALT", '146585145368132386173505678016728509634')
app.config['SECURITY_REGISTERABLE']=True
app.config['SECURITY_USERNAME_ENABLE']=True
app.config['SECURITY_SEND_REGISTER_EMAIL']=False
app.config['SECURITY_UNAUTHORIZED_VIEW']=False
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=True
# Setup Flask-Security
user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
security = Security(app, user_datastore)

api=Api(app)
app.app_context().push()

# Create a user to test with
from application.api import CardGetAPI, CardsAPI, DeckAPI, DeckGetAPI
api.add_resource(DeckAPI,"/api/deck/get/<string:deck_id>","/api/deck/post","/api/deck/delete/<string:deck_id>","/api/deck/put")
api.add_resource(DeckGetAPI,"/api/get/deck/<string:user_id>",)
api.add_resource(CardsAPI,"/api/cards/get/<string:deck_id>","/api/cards/post","/api/cards/delete/<string:card_id>","/api/cards/put")
api.add_resource(CardGetAPI,"/api/get/card/<string:card_id>","/api/put/card_score")
# Views
@app.before_first_request
def create_user():
     init_db()
     db_session.commit()


@app.route("/")

def home():
     if current_user.is_authenticated:
          return render_template('dashboard.html',User=current_user.username,user_id=current_user.id)
     else:
          return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
