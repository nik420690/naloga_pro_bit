from flask import Blueprint, request, jsonify
from app import db
from app.models import Car
from app.auth_utils import admin_required

cars_bp = Blueprint("cars", __name__)


@cars_bp.route("", methods=["GET"])
def list_cars():
    query = Car.query
    # Filter by brand
    brand = request.args.get("brand")
    if brand:
        query = query.filter(Car.brand.ilike(f"%{brand}%"))
    # Filter by min/max price
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)
    if min_price is not None:
        query = query.filter(Car.price >= min_price)
    if max_price is not None:
        query = query.filter(Car.price <= max_price)
    # Sort
    sort = request.args.get("sort", "id")
    order = request.args.get("order", "asc")
    if sort == "brand":
        query = query.order_by(Car.brand.asc() if order == "asc" else Car.brand.desc())
    elif sort == "year":
        query = query.order_by(Car.year.asc() if order == "asc" else Car.year.desc())
    elif sort == "price":
        query = query.order_by(Car.price.asc() if order == "asc" else Car.price.desc())
    else:
        query = query.order_by(Car.id.asc())
    cars = query.all()
    return jsonify([c.to_dict() for c in cars])


@cars_bp.route("/brands", methods=["GET"])
def list_brands():
    brands = db.session.query(Car.brand).distinct().order_by(Car.brand).all()
    return jsonify([b[0] for b in brands])


@cars_bp.route("/<int:car_id>", methods=["GET"])
def get_car(car_id):
    car = Car.query.get_or_404(car_id)
    return jsonify(car.to_dict())


@cars_bp.route("", methods=["POST"])
@admin_required
def create_car():
    data = request.get_json()
    required = ["brand", "model", "year", "price", "fuel_type", "doors"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    try:
        car = Car(
            brand=data["brand"].strip(),
            model=data["model"].strip(),
            year=int(data["year"]),
            price=float(data["price"]),
            fuel_type=data["fuel_type"].strip(),
            doors=int(data["doors"]),
            description=(data.get("description") or "").strip(),
        )
        db.session.add(car)
        db.session.commit()
        return jsonify(car.to_dict()), 201
    except (ValueError, TypeError) as e:
        return jsonify({"error": str(e)}), 400


@cars_bp.route("/<int:car_id>", methods=["PUT"])
@admin_required
def update_car(car_id):
    car = Car.query.get_or_404(car_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    for key in ["brand", "model", "year", "price", "fuel_type", "doors", "description"]:
        if key in data:
            if key == "year":
                car.year = int(data[key])
            elif key == "price":
                car.price = float(data[key])
            elif key == "doors":
                car.doors = int(data[key])
            else:
                setattr(car, key, (data[key] or "").strip() if isinstance(data[key], str) else data[key])
    try:
        db.session.commit()
        return jsonify(car.to_dict()), 200
    except (ValueError, TypeError) as e:
        return jsonify({"error": str(e)}), 400


@cars_bp.route("/<int:car_id>", methods=["DELETE"])
@admin_required
def delete_car(car_id):
    car = Car.query.get_or_404(car_id)
    db.session.delete(car)
    db.session.commit()
    return "", 204
