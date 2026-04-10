import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Search,
  ShoppingCart,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Video,
  PlayCircle
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [resources, setResources] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [recordedClasses, setRecordedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const [enrollmentRes, resourceRes, liveRes, recordedRes] = await Promise.all([
          fetch(`http://192.168.1.23:8000/api/enrollments/?email=${user.email}`),
          fetch(`http://192.168.1.23:8000/api/resource/`),
          fetch(`http://192.168.1.23:8000/api/live/`),
          fetch(`http://192.168.1.23:8000/api/recorded/`)
        ]);

        const enrollmentData = await enrollmentRes.json();
        const resourceData = resourceRes.ok ? await resourceRes.json() : [];
        const liveData = liveRes.ok ? await liveRes.json() : [];
        const recordedData = recordedRes.ok ? await recordedRes.json() : [];

        if (enrollmentRes.ok) {
          setEnrollments(enrollmentData.data || []);
        } else {
          setError(enrollmentData.error || "Failed to fetch courses");
        }

        if (resourceRes.ok) setResources(resourceData);
        if (liveRes.ok) setLiveClasses(liveData);
        if (recordedRes.ok) setRecordedClasses(recordedData);

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong while loading your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'partial': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none group">
              My Learning <span className="text-blue-600 group-hover:italic transition-all">Dashboard</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl">
              Hello, <span className="text-slate-900 font-bold">{user?.full_name || "Scholar"}</span>! Ready to continue your journey?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Enrollments</p>
                <p className="text-2xl font-black text-slate-900">{enrollments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-100 p-6 rounded-3xl flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="text-red-600" size={24} />
            <p className="text-red-900 font-bold">{error}</p>
          </div>
        )}

        {!user ? (
          <div className="bg-white rounded-[3rem] p-12 md:p-20 text-center border border-slate-100 shadow-2xl space-y-8">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-blue-600 shadow-inner">
              <User size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-slate-900">Access Denied</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto">Please sign in to view your personalized learning dashboard and enrolled courses.</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-105 transition-all text-sm uppercase tracking-widest"
            >
              Log In Now
            </button>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-12 md:p-24 text-center border border-slate-100 shadow-[0_32px_64px_-16px_rgba(30,41,59,0.05)] space-y-10 group">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform duration-500">
                <ShoppingCart size={64} strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce">
                <Search size={20} />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-slate-900">No enrollments yet</h2>
              <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">It looks like you haven't started your learning journey with us. Explore our elite courses to get started.</p>
            </div>
            <button
              onClick={() => navigate("/explore")}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-blue-600 text-blue-600 rounded-3xl font-black hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl shadow-blue-500/5 group"
            >
              Explore Course Catalog
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header (Desktop only) */}
            <div className="hidden lg:grid grid-cols-12 gap-6 px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              <div className="col-span-4">Course Identity</div>
              <div className="col-span-2">Batch Schedule</div>
              <div className="col-span-2">Payment Status</div>
              <div className="col-span-2 text-right">Investment</div>
              <div className="col-span-2 text-right">Class Link</div>
            </div>

            {enrollments.map((enrollment, idx) => {
              const isFullyPaid = enrollment.payment_status?.toLowerCase() === 'completed';

              const matchesCourse = (target) => {
                if (!target || !enrollment.title) return false;
                const t = target.toLowerCase();
                const e = enrollment.title.toLowerCase();
                if (t === 'all courses' || e === 'all courses') return true;
                if (t === e || e.includes(t) || t.includes(e)) return true;

                // Fuzzy edge cases based on dropdowns
                if (t.includes('react') && e.includes('react')) return true;
                if (t.includes('mern') && (e.includes('react') || e.includes('mern'))) return true;
                return false;
              };

              const courseResources = resources.filter(res => matchesCourse(res.targetCourse));
              const courseLiveClasses = liveClasses.filter(live => matchesCourse(live.targetCourse));
              const courseRecordedClasses = recordedClasses.filter(rec => matchesCourse(rec.targetCourse));

              const hasPremiumContent = courseLiveClasses.length > 0 || courseRecordedClasses.length > 0;

              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-300 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 lg:p-10">

                    {/* 1. Course ID */}
                    <div className="lg:col-span-4 flex items-start gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500 ${idx % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                        <BookOpen size={24} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50">Pro Student</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {String(enrollment.id).padStart(4, '0')}</span>
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate">
                          {enrollment.title}
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">Enrolled on {formatDate(enrollment.created_at)}</p>
                      </div>
                    </div>

                    {/* 2. Schedule */}
                    <div className="lg:col-span-2 flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl text-slate-400 lg:hidden"><Calendar size={16} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest lg:hidden mb-1">Batch Date</p>
                        <p className="text-sm font-bold text-slate-700">{enrollment.batch_date}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Upcoming Cohort</p>
                      </div>
                    </div>

                    {/* 3. Status */}
                    <div className="lg:col-span-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest lg:hidden mb-2">Status</p>
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest ${getStatusColor(enrollment.payment_status)} shadow-sm`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${enrollment.payment_status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}`}></div>
                        {enrollment.payment_status}
                      </div>
                    </div>

                    {/* 4. Payment Info */}
                    <div className="lg:col-span-2 lg:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest lg:hidden mb-1">Payment</p>
                      <p className="text-base font-black text-slate-800 italic">₹{enrollment.amount_paid}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Total Fee: ₹{enrollment.total_fee}</p>
                    </div>

                    {/* 5. Class Link (Primary Action) */}
                    <div className="lg:col-span-2 flex flex-col items-end gap-2 text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest lg:hidden mb-1">Class Link</p>
                      {isFullyPaid ? (
                        courseLiveClasses.length > 0 ? (
                          <>
                            <a href={courseLiveClasses[0].link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full lg:w-auto px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200/50">
                              <Video size={16} /> Join Class
                            </a>
                            <p className="text-[10px] font-bold text-slate-500 flex items-center lg:justify-end gap-1"><Clock size={10} /> {courseLiveClasses[0].date} {courseLiveClasses[0].time ? `• ${courseLiveClasses[0].time}` : ''}</p>
                          </>
                        ) : (
                          <button disabled className="flex items-center justify-center gap-2 w-full lg:w-auto px-6 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed border border-slate-100">
                            <Video size={14} /> No Live Class
                          </button>
                        )
                      ) : (
                        <button disabled className="flex items-center justify-center gap-2 w-full lg:w-auto px-6 py-3 bg-rose-50 text-rose-400 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed border border-rose-100">
                          <Video size={14} /> Locked
                        </button>
                      )}
                    </div>

                    {/* Premium Content Alerts */}
                    {!isFullyPaid && hasPremiumContent && (
                      <div className="lg:col-span-12 mt-4 p-5 border border-rose-100 bg-rose-50/50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                            <AlertCircle size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-rose-900">Premium Broadcasts Locked</p>
                            <p className="text-[11px] font-bold text-rose-600/80 mt-0.5">Complete your full payment to unlock live sessions and recordings for this course.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate("/checkout", { 
                            state: { 
                              items: [{ 
                                title: enrollment.title, 
                                price: enrollment.total_fee - enrollment.amount_paid,
                                mode: "Online Completion"
                              }] 
                            } 
                          })}
                          className="w-full md:w-auto px-6 py-3 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200"
                        >
                          Complete Payment
                        </button>
                      </div>
                    )}

                    {/* Course Resources (Always available if present) */}
                    {courseResources.length > 0 && (
                      <div className="lg:col-span-12 mt-6 pt-6 border-t border-slate-100">
                        <span className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                          <LinkIcon size={14} /> Course Resources & Links
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          {courseResources.map(res => (
                            <a href={res.driveLink} target="_blank" rel="noreferrer" key={res.id} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 group rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-105 transition-transform"><FileText size={18} /></div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 truncate">{res.title}</p>
                                <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">External Drive Link</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}



                    {/* Recorded Classes Section */}
                    {isFullyPaid && courseRecordedClasses.length > 0 && (
                      <div className="lg:col-span-12 mt-4 pt-6 border-t border-slate-100">
                        <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">
                          <PlayCircle size={14} /> Recorded Broadcasts
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {courseRecordedClasses.map(rec => (
                            <div key={rec.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-emerald-600"><PlayCircle size={20} /></div>
                                <div className="min-w-0">
                                  <p className="text-sm font-black text-emerald-950 truncate">{rec.title}</p>
                                  <p className="text-[10px] font-bold text-emerald-600/70 mt-0.5 flex items-center gap-1"><Clock size={10} /> Length: {rec.duration || "N/A"}</p>
                                </div>
                              </div>
                              <a href={rec.videoLink} target="_blank" rel="noreferrer" className="shrink-0 px-5 py-2.5 bg-white text-emerald-700 border-2 border-emerald-200 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:scale-105 transition-all shadow-sm"> Watch </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;