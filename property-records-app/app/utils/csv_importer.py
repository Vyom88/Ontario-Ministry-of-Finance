import csv
from app import db
from app.models.municipality import Municipality
from app.models.property import Property

def import_csv_data():
    with open('data/municipalities.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            municipality = Municipality(
                municipal_id=row['munid'],
                municipal_name=row['name_municipal_w_type'],
                municipal_rate=row['municipal_rate'],
                education_rate=row['education_rate']
            )
            db.session.add(municipality)
        db.session.commit()

    with open('data/properties.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            property = Property(
                assessment_roll_number=row['assessment_roll_number'],
                assessment_value=row['assessment_value'],
                municipal_id=row['municipal_id']
            )
            db.session.add(property)
        db.session.commit()
