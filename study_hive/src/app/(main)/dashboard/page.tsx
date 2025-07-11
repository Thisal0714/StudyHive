"use client";

import { useEffect, useState } from "react";
import {
  getUserProfile,
  getSessionCountByEmail,
  submitSession,
} from "@/app/lib/api/user";
import { useRouter } from "next/navigation";
import { RightArrowIcon } from "@/app/util/icons";
import Loading from "@/app/components/common/loading";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [userName, setUserName] = useState("loading...");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [isTimeSet, setIsTimeSet] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [initialSessionDuration, setInitialSessionDuration] = useState<
    number | null
  >(null);
  // Quote carousel state
  const quotes = [
    {
      text: "Success is the sum of small efforts, repeated day in and day out.",
      author: "Robert Collier",
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "Don’t watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
    {
      text: "Learning never exhausts the mind.",
      author: "Leonardo da Vinci",
    },
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check role from cookies
    const cookiesArr = document.cookie.split(";");
    const roleCookie = cookiesArr.find((cookie) =>
      cookie.trim().startsWith("role=")
    );
    const role = roleCookie ? roleCookie.split("=")[1] : null;
    if (!role || role === "GUEST") {
      router.replace("/unauthorized");
      return;
    }
    setIsAdmin(role.toLowerCase() === "admin");

    // Fetch user profile directly
    getUserProfile()
      .then((profileRes) => {
        if (profileRes.user && profileRes.user.name) {
          setUserName(profileRes.user.name);
        }
        if (profileRes.user && profileRes.user.email) {
          setUserEmail(profileRes.user.email);
        }
      })
      .catch(() => {
        setUserName("loading...");
      });
    getUserProfile()
      .then((profileRes) => {
        if (profileRes.user && profileRes.user.name) {
          setUserName(profileRes.user.name);
        }
      })
      .catch(() => {
        setUserName("loading...");
      });
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      setShowComplete(true);
      // Optionally play a sound here
      if (initialSessionDuration && userEmail) {
        submitSession({
          email: userEmail,
          duration: initialSessionDuration,
          completedAt: new Date().toISOString(),
        });
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timer, initialSessionDuration, userEmail]);

  useEffect(() => {
    if (userEmail) {
      getSessionCountByEmail(userEmail)
        .then((count) => {
          setSessionCount(typeof count === "number" ? count : 0);
        })
        .catch(() => setSessionCount(0));
    }
  }, [userEmail]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = currentDateTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (showLoader) {
    return <Loading />;
  }

  const handleClose = () => {
    setShowTimer(false);
    setIsRunning(false);
    setTimer(0);
    setIsTimeSet(false);
    setShowComplete(false);
    window.location.reload();
  };

  return (
    <div className="w-full px-4 py-4 sm:px-6 md:px-10 md:py-8">
      {/* Top Welcome + Admin Button */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex items-center flex-col sm:flex-row gap-4 sm:gap-8">
          <img
            src="/images/Verified User.gif"
            alt="Verified User"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {getGreeting()}, {userName}!
            </h2>
            <p className="text-gray-600 mt-2">
              Continue your study journey with StudyHive
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => router.push("admin_dashboard")}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 sm:px-6 rounded-lg hover:bg-red-700 cursor-pointer font-bold text-base sm:text-lg"
          >
            Admin Dashboard
            <RightArrowIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Decorative background for quote carousel */}
      <div className="relative my-6 sm:my-10 mb-10 sm:mb-20 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-full sm:w-[110%] h-full"
        >
          <svg
            width="100%"
            height="100"
            viewBox="0 0 600 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="300"
              cy="50"
              rx="300"
              ry="50"
              fill="url(#paint0_linear)"
              fillOpacity="0.15"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="0"
                y1="0"
                x2="600"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-primary/10 rounded-lg px-3 py-3 sm:px-6 sm:py-4 max-w-full sm:max-w-2xl w-full flex flex-col items-center relative shadow-lg backdrop-blur-sm"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg italic text-center text-primary font-medium mt-3 transition-all min-h-[48px]"
            >
              “{quotes[quoteIndex].text}”
            </motion.p>
          </AnimatePresence>
          <span className="text-xs sm:text-sm text-gray-600 mb-4">
            — {quotes[quoteIndex].author}
          </span>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Current Date & Time
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {currentDateTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-base sm:text-xl text-gray-700 mt-1">
            {currentDateTime.toLocaleTimeString()}
          </p>
        </motion.div>
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Recent Activity
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {sessionCount !== null ? sessionCount : 0}
          </p>
        </motion.div>
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Study Sessions
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">
            {sessionCount !== null ? sessionCount : 0}
          </p>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <div className="mt-10 sm:mt-16">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => router.push("/notes")}
          >
            Create New Note
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 sm:px-6 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => setShowTimer(true)}
          >
            Start Study Session
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 sm:px-6 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => router.push("/notes")}
          >
            View All Notes
          </button>
        </div>
      </div>

      {/* Study Session Timer Modal */}
      {showTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 flex flex-col items-center shadow-lg relative">
            <button
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={handleClose}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">
              Study Session Timer
            </h2>
            {!isTimeSet ? (
              <>
                <div className="mb-6 flex gap-2 items-center">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={inputMinutes}
                    onChange={(e) =>
                      setInputMinutes(
                        Math.max(0, Math.min(99, Number(e.target.value)))
                      )
                    }
                    className="w-16 p-2 border rounded text-center text-2xl text-black"
                  />
                  <span className="text-2xl font-mono text-black">:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={inputSeconds}
                    onChange={(e) =>
                      setInputSeconds(
                        Math.max(0, Math.min(59, Number(e.target.value)))
                      )
                    }
                    className="w-16 p-2 border rounded text-center text-2xl text-black"
                  />
                </div>
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
                  onClick={() => {
                    const duration = inputMinutes * 60 + inputSeconds;
                    setTimer(duration);
                    setInitialSessionDuration(duration);
                    setIsTimeSet(true);
                    setShowComplete(false);
                  }}
                  disabled={inputMinutes === 0 && inputSeconds === 0}
                >
                  Set Timer
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl font-mono mb-6 text-black">
                  {formatTime(timer)}
                </div>
                {showComplete && (
                  <div className="mb-4 text-green-600 font-bold text-lg">
                    Time &apos;s up! 🎉
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => setIsRunning(true)}
                    disabled={isRunning || timer === 0}
                  >
                    Start
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => setIsRunning(false)}
                    disabled={!isRunning}
                  >
                    Pause
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    onClick={() => {
                      setTimer(inputMinutes * 60 + inputSeconds);
                      setIsRunning(false);
                      setShowComplete(false);
                      setInitialSessionDuration(
                        inputMinutes * 60 + inputSeconds
                      );
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                      setIsTimeSet(false);
                      setIsRunning(false);
                      setShowComplete(false);
                      setTimer(0);
                      setInitialSessionDuration(null);
                    }}
                  >
                    Change Time
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
