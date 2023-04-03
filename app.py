from flask import Flask, render_template, redirect, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from celery_worker import make_celery
from celery.result import AsyncResult
from celery.schedules import crontab
import time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///blogs_database.sqlite3"
db = SQLAlchemy(app)

app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(app)

@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(10.0, add_together.s(9, 6), name='add every 10')

@celery.task()
def add_together(a, b):
    time.sleep(5)
    return a + b


@celery.task
def generate_csv():
    # importing the csv module
    import csv
    time.sleep(6)
 
    # field names
    fields = ['Name', 'Branch', 'Year', 'CGPA']
    
    # data rows of csv file
    rows = [ ['Nikhil', 'COE', '2', '9.0'],
            ['Sanchit', 'COE', '2', '9.1'],
            ['Aditya', 'IT', '2', '9.3'],
            ['Sagar', 'SE', '1', '9.5'],
            ['Prateek', 'MCE', '3', '7.8'],
            ['Sahil', 'EP', '2', '9.1']]
    
    # writing to csv file
    with open("static/data.csv", 'w') as csvfile:
        # creating a csv writer object
        csvwriter = csv.writer(csvfile)
        
        # writing the fields
        csvwriter.writerow(fields)
        
        # writing the data rows
        csvwriter.writerows(rows)

    return "Job Started..."


class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)


@app.route("/")
def home():
    return render_template("index.html", a = False)


@app.route("/getallposts")
def get_all_posts():
    blogs = Blog.query.all()  # get all the objects for the blog model
    data = []
    for blog in blogs:
        data.append({
            'id': blog.id,
            'title': blog.title,
            'description': blog.description
        })
    print("data:", data)
    return data


@app.route("/createblog", methods=['POST'])
def create_blog():
    data = request.get_json()
    print("Post Title:", data.get("title"),
          "Post Description:", data.get("desc"))
    blog = Blog(title=data.get("title", None),
                description=data.get("desc", None))
    db.session.add(blog)
    db.session.commit()
    return jsonify("Post successfully added")


@app.route("/updateblog/<id>", methods=['POST'])
def update_blog(id):
    # For form --> request.form['parameter'] --> request.files['file']
    data = request.get_json()
    print("Post Title:", data.get("title"),
          "Post Description:", data.get("desc"))
    blog = Blog.query.get(id)
    blog.title = data.get("title")
    blog.description = data.get("desc")
    db.session.commit()
    return jsonify("Post successfully updated")


@app.route("/deleteblog/<id>")
def delete_blog(id):
    blog = Blog.query.get(id)
    db.session.delete(blog)
    db.session.commit()
    return jsonify("Card deleted...")

@app.route("/trigger-celery-job")
def trigger_celery_job():
    a = generate_csv.delay()
    return {
        "Task_ID" : a.id,
        "Task_State" : a.state,
        "Task_Result" : a.result
    }

@app.route("/status/<id>")
def check_status(id):
    res = AsyncResult(id, app = celery)
    return {
        "Task_ID" : res.id,
        "Task_State" : res.state,
        "Task_Result" : res.result
    }

@app.route("/download-file")
def download_file():
    return send_file("static/data.csv")

if __name__ == "__main__":
    # with app.app_context():
    #     db.create_all()
    app.run(debug=True)
