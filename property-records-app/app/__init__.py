from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///property_records.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    from .routes.municipalities import municipalities_bp
    from .routes.properties import properties_bp
    
    app.register_blueprint(municipalities_bp)
    app.register_blueprint(properties_bp)
    
    return app
