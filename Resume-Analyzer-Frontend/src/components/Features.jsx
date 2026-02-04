import React from 'react';
import { Target, Zap, Shield, BarChart3, Users, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Target,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems with our advanced compatibility checker.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get comprehensive feedback on your resume in seconds, not hours.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and secure. We never share your personal information.",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: BarChart3,
      title: "Performance Scoring",
      description: "Receive detailed scores across multiple criteria to track your improvement.",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Industry Insights",
      description: "Tailored recommendations based on your target industry and role.",
      gradient: "from-teal-500 to-teal-600"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Stay current with the latest hiring trends and requirements.",
      gradient: "from-rose-500 to-rose-600"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NeoResume?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform combines cutting-edge technology with industry expertise 
            to give you the competitive edge in today's job market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-500/10 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;