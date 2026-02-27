import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Music, 
  Bus, 
  Car, 
  Baby, 
  Gift, 
  Heart,
  Volume2,
  VolumeX
} from 'lucide-react';

// --- Components ---

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="text-center mb-12"
  >
    <h2 className="text-4xl md:text-6xl font-display text-wedding-green mb-2">{title}</h2>
    {subtitle && <p className="text-stone-500 uppercase tracking-widest text-xs font-sans">{subtitle}</p>}
  </motion.div>
);

const CountdownItem = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-4 md:p-8 rounded-xl border border-white/20 min-w-[80px] md:min-w-[140px]">
    <span className="text-3xl md:text-5xl font-display text-white">{value.toString().padStart(2, '0')}</span>
    <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 mt-2 font-sans">{label}</span>
  </div>
);

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<'envelope' | 'video' | 'content'>('envelope');
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    guests: 1,
    allergies: [] as string[],
    otherAllergies: '',
    song: '',
    transport: 'bus',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (step === 'content') {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [step]);

  useEffect(() => {
    const targetDate = new Date('2026-05-09T16:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && step === 'video') {
      const remaining = videoRef.current.duration - videoRef.current.currentTime;
      // Start transition 0.5 seconds before video ends
      if (remaining <= 0.5) {
        setStep('content');
      }
    }
  };

  const handleOpen = () => {
    setStep('video');
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      setIsPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setStep('content');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (allergy: string) => {
    setFormData(prev => {
      const allergies = prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy];
      return { ...prev, allergies };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          attending: 'yes',
          guests: 1,
          allergies: [],
          otherAllergies: '',
          song: '',
          transport: 'bus',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-wedding-cream">
      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="https://boda-finca-comassema.lovable.app/assets/intro-music-DHhPHYn7.mp3"
        loop
      />

      {/* Music Toggle Button */}
      <AnimatePresence>
        {step !== 'envelope' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 z-[110] p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-stone-200 text-wedding-green hover:bg-white transition-all duration-300"
            aria-label={isPlaying ? "Mute Music" : "Play Music"}
          >
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- Intro / Envelope Section --- */}
      <AnimatePresence>
        {step === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          >
            {/* Desktop Background */}
            <div 
              className="hidden md:block absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://static.wixstatic.com/media/7fa905_11db10e7ba964d0dbd77fa949128ef85~mv2.png')" }}
            />
            {/* Mobile Background */}
            <div 
              className="md:hidden absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://static.wixstatic.com/media/7fa905_364ad1c1fd2b4003bfdd85811db07b59~mv2.jpg')" }}
            />
            
            {/* Clickable Area - Entire Screen */}
            <button 
              onClick={handleOpen}
              className="absolute inset-0 z-20 w-full h-full cursor-pointer appearance-none bg-transparent border-none"
              aria-label="Open Invitation"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Video Transition Section --- */}
      <AnimatePresence>
        {step === 'video' && (
          <motion.div
            key="video-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] bg-black flex items-center justify-center overflow-hidden"
          >
            <video 
              ref={videoRef}
              autoPlay
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnd}
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://video.wixstatic.com/video/7fa905_a2aa86b546164f4382703d4002bb873a/1080p/mp4/file.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <main className={`relative transition-opacity duration-[1000ms] ease-in-out ${step === 'content' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Section 4: Hero Video Background */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Hero Background Video */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://boda-finca-comassema.lovable.app/assets/hero-video-PwBjjBYV.mp4" type="video/mp4" />
          </video>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 font-sans">Nos Casamos</p>
              <h1 className="text-6xl md:text-9xl font-display mb-4">Pedro</h1>
              <p className="text-2xl md:text-4xl font-display mb-4">&</p>
              <h1 className="text-6xl md:text-9xl font-display mb-8">Júlia</h1>
              <div className="w-12 h-[1px] bg-white/50 mx-auto mb-8" />
              <p className="text-lg md:text-xl font-display mb-12">May 9, 2026</p>
              
              <button className="uppercase tracking-widest text-[10px] md:text-xs border border-white/50 px-8 py-3 hover:bg-white hover:text-stone-900 transition-all duration-300 font-sans">
                Confirm your attendance
              </button>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
              onClick={() => document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ChevronDown className="w-6 h-6 opacity-70" />
            </motion.div>
          </div>
        </section>

        {/* Section 5: Countdown */}
        <section className="py-24 md:py-32 bg-wedding-green relative overflow-hidden">
          {/* Embossed pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none embossed-bg" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-display text-white mb-4">Countdown</h2>
              <p className="text-white/70 uppercase tracking-widest text-xs font-sans">To the most special day of our lives</p>
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}><CountdownItem value={timeLeft.days} label="Days" /></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}><CountdownItem value={timeLeft.hours} label="Hours" /></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}><CountdownItem value={timeLeft.minutes} label="Minutes" /></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}><CountdownItem value={timeLeft.seconds} label="Seconds" /></motion.div>
            </div>
          </div>
        </section>

        {/* Section 6: Where We Celebrate */}
        <section className="py-24 md:py-32 bg-wedding-cream">
          <div className="container mx-auto px-4 max-w-4xl">
            <SectionHeading title="Where We Celebrate" subtitle="The place where we'll say 'I do'" />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden"
            >
              <div className="p-8 md:p-12 text-center">
                <div className="w-12 h-12 bg-wedding-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-6 h-6 text-wedding-green" />
                </div>
                <h3 className="text-3xl font-display mb-6">Finca Comassema</h3>
                <div className="space-y-4 text-stone-600 mb-8">
                  <div className="flex items-center justify-center gap-2">
                    <Clock size={16} className="text-wedding-olive" />
                    <span>Ceremony: 16:00h</span>
                    <span className="mx-2 opacity-30">|</span>
                    <Clock size={16} className="text-wedding-olive" />
                    <span>Banquet: 19:00h</span>
                  </div>
                  <p className="text-sm font-sans tracking-wide">Carretera Orient-Alaró, km 10, 07340 Alaró, Mallorca</p>
                </div>
                
                {/* Mock Map */}
                <div className="aspect-video w-full bg-stone-100 rounded-xl mb-8 relative overflow-hidden group">
                  <img 
                    src="https://picsum.photos/seed/mallorca-map/1200/600?blur=2" 
                    alt="Map location" 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-wedding-green font-sans text-sm font-medium">
                      <MapPin size={16} />
                      Open in Google Maps
                    </div>
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 px-8 py-3 bg-wedding-cream border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors font-sans text-sm uppercase tracking-widest">
                  <MapPin size={16} />
                  Open in Maps
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 7: Day Program */}
        <section className="py-24 md:py-32 bg-stone-50">
          <div className="container mx-auto px-4">
            <SectionHeading title="Day Program" subtitle="What we have planned for you" />
            
            <div className="relative max-w-5xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stone-200 hidden md:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {[
                  { time: '13:00', icon: <Calendar size={20} />, title: 'Ceremony', desc: 'Wedding at the Church of Encarnación' },
                  { time: '15:00', icon: <Volume2 size={20} />, title: 'Welcome Cocktail', desc: 'Arrival at the venue and appetizers' },
                  { time: '16:30', icon: <Clock size={20} />, title: 'Dinner', desc: 'Wedding banquet' },
                  { time: '18:30', icon: <Music size={20} />, title: 'First Dance', desc: "Let's hit the dance floor!" },
                  { time: '01:00', icon: <Heart size={20} />, title: 'End of Party', desc: 'With the possibility to extend' },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="bg-wedding-green text-white px-4 py-1 rounded-full text-xs font-sans mb-6 relative z-10">
                      {item.time}
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full border border-stone-200 flex items-center justify-center mb-6 shadow-sm">
                      <div className="text-wedding-green">{item.icon}</div>
                    </div>
                    <h4 className="text-xl font-display mb-2">{item.title}</h4>
                    <p className="text-xs text-stone-500 font-sans leading-relaxed px-4">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Dress Code */}
        <section className="py-24 md:py-32 bg-wedding-cream">
          <div className="container mx-auto px-4 max-w-4xl">
            <SectionHeading title="Dress Code" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center"
              >
                <div className="w-16 h-16 bg-wedding-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-wedding-green">🎖️</div>
                </div>
                <h3 className="text-2xl font-display mb-4">Military</h3>
                <p className="text-stone-500 font-sans text-sm">Formal dress uniform</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center"
              >
                <div className="w-16 h-16 bg-wedding-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-wedding-green">✨</div>
                </div>
                <h3 className="text-2xl font-display mb-4">Civilians</h3>
                <p className="text-stone-500 font-sans text-sm">Formal suit or gown</p>
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12 text-stone-400 italic text-sm"
            >
              Please avoid wearing white — reserved for the bride
            </motion.p>
          </div>
        </section>

        {/* Section 9: Important Information */}
        <section className="py-24 md:py-32 bg-stone-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <SectionHeading title="Important Information" />
            
            <div className="space-y-4">
              {[
                { q: 'Will there be bus service?', a: 'Yes, we will provide a bus service from the city center to the venue and back.', icon: <Bus size={18} /> },
                { q: 'Can I drive my own car?', a: 'Yes, there is plenty of parking available at the venue.', icon: <Car size={18} /> },
                { q: 'Can children attend?', a: 'While we love your little ones, our wedding will be an adults-only celebration.', icon: <Baby size={18} /> },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <details className="group bg-white rounded-xl border border-stone-200 overflow-hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <div className="flex items-center gap-4">
                        <div className="text-wedding-olive">{item.icon}</div>
                        <span className="font-sans text-sm font-medium text-stone-700">{item.q}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-stone-500 font-sans text-sm leading-relaxed ml-10">
                      {item.a}
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 10: Gifts */}
        <section className="py-24 md:py-32 bg-wedding-cream">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm"
            >
              <Gift className="w-6 h-6 text-wedding-green" />
            </motion.div>
            <SectionHeading title="Gifts" />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-stone-100/50 p-12 rounded-2xl border border-stone-200"
            >
              <Heart className="w-6 h-6 text-stone-300 mx-auto mb-6" />
              <p className="text-xl font-display text-stone-700 mb-6">Your presence is the greatest gift we can receive.</p>
              <p className="text-stone-500 font-sans text-sm leading-relaxed">
                Having you by our side on this special day is all we need. However, if you wish to give us a gift, any form of present will be received with much love and gratitude.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 11: RSVP Form */}
        <section id="rsvp-section" className="py-24 md:py-32 bg-stone-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <SectionHeading title="Confirm Your Attendance" subtitle="We hope to see you there" />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {submitStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 text-center"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-green-600 fill-green-600" />
                  </div>
                  <h3 className="text-3xl font-display text-stone-800 mb-4">Thank you!</h3>
                  <p className="text-stone-600 font-sans mb-8">Your RSVP has been received. We can't wait to celebrate with you!</p>
                  <button 
                    onClick={() => setSubmitStatus('idle')}
                    className="text-wedding-green font-sans text-sm uppercase tracking-widest font-semibold hover:underline"
                  >
                    Send another response
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-200 space-y-8">
                  <div className="space-y-2">
                    <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-stone-600">Full Name *</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name" 
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wedding-green/20 focus:border-wedding-green transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-stone-600">Email (optional)</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com" 
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wedding-green/20 focus:border-wedding-green transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-stone-600">Will you attend? *</label>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="attending" 
                          value="yes"
                          checked={formData.attending === 'yes'}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-wedding-green" 
                        />
                        <span className="text-sm text-stone-600 font-sans">Yes, I will attend</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="attending" 
                          value="no"
                          checked={formData.attending === 'no'}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-wedding-green" 
                        />
                        <span className="text-sm text-stone-600 font-sans">I won't be able to attend</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-stone-600">Number of guests (including yourself)</label>
                    <input 
                      type="number" 
                      name="guests"
                      min="1" 
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wedding-green/20 focus:border-wedding-green transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-600">
                      <span className="text-lg">⚠️</span>
                      <label className="block text-xs font-sans font-semibold uppercase tracking-widest">Food allergies and intolerances</label>
                    </div>
                    <p className="text-xs text-stone-400 font-sans italic">It's very important for us to know about any dietary restrictions. Select all that apply:</p>
                    <div className="grid grid-cols-2 gap-4">
                      {['Gluten-free / Celiac', 'Lactose-free', 'Vegetarian', 'Vegan', 'Nut allergy', 'Seafood allergy'].map((item) => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.allergies.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                            className="w-4 h-4 accent-wedding-green rounded" 
                          />
                          <span className="text-sm text-stone-600 font-sans">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-stone-600">Other allergies or restrictions:</label>
                    <textarea 
                      name="otherAllergies"
                      value={formData.otherAllergies}
                      onChange={handleInputChange}
                      placeholder="E.g., egg allergy, fructose intolerance..." 
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-wedding-green/20 focus:border-wedding-green transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Music size={16} />
                      <label className="block text-xs font-sans font-semibold uppercase tracking-widest">Your must-play song</label>
                    </div>
                    <input 
                      type="text" 
                      name="song"
                      value={formData.song}
                      onChange={handleInputChange}
                      placeholder="Artist - Song name" 
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wedding-green/20 focus:border-wedding-green transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Bus size={16} />
                      <label className="block text-xs font-sans font-semibold uppercase tracking-widest">Transportation *</label>
                    </div>
                    <p className="text-xs text-stone-400 font-sans italic">There will be a bus available after the ceremony to go up to the venue, and at the end of the party to return to Almuñécar.</p>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="transport" 
                          value="bus"
                          checked={formData.transport === 'bus'}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-wedding-green" 
                        />
                        <span className="text-sm text-stone-600 font-sans">Yes, I will need the bus</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="transport" 
                          value="car"
                          checked={formData.transport === 'car'}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-wedding-green" 
                        />
                        <span className="text-sm text-stone-600 font-sans">No, I will drive</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-stone-600">Message for the couple (optional)</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write us a few words..." 
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-wedding-green/20 focus:border-wedding-green transition-all"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm font-sans text-center">Something went wrong. Please try again.</p>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-wedding-green text-white py-4 rounded-lg font-sans text-sm uppercase tracking-widest font-semibold hover:bg-wedding-olive transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Heart size={16} />
                        Send confirmation
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* Section 12: Footer */}
        <footer className="py-24 bg-wedding-green text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none embossed-bg" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <Heart className="w-6 h-6 mx-auto mb-8 text-white/50" />
            <h2 className="text-4xl md:text-6xl font-display mb-4">Pedro & Júlia</h2>
            <p className="text-white/60 font-display text-lg mb-12">May 9, 2026</p>
            
            <div className="w-12 h-[1px] bg-white/20 mx-auto mb-8" />
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-sans">
              Made with love for our special day
            </p>
          </motion.div>
        </footer>

      </main>
    </div>
  );
}
