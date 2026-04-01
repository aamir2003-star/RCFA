import useAuthStore from "../stores/useAuthStore";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Settings, Globe, Save, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { SETTINGS_NAV_ITEMS, NOTIF_PREFERENCES_TEMPLATE } from "../constants/settings";

export default function BdeSettings() {
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
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your profile, notifications, and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="space-y-2">
                    {SETTINGS_NAV_ITEMS.bde.map((item, idx) => (
                        <SettingsNav key={item.id} icon={item.icon} label={item.label} active={idx === 0} />
                    ))}
                </div>

                {/* Settings Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/5 dark:shadow-none space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                {user?.avatar ? (
                                    <img
                                        src={`http://localhost:3000${user.avatar}`}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl group-hover:opacity-75 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl font-black border-4 border-white dark:border-slate-800 shadow-xl group-hover:opacity-75 transition-opacity">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <Globe className="text-white w-6 h-6" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight uppercase text-xs font-black">{user?.role}</p>
                                <button
                                    onClick={handleAvatarClick}
                                    className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline"
                                >
                                    Change Avatar
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 transition-all opacity-80 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Notification Preferences</h4>
                            <div className="space-y-4">
                                {NOTIF_PREFERENCES_TEMPLATE.map((notif) => (
                                    <div key={notif.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800/50">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{notif.label}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.type}</p>
                                        </div>
                                        <div className={cn("w-12 h-6 rounded-full p-1 transition-colors cursor-pointer", notif.enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800")}>
                                            <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", notif.enabled ? "translate-x-6" : "translate-x-0")}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#1e2532] dark:bg-white text-white dark:text-[#1e2532] font-black px-8 py-3 rounded-2xl shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-xs uppercase tracking-widest"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function SettingsNav({ icon: Icon, label, active }) {
    return (
        <button className={cn(
            "flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 group",
            active
                ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                : "bg-white/50 dark:bg-[#0f1115]/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-500/50 hover:text-indigo-600"
        )}>
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight className={cn("w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform", active && "opacity-100")} />
        </button>
    );
}
