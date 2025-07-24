import React from 'react';
import { Link } from 'react-router-dom';
import {
  Type,
  MessageCircle,
  Presentation,
  ArrowRight,
  Sparkles,
  FileText,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const features = [
    {
      title: 'Tone & Style Rewriter',
      description: 'Transform your text into any tone - formal, casual, persuasive, academic, or friendly.',
      icon: Type,
      href: '/transform',
      color: 'bg-blue-500',
      examples: ['Business emails', 'Academic papers', 'Social media posts']
    },
    {
      title: 'Interactive Q&A',
      description: 'Ask questions about your content and get intelligent, contextual answers.',
      icon: MessageCircle,
      href: '/qa',
      color: 'bg-green-500',
      examples: ['Document analysis', 'Content summarization', 'Key insights']
    },
    {
      title: 'Presentation Generator',
      description: 'Convert text into polished PowerPoint presentations with layouts and speaker notes.',
      icon: Presentation,
      href: '/presentation',
      color: 'bg-purple-500',
      examples: ['Meeting slides', 'Training materials', 'Project reports']
    },

  ];

  const stats = [
    { label: 'Text Transformations', value: '10K+', icon: Sparkles },
    { label: 'Questions Answered', value: '5K+', icon: MessageCircle },
    { label: 'Presentations Created', value: '2K+', icon: FileText },

  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="h-12 w-12 text-primary-600" />
            <h1 className="text-4xl font-bold text-gradient">
              TextIQ
            </h1>
          </div>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A versatile AI-driven platform designed to enhance your productivity with intuitive 
          text transformation, interactive Q&A, and smart content exports—all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card text-center">
              <Icon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.href}
              className="card hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`${feature.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm font-medium text-gray-700">Perfect for:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {feature.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="h-1 w-1 bg-gray-400 rounded-full mr-2"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Start Guide */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Choose Your Tool</h3>
            <p className="text-gray-600 text-sm">
              Select from text transformation, Q&A, presentation generation, or file upload.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Input Your Content</h3>
            <p className="text-gray-600 text-sm">
              Paste text, upload files, or type your questions directly into the interface.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Get AI-Powered Results</h3>
            <p className="text-gray-600 text-sm">
              Receive transformed text, answers, presentations, or insights in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
