from sqlalchemy import Column, Integer, String, Float
from app import db

class Municipality(db.Model):
    __tablename__ = 'municipalities'

    municipal_id = Column(Integer, primary_key=True)
    municipal_name = Column(String, nullable=False)
    municipal_rate = Column(Float, nullable=False)
    education_rate = Column(Float, nullable=False)

    def __repr__(self):
        return f'<Municipality {self.municipal_name}>'
