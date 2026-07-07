"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Store, Category, Product
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/store", methods=["GET"])
def get_store():

    store = Store.query.first()

    if store is None:
        return jsonify({
            "message": "No existe ninguna tienda todavia."
        }), 404

    return jsonify(store.serialize()), 200


@api.route("/store", methods=["POST"])
def create_store():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    name = data.get("name")
    logo = data.get("logo")
    description = data.get("description")

    if not name:
        return jsonify({"error": "El nombre de la tienda es obligatorio"}), 400

    existing_store = Store.query.first()

    if existing_store:
        return jsonify({"error": "Ya existe una tienda"}), 400

    new_store = Store(
        name=name,
        logo=logo,
        description=description
    )

    db.session.add(new_store)
    db.session.commit()

    return jsonify(new_store.serialize()), 201


@api.route("/store", methods=["PUT"])
def update_store():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    store = Store.query.first()

    if store is None:
        return jsonify({"error": "No existe ninguna tienda todavía"}), 404

    if "name" in data:
        store.name = data["name"]

    if "logo" in data:
        store.logo = data["logo"]

    if "description" in data:
        store.description = data["description"]

    db.session.commit()

    return jsonify(store.serialize()), 200

@api.route("/categories", methods=["GET"])
def get_categories():
    categories = Category.query.all()

    return jsonify([category.serialize() for category in categories]), 200

@api.route("/categories", methods=["POST"])
def create_category():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    name = data.get("name")

    if not name:
        return jsonify({"error": "El nombre de la categoría es obligatorio"}), 400

    new_category = Category(name=name)

    db.session.add(new_category)
    db.session.commit()

    return jsonify(new_category.serialize()), 201

@api.route("/categories/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = Category.query.get(category_id)

    if category is None:
        return jsonify({"error": "Categoría no encontrada"}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({"message": "Categoría eliminada correctamente"}), 200

@api.route("/products/category/<int:category_id>", methods=["GET"])
def get_products_by_category(category_id):
    category = Category.query.get(category_id)

    if category is None:
        return jsonify({"error": "Categoría no encontrada"}), 404

    products = Product.query.filter_by(category_id=category_id).all()

    return jsonify([product.serialize() for product in products]), 200

@api.route("/products", methods=["POST"])
def create_product():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    name = data.get("name")
    price = data.get("price")
    description = data.get("description")
    image = data.get("image")
    category_id = data.get("category_id")

    if not name:
        return jsonify({"error": "El nombre del producto es obligatorio"}), 400

    if price is None:
        return jsonify({"error": "El precio del producto es obligatorio"}), 400

    if not category_id:
        return jsonify({"error": "La categoría es obligatoria"}), 400

    category = Category.query.get(category_id)

    if category is None:
        return jsonify({"error": "Categoría no encontrada"}), 404

    new_product = Product(
        name=name,
        price=price,
        description=description,
        image=image,
        category_id=category_id
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.serialize()), 201

@api.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No enviaste datos"}), 400

    product = Product.query.get(product_id)

    if product is None:
        return jsonify({"error": "Producto no encontrado"}), 404

    if "name" in data:
        product.name = data["name"]

    if "price" in data:
        product.price = data["price"]

    if "description" in data:
        product.description = data["description"]

    if "image" in data:
        product.image = data["image"]

    if "category_id" in data:
        category = Category.query.get(data["category_id"])

        if category is None:
            return jsonify({"error": "Categoría no encontrada"}), 404

        product.category_id = data["category_id"]

    db.session.commit()

    return jsonify(product.serialize()), 200

@api.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)

    if product is None:
        return jsonify({"error": "Producto no encontrado"}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Producto eliminado correctamente"}), 200