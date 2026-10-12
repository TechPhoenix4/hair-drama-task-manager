import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://cyraafcyiwwztpqowjvo.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cmFhZmN5aXd3enRwcW93anZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTcwNzIxNywiZXhwIjoyMTA3MjgzMjE3fQ.lUch80pcDWF-Sx0L-uIloPeJRYNb-VT8yG5fXzGsmac")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Email configuration (Optional/Mock fallback if SMTP isn't fully configured yet)
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "ayushshreejena@gmail.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "")

def send_email_notification(to_email, task_title, description):
    if not SENDER_PASSWORD:
        print(f"Skipping email (No SENDER_PASSWORD provided). Task '{task_title}' assigned to {to_email}")
        return
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = f"New Task Assigned: {task_title}"

        body = f"Hello,\n\nYou have been assigned a new task:\n\nTitle: {task_title}\nDescription: {description}\n\nPlease log in to your dashboard to complete it."
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
        print(f"Email notification successfully sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "Hair Drama Task Manager Backend is live!"}), 200

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        response = supabase.table('tasks').select('*').order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json
        print("Received task data:", data)
        
        # Safely extract user ID whether frontend sent user_id or created_by
        user_id = data.get('user_id') or data.get('created_by')
        if not user_id:
            return jsonify({'error': 'Missing user_id constraint'}), 400

        task_data = {
            'title': data.get('title'),
            'description': data.get('description', ''),
            'assignee': data.get('assignee'),
            'priority': data.get('priority', 'Medium'),
            'status': 'pending',
            'created_by': user_id
        }

        response = supabase.table('tasks').insert(task_data).execute()
        
        # Trigger email notification
        if data.get('assignee'):
            send_email_notification(data.get('assignee'), task_data['title'], task_data['description'])

        return jsonify(response.data), 201
    except Exception as e:
        print("Error creating task:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>/complete', methods=['PATCH'])
def complete_task(task_id):
    try:
        response = supabase.table('tasks').update({'status': 'Completed'}).eq('id', task_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)