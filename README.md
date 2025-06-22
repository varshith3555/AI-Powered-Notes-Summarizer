# AI-Powered Notes Summarizer

A full-stack web application that allows users to write notes and get AI-powered summaries using OpenAI's GPT API.

## 🌟 Features

- ✍️ **Add Notes**: Write or paste your notes
- ⚡ **AI Summarization**: Get concise summaries using GPT-3.5/4
- 📚 **View All Notes**: Browse your original notes and summaries
- 🗑️ **Edit & Delete**: Manage your notes easily
- 👤 **User Authentication**: Secure login and registration
- 📱 **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI API**: OpenAI GPT
- **Authentication**: JWT

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/varshith3555/AI-Powered-Notes-Summarizer.git
   cd ai-notes-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   PORT=5000
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend (port 3000).

## 📁 Project Structure

```
ai-notes-summarizer/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Notes
- `GET /api/notes` - Get all notes for user
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/summarize` - Generate AI summary

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `client/build` folder

### Backend (Render/Railway)
1. Set environment variables
2. Deploy the `server` folder

### Database
- Use MongoDB Atlas for cloud database

## 📝 Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-summarizer
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=sk-your_openai_api_key_here
PORT=5000
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues, please open an issue on GitHub. 