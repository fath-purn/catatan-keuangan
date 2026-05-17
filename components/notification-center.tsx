"use client";

import React, { useState, useEffect } from "react";
import { IoNotificationsOutline, IoClose } from "react-icons/io5";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
}

export default function NotificationCenter({ notifications }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [permission, setPermission] = useState<string>("default");

  // Register Service Worker on mount for mobile push notification support
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker registered:", reg.scope))
        .catch((err) => console.error("Service Worker registration failed:", err));
    }
  }, []);

  // Read state management from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRead = localStorage.getItem("read_notifications");
      if (savedRead) {
        setReadIds(JSON.parse(savedRead));
      }

      // Check current Notification permission
      if ("Notification" in window) {
        setPermission(Notification.permission);
      }
    }
  }, []);

  // Helper to trigger native notification (works on both mobile and desktop)
  const triggerNativeNotification = async (title: string, body: string) => {
    const options = {
      body,
      icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23FF7676'/><text x='15' y='70' font-size='60'>🎯</text></svg>",
      badge: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23FF7676'/><text x='15' y='70' font-size='60'>🎯</text></svg>",
    };

    if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg && "showNotification" in reg) {
          reg.showNotification(title, options);
          return;
        }
      } catch (err) {
        console.error("SW notification failed, falling back to window.Notification:", err);
      }
    }

    try {
      new Notification(title, options);
    } catch (err) {
      console.error("Failed to construct Notification object:", err);
    }
  };

  // Handle native push notifications for un-pushed items
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && permission === "granted" && notifications.length > 0) {
      const savedPushed = localStorage.getItem("pushed_notifications");
      const pushedIds: string[] = savedPushed ? JSON.parse(savedPushed) : [];
      let updated = false;

      notifications.forEach((n) => {
        // We only push system notifications for warning/danger/success messages, not general tips
        if (n.type !== "tip" && !pushedIds.includes(n.id)) {
          triggerNativeNotification(n.title, n.message);
          pushedIds.push(n.id);
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem("pushed_notifications", JSON.stringify(pushedIds));
      }
    }
  }, [notifications, permission]);

  // Request browser notification permission
  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        triggerNativeNotification(
          "Notifikasi Aktif! 🔔",
          "Hebat! Sekarang kamu akan menerima peringatan limit gaya hidup dan progres goals langsung di HP/Desktop-mu!"
        );
      }
    } else {
      alert("Browser Anda tidak mendukung notifikasi sistem.");
    }
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem("read_notifications", JSON.stringify(allIds));
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Compute unread count
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  return (
    <div className="relative font-sans text-black">
      {/* Notification Bell Icon */}
      <button
        onClick={toggleOpen}
        aria-label="Notifikasi"
        className="relative p-2.5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all flex items-center justify-center text-black"
      >
        <IoNotificationsOutline className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF7676] border-2 border-black rounded-full flex items-center justify-center text-[9px] font-black text-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover / Overlay Drawer */}
      {isOpen && (
        <>
          {/* Backdrop (Centered Modal style with blur and high z-index) */}
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
            onClick={toggleOpen}
          />

          {/* Neo-Brutalist Modal Container (Centered, heavy shadows, high z-index) */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] max-w-[calc(100vw-32px)] bg-[#FDF8EE] border-4 border-black rounded-3xl shadow-[8px_8px_0_0_#000,0_20px_50px_rgba(0,0,0,0.3)] z-[101] overflow-hidden flex flex-col transition-all transform scale-100 animate-in zoom-in-95 duration-200">
            {/* Header Popover */}
            <div className="bg-[#DBCBFF] p-4 border-b-4 border-black flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-black text-sm uppercase tracking-tight">Notifikasi Pintar</h3>
                <p className="text-[10px] font-bold text-black/60">Asisten Keuangan Pribadimu</p>
              </div>
              <button
                onClick={toggleOpen}
                className="p-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#000] transition-all"
              >
                <IoClose className="w-4 h-4" />
              </button>
            </div>

            {/* Notification List Body */}
            <div className="p-4 max-h-[350px] overflow-y-auto flex flex-col gap-3">
              {/* Native Push Request Button if not granted */}
              {permission !== "granted" && (
                <div className="bg-[#E4F087] border-2 border-black rounded-xl p-3 shadow-[2px_2px_0_0_#000] flex flex-col gap-2">
                  <p className="text-[10px] font-black leading-snug">
                    🔔 Ingin notifikasi muncul di HP / Bilah Status HP Anda saat bepergian?
                  </p>
                  <button
                    onClick={requestPermission}
                    className="w-full bg-white border-2 border-black py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#000] hover:bg-[#FDF8EE] transition-all"
                  >
                    Aktifkan Notifikasi HP
                  </button>
                </div>
              )}

              {notifications.length === 0 ? (
                <div className="text-center py-6 flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl">☕</span>
                  <p className="text-xs font-bold text-black/60">Keuanganmu aman terkendali, belum ada notifikasi baru!</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const isRead = readIds.includes(n.id);
                  // Dynamic colors based on type
                  const bgClass =
                    n.type === "danger"
                      ? "bg-[#FF7676]"
                      : n.type === "warning"
                        ? "bg-[#FFD56B]"
                        : n.type === "success"
                          ? "bg-[#60D689]"
                          : n.type === "info"
                            ? "bg-[#DBCBFF]"
                            : "bg-white";

                  return (
                    <div
                      key={n.id}
                      className={`${bgClass} border-2 border-black rounded-xl p-3 shadow-[3px_3px_0_0_#000] relative flex flex-col gap-1 transition-all ${isRead ? "opacity-75" : ""
                        }`}
                    >
                      {/* Unread Indicator dot */}
                      {!isRead && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF7676] rounded-full border border-black" />
                      )}
                      <h4 className="font-black text-xs uppercase pr-4">{n.title}</h4>
                      <p className="text-[10px] font-semibold leading-relaxed text-black/90">
                        {n.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Action */}
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-3 border-t-2 border-black bg-white flex justify-center">
                <button
                  onClick={handleMarkAllRead}
                  className="w-full bg-[#E4F087] border-2 border-black py-2 rounded-xl text-xs font-black uppercase shadow-[3px_3px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_#000] hover:bg-[#d8e47c] transition-all"
                >
                  Tandai Semua Dibaca
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
