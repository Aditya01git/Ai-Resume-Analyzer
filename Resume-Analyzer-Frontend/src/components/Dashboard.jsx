import React from 'react';
import {
  BarChart3,
  FileText,
  TrendingUp,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

const Dashboard = () => {

  const { user } = useAuth();

  const [recentAnalyses, setRecentAnalyses] = React.useState([]);
  const [totalAnalyses, setTotalAnalyses] = React.useState(0);
  const [avgScore, setAvgScore] = React.useState(0);
  const [scoreChange, setScoreChange] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;

    const fetchReports = async () => {
      try {
        const res = await fetch(
          `https://ai-resume-analyzer-9yya.onrender.com/get_all_documents?username=${user.displayName || user.email}`
        );

        const data = await res.json();

        setTotalAnalyses(data.Total_Analyses);
        setAvgScore(data.Avg_ATS_Score);
        setScoreChange(data.Overall_Score_Change);

        const formatted = data.documents.map((doc, index) => ({
          id: index,
          fileName: doc.resume_file_name,
          score: doc.data.overall_score,
          status: "completed",
          date: doc.uploaded_date,
          industry: doc.data.ai_job_category,
          reportId: doc.resume_report_id
        }));

        setRecentAnalyses(formatted);

      } catch (err) {
        console.log(err);
      }
    };

    fetchReports();
  }, [user]);

  const handleDownload = async (reportId, originalName) => {

    const res = await fetch(
      `https://ai-resume-analyzer-9yya.onrender.com/download_reportfile/${reportId}`
    );

    const blob = await res.blob();

    const pdfBlob = new Blob([blob], { type: "application/pdf" });

    const url = window.URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = url;

    const baseName = originalName.replace(/\.[^/.]+$/, "");
    link.download = `${baseName}_report.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || user?.email}!
          </h1>
          <p className="text-gray-600">Here's your resume analysis overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900">{totalAnalyses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{avgScore}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+{scoreChange} score change</span>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAnalyses
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
                    .map((analysis) => (
                      <tr key={analysis.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {analysis.fileName}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <span className={`font-semibold ${getScoreColor(analysis.score)}`}>
                            {analysis.score}/100
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getStatusIcon(analysis.status)}
                            <span className="ml-2 text-sm text-gray-600 capitalize">
                              {analysis.status}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {analysis.industry}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {analysis.date}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            {/* <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button> */}

                            <button
                              onClick={() => handleDownload(analysis.reportId, analysis.fileName)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
