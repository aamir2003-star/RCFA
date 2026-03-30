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

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f6f7f7] text-[#0f172a] font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter">RCFA</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900">How It Works</a>
          <a href="#reports" className="hover:text-slate-900">Reports</a>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link to="/login" className="px-4 py-2 hover:text-slate-900">Login</Link>
          <Link to="/login" className="bg-[#1d283a] text-white px-5 py-2.5 rounded-md hover:bg-slate-800 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="mb-4">
            <span className="bg-[#b7e4f9] text-[#0ea5e9] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
              Precision Engineering
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
            Resolve Requirement <br />
            <span className="text-[#2c4c8d]">Conflicts</span> Before <br />
            Development Begins
          </h1>
          <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
            Our AI-powered engine automatically detects conflicting requirements from Legal, Developers, and PMs, providing real-time feasibility insights and collaborative resolution tools.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="bg-[#0f172a] text-white px-6 py-3 rounded-md font-semibold hover:bg-slate-800 transition-colors">
              Get Started Free
            </Link>
            <button className="bg-white border border-slate-200 px-6 py-3 rounded-md font-semibold text-slate-700 hover:bg-slate-50 transition-colors border-b-2">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Card Graphic */}
        <div className="relative group perspective-1000">
          <div className="bg-white rounded-xl shadow-2xl p-6 border border-slate-100 transform transition-transform duration-500 hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold">Detected Conflict #842</span>
              </div>
              <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-1 rounded-sm uppercase tracking-wider uppercase">High Risk</span>
            </div>

            <div className="space-y-4">
              <div className="bg-[#f0f4f9] p-4 rounded-lg relative">
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Legal Requirement</div>
                        <div className="text-sm font-medium leading-tight">Mandatory AES-256 encryption for all data at rest and in transit.</div>
                    </div>
                 </div>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold border-4 border-white">VS</div>
              </div>

              <div className="bg-[#f8f9fa] p-4 rounded-lg">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Developer Constraint</div>
                        <div className="text-sm font-medium leading-tight">Support 10,000 concurrent users with &lt;100ms latency.</div>
                    </div>
                 </div>
              </div>

              <div className="pt-4 space-y-4">
                <div>
                   <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                      <span className="text-slate-400">Timeline Impact</span>
                      <span className="text-orange-500">+2 Weeks</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[75%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                      <span className="text-slate-400">Budget Increase</span>
                      <span className="text-orange-500">+15%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[45%]"></div>
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                     </div>
                   ))}
                   <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">+2</div>
                </div>
                <div className="flex gap-2">
                   <button className="text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600">Dismiss</button>
                   <button className="text-[10px] font-bold uppercase bg-[#0f172a] text-white px-3 py-2 rounded">View Correlation</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-[#f6f7f7]">
        <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-8">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Trusted by Leading Engineering and Product Teams</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale group">
                <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">GLOBAL_CORE</span>
                <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">NEXUSIO</span>
                <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">STRATUM</span>
                <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">VELOCITY</span>
                <span className="text-lg font-bold tracking-tighter hover:grayscale-0 transition-all cursor-default">ZENITH</span>
            </div>
        </div>
      </section>

      {/* Features Section - Architected for Accuracy */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-8">
        <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Architected for Accuracy</h2>
            <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
                Our system doesn't just find problems, it mathematically calculates the feasibility of every architectural decision.
            </p>
        </div>

        <div className="grid md:grid-cols-6 md:grid-rows-2 gap-4 h-full md:h-[600px]">
            {/* AI Powered Detection */}
            <div className="md:col-span-4 bg-white rounded-xl p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                   <div className="w-10 h-10 bg-[#0ea5e9] rounded-md flex items-center justify-center mb-6">
                      <Zap className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-4">AI-Powered Detection</h3>
                   <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                      Proprietary NLP engine scans PRDs, legal docs, and Jira tickets to map logical inconsistencies in milliseconds.
                   </p>
                </div>
                <a href="#" className="flex items-center gap-2 text-xs font-bold uppercase group">
                   Learn about the engine <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            {/* Collaborative Voting */}
            <div className="md:col-span-2 bg-[#022f5c] text-white rounded-xl p-10 border border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden relative">
                <div className="relative z-10">
                   <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center mb-6 backdrop-blur">
                      <Users className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-4">Collaborative Voting</h3>
                   <p className="text-white/60 text-sm mb-6 leading-relaxed">
                      Reach consensus faster with structured revelation workflows for every stakeholder.
                   </p>
                </div>
                <div className="space-y-3 relative z-10">
                   {[1,2].map(i => (
                     <div key={i} className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-blue-300 w-[${i === 1 ? '85%' : '60%'}]`}></div>
                     </div>
                   ))}
                </div>
            </div>

            {/* Feasibility Matrix */}
            <div className="md:col-span-2 bg-[#f0f4f9] rounded-xl p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                   <div className="w-10 h-10 bg-[#1d283a] rounded-md flex items-center justify-center mb-6">
                      <LayoutGrid className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-4">Feasibility Matrix</h3>
                   <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      Visualize the intersection of cost, timeline, and technical risk in a real-time heat map.
                   </p>
                </div>
            </div>

            {/* Enterprise Reporting */}
            <div className="md:col-span-4 bg-[#e8e9e9] rounded-xl p-10 border border-slate-100 shadow-sm flex items-center gap-12">
                <div className="flex-1">
                   <h3 className="text-xl font-bold mb-4">Enterprise Reporting</h3>
                   <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      Generate board-ready audit trails of every requirement change and resolution decision.
                   </p>
                   <button className="bg-white px-4 py-2 rounded-md text-xs font-bold">Preview Reports</button>
                </div>
                <div className="flex-1 hidden lg:block">
                   <div className="bg-white rounded p-4 h-32 w-full shadow-inner border border-slate-200">
                      <div className="h-2 w-3/4 bg-slate-100 mb-2"></div>
                      <div className="h-2 w-full bg-slate-50 mb-2"></div>
                      <div className="h-8 w-full bg-[#f8f9fa] mt-4"></div>
                   </div>
                </div>
            </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="how-it-works" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">The RCFA Workflow</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm">
                    From raw documents to resolved conflicts in four high-efficiency steps.
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-12">
                {[
                    { icon: Shield, title: "Upload", desc: "Import documents from Jira, Confluence, or raw PDF/DOCX files." },
                    { icon: Search, title: "Analyze", desc: "Our AI maps logic clusters and identifies hidden dependencies." },
                    { icon: Users, title: "Collaborate", desc: "Stakeholders review detected conflicts and discuss trade-offs." },
                    { icon: CheckCircle, title: "Resolve", desc: "Approve one version of truth and export the updated feasibility report." }
                ].map((step, i) => (
                    <div key={i} className="text-center flex flex-col items-center group">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-slate-200 transition-colors">
                            <step.icon className="w-5 h-5 text-slate-800" />
                        </div>
                        <h4 className="font-bold mb-3">{step.title}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed px-4">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <div className="bg-[#021831] rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden">
            {/* Dots Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
            
            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    Stop development rework. <br />
                    Start analyzing today.
                </h2>
                <p className="text-slate-400 mb-10 text-sm">
                    Join over 250+ engineering teams that use RCFA to reduce <br className="hidden md:block" />
                    project delays by 35% on average.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/login" className="bg-[#b7e4f9] text-slate-900 px-8 py-3 rounded-md font-bold hover:bg-white transition-colors">
                        Get Started for Free
                    </Link>
                    <button className="bg-[#112d4a] text-white px-8 py-3 rounded-md font-bold hover:bg-[#1a3a5a] transition-colors border border-white/10">
                        Schedule a Demo
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f6f7f7] pt-20 pb-8 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12 mb-20">
            <div className="md:col-span-2">
                <div className="text-xl font-bold mb-6">RCFA</div>
                <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs uppercase font-medium">
                    Precision engineering conflict resolution for modern enterprises.
                </p>
            </div>
            <div>
                <h5 className="font-bold text-xs uppercase mb-6 tracking-wider">Product</h5>
                <ul className="space-y-4 text-[10px] text-slate-400 font-bold uppercase">
                    <li><a href="#" className="hover:text-slate-900">Features</a></li>
                    <li><a href="#" className="hover:text-slate-900">Security</a></li>
                    <li><a href="#" className="hover:text-slate-900">Integrations</a></li>
                </ul>
            </div>
            <div>
                <h5 className="font-bold text-xs uppercase mb-6 tracking-wider">Company</h5>
                <ul className="space-y-4 text-[10px] text-slate-400 font-bold uppercase">
                    <li><a href="#" className="hover:text-slate-900">About Us</a></li>
                    <li><a href="#" className="hover:text-slate-900">Careers</a></li>
                    <li><a href="#" className="hover:text-slate-900">Blog</a></li>
                </ul>
            </div>
            <div>
                <h5 className="font-bold text-xs uppercase mb-6 tracking-wider">Legal</h5>
                <ul className="space-y-4 text-[10px] text-slate-400 font-bold uppercase">
                    <li><a href="#" className="hover:text-slate-900">Privacy</a></li>
                    <li><a href="#" className="hover:text-slate-900">Terms</a></li>
                    <li><a href="#" className="hover:text-slate-900">Security</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-200 pt-8 flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            <div>© 2024 REQUIREMENT CONFLICT & FEASIBILITY ANALYZER. ENGINEERED FOR PRECISION.</div>
            <div className="flex gap-4">
                <Globe className="w-3 h-3" />
                <LayoutGrid className="w-3 h-3" />
                <Shield className="w-3 h-3" />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
