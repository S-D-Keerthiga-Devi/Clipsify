"use client"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Clapperboard, Video, Image as ImageIcon, BarChart3, Sparkles, Rocket, Shield, Star } from "lucide-react";
import NavbarMain from "../components/NavbarMain";

export default function AboutPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const handleGetStarted = () => {
        if (session) {
            router.push('/dashboard/home');
        } else {
            router.push('/register');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
            <NavbarMain />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        About{' '}
                        <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
                            Clipsify
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        Empowering creators to share their vision with the world through seamless video and image management.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-4">
                                At Clipsify, we believe that every creator deserves powerful tools to bring their vision to life.
                                Our platform is designed to make content creation, management, and sharing as effortless as possible.
                            </p>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Whether you're a professional videographer, photographer, or just starting your creative journey,
                                Clipsify provides the tools you need to organize, showcase, and share your work with the world.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="w-full h-80 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-500/50">
                                        <Clapperboard className="w-10 h-10 text-purple-400" />
                                    </div>
                                    <p className="text-white text-xl font-semibold">Create. Share. Inspire.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Overview */}
            <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">What We Offer</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4">
                                <Video className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Video Management</h3>
                            <p className="text-gray-400">
                                Upload, organize, and share your videos with ease. Support for all major formats with smooth playback.
                            </p>
                        </div>

                        <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4">
                                <ImageIcon className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Image Galleries</h3>
                            <p className="text-gray-400">
                                Create stunning image galleries with our modern, responsive grid layout. Perfect for portfolios.
                            </p>
                        </div>

                        <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Analytics</h3>
                            <p className="text-gray-400">
                                Track your content performance with real-time analytics and insights into your uploads.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">Our Values</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Simplicity</h3>
                                <p className="text-gray-400">
                                    We believe powerful tools should be easy to use. Our interface is designed for creators, not engineers.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                    <Rocket className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Performance</h3>
                                <p className="text-gray-400">
                                    Lightning-fast uploads, smooth playback, and instant access to your content whenever you need it.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
                                <p className="text-gray-400">
                                    Your content is precious. We use industry-standard security to keep your files safe and private.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                    <Star className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
                                <p className="text-gray-400">
                                    We're constantly improving and adding new features based on what creators actually need.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of creators who trust Clipsify for their content management needs.
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 text-lg cursor-pointer"
                    >
                        {session ? 'Go to Dashboard' : 'Start Creating Now'}
                    </button>
                </div>
            </section>
        </div>
    );
}
