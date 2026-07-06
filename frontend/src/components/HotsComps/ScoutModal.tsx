import React, { useState } from "react";
import Modal from "react-modal";
import { Sparkles, Briefcase, MapPin, Globe, ExternalLink, Search } from "lucide-react";
import Spinner from "@/components/Spinner";

// Accessibility
Modal.setAppElement("#root");

interface ScoutResult {
    title: string;
    organization: string;
    location: string;
    description: string;
    link: string;
    isRealTime: boolean;
}

interface ScoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ScoutModal: React.FC<ScoutModalProps> = ({ isOpen, onClose }) => {
    const [topic, setTopic] = useState("");
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ScoutResult[] | null>(null);

    const handleScout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) return;

        setLoading(true);
        setResults(null);

        try {
            const res = await fetch("/api/scout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ topic, role, specificLocation: location }),
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.results);
            }
        } catch (error) {
            console.error("Scout error:", error);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setResults(null);
        setTopic("");
        setRole("");
        setLocation("");
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 top-1/2 flex max-h-[calc(100dvh-2rem)] w-[94vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl outline-none lg:h-[90vh] lg:overflow-hidden lg:rounded-3xl"
            overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] transition-opacity duration-300"
        >
            <div className="flex min-h-full flex-col lg:h-full lg:flex-row lg:overflow-hidden">
                {/* Sidebar / Left Panel */}
                <div className="w-full shrink-0 border-b border-gray-200 bg-gray-50 p-4 sm:p-6 lg:w-1/3 lg:border-b-0 lg:border-r lg:p-8">
                    <div className="mb-5 lg:mb-8">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                            <Sparkles className="text-purple-600" />
                            AI Scout
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Scour global networks for real-time research opportunities and internships.
                        </p>
                    </div>

                    <form onSubmit={handleScout} className="space-y-4 lg:space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Research Topic / Field *
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Quantum Computing, CRISPR..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target Role
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="e.g. PhD, Postdoc, Intern..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="e.g. London, Remote, Anywhere..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-semibold shadow-lg shadow-gray-200 transition-all flex justify-center items-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Start Scouting <Sparkles size={16} className="group-hover:text-yellow-300 transition-colors" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 border-t border-gray-200 pt-4 lg:mt-8 lg:pt-6">
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm font-medium">
                            Cancel & Close
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div className="flex min-h-[18rem] flex-col bg-white p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:p-8">
                    {!results && !loading && (
                        <div className="flex min-h-[16rem] flex-col items-center justify-center text-center opacity-40 lg:h-full">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <Globe size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900">Ready to Explore?</h3>
                            <p className="text-gray-500 max-w-sm mt-2">
                                Enter a research topic to find global opportunities matching your profile.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex min-h-[16rem] flex-col items-center justify-center space-y-6 lg:h-full">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="text-purple-600 animate-pulse" size={24} />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-medium text-gray-900">Contacting Global Research Nodes...</p>
                                <p className="text-sm text-gray-500 mt-1">Analyzing Nature Careers & Science Jobs RSS Feeds</p>
                            </div>
                        </div>
                    )}

                    {results && (
                        <div className="flex flex-col lg:h-full">
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Scout Results</h3>
                                    <p className="text-sm text-gray-500">Found {results.length} potentials based on "{topic}"</p>
                                </div>
                                <button onClick={reset} className="text-sm text-purple-600 font-medium hover:underline">
                                    New Search
                                </button>
                            </div>

                            <div className="space-y-4 pb-4 lg:flex-1 lg:overflow-y-auto lg:pr-2">
                                {results.map((res, idx) => (
                                    <div key={idx} className="group rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-purple-100 hover:shadow-lg sm:p-5">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                                                        {res.title}
                                                    </h4>
                                                    {res.isRealTime && (
                                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            Live Feed
                                                        </span>
                                                    )}
                                                    {!res.isRealTime && (
                                                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            Top Lab Match
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 font-medium text-sm flex items-center gap-2">
                                                    <Briefcase size={14} /> {res.organization}
                                                    <span className="text-gray-300">|</span>
                                                    <MapPin size={14} /> {res.location}
                                                </p>
                                            </div>
                                            <a
                                                href={res.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-purple-600 hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-md"
                                            >
                                                <ExternalLink size={20} />
                                            </a>
                                        </div>
                                        <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                                            {res.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ScoutModal;
