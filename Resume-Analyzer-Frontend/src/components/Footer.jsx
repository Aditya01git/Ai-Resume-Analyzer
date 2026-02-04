import React from 'react';
import { Zap, FileText, BarChart3, Target, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NeoResume
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-Powered Resume Analysis System designed to help job seekers optimize their resumes and land their dream jobs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>ATS Compatibility Check</span>
              </li>
              <li className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Content Quality Analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span>Keyword Optimization</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>AI-Powered Insights</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Our Team</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Anuj Rawat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Aditya Singh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Sarthak Kharola</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Pratyush</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              Major Project - Computer Science Department
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 NeoResume. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;