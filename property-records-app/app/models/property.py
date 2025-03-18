from sqlalchemy import Column, Integer, Float, ForeignKey
from app import db

class Property(db.Model):
    __tablename__ = 'properties'

    assessment_roll_number = Column(Integer, primary_key=True)
    assessment_value = Column(Float, nullable=False)
    municipal_id = Column(Integer, ForeignKey('municipalities.municipal_id'), nullable=False)

    def __repr__(self):
        return f'<Property {self.assessment_roll_number}>'
