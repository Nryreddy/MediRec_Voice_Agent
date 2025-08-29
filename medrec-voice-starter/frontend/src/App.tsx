import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { 
  Heart, 
  Shield, 
  Globe, 
  Users, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  Star,
  Activity,
  Clock,
  Languages,
  Stethoscope,
  Brain,
  MessageSquare,
  Link as LinkIcon
} from 'lucide-react';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [surgeryCount, setSurgeryCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
          animateCounter(setSurgeryCount, 3000000, 2000);
          animateCounter(setPatientsCount, 40000000, 2000);
        }
      });
    });

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  const animateCounter = (setter: React.Dispatch<React.SetStateAction<number>>, target: number, duration: number) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(start));
      }
    }, 16);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                MedRec Voice
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-blue-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 transition-colors">Contact</button>
            </div>
            {/*
            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Get Started
            </button>
            */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Shield className="h-4 w-4" />
              <span>Trusted Post-Surgery Care</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
                AI-Powered
              </span>
              <br />
              Recovery Support
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Intelligent post-surgery monitoring that bridges the gap between hospital discharge and complete recovery. 
              Available in your language, whenever you need support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/*
              <button className="group bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <span>Start Your Recovery Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <span>Learn More</span>
                <Activity className="h-5 w-5" />
              </button>
              */}
              {/* New Patients Button */}
              <Link
                to="/patients"
                aria-label="Call patients"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span className="grid place-items-center w-10 h-10 rounded-full bg-white/20">
                  <Phone className="h-8 w-8" />
                </span>
                <span>Call Patients</span>
              </Link>
              
      

            </div>
          </div>
        </div>
      

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-teal-400 to-green-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                <span>The Problem</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Post-Surgery Care 
                <span className="text-red-500"> Gap</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                After major surgery, patients face a critical period where complications can arise, 
                but doctors lack time for regular follow-ups. Patients often don't know what 
                questions to ask or when symptoms require immediate attention.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">3M+</div>
                  <div className="text-sm text-gray-600">Surgeries in Australia annually</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">40M+</div>
                  <div className="text-sm text-gray-600">Surgeries in USA annually</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-red-600">
                    <Clock className="h-6 w-6" />
                    <span className="font-semibold">Limited doctor availability</span>
                  </div>
                  <div className="flex items-center space-x-3 text-red-600">
                    <MessageSquare className="h-6 w-6" />
                    <span className="font-semibold">Patients don't know what to ask</span>
                  </div>
                  <div className="flex items-center space-x-3 text-red-600">
                    <Globe className="h-6 w-6" />
                    <span className="font-semibold">Language barriers</span>
                  </div>
                  <div className="flex items-center space-x-3 text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                    <span className="font-semibold">Delayed recognition of complications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4" />
              <span>Our Solution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                AI Care Companion
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Intelligent, multilingual AI that supports patients after surgery and connects them
              with the right care at the right time.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 p-4 rounded-full w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Languages className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multilingual Support</h3>
              <p className="text-gray-600 mb-4">
                Break down language barriers with native-language communication, ensuring nothing gets lost in translation.
              </p>
              <div className="flex space-x-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">English</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Spanish</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Chineese</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Hindi</span>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Network</h3>
              <p className="text-gray-600 mb-4">
                Direct connections to healthcare providers, specialists, and support services when you need them most.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 availability</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Specialist referrals</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Emergency protocols</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats-section" className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transforming Recovery Worldwide
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Every year, millions of patients need better post-surgery support. We're here to provide it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {surgeryCount.toLocaleString()}+
              </div>
              <div className="text-blue-100">Annual Surgeries in Australia</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {patientsCount.toLocaleString()}+
              </div>
              <div className="text-blue-100">Annual Surgeries in USA</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">AI Outreach</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">3+</div>
              <div className="text-blue-100">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, three-step process that ensures continuous care throughout your recovery journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Doctor Setup</h3>
              <p className="text-gray-600 leading-relaxed">
                Your healthcare provider inputs your medical information, surgery details, 
                and any care preferences.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-teal-500 to-green-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Regular Check-ins</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI reaches out at optimal intervals to check in through
                natural conversations in your preferred language.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive reminders for care instructions and direct connections 
                to appropriate healthcare providers when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose MedRec Voice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology meets compassionate care to support your complete recovery journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Care</h3>
              <p className="text-gray-600">
                Tailored monitoring based on your specific surgery, medical history, and recovery needs.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Accessibility</h3>
              <p className="text-gray-600">
                Communicate in your native language with AI that understands cultural nuances and medical terminology.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600">
                HIPAA-compliant platform with end-to-end encryption and strict privacy protections for your health data.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Availability</h3>
              <p className="text-gray-600">
                Round-the-clock monitoring with intelligent scheduling that respects your time and recovery needs.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Evidence-Based</h3>
              <p className="text-gray-600">
                Built on clinical research and best practices.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Care Network</h3>
              <p className="text-gray-600">
                Seamless integration with your existing healthcare team and access to verified specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Recovery Care?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join healthcare providers worldwide who are improving patient outcomes with AI-powered post-surgery monitoring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/*
            <button className="group bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
              <span>Schedule a Demo</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white/30 hover:bg-white/10 transition-colors flex items-center space-x-2">
              <span>Contact Sales</span>
              <MessageSquare className="h-5 w-5" />
            </button>
            */}
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <Star className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
              <div className="text-2xl font-bold mb-1">Industry Leading</div>
              <div className="text-blue-100">AI Technology</div>
            </div>
            <div className="text-white">
              <Shield className="h-8 w-8 mx-auto mb-3 text-green-300" />
              <div className="text-2xl font-bold mb-1">HIPAA Compliant</div>
              <div className="text-blue-100">Security Standards</div>
            </div>
            <div className="text-white">
              <Globe className="h-8 w-8 mx-auto mb-3 text-teal-300" />
              <div className="text-2xl font-bold mb-1">Global Reach</div>
              <div className="text-blue-100">Multilingual Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MedRec Voice</span>
            </div>
            
            <div className="text-gray-400 text-center md:text-right">
              <p className="mb-2">© 2025 MedRec Voice. All rights reserved.</p>
              <p className="text-sm">Supporting post-surgery care with helpful AI outreach.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add missing import
import { AlertTriangle } from 'lucide-react';

export default App;