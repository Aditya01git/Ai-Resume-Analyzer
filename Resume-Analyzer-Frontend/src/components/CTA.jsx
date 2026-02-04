import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTA = () => {
  const benefits = [
    "Detailed ATS compatibility analysis",
    "Industry-specific optimization tips", 
    "Real-time improvement tracking",
    "Expert-level recommendations"
  ];

  return (
    <section id="analyze" className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Resume?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of professionals who have already improved their career prospects 
              with NeoResume's AI-powered analysis.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/analyze" className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-white/25 transition-all duration-300 flex items-center justify-center">
                Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <div className="bg-white rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Resume Score</span>
                  <span className="text-2xl font-bold text-green-600">92/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full w-[92%]"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ATS Compatibility</span>
                    <span className="text-sm font-semibold text-green-600">Excellent</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Content Quality</span>
                    <span className="text-sm font-semibold text-blue-600">Very Good</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Format & Design</span>
                    <span className="text-sm font-semibold text-green-600">Perfect</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;