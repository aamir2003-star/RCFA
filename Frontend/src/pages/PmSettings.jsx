import useAuthStore from "../stores/useAuthStore";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Settings, Save, Globe } from "lucide-react";
import { cn } from "../lib/utils";
import { SETTINGS_NAV_ITEMS, PM_PROTOCOLS_TEMPLATE } from "../constants/settings";

export default function PmSettings() {
    const { user, updateProfile, updateAvatar } = useAuthStore();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setLoading(true);
        const result = await updateAvatar(formData);
        setLoading(false);

        if (result.success) {
            toast.success("Avatar updated successfully");
        } else {
            toast.error(result.message);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const result = await updateProfile({ name, email });
        setLoading(false);

        if (result.success) {
            toast.success("Profile updated successfully");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Settings className="w-8 h-8 text-indigo-500" />
                    Management Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Configure project oversight and team resolution protocols.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Nav */}
                <div className="space-y-1">
                    {SETTINGS_NAV_ITEMS.pm.map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>

                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Information</h3>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                {user?.avatar ? (
                                    <img
                                        src={`http://localhost:3000${user.avatar}`}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-lg group-hover:opacity-75 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white text-xl font-black border-2 border-white dark:border-slate-800 shadow-lg group-hover:opacity-75 transition-opacity">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Picture</p>
                                <button
                                    onClick={handleAvatarClick}
                                    className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase hover:underline mt-1"
                                >
                                    Upload New
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role ID</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-400 font-bold"
                                        disabled
                                        value={`PM_${user?.id?.substring(0, 4).toUpperCase()}`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Work Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold opacity-75 cursor-not-allowed"
                                    value={email}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Conflict Resolution Protocol</h3>
                        <div className="space-y-4">
                            {PM_PROTOCOLS_TEMPLATE.map((protocol) => (
                                <div key={protocol.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{protocol.label}</p>
                                        <p className="text-[10px] font-medium text-slate-500">{protocol.description}</p>
                                    </div>
                                    <div className={cn("w-10 h-5 rounded-full relative transition-colors", protocol.enabled ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700")}>
                                        <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform", protocol.enabled ? "right-0.5" : "left-0.5")}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-8 py-3 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all font-black"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? "Processing..." : "Save Configuration"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

