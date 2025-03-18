from flask import Blueprint, jsonify, request
from app import db
from app.models import Property

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('/properties', methods=['GET'])
def get_properties():
    properties = Property.query.all()
    return jsonify([p.to_dict() for p in properties])

@properties_bp.route('/properties', methods=['POST'])
def add_property():
    data = request.get_json()
    new_property = Property(**data)
    db.session.add(new_property)
    db.session.commit()
    return jsonify(new_property.to_dict()), 201

@properties_bp.route('/properties/<int:assessment_roll_number>', methods=['GET'])
def get_property(assessment_roll_number):
    property = Property.query.get_or_404(assessment_roll_number)
    return jsonify(property.to_dict())

@properties_bp.route('/properties/<int:assessment_roll_number>', methods=['PUT'])
def update_property(assessment_roll_number):
    data = request.get_json()
    property = Property.query.get_or_404(assessment_roll_number)
    if 'assessment_value' in data:
        property.assessment_value = data['assessment_value']
    if 'municipal_id' in data:
        property.municipal_id = data['municipal_id']
    db.session.commit()
    return jsonify(property.to_dict())

@properties_bp.route('/properties/<int:assessment_roll_number>', methods=['DELETE'])
def delete_property(assessment_roll_number):
    property = Property.query.get_or_404(assessment_roll_number)
    db.session.delete(property)
    db.session.commit()
    return '', 204
