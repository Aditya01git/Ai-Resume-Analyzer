import React, { useState, useMemo } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  Eye,
  BarChart3,
  Target,
  Zap,
  ArrowRight,
  Clock,
  Brain,
  Search
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null); // summary cards
  const [apiResponse, setApiResponse] = useState(null);       // full backend payload
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const analysisSteps = [
    {
      title: "Uploading Resume",
      description: "Securely uploading your resume file...",
      icon: Upload,
      color: "blue"
    },
    {
      title: "Parsing Content",
      description: "Extracting text and analyzing structure...",
      icon: FileText,
      color: "purple"
    },
    {
      title: "AI Analysis",
      description: "Running AI algorithms for comprehensive analysis...",
      icon: Brain,
      color: "green"
    },
    {
      title: "Generating Report",
      description: "Creating detailed insights and recommendations...",
      icon: BarChart3,
      color: "teal"
    }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragleave" || e.type === "dragover") {
      setDragActive(e.type !== "dragleave");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Helpers (unchanged)
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-blue-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'needs_improvement':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const stepper = () => {
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);
    return interval;
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError('Please upload a resume and paste a job description.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setApiResponse(null);
    setAnalysisResult(null);
    const interval = stepper();

    try {
      const formData = new FormData();
      formData.append('uploaded_file', file);
      formData.append('job_description', jobDescription);
      formData.append('user_name', 'xyz');

      const res = await fetch('https://ai-resume-analyzer-9yya.onrender.com/upload_resume', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      // -----------------------------------------------------------------
      // START FIX: This is the part that was still broken
      // -----------------------------------------------------------------
      
      const fullResponse = await res.json(); // 1. Get the full response
      const data = fullResponse.data;         // 2. Get the NESTED 'data' object

      if (!data) {
        // Handle cases where the 'data' object might be missing
        throw new Error("Invalid API response: 'data' object not found.");
      }
      // -----------------------------------------------------------------
      // END FIX
      // -----------------------------------------------------------------

      // Now this 'summary' object will be built correctly
      // because 'data' refers to the nested object
      const summary = {
        overallScore: typeof data.overall_score === 'number' ? data.overall_score : 0,
        atsCompatibility: typeof data.ats_score === 'number' ? data.ats_score : 0,
        contentQuality: typeof data.content_score === 'number' ? data.content_score : 0,
        formatDesign: typeof data.format_design_score === 'number' ? data.format_design_score : 0,
        keywordOptimization: typeof data.keyword_score === 'number' ? data.keyword_score : 0,
        sections: null,
        recommendations: [
          ...(Array.isArray(data.content_improvements) ? data.content_improvements : []),
          ...(Array.isArray(data.format_design_improvements) ? data.format_design_improvements : []),
          ...(Array.isArray(data.key_improvements) ? data.key_improvements : [])
        ],
        strengths: Array.isArray(data.strengths) ? data.strengths : [] // This will now work
      };

      setApiResponse(fullResponse); // Save the full response (for 'Weakness', etc.)
      setAnalysisResult(summary);   // Save the summary (for 'Strengths' and scores)

    } catch (err) {
      console.error(err);
      setError(`Failed to analyze resume: ${err.message}`);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };


  // --- NEW: Add this download handler function ---
  // PASTE THIS NEW CODE
  const handleDownload = async () => {

    if (!apiResponse || !apiResponse.resume_report_id) {
      if (apiResponse && apiResponse.success === false) {
        console.error("Cannot download report: Analysis failed.");
        alert("Cannot download report: The resume analysis failed so no report was generated.");
      } else {
        console.error("No report ID found to download.");
      }
      return;
    }

    try {
      // 1. Use the correct ID: resume_report_id
      const reportFileId = apiResponse.resume_report_id; 

      // 2. Build the URL
      const downloadUrl = `https://ai-resume-analyzer-9yya.onrender.com/download_reportfile/${reportFileId}`;

      // 3. Fetch the data
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // 4. Get the data as a blob
      const blob = await response.blob();

      // 5. Create a local URL for this blob
      const url = window.URL.createObjectURL(blob);

      // 6. Create the link
      const link = document.createElement('a');
      link.href = url;

      // 7. Set the filename
      const originalName = apiResponse.resume_file_name || 'resume.pdf';
      const baseName = originalName.replace(/\.[^/.]+$/, "");
      const newFileName = `${baseName}_report.pdf`;

      link.setAttribute('download', newFileName);

      // 8. Click the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // 9. Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // Free up memory

    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };


  // Derived helpers for rendering API response sections
  // This part is correct, as these IDs are at the top level
  const ids = useMemo(() => {
    if (!apiResponse) return {};
    return {
      Resume_File_ID: apiResponse.resume_file_id,
      Resume_Report_ID: apiResponse.resume_report_id,
      Document_ID: apiResponse._id
    };
  }, [apiResponse]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Analyzer
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your resume and get instant AI-powered analysis with detailed insights and recommendations.
          </p>
        </div>

        {!analysisResult ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Job Description Input */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Job Description</h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Paste the job description you're applying for
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here. This helps our AI provide more targeted recommendations..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Including the job description helps our AI provide more accurate ATS optimization and targeted recommendations.
                  </p>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Your Resume</h2>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : file
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-4">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">{file.name}</p>
                        <p className="text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Choose different file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drag and drop your resume here
                        </p>
                        <p className="text-gray-600">or click to browse files</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                      >
                        Browse Files
                      </label>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-4">Supported formats:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">PDF</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">DOC</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">DOCX</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">TXT</span>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !file || !jobDescription.trim()}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Start Analysis
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                {!jobDescription.trim() && file && (
                  <p className="text-sm text-amber-600 mt-2 text-center">
                    Please add a job description to get more accurate analysis
                  </p>
                )}
              </div>
            </div>

            {/* Analysis Process or What We Analyze */}
            {isAnalyzing ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                  Analyzing Your Resume
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-6">
                  {analysisSteps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    const StepIcon = step.icon;

                    return (
                      <div key={index} className="flex items-center">
                        <div
                          className={`flex flex-col items-center space-y-3 p-6 rounded-xl transition-all duration-500 w-[180px] ${isActive
                            ? 'bg-blue-50 border-2 border-blue-200 scale-105'
                            : isCompleted
                              ? 'bg-green-50 border-2 border-green-200'
                              : 'bg-gray-50 border-2 border-gray-200'
                            }`}
                        >
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                              ? 'bg-blue-500 animate-pulse'
                              : isCompleted
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                              }`}
                          >
                            {isActive ? (
                              <StepIcon className="w-7 h-7 text-white animate-bounce" />
                            ) : isCompleted ? (
                              <CheckCircle className="w-7 h-7 text-white" />
                            ) : (
                              <StepIcon className="w-7 h-7 text-white" />
                            )}
                          </div>
                          <div className="text-center">
                            <h3
                              className={`font-semibold text-sm ${isActive ? 'text-gray-900' : isCompleted ? 'text-green-700' : 'text-gray-600'
                                }`}
                            >
                              {step.title}
                            </h3>
                            <p
                              className={`text-xs mt-1 leading-snug ${isActive ? 'text-gray-700' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                }`}
                            >
                              {step.description}
                            </p>
                          </div>
                          {isActive && (
                            <div className="flex space-x-1.5">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          )}
                        </div>
                        {index < analysisSteps.length - 1 && (
                          <div className={`hidden sm:block w-8 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'} transition-all duration-500`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    Estimated time: 2-3 minutes
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What We Analyze</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Target className="w-8 h-8 text-blue-600" />
                    <span className="text-gray-700 font-medium">ATS Compatibility</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <span className="text-gray-700 font-medium">Content Quality</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                    <span className="text-gray-700 font-medium">Format & Design</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Zap className="w-8 h-8 text-orange-600" />
                    <span className="text-gray-700 font-medium">Keywords</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Analysis Results + API payload sections */
          <div className="space-y-8">
            {/* Summary scores from backend (This section reads from analysisResult, which is now fixed) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis Complete!</h2>
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold mb-4">
                  {analysisResult.overallScore ?? 0}
                </div>
                <p className="text-xl text-gray-600">Overall Resume Score</p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(analysisResult.atsCompatibility ?? 0)}`}>
                    {analysisResult.atsCompatibility ?? 0}
                  </div>
                  <p className="text-gray-600">ATS Compatibility</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(analysisResult.contentQuality ?? 0)}`}>
                    {analysisResult.contentQuality ?? 0}
                  </div>
                  <p className="text-gray-600">Content Quality</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(analysisResult.formatDesign ?? 0)}`}>
                    {analysisResult.formatDesign ?? 0}
                  </div>
                  <p className="text-gray-600">Format & Design</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(analysisResult.keywordOptimization ?? 0)}`}>
                    {analysisResult.keywordOptimization ?? '—'}
                  </div>
                  <p className="text-gray-600">Keywords</p>
                </div>
              </div>
            </div>

            {/* Recommendations and Strengths from backend fields */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Strengths - left side (This section reads from analysisResult, which is now fixed) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Strengths</h3>
                <div className="grid md:grid-cols-1 gap-4">
                  {analysisResult.strengths?.length ? (
                    analysisResult.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{strength}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No strengths listed.</p>
                  )}
                </div>
              </div>

              {/* Weakness - right side (FIXED: Added .data) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Weakness</h3>
                <div className="space-y-4">
                  {(apiResponse?.data?.weakness || []).map((weakness, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{weakness}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New: Full API response sections */}
            {apiResponse && (
              <>
                {/* Categories and conclusion (FIXED: Added .data) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Job Category & Summary</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">AI Job Category</p>
                      <p className="text-gray-900 font-medium">{apiResponse?.data?.ai_job_category || '—'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">ML Job Category</p>
                      <p className="text-gray-900 font-medium">{apiResponse?.data?.ml_job_category || '—'}</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-gray-800">{apiResponse?.data?.conclusion || '—'}</p>
                  </div>
                </div>

                {/* Improvements and weaknesses (FIXED: Added .data) */}
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Improvements</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {(apiResponse?.data?.content_improvements || []).map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Format & Design</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {(apiResponse?.data?.format_design_improvements || []).map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Improvements</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {(apiResponse?.data?.key_improvements || []).map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Resume/JD text blocks (FIXED: Added .data) */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Resume Content</h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-80 overflow-auto whitespace-pre-wrap text-sm text-gray-800">
                      {apiResponse?.data?.resume_content || '—'}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-80 overflow-auto whitespace-pre-wrap text-sm text-gray-800">
                      {apiResponse?.data?.job_description || '—'}
                    </div>
                  </div>
                </div>

                {/* IDs (This was already correct) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Reference IDs</h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    {Object.entries(ids).map(([k, v]) => (
                      <div key={k} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">{k}</p>
                        <p className="text-gray-900 font-mono break-all">{v || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw JSON viewer (This was already correct) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Raw Response (JSON)</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2))}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 text-sm rounded-lg p-4 overflow-auto max-h-96">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleDownload} // <-- ADD THIS
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Report
              </button>
              
              {/* /*<button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center">
                <Eye className="w-5 h-5 mr-2" />
                View Detailed Report
              </button>*/ }
              <button
                onClick={() => {
                  setFile(null);
                  setAnalysisResult(null);
                  setApiResponse(null);
                  setIsAnalyzing(false);
                  setError('');
                }}
                className="border border-blue-300 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;