from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

@app.route('/api/send-task-email', methods=['POST'])
def send_task_email():
    data = request.get_json()
    assignee = data.get('assignee')
    title = data.get('title')
    description = data.get('description')
    assigned_by = data.get('assignedBy')

    # Sender SMTP credentials (use an App Password for Gmail)
    sender_email = "your-app-email@gmail.com"
    sender_password = "your-gmail-app-password"

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = assignee
        msg['Subject'] = f"New Task Assigned: {title}"

        body = f"""
        Hello,

        You have been assigned a new task on Hair Drama Task Manager by {assigned_by}:

        Task Heading: {title}
        Description: {description or 'No description provided.'}

        Please log into the portal to check it off when completed!
        """
        msg.attach(MIMEText(body, 'plain'))

        # Connecting to Gmail SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, assignee, msg.as_string())
        server.quit()

        return jsonify({"status": "success", "message": "Email sent successfully!"}), 200
    except Exception as e:
        # Fallback if SMTP isn't configured yet so frontend doesn't crash
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)