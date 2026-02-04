import React from 'react';
import { Upload, Brain, CheckCircle, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Resume",
      description: "Simply drag and drop your resume file or browse to select it. We support PDF, Word, and text formats.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      number: "02", 
      icon: Brain,
      title: "AI Analysis",
      description: "Our advanced AI engine analyzes your resume for content quality, ATS compatibility, and industry standards.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      number: "03",
      icon: CheckCircle,
      title: "Get Insights",
      description: "Receive detailed feedback with specific recommendations for improvement and optimization strategies.",
      gradient: "from-green-500 to-green-600"
    },
    {
      number: "04",
      icon: Download,
      title: "Download Report",
      description: "Get your comprehensive analysis report with actionable insights to enhance your job search success.",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get professional resume analysis in just four simple steps. Our streamlined 
            process ensures you get results quickly and efficiently.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step Number Circle */}
                <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                  {step.number}
                </div>

                {/* Icon Container */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 group-hover:shadow-xl group-hover:shadow-gray-500/10 transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mb-8">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;