from flask import Flask, render_template, request, jsonify, redirect, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date

app = Flask(__name__)
app.secret_key = "your_secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///todo.db"
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task = db.Column(db.String(200), nullable=False)
    deadline = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), default="pending")

# Routes
@app.route("/")
def index():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("index.html")

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

# API Endpoints
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered!"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401
    session["user_id"] = user.id
    return jsonify({"message": "Login successful!"})

@app.route("/api/tasks")
def api_tasks():
    if "user_id" not in session:
        return jsonify([])
    tasks = Task.query.filter_by(user_id=session["user_id"]).order_by(Task.deadline.asc()).all()
    return jsonify([
        {
            "id": t.id,
            "task": t.task,
            "deadline": t.deadline.isoformat() if t.deadline else "",
            "status": t.status
        } for t in tasks
    ])

@app.route("/api/add_task", methods=["POST"])
def add_task():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    task = data.get("task")
    deadline = data.get("deadline")
    deadline_date = date.fromisoformat(deadline) if deadline else None
    new_task = Task(user_id=session["user_id"], task=task, deadline=deadline_date)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task added!"})

@app.route("/api/update_task/<int:task_id>", methods=["POST"])
def update_task(task_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    status = data.get("status")
    task = Task.query.get(task_id)
    if task and task.user_id == session["user_id"]:
        task.status = status
        db.session.commit()
    return jsonify({"message": "Task updated!"})

@app.route("/api/delete_task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    task = Task.query.get(task_id)
    if task and task.user_id == session["user_id"]:
        db.session.delete(task)
        db.session.commit()
    return jsonify({"message": "Task deleted!"})

# Create tables
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)