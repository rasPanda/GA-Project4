# pylint: disable=import-error
from flask import Blueprint, request, g
from models.product import Product
from serializers.product import ProductSchema
from decorators.secure_route import secure_route

product_schema = ProductSchema()

router = Blueprint(__name__, "products")

@router.route("/product", methods=["GET"])
def get_all_products():
    products = Product.query.all()
    return product_schema.jsonify(products, many=True), 200

@router.route("/product/<int:product_id>", methods=["GET"])
def get_single_product(product_id):
    product = Product.query.get(product_id)
    if not product: 
        return { 'messages': 'Product not found' }, 404
    return product_schema.jsonify(product), 200


@router.route("/product", methods=["POST"])
@secure_route
def create_product():
    product_dict = request.json
    product = product_schema.load(product_dict)
    product.user = g.current_user
    product.save()
    return product_schema.jsonify(product), 201


@router.route("/product/<int:product_id>", methods=["PUT"])
@secure_route
def edit_product(product_id):
    existing_product = Product.query.get(product_id)
    product_dict = request.json
    product = product_schema.load(product_dict, instance=existing_product, partial=True)
    product.save()
    return product_schema.jsonify(product), 201


@router.route("/product/<int:product_id>", methods=["DELETE"])
@secure_route
def delete_product(product_id):
    product = Product.query.get(product_id)
    if g.current_user.role != 'admin':
        return { "messages": "Unauthorized" }, 401
    product.remove()
    return { "messages": "Product successfully deleted" }, 200