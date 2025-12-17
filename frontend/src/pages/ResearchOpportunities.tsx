import React, { useEffect, useState } from "react";
import ResearchCard from "@/components/HotsComps/ResearchCard";
import Spinner from "../components/Spinner";
import SideBar from "@/components/SideBar";
import OppModal from "@/components/HotsComps/OppModal";
import ScoutModal from "@/components/HotsComps/ScoutModal";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface Research {
    _id: string;
    title: string;
    description: string;
    skillsRequired: string[];
    membersNeeded: number;
    membersJoined: string[];
    duration: string;
    status: string;
    createdBy: { email: string };
}

const ResearchOpportunities: React.FC = () => {
    const [researches, setResearches] = useState<Research[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOppModalOpen, setIsOppModalOpen] = useState(false);
    const [isScoutModalOpen, setIsScoutModalOpen] = useState(false);

    const openOppModal = () => setIsOppModalOpen(true);
    const closeOppModal = () => setIsOppModalOpen(false);

    useEffect(() => {
        const fetchResearches = async () => {
            try {
                const res = await fetch("/api/hots/research-opportunities/get", {
                    credentials: 'include',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setResearches(data.results);
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                console.error("Error fetching researches:", err);
                toast.error("Failed to fetch opportunities");
            } finally {
                setLoading(false);
            }
        };

        fetchResearches();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <SideBar />

            <div className="flex-1 p-8 pl-24 overflow-y-auto w-full"> {/* Added pl-24 for sidebar offset */}
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 mt-8 flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">🔥 Research Opportunities</h1>
                            <p className="text-gray-500 mt-1">
                                Discover the latest ongoing studies and connect with researchers.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                className="bg-black text-white hover:bg-gray-800 transition font-semibold py-2 px-6 rounded-xl border border-transparent shadow-lg flex items-center gap-2"
                                onClick={() => setIsScoutModalOpen(true)}
                            >
                                <Sparkles size={18} className="text-yellow-400" /> AI Scout
                            </button>

                            <button
                                className="bg-purple-600 hover:bg-purple-700 transition font-semibold text-white py-2 px-6 rounded-xl border border-transparent shadow-lg shadow-purple-200"
                                onClick={openOppModal}
                            >
                                Add Research Opportunity
                            </button>

                            <OppModal isOpen={isOppModalOpen} onClose={closeOppModal} />
                            <ScoutModal isOpen={isScoutModalOpen} onClose={() => setIsScoutModalOpen(false)} />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    ) : researches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <img
                                src="/empty-state.svg"
                                alt="No data"
                                className="w-40 mb-4 opacity-70"
                            />
                            <p>No research opportunities available yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {researches.map((r) => (
                                <ResearchCard
                                    key={r._id}
                                    title={r.title}
                                    description={r.description}
                                    skillsRequired={r.skillsRequired}
                                    membersNeeded={r.membersNeeded}
                                    membersJoined={r.membersJoined.length}
                                    duration={r.duration}
                                    status={r.status}
                                    createdByEmail={r.createdBy?.email} // Check if createdBy exists
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResearchOpportunities;
