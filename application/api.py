from ast import arg
from flask_login import current_user
from flask_restful import Resource,Api,fields,marshal_with,reqparse
from pyrsistent import field
from application.models import *
from application.database import db,db_session
from application.validation import NotFoundError,BusinessValidationError
from flask_security import auth_required
import json
from flask import make_response

output_fields={
    "user_id":fields.Integer,
    "deck_id":fields.Integer,
    "deck_name": fields.String,
    "deck_description": fields.String,
    "score":fields.Integer,
    "avg_score":fields.Integer,
    "time":fields.String,

}
cards_output_fields={
    "card_id":fields.Integer,
    
    "front":fields.String,
    "back":fields.String,
    "score":fields.Integer,
    "time":fields.String
}
card_out_fields={
    "card_id":fields.Integer,
    "front":fields.String,
    "back":fields.String,
}
add_deck_parser=reqparse.RequestParser()
add_deck_parser.add_argument("deck_name")
add_deck_parser.add_argument("deck_description")

add_card_parser=reqparse.RequestParser()
add_card_parser.add_argument("deck_id")
add_card_parser.add_argument("front")
add_card_parser.add_argument("back")

put_card_parser=reqparse.RequestParser()
put_card_parser.add_argument("card_id")
put_card_parser.add_argument("front")
put_card_parser.add_argument("back")

put_card_score_parser=reqparse.RequestParser()
put_card_score_parser.add_argument("card_id")
put_card_score_parser.add_argument("score")

put_deck_score_parser=reqparse.RequestParser()
put_deck_score_parser.add_argument("deck_id")
put_deck_score_parser.add_argument("score")

class DeckAPI(Resource):
    @auth_required()
    @marshal_with(output_fields)
    def get(self,deck_id):
        deck = db_session.query(Decks).filter(Decks.deck_id==deck_id).one()
        if (deck):
            return(deck)
        else:
            raise NotFoundError("Deck Not Found",status_code=404)
        
    
    


    
    def post(self):
        args=add_deck_parser.parse_args()
        deck_name=args.get('deck_name')
        deck_description=args.get('deck_description')
        if deck_name is None:
            raise BusinessValidationError(status_code=400, error_code="BE1001",error_message="Deck name cant be null")

        if deck_name :
            deck_check=db_session.query(Decks).filter(Decks.deck_name==deck_name).all()
            if deck_check:
                raise BusinessValidationError(status_code=409, error_code="BE1002",error_message="Deck already exists")
            else:
                new_deck = Decks(user_id=current_user.id,deck_name=deck_name,deck_description=deck_description,)
                db_session.add(new_deck) 
                db_session.commit()

                return("",201)

    def put(self):
        args=put_deck_score_parser.parse_args()
        deck_id=args.get('deck_id')
        score=args.get('score')
        deck=db_session.query(Decks).filter(Decks.deck_id==deck_id).one()
        deck.score=score
        deck.avg_score=(deck.avg_score+int(score))/2
        deck.time=d.datetime.now()
        db_session.commit()
        return("",201)

        
        
        
    def delete(self,deck_id):
        deck=db_session.query(Decks).filter(Decks.deck_id==deck_id).one()
        db_session.delete(deck)
        db_session.commit()
        return("",200)    

class CardsAPI(Resource):
    @auth_required()
    @marshal_with(cards_output_fields)
    def get(self,deck_id):
        cards=db_session.query(Cards).filter(Cards.deck_id==deck_id).all()
        if cards:
            return(cards)
        else:
            raise NotFoundError("Cards Not Found",status_code=404)
    
    def post(self):
        args=add_card_parser.parse_args()
        deck_id=args.get('deck_id')
        front=args.get('front')
        back=args.get('back')
        if deck_id:
            new_card=Cards(deck_id=deck_id,front=front,back=back)
            db_session.add(new_card)
            db_session.commit()
            return("",201)
        else:
            raise BusinessValidationError(status_code=400, error_code="DE1001",error_message="Deck id cant be null")
    
    def delete(self,card_id):
        card=db_session.query(Cards).filter(Cards.card_id==card_id).one()
        db_session.delete(card)
        db_session.commit()
        return("",200)
    
    def put(self):
        args=put_card_parser.parse_args()
        card_id=args.get('card_id')
        new_front=args.get('front')
        new_back=args.get('back')
        card=db_session.query(Cards).filter(Cards.card_id==card_id).one()
        card.front=new_front
        card.back=new_back
        db_session.commit()
        return("",200)
        





class DeckGetAPI(Resource):
    @marshal_with(output_fields)
    @auth_required()
    def get(self,user_id):
        deck = db_session.query(Decks).filter(Decks.user_id==user_id).all()
        
        if (deck):
            return(deck)
        else:
            raise NotFoundError("No Deck associated with the user",status_code=404)

class CardGetAPI(Resource):
    @marshal_with(card_out_fields)
    @auth_required()

    def get(self,card_id):
        card=db_session.query(Cards).filter(Cards.card_id==card_id).one()

        if card:
            return(card)
        else:
            raise NotFoundError("No Card found",status_code=404)
    
    def put(self):
        args=put_card_score_parser.parse_args()
        card_id=args.get('card_id')
        time=d.datetime.now()
        score=args.get('score')
        card=db_session.query(Cards).filter(Cards.card_id==card_id).one()
        card.score=score
        card.time=time
        db_session.commit()
        return("",200)