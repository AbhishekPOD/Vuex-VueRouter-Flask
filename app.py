from flask import Flask, render_template, redirect, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///blogs_database.sqlite3"
db = SQLAlchemy(app)


class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)


@app.route("/")
def home():
    return render_template("index.html")


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


if __name__ == "__main__":
    # with app.app_context():
    #     db.create_all()
    app.run(debug=True)
