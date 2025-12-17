
import { motion } from "framer-motion";
import { Sparkles, Users, Globe, BookOpen, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white text-gray-800 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            <SideBar />

            <main className="pt-24 pl-24 pr-6 md:pr-12 lg:pr-24 container mx-auto mb-20 relative z-10">
                {/* Decorative background blobs */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none" />
                <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -z-10 animate-pulse-glow" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20 md:mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 animate-fade-in-up">
                        <Sparkles className="w-4 h-4" />
                        <span>Innovating Research</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-slate-900">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">PaperHunt</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light">
                        Democratizing access to knowledge. Accelerating discovery through the power of AI.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            Bridging the gap between <br className="hidden md:block" />
                            <span className="text-blue-600 relative">
                                complexity
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                            and clarity.
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                            <p>
                                Research shouldn't be hidden behind dense terminology or paywalls. At PaperHunt, we believe that knowledge belongs to everyone.
                            </p>
                            <p>
                                We leverage cutting-edge AI to scout, digest, and deliver the most relevant academic papers, transforming how students and researchers interact with information.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden`}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" className="w-full h-full" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                                    +1k
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-bold text-gray-900">Growing Community</span>
                                <span className="text-sm text-gray-500">Researchers trusted us</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl blur-2xl opacity-20 transform rotate-3" />
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Quote className="w-24 h-24 text-blue-600 transform rotate-12" />
                            </div>

                            <ul className="space-y-8 relative z-10">
                                {[
                                    { icon: BookOpen, title: "Smart Discovery", desc: "AI tailored to your curiosity." },
                                    { icon: Globe, title: "Global Reach", desc: "Top institutions, worldwide." },
                                    { icon: Users, title: "Community Driven", desc: "Join 1000+ innovators." }
                                ].map((item, idx) => (
                                    <motion.li
                                        key={item.title}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="flex items-start gap-5 group"
                                    >
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-gray-500 group-hover:text-gray-700 transition-colors">{item.desc}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AboutUs;
