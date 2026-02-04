import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  FileText,
  Target,
  Zap,
  Star,
  Clock,
  Calendar
} from 'lucide-react';
// We've removed resumeAnalysisService for now to avoid errors, as that file doesn't exist yet.
// import { resumeAnalysisService } from '../services/resumeAnalysisService';

const ReportPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- CHANGES START HERE ---

  useEffect(() => {
    // We no longer check for a user. We just fetch the analysis.
    if (reportId) {
      fetchAnalysis();
    }
  }, [reportId, navigate]); // Removed 'user' from dependencies

  // --- CHANGES END HERE ---

  const fetchAnalysis = async () => {
    if (!reportId) return;
    
    // This part is now using mock data because the login system is removed.
    try {
      // Simulating a successful fetch
      const mockAnalysis = {
        overallScore: 85,
        atsCompatibility: 88,
        contentQuality: 82,
        formatDesign: 90,
        keywordOptimization: 80,
        sections: {
          contact: { score: 95, status: 'excellent' },
          summary: { score: 85, status: 'good' },
          experience: { score: 80, status: 'good' },
          education: { score: 90, status: 'excellent' },
          skills: { score: 75, status: 'needs_improvement' }
        },
        recommendations: [
          'Add more quantifiable achievements in your experience section',
          'Include more industry-specific keywords for better ATS optimization',
        ],
        strengths: [
          'Clean and professional formatting',
          'Strong educational background',
        ]
      };
      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Failed to load analysis report');
    } finally {
      setLoading(false);
    }
  };

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

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 75) return 'from-blue-500 to-blue-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analysis report...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested analysis report could not be found.'}</p>
          <button
            onClick={() => navigate('/analyze')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Analyzer
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis Report</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {/* --- THIS BLOCK WAS REMOVED --- */}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* --- REST OF THE JSX REMAINS THE SAME --- */}
        {/* Overall Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreGradient(analysis.overallScore)} text-white text-4xl font-bold mb-6 shadow-lg`}>
              {analysis.overallScore}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Resume Score</h2>
            <p className="text-gray-600 mb-6">
              {analysis.overallScore >= 90 ? 'Excellent! Your resume is highly optimized.' :
               analysis.overallScore >= 75 ? 'Good! Your resume is well-structured with room for improvement.' :
               analysis.overallScore >= 60 ? 'Fair. Your resume needs some optimization.' :
               'Needs significant improvement to be competitive.'}
            </p>
            
            {/* Score Breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.atsCompatibility)}`}>
                  {analysis.atsCompatibility}
                </div>
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">ATS Score</span>
                </div>
                <div className={`w-full h-2 rounded-full ${getScoreBackground(analysis.atsCompatibility)}`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.atsCompatibility)}`}
                    style={{ width: `${analysis.atsCompatibility}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.contentQuality)}`}>
                  {analysis.contentQuality}
                </div>
                <div className="flex items-center justify-center mb-1">
                  <FileText className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">Content</span>
                </div>
                <div className={`w-full h-2 rounded-full ${getScoreBackground(analysis.contentQuality)}`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.contentQuality)}`}
                    style={{ width: `${analysis.contentQuality}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.formatDesign)}`}>
                  {analysis.formatDesign}
                </div>
                <div className="flex items-center justify-center mb-1">
                  <BarChart3 className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">Format</span>
                </div>
                <div className={`w-full h-2 rounded-full ${getScoreBackground(analysis.formatDesign)}`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.formatDesign)}`}
                    style={{ width: `${analysis.formatDesign}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.keywordOptimization)}`}>
                  {analysis.keywordOptimization}
                </div>
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">Keywords</span>
                </div>
                <div className={`w-full h-2 rounded-full ${getScoreBackground(analysis.keywordOptimization)}`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.keywordOptimization)}`}
                    style={{ width: `${analysis.keywordOptimization}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Section Analysis */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
              Section Analysis
            </h3>
            <div className="space-y-4">
              {Object.entries(analysis.sections).map(([section, data]) => (
                <div key={section} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(data.status)}
                      <span className="font-medium text-gray-900 capitalize">
                        {section.replace('_', ' ')}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(data.score)} ${getScoreColor(data.score)}`}>
                      {data.score}/100
                    </div>
                  </div>
                  <div className={`w-full h-2 rounded-full ${getScoreBackground(data.score)}`}>
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(data.score)}`}
                      style={{ width: `${data.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Key Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Top Strength</h4>
                <p className="text-green-700 text-sm">
                  {analysis.strengths[0] || "Professional formatting and clear structure"}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Priority Improvement</h4>
                <p className="text-yellow-700 text-sm">
                  {analysis.recommendations[0] || "Add more industry-specific keywords"}
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">ATS Compatibility</h4>
                <p className="text-blue-700 text-sm">
                  {analysis.atsCompatibility >= 80 
                    ? "Your resume is well-optimized for ATS systems"
                    : "Consider improving keyword density and formatting for better ATS compatibility"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            Detailed Recommendations
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 flex-1">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
            Your Resume Strengths
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Next Steps</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Implement Changes</h4>
              <p className="text-gray-600 text-sm">Apply the recommended improvements to your resume</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Re-analyze</h4>
              <p className="text-gray-600 text-sm">Upload your updated resume to track improvements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Apply with Confidence</h4>
              <p className="text-gray-600 text-sm">Use your optimized resume for job applications</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/analyze')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;