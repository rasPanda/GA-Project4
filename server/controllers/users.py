# pylint: disable=import-error
from flask import Blueprint, request, g
from models.user import User
from serializers.user import UserSchema
from decorators.secure_route import secure_route

user_schema = UserSchema()

router = Blueprint(__name__, "users")

@router.route("/register", methods=["POST"])
def register():
    user = user_schema.load(request.json)
    user.save()
    return user_schema.jsonify(user), 201


@router.route("/login", methods=["GET"])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if not user:
        return { 'messages': 'No player found' }
    if not user.validate_password(request.json['password']):
        return { 'messages': 'Incorrect password' }, 402
    token = user.generate_token()
    return { 'token': token, 'messages': f'Welcome back {user.username}!' }


@router.route('/profile', methods=['GET'])
@secure_route
def get_own_profile():
    return user_schema.jsonify(g.current_user), 200


@router.route('/profile/<int:user_id>', methods=['GET'])
@secure_route
def get_user_profile(user_id):
    user = User.query.get(user_id)
    return user_schema.jsonify(user), 200


@router.route("/profile", methods=['DELETE'])
@secure_route
def delete_profile():
    user = User.query.get(g.current_user.id)
    user.remove()
    return { "messages": "Profile deleted!" }, 200


@router.route("/profile", methods=['PUT'])
@secure_route
def edit_profile():
    existing_user = User.query.get(g.current_user.id)
    user_dict = request.json
    user = user_schema.load(user_dict, instance=existing_user, partial=True)
    user.save()
    return user_schema.jsonify(user), 200


@router.route("/follow/<int:user_id>", methods=["POST"])
@secure_route
def follow(user_id):
    user = g.current_user
    user_to_follow = User.query.get(user_id)
    if user == user_to_follow:
        return { "messages": "Can't follow yourself!" }, 400
    if user_to_follow in user.following:
        return { "messages": "Already following" }, 400
    user.following.append(user_to_follow)
    user.save()
    return { "messages": f"{user_to_follow.username} followed!" }, 201


@router.route("/follow/<int:user_id>", methods=["DELETE"])
@secure_route
def unfollow(user_id):
    user = g.current_user
    user_to_unfollow = User.query.get(user_id)
    if user == user_to_unfollow:
        return { "messages": "Can't unfollow yourself!" }, 400
    if user_to_unfollow not in user.following:
        return { "messages": "Not following" }, 404
    user.following.remove(user_to_unfollow)
    user.save()
    return { "messages": f"{user_to_unfollow.username} unfollowed!" }, 200