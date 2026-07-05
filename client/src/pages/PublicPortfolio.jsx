import { useState, useEffect, useRef } from 'react';
import { FaAddressCard, FaGithub, FaLinkedin } from 'react-icons/fa';
import { IoIosSend } from "react-icons/io";
import { FaFax } from "react-icons/fa";


import { FiExternalLink, FiMail, FiMapPin } from "react-icons/fi";
import { CiMenuBurger } from "react-icons/ci";
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Briefcase, Calendar, CheckSquare, ChevronDown, Cloud, Code, Database, Download, ExternalLink, Layers, Mail, Map, MapPin, Menu, Moon, Send, Settings, Star, Sun, Terminal, X } from 'lucide-react';

// ── Utility ─────────────────────────────────────────────────────────────────
const useVisible = (ref) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
};

// ── Section Wrapper ──────────────────────────────────────────────────────────
const Section = ({ id, children, className = '' }) => {
  const ref = useRef(null);
  const visible = useVisible(ref);
  return (
    <section id={id} ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </section>
  );
};

// ── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ isAvailable }) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['About', 'Projects', 'Experience', 'Skills', 'Contact'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-black">C</div>
          <span className="font-bold text-gray-900 dark:text-white hidden sm:block">ChazDev</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-800 transition-colors">
            {theme === 'dark' ? <Sun size={16} className="text-gray-400" /> : <Moon size={16} className="text-gray-600" />}
          </button>
          {isAvailable && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot"></div>
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">Available</span>
            </div>
          )}
          <a href="#contact" className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-opacity">
            Hire Me
          </a>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4 animate-fade-in">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {l}
            </a>
          ))}
          <a href="#contact" className="mt-3 block text-center px-4 py-2.5 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl">
            Hire Me
          </a>
        </div>
      )}
    </nav>
  );
};

// ── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ data }) => (
  <section id="about" className="relative min-h-screen flex items-center overflow-hidden">
    {/* Background glow */}
    <div className="absolute inset-0 pointer-events-none" />

    {/* Floating orbs */}
    <div className="absolute top-1/4 right-1/4 w-64 h-64  rounded-full blur-3xl float-1 pointer-events-none" />
    <div className="absolute bottom-1/4 left-1/4 w-48 h-48  rounded-full blur-3xl float-2 pointer-events-none" />

    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
      {/* Text */}
      <div className="flex-1 text-center lg:text-left">
        {data?.isAvailable && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800  mb-6 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot"></div>
            <span className="text-xs font-semibold text-green-500 uppercase tracking-widest">Available for Work</span>
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-5xl font-black text-gray-800 dark:text-gray-300 leading-tight mb-6 animate-fade-in">
          {data?.mainHeadline || "Hello, I'm a Developer"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in">
          {data?.subHeadline || 'Building extraordinary digital experiences.'}
        </p>
        <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start animate-fade-in">
          <a
            href="/resume.pdf" // 1. Path to your actual resume file
            download="My_Resume.pdf" // 2. Forces download and sets the filename
            className="flex items-center text-xs gap-2 px-6 py-3 bg-gray-300 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Download size={16} /> Download Resume
          </a>
          <a href="#contact" className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors text-xs font-semibold">
            Get in Touch
            <FaAddressCard size={14} />
          </a>
        </div>
        {/* Metrics */}
        {data?.metrics && (
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12 animate-fade-in">
            {[
              { label: 'Projects', value: data.metrics.projectsCompleted },
              { label: 'Years Exp', value: data.metrics.yearsExperience },
              { label: 'OSS Contribs', value: data.metrics.openSourceContribs },
              { label: 'Clients', value: data.metrics.happyClients },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-gray-900 dark:text-gray-300">{value}+</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile image */}
      <div className="flex-shrink-0 animate-fade-in">
        <div className="relative w-64 h-64 lg:w-80 lg:h-80">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-2xl opacity-30 scale-105" />
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
            {data?.profileImage ? (
              <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                <span className="text-7xl font-black text-white/20">
                  {data?.mainHeadline?.[data?.mainHeadline?.indexOf("'") + 1] || 'A'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-900 dark:text-gray-300 animate-bounce">
      <ChevronDown size={20} />
    </div>
  </section>
);

// ── PROJECTS ─────────────────────────────────────────────────────────────────
const Projects = ({ projects }) => (
  <Section id="projects" className="py-24 bg-white dark:bg-gray-950">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-3">
          <Briefcase size={16} />
          PORTFOLIO
        </div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white">Featured Projects</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg mx-auto">Engineering solutions that scale — from distributed systems to beautiful interfaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.filter((p) => p.isPublished).map((project, i) => (
          <div key={project._id} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-video bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
              {project.heroImage ? (
                <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Code size={40} className="text-white/20" />
                </div>
              )}
              {project.isFeatured && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-yellow-400/90 rounded-full text-xs font-bold text-gray-900">
                  <Star size={10} fill="currentColor" />
                  Featured
                </div>
              )}
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                {project.category}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack?.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md">
                    {tag}
                  </span>
                ))}
                {project.techStack?.length > 3 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">

                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:underline">
                    <FaGithub size={12} />
                    GitHub
                  </a>
                )}

                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    <ExternalLink size={12} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// ── EXPERIENCE ───────────────────────────────────────────────────────────────
const ExperienceSection = ({ experiences = [] }) => {
  return (
    <section id="experience" className="py-24 dark:bg-zinc-950 text-black dark:text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 dark:text-zinc-400 text-zinc-700 font-semibold text-xs tracking-widest uppercase mb-3 dark:bg-zinc-900 bg-gray-100 border border-zinc-800 px-3 py-1 rounded-full">
            <Briefcase size={14} className="dark:text-indigo-500 text-indigo-900" />
            Career Journey
          </div>
          <h2 className="text-3xl font-black dark:text-white text-black tracking-tight">Work Experience</h2>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Modern Minimal Vertical Timeline Line */}
          <div className="absolute left-4 sm:left-6 top-2 bottom-2 w-[2px] bg-gradient-to-b from-gray-600 via-gray-600 to-gray-600 opacity-30 dark:bg-gradient-to-b dark:from-indigo-500 dark:via-purple-500 dark:to-transparent dark:opacity-30" />

          <div className="space-y-10">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="pl-10 sm:pl-16 relative group transition-all duration-300"
              >
                {/* Glow Timeline Ring Indicator */}
                <div className="absolute left-2.5 sm:left-4 top-2.5 w-3.5 h-3.5 rounded-full dark:bg-zinc-950 bg-gray-300 border-2 dark:border-indigo-500 border-gray-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10 transition-transform duration-300 group-hover:scale-125 group-hover:border-purple-400" />

                {/* Main Card */}
                <div className=" dark:bg-zinc-900/40 bg-gray-100 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/80 hover:border-zinc-700/60 shadow-xl transition-all duration-300 hover:-translate-y-1">

                  {/* Header metadata layout */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 pb-4 border-b border-zinc-800/60">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white text-black transition-colors">
                        {exp.jobTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-sm text-zinc-400">
                        <span className="font-semibold dark:text-indigo-400 text-indigo-900">{exp.company}</span>

                        {exp.location && (
                          <span className="flex items-center gap-1 dark:text-gray-400 text-gray-700">
                            <MapPin size={13} />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Modern Date Tag Box */}
                    <div className="flex items-center gap-2 self-start md:self-auto dark:bg-zinc-800/60 dark:border-zinc-700/30 bg-gray-100/60 border border-zinc-700/30 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 shadow-inner">
                      <Calendar size={13} className="dark:text-indigo-400 text-indigo-900" />
                      <span className="dark:text-zinc-300 text-zinc-700">{exp.startDate?.replace('-', ' ')}</span>
                      <span className="text-zinc-500">—</span>
                      <span className={exp.isPresent ? "dark:text-emerald-400 text-emerald-900 font-semibold" : "dark:text-zinc-300 text-zinc-700"}>
                        {exp.isPresent ? 'Present' : exp.endDate?.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Bullet Points / Responsibilities Description */}
                  {exp.responsibilities?.length > 0 && (
                    <ul className="space-y-2.5">
                      {exp.responsibilities.map((r, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm dark:text-zinc-300 text-zinc-700 leading-relaxed transition-colors"
                        >
                          {/* Elegant minimal line pointer */}
                          <span className="text-indigo-500 font-bold mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500/80" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// ── SKILLS ────────────────────────────────────────────────────────────────────
const SkillsSection = ({ skills = [] }) => {
  // 1. Core categories defined exactly as per design
  const CATEGORIES = [
    { icon: Terminal, name: 'Programming Languages' },
    { icon: Settings, name: 'DevOps & Tools' },
    { icon: Layers, name: 'JavaScript Libraries & Frameworks' },
    { icon: Database, name: 'Web Frameworks' },
    { icon: Cloud, name: 'Backend as a Service' },
    { icon: CheckSquare, name: 'Testing' }
  ];

  // 2. Flexible grouping logic to prevent data from being filtered out
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const matchingSkills = skills.filter((sk) => {
      if (!sk.category) return false;

      const dbCat = String(sk.category).toLowerCase().trim();
      const targetCat = cat.name.toLowerCase().trim();

      // Matches even if your database says "Devops" instead of "DevOps & Tools"
      return dbCat === targetCat || targetCat.includes(dbCat) || dbCat.includes(targetCat);
    });

    if (matchingSkills.length > 0) {
      acc[cat.name] = {
        icon: cat.icon,
        items: matchingSkills
      };
    }
    return acc;
  }, {});

  // Fallback: If nothing matched the strict categories, catch them in an "Other" block
  const matchedSkillIds = new Set(
    Object.values(grouped).flatMap(group => group.items.map(s => s._id))
  );
  const remainingSkills = skills.filter(sk => !matchedSkillIds.has(sk._id));

  if (remainingSkills.length > 0) {
    grouped['Other Skills'] = {
      icon: Terminal,
      items: remainingSkills
    };
  }

  // Double-check fallback: If still empty, display skills as a single list so something always renders
  const hasGroupedData = Object.keys(grouped).length > 0;

  return (
    <section id="skills" className="py-24 dark:bg-zinc-950 text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header Section */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-3">Technical Skills</h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            Comprehensive expertise across modern development stack with focus on scalable web applications and DevOps practices.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasGroupedData ? (
            Object.entries(grouped).map(([categoryName, data]) => {
              const Icon = data.icon;
              return (
                <div
                  key={categoryName}
                  className="bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Category Title & Icon */}
                    <div className="flex items-center gap-2.5 mb-5">
                      <Icon size={18} className="text-zinc-900 dark:text-zinc-200" />
                      <h3 className="text-base font-semibold tracking-wide">{categoryName}</h3>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-2">
                      {data.items.map((skill) => (
                        <span
                          key={skill._id || skill.name}
                          className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 rounded-lg text-xs font-medium border border-zinc-700/40 hover:border-zinc-600 transition-colors duration-200"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Emergency Fallback UI if data structure is completely different */
            <div className="col-span-full bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill._id || skill.name} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
// ── CONTACT ───────────────────────────────────────────────────────────────────
const ContactSection = ({ contact }) => {
  const [form, setForm] = useState({ senderName: '', senderEmail: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/inquiries', form);
      setSent(true);
      setForm({ senderName: '', senderEmail: '', subject: '', message: '' });
    } catch { alert('Failed to send. Please try again.'); }
    finally { setSending(false); }
  };

  return (
    <Section id="contact" className="py-24  dark:bg-black">
      <div className="max-w-5xl  mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-3">
            <Mail size={16} />
            CONTACT
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">Let's Work Together</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto">Have a project in mind? I'd love to hear from you. Send a message and I'll get back to you shortly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: info */}
          <div>
            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, label: 'Email', value: contact?.email, href: `mailto:${contact?.email}` },
                { icon: MapPin, label: 'Location', value: contact?.location },
                { icon: FaLinkedin, label: 'LinkedIn', value: contact?.linkedinUrl, href: `https://${contact?.linkedinUrl}` },
                { icon: FaGithub, label: 'GitHub', value: contact?.githubUrl, href: `https://${contact?.githubUrl}` },
              ].filter((i) => i.value).map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} target={href ? '_blank' : undefined} rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors flex-shrink-0">
                    <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability badge */}
            {contact?.availability === 'selective' && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-dot"></div>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Open for work</span>
                </div>
                {contact.customStatusMessage && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{contact.customStatusMessage}"</p>
                )}
              </div>
            )}
          </div>

          {/* Right: form */}
          <div className="bg-gray-50 dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Send size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">I'll get back to you as soon as possible.</p>
                <button onClick={() => setSent(false)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Your Name</label>
                    <input
                      type="text" required
                      value={form.senderName}
                      onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Email</label>
                    <input
                      type="email" required
                      value={form.senderEmail}
                      onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Subject</label>
                  <input
                    type="text" required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project collaboration"
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Message</label>
                  <textarea
                    rows={5} required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-400 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-zinc-800 to-gray-700 text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send size={15} />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

// ── FOOTER ─────────────────────────────────────────────────────────────────
const Footer = ({ contact }) => (
  <footer className="bg-gray-950 dark:bg-black text-gray-400 py-10">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">Z</div>
        <span className="text-sm font-medium text-gray-300">Portfolio</span>
      </div>
      <p className="text-xs text-center">© {new Date().getFullYear()} · Built with React, TailwindCSS & Express</p>
      <div className="flex items-center gap-3">
        {contact?.linkedinUrl && (
          <a href={`https://${contact.linkedinUrl}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <FaLinkedin size={18} />
          </a>
        )}
        {contact?.githubUrl && (
          <a href={`https://${contact.githubUrl}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <FaGithub size={18} />
          </a>
        )}
        {contact?.email && (
          <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
            <Mail size={18} />
          </a>
        )}
      </div>
    </div>
  </footer>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const PublicPortfolio = () => {
  const [data, setData] = useState({ home: null, projects: [], experiences: [], skills: [], contact: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [homeRes, projRes, expRes, skillRes, contactRes] = await Promise.all([
          api.get('/home'),
          api.get('/projects'),
          api.get('/experience'),
          api.get('/skills'),
          api.get('/contact'),
        ]);
        setData({
          home: homeRes.data,
          projects: projRes.data,
          experiences: expRes.data,
          skills: skillRes.data,
          contact: contactRes.data,
        });
        // Track portfolio view
        api.post('/home/view').catch(() => { });
      } catch (e) {
        console.error('Failed to load portfolio data', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
          </div>
          <p className="text-white/60 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar isAvailable={data.home?.isAvailable} />
      <Hero data={data.home} />
      <SkillsSection skills={data.skills} />
      <ExperienceSection experiences={data.experiences} />
      <Projects projects={data.projects} />
      <ContactSection contact={data.contact} />
      <Footer contact={data.contact} />
    </div>
  );
};

export default PublicPortfolio;
