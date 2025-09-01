from flask import Flask, render_template, request, jsonify, session
import secrets
import string
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'

class PasswordGenerator:
    @staticmethod
    def generate_password(length, include_uppercase=True, include_lowercase=True, 
                         include_numbers=True, include_special=True):
        """Generate a secure password with specified criteria"""
        charset = ""
        
        if include_uppercase:
            charset += string.ascii_uppercase
        if include_lowercase:
            charset += string.ascii_lowercase
        if include_numbers:
            charset += string.digits
        if include_special:
            charset += "@#$%&*"
        
        if not charset:
            return None
            
        # Use secrets module for cryptographically secure random generation
        password = ''.join(secrets.choice(charset) for _ in range(length))
        return password

@app.route('/')
def index():
    """Main page with password generator"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_password():
    """API endpoint to generate password"""
    data = request.get_json()
    
    length = int(data.get('length', 12))
    options = data.get('options', {})
    
    password = PasswordGenerator.generate_password(
        length=length,
        include_uppercase=options.get('uppercase', True),
        include_lowercase=options.get('lowercase', True),
        include_numbers=options.get('numbers', True),
        include_special=options.get('special', True)
    )
    
    if password:
        return jsonify({'success': True, 'password': password})
    else:
        return jsonify({'success': False, 'error': 'No character types selected'})

@app.route('/save', methods=['POST'])
def save_password():
    """API endpoint to save password"""
    data = request.get_json()
    
    site_name = data.get('siteName')
    password = data.get('password')
    
    if not site_name or not password:
        return jsonify({'success': False, 'error': 'Missing site name or password'})
    
    # Initialize saved passwords in session if not exists
    if 'saved_passwords' not in session:
        session['saved_passwords'] = []
    
    # Create new password entry
    new_password = {
        'id': len(session['saved_passwords']) + 1,
        'siteName': site_name,
        'password': password,
        'createdAt': datetime.now().isoformat()
    }
    
    session['saved_passwords'].append(new_password)
    session.modified = True
    
    return jsonify({'success': True})

@app.route('/saved')
def saved_passwords():
    """Get saved passwords"""
    passwords = session.get('saved_passwords', [])
    # Return newest first
    passwords.reverse()
    return jsonify({'passwords': passwords})

@app.route('/delete/<int:password_id>', methods=['DELETE'])
def delete_password(password_id):
    """Delete a saved password"""
    if 'saved_passwords' not in session:
        return jsonify({'success': False, 'error': 'No passwords found'})
    
    session['saved_passwords'] = [
        p for p in session['saved_passwords'] if p['id'] != password_id
    ]
    session.modified = True
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)