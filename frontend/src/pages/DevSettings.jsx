import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { Settings, Cpu, Save, ChevronRight, Github, Image as ImageIcon, Camera } from "lucide-react";
import { cn, getAvatarUrl } from "../lib/utils";
import { SETTINGS_NAV_ITEMS, DEV_ENVIRONMENT_PREFERENCES } from "../constants/settings";

export default function DevSettings() {
    const { user, updateProfile, updateAvatar, updateCover } = useAuthStore();
    const [activeTabId, setActiveTabId] = useState("profile");
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);

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
            toast.error(result.message || "Failed to update avatar");
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("cover", file);

        setUploadingCover(true);
        const result = await updateCover(formData);
        setUploadingCover(false);

        if (result.success) {
            toast.success("Cover image updated successfully");
        } else {
            toast.error(result.message || "Failed to update cover image");
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const result = await updateProfile({ name, email });
        setLoading(false);

        if (result.success) {
            toast.success("Profile updated successfully");
        } else {
            toast.error(result.message || "Profile update failed");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Settings className="w-8 h-8 text-indigo-500" />
                    System Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Configure your development environment and personal profile.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Nav */}
                <div className="space-y-2">
                    {SETTINGS_NAV_ITEMS.dev.map((item) => (
                        <SettingsTab
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeTabId === item.id}
                            onClick={() => setActiveTabId(item.id)}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-8 pb-20">
                    {activeTabId === "profile" ? (
                        <>
                            {/* Appearance Section (Cover & Avatar) */}
                            <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/5 dark:shadow-none space-y-8">
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                                    Appearance & Branding
                                </h4>

                                <div className="space-y-8">
                                    {/* Cover Image Upload Area */}
                                    <div className="relative group rounded-3xl overflow-hidden aspect-[4/1] bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center transition-all hover:border-indigo-500/50">
                                        {user?.coverImage?.url ? (
                                            <img src={user.coverImage.url} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <ImageIcon className="w-10 h-10" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">No Cover Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => coverInputRef.current?.click()}
                                                disabled={uploadingCover}
                                                className="bg-white/10 backdrop-blur-lg px-6 py-2.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/20 transition-all hover:bg-white/20 active:scale-95"
                                            >
                                                <Camera className="w-4 h-4" />
                                                {uploadingCover ? "Uploading..." : "Change Cover"}
                                            </button>
                                        </div>
                                        <input
                                            type="file"
                                            ref={coverInputRef}
                                            onChange={handleCoverChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                            <div className="w-28 h-28 rounded-[2.5rem] bg-white dark:bg-[#0f1115] p-1.5 shadow-2xl shadow-black/10 transition-transform group-hover:scale-105 duration-500">
                                                <div className="w-full h-full rounded-[2.2rem] bg-linear-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white text-3xl font-black border-4 border-white dark:border-[#0f1115] overflow-hidden">
                                                    {getAvatarUrl(user?.avatar) ? (
                                                        <img
                                                            src={getAvatarUrl(user.avatar)}
                                                            className="w-full h-full object-cover"
                                                            alt="avatar"
                                                        />
                                                    ) : (
                                                        user?.name?.charAt(0).toUpperCase() || "U"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="absolute bottom-1 right-1 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg border-4 border-white dark:border-[#0f1115] flex items-center justify-center text-indigo-600 transition-all group-hover:scale-110">
                                                <Camera className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </div>
                                        <div className="flex-1 text-center md:text-left space-y-2">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user?.name}</h3>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                                <span className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/20">{user?.role}</span>
                                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Verified Identity</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm">Use a professional avatar and high-resolution cover for team identification. Max 5MB allowed.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Card */}
                            <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/5 dark:shadow-none space-y-8">
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <Save className="w-4 h-4 text-indigo-500" />
                                    General Information
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Work Email</label>
                                        <input
                                            type="text"
                                            value={email}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-sm opacity-75 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                    <InputGroup label="Technical Stack" value="Node.js, React, Postgres" />
                                    <div className="space-y-1.5 flex flex-col">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GitHub Account</label>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                            <Github className="w-5 h-5 text-slate-900 dark:text-white" />
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">@arivera-codes</span>
                                            <span className="ml-auto text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connected</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Preferences */}
                                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-indigo-500" />
                                        Environment Preferences
                                    </h4>
                                    <div className="space-y-4">
                                        {DEV_ENVIRONMENT_PREFERENCES.map((pref) => (
                                            <ToggleItem key={pref.id} label={pref.label} desc={pref.desc} enabled={pref.enabled} />
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-black px-10 py-3.5 rounded-2xl shadow-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-xs uppercase tracking-widest"
                                    >
                                        <Save className="w-4 h-4" />
                                        {loading ? "Updating..." : "Update Configuration"}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                <Settings className="w-10 h-10 text-indigo-500 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Access Restricted</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-center max-w-xs">
                                The <span className="text-indigo-500 font-bold">{activeTabId?.toUpperCase()}</span> module is currently under strategic maintenance.
                                Please check back in the next deployment cycle.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


function SettingsTab({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 group shadow-sm hover:shadow-md",
                active
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20"
                    : "bg-white/50 dark:bg-[#0f1115]/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-500/50 hover:text-indigo-600"
            )}>
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight className={cn("w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform", active && "opacity-100")} />
        </button>
    );
}

function InputGroup({ label, value }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
            <input type="text" defaultValue={value} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-sm" />
        </div>
    );
}

function ToggleItem({ label, desc, enabled }) {
    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/30 dark:bg-white/[0.01] border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/20 transition-all cursor-pointer group">
            <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{label}</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-sm">{desc}</p>
            </div>
            <div className={cn("w-12 h-6 rounded-full p-1 transition-colors relative shadow-inner", enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800")}>
                <div className={cn("w-4 h-4 bg-white rounded-full transition-transform shadow-md", enabled ? "translate-x-6" : "translate-x-0")}></div>
            </div>
        </div>
    );
}
