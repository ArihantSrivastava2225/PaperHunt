import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/mail/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Message sent!", { description: "We'll be in touch soon." });
                setFormData({ name: "", email: "", message: "" });
            } else {
                toast.error("Sending failed", { description: data.message });
            }
        } catch (error) {
            toast.error("Error", { description: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 overflow-hidden font-sans selection:bg-cyan-100 selection:text-cyan-900">
            <Navbar />

            <main className="px-6 md:px-12 lg:px-24">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/40 to-transparent -z-10 pointer-events-none" />

                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start mt-10">
                    {/* Left Column: Text Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:pt-10"
                    >
                        <div className="inline-block px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-sm font-semibold mb-6">
                            Get in Touch
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                            Let's start a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">conversation.</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Have a question about the platform? Want to collaborate? Or just want to say hi Or have any Feedback? We'd love to hear from you.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="font-medium">contact@paperhunt.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Live Chat (Coming Soon)</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 shadow-2xl shadow-blue-900/5 border border-gray-100 relative"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className={`text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${focusedField === 'name' ? 'text-blue-600' : 'text-gray-600'}`}>
                                    <User className="w-4 h-4" /> Name
                                </label>
                                <Input
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 h-12 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-600'}`}>
                                    <Mail className="w-4 h-4" /> Email Address
                                </label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 h-12 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${focusedField === 'message' ? 'text-blue-600' : 'text-gray-600'}`}>
                                    <MessageSquare className="w-4 h-4" /> Message
                                </label>
                                <Textarea
                                    name="message"
                                    placeholder="Tell us about your project..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 min-h-[150px] rounded-xl resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-6 rounded-xl transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-blue-500/25 group"
                            >
                                {loading ? "Sending..." : (
                                    <span className="flex items-center gap-2">Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ContactUs;
