# 📄 AI-Powered Resume Analyzer

An intelligent resume analysis tool powered by AI that evaluates resumes, provides ATS scores, identifies job categories, and offers actionable feedback to improve your resume.

## 🚀 Features

- **AI-Powered Analysis**: Leverages LangChain, LangGraph, and Google Gemini for intelligent resume evaluation
- **ATS Score Calculation**: Get an Applicant Tracking System compatibility score
- **Job Category Prediction**: Automatically categorizes resumes into relevant job roles
- **Comprehensive Feedback**: Identifies strengths, weaknesses, and key improvements
- **PDF Processing**: Extracts and analyzes text from PDF resumes
- **Modern UI**: React-based frontend with Tailwind CSS for a seamless user experience
- **RESTful API**: FastAPI backend for easy integration

## 🏗️ Architecture

The project consists of two main components:

### Backend (Python + FastAPI)
- **Framework**: FastAPI with Uvicorn
- **AI/ML Stack**: LangChain, LangGraph, Google Gemini (via langchain-google-genai)
- **NLP**: NLTK for text processing
- **PDF Processing**: PyPDF2, pdfplumber, python-docx
- **Data Analysis**: NumPy, Pandas, Scikit-learn
- **Visualization**: Matplotlib, Seaborn, Plotly
- **UI Alternative**: Streamlit (for standalone deployment)

### Frontend (React + Vite)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router DOM
- **PDF Handling**: pdfjs-dist
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Resume-Analyzer-Backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the `Analyze` directory with your API keys:
```env
GOOGLE_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key  # if using Groq
```

5. Run the FastAPI server:
```bash
cd Analyze
uvicorn main:app --reload
```

Or run the Streamlit app:
```bash
streamlit run app.py
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Resume-Analyzer-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🎯 Usage

### Using the Web Interface

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173` (or your configured port)
3. Upload a PDF resume
4. View comprehensive analysis including:
   - ATS Score
   - Overall Score
   - Job Category Predictions
   - Strengths and Weaknesses
   - Improvement Recommendations
   - Detailed Conclusion

### Using the Streamlit Interface

1. Run the Streamlit app: `streamlit run app.py`
2. Upload your resume PDF
3. View extracted text (optional)
4. Get instant analysis results

## 📁 Project Structure

```
AI-Powered-Resume-Analyzer/
├── Resume-Analyzer-Backend/
│   ├── Analyze/
│   │   ├── Analyze_Resume.py    # Core analysis logic
│   │   ├── DB_Handle.py          # Database operations
│   │   ├── app.py                # Streamlit interface
│   │   ├── main.py               # FastAPI server
│   │   ├── Job_Role/             # Job role definitions
│   │   └── Report/               # Generated reports
│   ├── requirements.txt          # Python dependencies
│   └── Steps.txt                 # Setup instructions
│
├── Resume-Analyzer-Frontend/
│   ├── src/                      # React source files
│   ├── public/                   # Static assets
│   ├── package.json              # Node dependencies
│   ├── vite.config.js            # Vite configuration
│   └── eslint.config.js          # ESLint rules
│
└── README.md
```

## 🔧 Configuration

### Backend Configuration
- Modify API endpoints in `main.py`
- Configure AI models in `Analyze_Resume.py`
- Adjust scoring algorithms as needed

### Frontend Configuration
- Update API base URL in your Axios configuration
- Customize Tailwind theme in `tailwind.config.js`
- Modify routes in your React Router setup

## 🤖 AI Models Used

- **Google Gemini**: Primary LLM for resume analysis
- **LangChain**: Framework for building LLM applications
- **LangGraph**: Workflow orchestration for complex analysis tasks
- **Groq** (Optional): Alternative LLM provider

## 📊 Analysis Metrics

The system evaluates resumes based on:
- ATS compatibility score
- Overall presentation score
- Technical skills match
- Experience relevance
- Education alignment
- Keyword optimization
- Format and structure

## 🛠️ Technologies

**Backend:**
- Python 3.8+
- FastAPI
- LangChain & LangGraph
- Google Gemini AI
- Streamlit
- Pandas, NumPy, Scikit-learn

**Frontend:**
- React 19
- Vite 7
- Tailwind CSS 4
- Zustand
- React Router
- Axios

## 📝 API Endpoints

### POST `/analyze`
Analyzes a resume and returns comprehensive feedback

**Request:**
- Content-Type: `multipart/form-data`
- Body: PDF file

**Response:**
```json
{
  "ats_score": 85,
  "overall_score": 78,
  "ai_job_category": "Software Engineer",
  "ml_job_category": "Backend Developer",
  "strengths": [...],
  "weaknesses": [...],
  "key_improvements": [...],
  "conclusion": "..."
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

**Adiya Singh**
- GitHub: [@AnujRawat1](https://github.com/Aditya01git)

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- LangChain community for excellent documentation
- Open source community for various tools and libraries

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Note**: Make sure to set up your API keys properly before running the application. Never commit your `.env` file or API keys to version control.
