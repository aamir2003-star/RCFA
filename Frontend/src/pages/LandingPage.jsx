import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  BarChart3,
  FileCheck,
  Upload,
  Search,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Globe,
  LayoutGrid,
  Zap,
  Cpu,
  MousePointer2
} from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter">SpectraAI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#reports" className="hover:text-foreground transition-colors">Reports</a>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold">
          <ThemeToggle />
          <Link to="/login" className="px-4 py-2 hover:text-foreground">Login</Link>
          <Link to="/login" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md hover:opacity-90 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <span className="bg-[#b7e4f9] text-[#0ea5e9] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
              Precision Engineering
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight"
          >
            Resolve Requirement <br />
            <span className="text-[#2c4c8d] font-extrabold italic">Conflicts</span> Before <br />
            Development Begins
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed font-medium"
          >
            Our <span className="text-foreground font-bold underline decoration-[#0ea5e9]/30">AI-powered engine</span> automatically detects conflicting requirements from Legal, Developers, and PMs, providing real-time feasibility insights and collaborative resolution tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/login" className="bg-foreground text-background px-6 py-3 rounded-md font-bold hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10">
              Get Started Free
            </Link>
            <button className="bg-card border border-border px-6 py-3 rounded-md font-bold text-foreground hover:bg-muted transition-all hover:scale-105 active:scale-95 border-b-2">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Hero Card Graphic */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="relative group perspective-1000"
        >
          <motion.div
            whileHover={{ y: -10, rotateX: 2, rotateY: -2, scale: 1.02 }}
            className="bg-card rounded-xl shadow-2xl p-6 border border-border transform transition-all duration-500"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-extrabold uppercase tracking-tight">Detected Conflict <span className="text-blue-600">#842</span></span>
              </div>
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-[10px] font-black bg-destructive/10 text-destructive px-2 py-1 rounded-sm uppercase tracking-widest"
              >
                High Risk
              </motion.span>
            </div>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.03, backgroundColor: "#eff6ff" }}
                className="bg-[#f0f4f9] p-4 rounded-lg relative overflow-hidden transition-colors border border-transparent hover:border-blue-100"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-tighter">Legal Requirement</div>
                    <div className="text-sm font-bold leading-tight text-foreground">Mandatory <span className="text-blue-600 underline underline-offset-2">AES-256 encryption</span> for all data at rest.</div>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-center -my-2 relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-black border-4 border-white shadow-lg"
                >
                  VS
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.03, backgroundColor: "#fff7ed" }}
                className="bg-[#f8f9fa] p-4 rounded-lg transition-colors border border-transparent hover:border-orange-100"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-tighter">Developer Constraint</div>
                    <div className="text-sm font-bold leading-tight text-foreground">Support <span className="text-orange-600">10,000 concurrent users</span> with &lt;100ms latency.</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="pt-6 space-y-4">
              <div className="group/item">
                <div className="flex justify-between text-[10px] font-black uppercase mb-1 tracking-widest">
                  <span className="text-slate-400 group-hover/item:text-slate-600 transition-colors">Timeline Impact</span>
                  <span className="text-orange-500 font-black">+2 Weeks</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]"
                  ></motion.div>
                </div>
              </div>
              <div className="group/item">
                <div className="flex justify-between text-[10px] font-black uppercase mb-1 tracking-widest">
                  <span className="text-slate-400 group-hover/item:text-slate-600 transition-colors">Budget Increase</span>
                  <span className="text-orange-500 font-black">+15%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "45%" }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                    className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]"
                  ></motion.div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -8, scale: 1.1, zIndex: 10 }}
                      className="w-8 h-8 rounded-full border-2 border-card bg-muted overflow-hidden cursor-pointer shadow-sm"
                    >
                      <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="avatar" />
                    </motion.div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground shadow-sm">+2</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-[10px] font-black uppercase text-secondary-foreground hover:text-primary transition-colors">Dismiss</button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "var(--foreground)", color: "var(--background)" }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[10px] font-black uppercase bg-primary text-primary-foreground px-4 py-2.5 rounded shadow-xl transition-all"
                  >
                    View Correlation
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Trusted by Leading Engineering and Product Teams</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale dark:invert group">
            <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">GLOBAL_CORE</span>
            <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">NEXUSIO</span>
            <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">STRATUM</span>
            <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">VELOCITY</span>
            <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">ZENITH</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Architected for Accuracy</h2>
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed font-medium">
            Our system doesn't just find problems, it mathematically calculates the feasibility of every architectural decision.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="grid md:grid-cols-6 md:grid-rows-2 gap-6 h-full md:h-[600px]"
        >
          {/* AI Powered Detection */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="md:col-span-4 bg-card rounded-xl p-10 border border-border shadow-sm flex flex-col justify-between group/card transition-all"
          >
            <div>
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                className="w-12 h-12 bg-[#0ea5e9] rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-[#0ea5e9]/20"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter">AI-Powered Detection</h3>
              <p className="text-muted-foreground text-base max-w-sm mb-6 leading-relaxed font-medium">
                Proprietary <span className="text-foreground font-bold">NLP engine</span> scans PRDs, legal docs, and Jira tickets to map logical inconsistencies in milliseconds.
              </p>
            </div>
            <a href="#" className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 group">
              Learn about the engine <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>

          {/* Collaborative Voting */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0 }
            }}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 bg-[#022f5c] text-white rounded-xl p-10 border border-slate-800 shadow-xl flex flex-col justify-between overflow-hidden relative group/card"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8 backdrop-blur border border-white/10 group-hover/card:bg-white/20 transition-colors">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter">Collaborative Voting</h3>
              <p className="text-white/70 text-base mb-6 leading-relaxed font-medium">
                Reach <span className="text-white font-bold underline decoration-white/30">consensus faster</span> with structured revelation workflows for every stakeholder.
              </p>
            </div>
            <div className="space-y-4 relative z-10">
              {[1, 2].map(i => (
                <div key={i} className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: i === 1 ? '85%' : '60%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-[#0ea5e9]/60"
                  ></motion.div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </motion.div>

          {/* Feasibility Matrix */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0 }
            }}
            whileHover={{ y: -8 }}
            className="md:col-span-2 bg-secondary rounded-xl p-10 border border-border shadow-sm flex flex-col justify-between group/card hover:bg-card transition-all"
          >
            <div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-8 shadow-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter">Feasibility Matrix</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed font-bold">
                Visualize the <span className="text-foreground italic">intersection</span> of cost, timeline, and technical risk.
              </p>
            </div>
          </motion.div>

          {/* Enterprise Reporting */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8 }}
            className="md:col-span-4 bg-muted rounded-xl p-10 border border-border shadow-sm flex items-center gap-12 group/card hover:bg-card transition-all"
          >
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-4 tracking-tighter">Enterprise Reporting</h3>
              <p className="text-muted-foreground text-base mb-8 leading-relaxed font-medium">
                Generate <span className="text-foreground font-bold uppercase tracking-tight">board-ready audit trails</span> of every requirement change and resolution decision.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "var(--foreground)", color: "var(--background)" }}
                className="bg-card px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest border border-border transition-all shadow-sm"
              >
                Preview Reports
              </motion.button>
            </div>
            <div className="flex-1 hidden lg:block">
              <div className="bg-background rounded-xl p-6 h-40 w-full shadow-inner border border-border space-y-4 transition-colors">
                <motion.div initial={{ width: 0 }} whileInView={{ width: "80%" }} transition={{ duration: 1 }} className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full"></motion.div>
                <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.2 }} className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full"></motion.div>
                <div className="h-16 w-full bg-card rounded-lg shadow-sm border border-border flex items-center px-4">
                  <div className="w-full h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-1/3 h-full bg-blue-500"></motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Workflow Section */}
      <section id="how-it-works" className="py-24 bg-background border-y border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">SpectraAI Workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base font-medium">
              From raw documents to resolved conflicts in four high-efficiency steps.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid md:grid-cols-4 gap-12"
          >
            {[
              { icon: Shield, title: "Upload", desc: "Import documents from Jira, Confluence, or raw PDF/DOCX files." },
              { icon: Search, title: "Analyze", desc: "Our AI maps logic clusters and identifies hidden dependencies." },
              { icon: Users, title: "Collaborate", desc: "Stakeholders review detected conflicts and discuss trade-offs." },
              { icon: CheckCircle, title: "Resolve", desc: "Approve one version of truth and export the updated feasibility report." }
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -12, scale: 1.05 }}
                className="text-center flex flex-col items-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0f172a] dark:group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:rotate-6">
                  <step.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                </div>
                <h4 className="text-lg font-black mb-3 group-hover:text-primary transition-colors">{step.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed px-4 font-medium group-hover:text-foreground transition-colors">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="bg-[#021831] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          {/* Dots Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Stop development rework. <br />
              Start analyzing today.
            </h2>
            <p className="text-slate-400 mb-10 text-base max-w-lg mx-auto font-medium leading-relaxed">
              Join over 250+ engineering teams that use RCFA to reduce project delays by 35% on average.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="bg-[#b7e4f9] text-slate-900 px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all hover:scale-105 shadow-xl shadow-blue-500/10">
                Get Started for Free
              </Link>
              <button className="bg-[#112d4a] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#1a3a5a] transition-all border border-white/10 hover:scale-105">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background pt-24 pb-12 px-8 border-t border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2">
            <div className="text-2xl font-black mb-6 tracking-tighter">SpectraAI</div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs uppercase font-black tracking-[0.1em] opacity-60">
              Precision engineering conflict resolution for modern enterprises. Built for scale.
            </p>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase mb-8 tracking-widest">Product</h5>
            <ul className="space-y-4 text-xs text-muted-foreground font-bold uppercase tracking-wider">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase mb-8 tracking-widest">Company</h5>
            <ul className="space-y-4 text-xs text-muted-foreground font-bold uppercase tracking-wider">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase mb-8 tracking-widest">Legal</h5>
            <ul className="space-y-4 text-xs text-muted-foreground font-bold uppercase tracking-wider">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
          <div>© 2026 REQUIREMENT CONFLICT & FEASIBILITY ANALYZER. ENGINEERED FOR PRECISION.</div>
          <div className="flex gap-6">
            <Globe className="w-4 h-4 hover:text-foreground transition-colors cursor-pointer" />
            <LayoutGrid className="w-4 h-4 hover:text-foreground transition-colors cursor-pointer" />
            <Shield className="w-4 h-4 hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
