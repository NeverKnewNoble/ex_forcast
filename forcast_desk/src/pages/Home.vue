<template>
  <div 
    class="w-full min-h-screen bg-white text-gray-800 relative overflow-hidden"
    :style="{
      backgroundImage: `url(${bg1})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <!-- Animated Floating Blobs -->
    <div class="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      <div class="blob blob1 animate-blob1"></div>
      <div class="blob blob2 animate-blob2"></div>
      <div class="blob blob3 animate-blob3"></div>
    </div>
    <!-- Overlay for better text readability -->
    <div class="absolute inset-0 bg-gray-600 bg-opacity-10 z-0"></div>
    
    <!-- Hero Section -->
    <section
      class="w-full min-h-screen flex justify-center items-center text-center px-4 relative z-10"
    >
      <div class="max-w-4xl mx-auto glass-card p-10 md:p-16 rounded-3xl shadow-2xl animate-fadein">
        <div class="flex items-center justify-center gap-4 flex-wrap text-center md:text-left">
          <img :src="logo" alt="logo" class="mx-auto mb-4 w-[100px] md:w-[140px] object-contain drop-shadow-lg animate-bounce-slow" />
          <h1
            class="text-[48px] md:text-[80px] font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500 animate-slidein"
          >
            Ex Forecastor
          </h1>
        </div>

        <p class="mt-6 text-lg md:text-xl text-white/90 animate-fadein delay-200">
          Your personalized forecasting insights delivered straight to your dashboard
          <br class="hidden md:block" />
          powered by data, designed for decision-makers.
        </p>

        <div class="mt-10 flex flex-col md:flex-row justify-center items-center gap-4 animate-fadein delay-300">
          <router-link
            to="/dashboard"
            class="px-8 py-3 text-white font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-black hover:to-purple-700 rounded-full shadow-lg transition duration-300 flex items-center gap-2"
          >
            <span>Get Started</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </router-link>

          <button
            @click="session.logout.submit()"
            class="px-8 py-2 text-purple-600 font-medium bg-white hover:bg-purple-600 hover:text-white rounded-full transition duration-300 flex items-center gap-2 border border-purple-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7"/></svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="relative z-10 py-16 bg-gradient-to-b from-transparent to-white/80">
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div class="feature-card">
          <div class="feature-icon bg-violet-100 text-violet-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
          </div>
          <h3 class="font-bold text-lg mt-4 mb-2">AI-Powered Forecasts</h3>
          <p class="text-gray-600">Leverage advanced AI to get accurate, actionable predictions for your business.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon bg-blue-100 text-blue-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 008 0m0 0a4 4 0 018 0m-8 0V3"/></svg>
          </div>
          <h3 class="font-bold text-lg mt-4 mb-2">Real-Time Dashboard</h3>
          <p class="text-gray-600">Monitor key metrics and trends in a beautiful, interactive dashboard.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon bg-pink-100 text-pink-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="font-bold text-lg mt-4 mb-2">Seamless Integration</h3>
          <p class="text-gray-600">Easily connect with your existing tools and workflows for a smooth experience.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { session } from '@/data/session'
import logo from '@/assets/images/icon_logo.png'
// import hero from '@/assets/images/hero.png'
import bg1 from '@/assets/images/bg1.jpg'
// import bg2 from '@/assets/images/bg2.jpg'
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Animated Blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.25;
  filter: blur(32px);
  z-index: 1;
}
.blob1 {
  width: 320px; height: 320px;
  background: #a78bfa;
  top: -80px; left: -80px;
}
.blob2 {
  width: 220px; height: 220px;
  background: #60a5fa;
  bottom: 40px; right: 60px;
}
.blob3 {
  width: 180px; height: 180px;
  background: #f472b6;
  top: 60%; left: 60%;
}
@keyframes blob1 {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(40px) scale(1.1); }
}
@keyframes blob2 {
  0%, 100% { transform: translateX(0) scale(1); }
  50% { transform: translateX(-30px) scale(1.08); }
}
@keyframes blob3 {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(-20px, 20px) scale(1.12); }
}
.animate-blob1 { animation: blob1 8s ease-in-out infinite; }
.animate-blob2 { animation: blob2 10s ease-in-out infinite; }
.animate-blob3 { animation: blob3 12s ease-in-out infinite; }

/* Animations */
@keyframes fadein {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadein {
  animation: fadein 1.2s cubic-bezier(0.4,0,0.2,1) both;
}
.animate-fadein.delay-200 { animation-delay: 0.2s; }
.animate-fadein.delay-300 { animation-delay: 0.3s; }
@keyframes slidein {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slidein { animation: slidein 1.2s cubic-bezier(0.4,0,0.2,1) both; }
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}
.animate-bounce-slow { animation: bounce-slow 2.5s infinite; }

/* Features */
.feature-card {
  background: rgba(255,255,255,0.7);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(80,80,180,0.08);
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.feature-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 8px 32px 0 rgba(80,80,180,0.16);
}
.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 auto;
  font-size: 2rem;
  box-shadow: 0 2px 8px 0 rgba(80,80,180,0.08);
}
</style>
