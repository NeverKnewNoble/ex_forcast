<template>
  <div class="w-full min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-100 text-gray-800 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-pattern opacity-40"></div>
    
    <!-- Animated Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="geometric-pattern pattern-1"></div>
      <div class="geometric-pattern pattern-2"></div>
      <div class="geometric-pattern pattern-3"></div>
      <div class="dot-pattern"></div>
      <div class="grid-pattern"></div>
    </div>
    
    <!-- Hero Section -->
    <section class="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
      <div class="max-w-6xl mx-auto text-center">
        <div class="animate-fade-in-up">
          <h1 class="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black  bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 bg-clip-text text-transparent animate-slide-in-left tracking-tight">
            Ex Forecast
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Transform your business decisions with AI-powered forecasting insights. 
            <span class="text-violet-600 font-semibold">Predict the future, shape your success.</span>
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
          <router-link
            to="/dashboard"
              class="group px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <span>Get Started</span>
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </router-link>

          <button
            @click="session.logout.submit()"
              class="px-8 py-4 text-violet-600 font-semibold bg-white border-2 border-violet-200 rounded-full hover:bg-violet-50 hover:border-violet-300 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
              <LogOut class="w-5 h-5" />
            <span>Logout</span>
          </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="relative z-10 py-20 bg-white/50 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose <span class="text-violet-600">Ex Forecastor</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to revolutionize your forecasting experience
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="feature-card animate-fade-in-up delay-100">
            <div class="feature-icon">
              <BarChart3 class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Real-Time Analytics</h3>
            <p class="text-gray-600 leading-relaxed">
              Monitor key metrics and trends with beautiful, interactive dashboards updated in real-time.
            </p>
          </div>
          
          <div class="feature-card animate-fade-in-up delay-200">
            <div class="feature-icon">
              <Zap class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Lightning Fast</h3>
            <p class="text-gray-600 leading-relaxed">
              Get instant insights with our optimized platform that processes data at lightning speed.
            </p>
          </div>
          
          <div class="feature-card animate-fade-in-up delay-300">
            <div class="feature-icon">
              <Shield class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Enterprise Security</h3>
            <p class="text-gray-600 leading-relaxed">
              Bank-level security ensures your data is protected with encryption and compliance standards.
            </p>
          </div>
          
          <div class="feature-card animate-fade-in-up delay-400">
            <div class="feature-icon">
              <Users class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Team Collaboration</h3>
            <p class="text-gray-600 leading-relaxed">
              Share insights and collaborate seamlessly with your team across departments and locations.
            </p>
          </div>
          
          <div class="feature-card animate-fade-in-up delay-500">
            <div class="feature-icon">
              <TrendingUp class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Predictive Insights</h3>
            <p class="text-gray-600 leading-relaxed">
              Identify patterns and trends before they happen with our advanced predictive analytics.
            </p>
          </div>
          
          <div class="feature-card animate-fade-in-up delay-600">
            <div class="feature-icon">
              <Database class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Data Integration</h3>
            <p class="text-gray-600 leading-relaxed">
              Seamlessly connect and integrate with your existing data sources and business tools.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- People's Experience Section -->
    <section class="relative z-10 py-20 bg-gradient-to-br from-violet-50 to-purple-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our <span class="text-violet-600">Users Say</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their business with Ex Forecastor
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="testimonial-card animate-fade-in-up delay-100">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                S
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">Sarah Johnson</h4>
                <p class="text-sm text-gray-500">CEO, TechFlow Inc.</p>
              </div>
            </div>
            <p class="text-gray-600 leading-relaxed">
              "Ex Forecastor has revolutionized how we make business decisions. The AI insights are incredibly accurate and have helped us increase our revenue by 40%."
            </p>
            <div class="flex text-yellow-400 mt-4">
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
            </div>
          </div>
          
          <div class="testimonial-card animate-fade-in-up delay-200">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                M
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">Michael Chen</h4>
                <p class="text-sm text-gray-500">Data Scientist, DataCorp</p>
              </div>
            </div>
            <p class="text-gray-600 leading-relaxed">
              "The real-time analytics and predictive capabilities are outstanding. It's like having a crystal ball for business forecasting."
            </p>
            <div class="flex text-yellow-400 mt-4">
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
            </div>
          </div>
          
          <div class="testimonial-card animate-fade-in-up delay-300">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                E
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">Emily Rodriguez</h4>
                <p class="text-sm text-gray-500">Operations Manager, GrowthCo</p>
              </div>
            </div>
            <p class="text-gray-600 leading-relaxed">
              "The user interface is intuitive and the team collaboration features have improved our workflow significantly."
            </p>
            <div class="flex text-yellow-400 mt-4">
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
              <Star class="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>
        
        <!-- Stats Section -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="stat-card animate-fade-in-up delay-400">
            <h3 class="text-3xl md:text-4xl font-bold text-violet-600 mb-2">10K+</h3>
            <p class="text-gray-600">Active Users</p>
          </div>
          <div class="stat-card animate-fade-in-up delay-500">
            <h3 class="text-3xl md:text-4xl font-bold text-violet-600 mb-2">95%</h3>
            <p class="text-gray-600">Accuracy Rate</p>
          </div>
          <div class="stat-card animate-fade-in-up delay-600">
            <h3 class="text-3xl md:text-4xl font-bold text-violet-600 mb-2">24/7</h3>
            <p class="text-gray-600">Support Available</p>
          </div>
          <div class="stat-card animate-fade-in-up delay-700">
            <h3 class="text-3xl md:text-4xl font-bold text-violet-600 mb-2">50M+</h3>
            <p class="text-gray-600">Predictions Made</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { session } from '@/data/session'
import { 
  ArrowRight, 
  LogOut, 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  Star,
  Database
} from 'lucide-vue-next'
</script>



















<style scoped>
/* Background Pattern */
.bg-pattern {
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.25) 0%, transparent 50%),
    linear-gradient(45deg, transparent 40%, rgba(139, 92, 246, 0.15) 50%, transparent 60%),
    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 92, 246, 0.08) 35px, rgba(139, 92, 246, 0.08) 36px);
  background-size: 200px 200px, 300px 300px, 100px 100px, 72px 72px;
  background-position: 0 0, 100px 100px, 50px 50px, 0 0;
}

/* Geometric Patterns */
.geometric-pattern {
  position: absolute;
  opacity: 0.15;
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
}

.pattern-1 {
  width: 400px;
  height: 400px;
  top: 10%;
  right: 5%;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: rotate1 30s linear infinite;
}

.pattern-2 {
  width: 300px;
  height: 300px;
  bottom: 15%;
  left: 10%;
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
  animation: rotate2 25s linear infinite reverse;
}

.pattern-3 {
  width: 250px;
  height: 250px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
  animation: rotate3 35s linear infinite;
}

@keyframes rotate1 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate2 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate3 {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Additional Background Patterns */
.dot-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(139, 92, 246, 0.15) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
  animation: float-dots 20s ease-in-out infinite;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.08) 1px, transparent 1px);
  background-size: 100px 100px;
  opacity: 0.4;
}

@keyframes float-dots {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Floating Shapes Animation */
.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(40px);
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  top: 10%;
  left: 10%;
  animation: float1 20s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #a855f7, #c084fc);
  top: 60%;
  right: 15%;
  animation: float2 25s ease-in-out infinite;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #c084fc, #8b5cf6);
  bottom: 20%;
  left: 20%;
  animation: float3 18s ease-in-out infinite;
}

.shape-4 {
  width: 180px;
  height: 180px;
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  top: 30%;
  right: 30%;
  animation: float4 22s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-40px, 20px) rotate(120deg); }
  66% { transform: translate(20px, -40px) rotate(240deg); }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(25px, 25px) rotate(120deg); }
  66% { transform: translate(-25px, -25px) rotate(240deg); }
}

@keyframes float4 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-30px, -30px) rotate(120deg); }
  66% { transform: translate(30px, 30px) rotate(240deg); }
}

/* Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 1s ease-out forwards;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }
.delay-600 { animation-delay: 0.6s; }
.delay-700 { animation-delay: 0.7s; }

/* Feature Cards */
.feature-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(139, 92, 246, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  animation: fade-in-up 0.8s ease-out forwards;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.2);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

/* Testimonial Cards */
.testimonial-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  animation: fade-in-up 0.8s ease-out forwards;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.1);
}

/* Stats Cards */
.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  animation: fade-in-up 0.8s ease-out forwards;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(139, 92, 246, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-shape {
    display: none;
  }
}
</style>
