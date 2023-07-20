from distutils.archive_util import make_archive
from email import message
from flask import make_response
from werkzeug.exceptions import HTTPException
import json
class NotFoundError(HTTPException):
    def __init__(self,message, status_code):
        self.response = make_response(message,status_code)

class BusinessValidationError(HTTPException):
    def __init__(self,error_code,error_message,status_code):
        message={"message":{"code": error_code, "message":error_message}}
        self.response=make_response(json.dumps(message),status_code)
