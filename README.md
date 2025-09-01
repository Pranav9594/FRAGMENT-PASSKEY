# 🔐 FRAGMENT PASSKEY
<img width="1146" height="774" alt="Screenshot 2025-08-30 025534" src="https://github.com/user-attachments/assets/e4a0da7c-eff0-4bdd-9f31-bf47e972f324" />



- 🐍 
## 🔌 API Endpoints

- 🏠 `GET /` - Main application page
- ⚡ `POST /generate` - Generate new password
- 💾 `POST /save` - Save password to session
- 📋 `GET /saved` - Retrieve saved passwords
- 🗑️ `DELETE /delete/<id>` - Delete saved password

## 🎨 Design Features

- 🪟 **Glassmorphism cards** with backdrop blur effects
- ✨ **Glowing borders** and hover animations
- 🌌 **Cyberpunk color scheme** with electric blue accents
- 🎭 **Smooth CSS transitions** and animations
- 📱 **Responsive layout** that adapts to all screen sizes
- 🎯 **Interactive feedback** for all user actions

## 🔐 Security Notes

- 🛡️ Passwords are generated using Python's `secrets` module for cryptographic security
- 🔒 Passwords are stored in Flask sessions (server-side, encrypted)
- 🧹 Session data is cleared when browser is closed
- 🖥️ All password generation happens server-side
- 🌐 HTTPS recommended for production use

## 🌐 Browser Compatibility

- 🟢 Chrome/Edge 88+
- 🦊 Firefox 78+
- 🍎 Safari 14+
- ⚡ Modern browsers with ES6+ support

## 📁 File Structure

```
fragment-passkey/
├── 🐍 app.py                 # Flask application
├── 📦 requirements.txt       # Python dependencies
├── 📄 templates/
│   └── 🌐 index.html        # Main HTML template
├── 🎨 static/
│   ├── 🎨 css/
│   │   └── 💄 style.css     # Custom CSS styles
│   ├── ⚡ js/
│   │   ├── 🎯 app.js        # Frontend JavaScript
│   │   └── 🌌 background.js # Background effects
│   ├── 🖼️ favicon.ico       # Favicon files
│   ├── 🖼️ favicon-16x16.png
│   ├── 🖼️ favicon-32x32.png
│   └── 🍎 apple-touch-icon.png
└── 📖 README.md             # This file
```

## 📄 License

This project is open source and available under the MIT License. 🎉


