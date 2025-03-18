from flask import Blueprint, request, jsonify
from app.models.municipality import Municipality
from app import db

municipalities_bp = Blueprint('municipalities', __name__)

@municipalities_bp.route('/municipalities', methods=['GET'])
def get_municipalities():
    municipalities = Municipality.query.all()
    return jsonify([m.to_dict() for m in municipalities])

@municipalities_bp.route('/municipalities', methods=['POST'])
def add_municipality():
    data = request.get_json()
    new_municipality = Municipality(**data)
    db.session.add(new_municipality)
    db.session.commit()
    return jsonify(new_municipality.to_dict()), 201

@municipalities_bp.route('/municipalities/<int:municipal_id>', methods=['GET'])
def get_municipality(municipal_id):
    municipality = Municipality.query.get_or_404(municipal_id)
    return jsonify(municipality)

@municipalities_bp.route('/municipalities/<int:municipal_id>', methods=['PUT'])
def update_municipality(municipal_id):
    data = request.get_json()
    municipality = Municipality.query.get_or_404(municipal_id)
    if 'municipal_name' in data:
        municipality.municipal_name = data['municipal_name']
    if 'municipal_rate' in data:
        municipality.municipal_rate = data['municipal_rate']
    if 'education_rate' in data:
        municipality.education_rate = data['education_rate']
    db.session.commit()
    return jsonify(municipality)

@municipalities_bp.route('/municipalities/<int:municipal_id>', methods=['DELETE'])
def delete_municipality(municipal_id):
    municipality = Municipality.query.get_or_404(municipal_id)
    db.session.delete(municipality)
    db.session.commit()
    return '', 204
