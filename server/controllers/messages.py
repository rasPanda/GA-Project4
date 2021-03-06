# pylint: disable=import-error
from flask import Blueprint, request, g
from models.message import Message
from serializers.message import MessageSchema
from decorators.secure_route import secure_route

message_schema = MessageSchema()

router = Blueprint(__name__, "messages")

@router.route("/message/inbox", methods=["GET"])
@secure_route
def get_user_inbox():
    messages = Message.query.filter_by(recipient_id=g.current_user.id)
    return message_schema.jsonify(messages, many=True), 200

@router.route("/message/sent", methods=["GET"])
@secure_route
def get_user_sent():
    messages = Message.query.filter_by(sender_id=g.current_user.id)
    return message_schema.jsonify(messages, many=True), 200

@router.route("/message/from_<int:sender_id>/to_<int:recipient_id>", methods=["POST"])
@secure_route
def send_message(sender_id, recipient_id):
    message_dict = request.json
    message = message_schema.load(message_dict)
    message.sender_id = sender_id
    message.recipient_id = recipient_id
    message.save()
    return { "messages": "Message sent!" }, 201

@router.route("/message/<int:message_id>", methods=["DELETE"])
@secure_route
def delete_message(message_id):
    message = Message.query.get(message_id)
    if message.sender != g.current_user:
        return { 'messages': 'Unauthorized' }, 401
    message.remove()
    return { "messages": "Message deleted!" }, 200

@router.route("/message/<int:message_id>", methods=["PUT"])
@secure_route
def edit_message(message_id):
    existing_message = Message.query.get(message_id)
    message_dict = request.json
    if existing_message.sender != g.current_user:
        return { 'messages': 'Unauthorized' }, 401
    message = message_schema.load(message_dict, instance=existing_message, partial=True)
    message.save()
    return message_schema.jsonify(message), 200
