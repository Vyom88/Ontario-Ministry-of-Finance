from app import create_app, db
from app.utils.csv_importer import import_csv_data

app = create_app()

with app.app_context():
    db.create_all()
    import_csv_data()

if __name__ == '__main__':
    app.run(debug=True)
