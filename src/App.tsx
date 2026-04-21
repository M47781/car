import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { supabase } from './lib/supabase';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isToday
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from './lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Car, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  X,
  Plus,
  Trash2,
  Trophy,
  ArrowUpDown,
  CheckCircle2,
  Info,
  LogOut,
  BellRing
} from 'lucide-react';

// --- LUXURY LOGO COMPONENT ---
const LuxuryLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
    <circle cx="50" cy="50" r="48" stroke="url(#goldGradient)" strokeWidth="2" />
    <circle cx="50" cy="50" r="44" stroke="url(#goldGradient)" strokeWidth="0.5" strokeDasharray="2 2" />
    
    {/* Crown */}
    <path d="M40 35L45 30L50 35L55 30L60 35V38H40V35Z" fill="#D4AF37" />
    <path d="M43 28C43 26.8954 43.8954 26 45 26C46.1046 26 47 26.8954 47 28C47 29.1046 46.1046 30 45 30C43.8954 30 43 29.1046 43 28Z" fill="#D4AF37" />
    <path d="M53 28C53 26.8954 53.8954 26 55 26C56.1046 26 57 26.8954 57 28C57 29.1046 56.1046 30 55 30C53.8954 30 53 29.1046 53 28Z" fill="#D4AF37" />
    <path d="M48 24C48 22.8954 48.8954 22 50 22C51.1046 22 52 22.8954 52 24C52 25.1046 51.1046 26 50 26C48.8954 26 48 25.1046 48 24Z" fill="#D4AF37" />

    {/* Luxury Car Silhouette */}
    <path d="M25 60C25 60 35 48 55 48C75 48 85 58 85 62C85 65 80 68 75 68H35C30 68 25 65 25 60Z" fill="white" />
    <path d="M30 62H70M30 65H50" stroke="#111" strokeWidth="0.5" />
    <circle cx="35" cy="68" r="4" fill="#D4AF37" stroke="#111" strokeWidth="1" />
    <circle cx="75" cy="68" r="4" fill="#D4AF37" stroke="#111" strokeWidth="1" />

    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D4AF37" />
        <stop offset="0.5" stopColor="#FBF5B7" />
        <stop offset="1" stopColor="#D4AF37" />
      </linearGradient>
    </defs>
  </svg>
);

const VEHICLES = [
  "MERCEDES GLE COUPÉ NOIR", "AUDI Q3 2024", "Golf 8 R Line Gris nardo", "GOLF 8R line", "PASSAT",
  "AUDI A3 KIT RS3", "AUDI A6", "AUDI Q2", "MERCEDES CLE 2026", "MERCEDES GLE CARRÉ", "MERCEDES GLC",
  "MERCEDES G63 Noir", "AUDI Q8", "BMW X3", "BMW 420D NOIR", "KIA SANTOS", "MERCEDES C300", 
  "MERCEDES G63 Blanc", "G63 Gris nardo", "LÉON FR", "MERCEDES MAYBACH", "PORSCHE MACAN", 
  "GOLF 8R", "URUS NOIR", "RANGE P300 Gris", "MERCEDES G700 BRABUS", "BMW 520 NOIR", "BMW X5", 
  "BMW X4", "AUDI RSQ3", "AUDI RS3", "AUDI RS6 GRIS", "AUDI RS3 BLEU CIEL", "AUDI A3", 
  "GOLF 8 GTD NOIR", "GLE NOIR", "TIGUAN NOIR 2024", "GLE GRIS NARDO COUPÈ", "PORSCHE CAYENNE", 
  "MERCEDES G63 Salon Rouge", "AUDI Q5", "AUDI RSQ3 2025 Gris NARDo"
];

interface Reservation {
  nom?: string;
  telephone?: string;
  versement?: 'oui' | 'non';
  montant?: string;
  color?: string;
  clientId?: string;
  apporteur?: string;
}

type PlannerState = Record<string, Reservation>;

function LoginForm({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data.session) {
      onLogin(data.user);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-luxury-gold selection:text-black font-sans text-white">
      <div className="bg-[#111] border border-luxury-border p-8 rounded-xl shadow-2xl w-full max-w-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-luxury-gold/10 via-luxury-gold to-luxury-gold/10" />
        
        <div className="flex justify-center mb-6 mt-4">
          <div className="bg-luxury-gold/10 p-4 rounded-full text-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-luxury-gold/30">
            <Car size={36} strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-3xl font-light text-center mb-1 text-white tracking-widest font-serif uppercase">Location de voiture</h2>
        <p className="text-luxury-gold text-xs uppercase tracking-[0.2em] text-center mb-8 font-medium">Administration</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full bg-black/80 border border-luxury-border rounded-lg px-4 py-3 text-sm text-white placeholder-luxury-muted focus:border-luxury-gold outline-none transition-colors"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-black/80 border border-luxury-border rounded-lg px-4 py-3 text-sm text-white placeholder-luxury-muted focus:border-luxury-gold outline-none transition-colors"
            />
          </div>
          
          {error && <p className="text-[#ff3333] text-xs text-center font-medium bg-[#ff3333]/10 py-2 rounded border border-[#ff3333]/20">{error}</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-luxury-gold hover:bg-luxury-gold-hover text-black font-bold py-3.5 rounded-lg text-sm tracking-widest uppercase transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-[0.98] mt-2 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se Connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

function UpcomingAlertToast({ message, onClose }: { key?: string, message: string, onClose: () => void }) {
  useEffect(() => {
    // Alert hides automatically after 15 seconds
    const t = setTimeout(() => onClose(), 15000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="bg-gradient-to-r from-[#ff9800] to-[#f57c00] text-white p-4 rounded-xl shadow-[0_10px_40px_rgba(245,124,0,0.4)] border border-[#ffb74d] flex justify-between items-start w-[340px] md:w-[400px] mb-4 animate-in fade-in slide-in-from-right-10 z-[100] pointer-events-auto relative overflow-hidden group">
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      
      <div className="mt-1 mr-4 shrink-0 bg-white/20 p-2 rounded-full shadow-inner relative z-10">
        <BellRing size={22} className="animate-bounce" />
      </div>
      
      <div className="flex-1 text-sm font-medium pr-2 whitespace-pre-line leading-relaxed relative z-10 drop-shadow-md">
        {message}
      </div>
      
      <button onClick={onClose} className="hover:bg-black/20 rounded-full transition-colors shrink-0 p-1.5 relative z-10 text-white/90 hover:text-white">
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // Starts Jan 2026
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState<PlannerState>({});
  const [customVehicles, setCustomVehicles] = useState<string[]>([]);
  const [deletedVehicles, setDeletedVehicles] = useState<string[]>([]);
  const [clientColors, setClientColors] = useState<Record<string, string>>({});
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Cell edit modal state
  const [editingKeys, setEditingKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  
  // Drag selection persistence
   const isDraggingRef = useRef(false);
   const selectedKeysRef = useRef<string[]>([]);
   const lastTapRef = useRef(0);
   const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Form fields
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [versement, setVersement] = useState<'oui' | 'non'>('non');
  const [montant, setMontant] = useState('');
  const [apporteur, setApporteur] = useState('');

  // Add Vehicle modal state
  const [newVehicleModalOpen, setNewVehicleModalOpen] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState('');

  // Vehicle Details modal state
  const [vehicleDetailsModal, setVehicleDetailsModal] = useState<string | null>(null);
  
  // Delete Vehicle modal state
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  // Apporteurs Ranking modal state
  const [rankingModalOpen, setRankingModalOpen] = useState(false);
  const [rankingSortBy, setRankingSortBy] = useState<'clients' | 'revenue'>('clients');

  // Notification Toast state
  const [toast, setToast] = useState<{message: string, visible: boolean, id: number, type: 'success' | 'info' | 'error'} | null>(null);

  // Upcoming alerts state
  const [upcomingAlerts, setUpcomingAlerts] = useState<{id: string, message: string}[]>([]);

  // Live "Today" timer state
  const [today, setToday] = useState(new Date());

  // Manual Reservation state
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualVehicle, setManualVehicle] = useState('');
  const [manualStartDate, setManualStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [manualEndDate, setManualEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Modal swipe-to-close state
  const [modalTouchStartY, setModalTouchStartY] = useState(0);

  useEffect(() => {
    // Update 'today' every minute so it reflects day rollovers if left open
    const interval = setInterval(() => {
      setToday(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ message, visible: true, id, type });
    setTimeout(() => {
      setToast(prev => prev?.id === id ? { ...prev, visible: false } : prev);
    }, 4000);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showToast("Les notifications ne sont pas supportées sur ce navigateur", "error");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showToast("Notifications activées !", "success");
      new Notification("✅ Luxury Location", {
        body: "Les notifications sont maintenant actives.",
        icon: "/icon-192.png"
      });
    } else {
      showToast("Permission refusée", "error");
    }
  };

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: "/icon-192.png" });
    }
  };

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      setSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      setSessionLoading(false);
    });

    // iOS PWA Install Hint
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isStandalone) {
      setTimeout(() => {
        showToast("📲 Ajoutez à l'écran d'accueil pour installer l'app", "info");
      }, 3000);
    }

    return () => subscription.unsubscribe();
  }, []);

  // Data Loading
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      try {
        const { data: settings } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();
        if (settings) {
          if (settings.custom_vehicles) setCustomVehicles(settings.custom_vehicles);
          if (settings.deleted_vehicles) setDeletedVehicles(settings.deleted_vehicles);
          if (settings.client_colors) setClientColors(settings.client_colors);
        }

        const { data: resData, error: resError } = await supabase.from('reservations').select('*').eq('user_id', user.id);
        if (resError) {
          console.error("Error fetching reservations:", resError);
          showToast("Erreur lors du chargement des données", "error");
        } else if (resData) {
          const newPlanner: PlannerState = {};
          resData.forEach(r => {
            const key = `${r.date}_${r.vehicle}`;
            newPlanner[key] = {
              nom: r.nom || '',
              telephone: r.telephone || '',
              versement: (r.versement as 'oui' | 'non') || 'non',
              montant: r.montant || '',
              apporteur: r.apporteur || '',
              color: r.color || undefined,
              clientId: r.client_id || undefined
            };
          });
          setReservations(newPlanner);
        }
      } catch (err) {
        console.error("Unexpected error loading data:", err);
      }
    };
    
    loadData();
  }, [user]);

  // Real-time
  useEffect(() => {
    if (!user) return;
    const channelRes = supabase.channel('schema-res-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations', filter: `user_id=eq.${user.id}` }, (payload: any) => {
        if (payload.eventType === 'DELETE') {
          const old = payload.old;
          if (old && old.date && old.vehicle) {
            const key = `${old.date}_${old.vehicle}`;
            setReservations(prev => { const copy = { ...prev }; delete copy[key]; return copy; });
          }
        } else {
          const r = payload.new;
          if (r && r.date && r.vehicle) {
            const key = `${r.date}_${r.vehicle}`;
            setReservations(prev => ({
              ...prev, [key]: {
                nom: r.nom || '', telephone: r.telephone || '', versement: (r.versement as 'oui'|'non') || 'non', montant: r.montant || '', apporteur: r.apporteur || '', color: r.color || undefined, clientId: r.client_id || undefined
              }
            }));
          }
        }
      }).subscribe();
      
    const channelSet = supabase.channel('schema-set-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_settings', filter: `user_id=eq.${user.id}` }, (payload: any) => {
         const settings = payload.new;
         if (settings) {
            if (settings.custom_vehicles) setCustomVehicles(settings.custom_vehicles);
            if (settings.deleted_vehicles) setDeletedVehicles(settings.deleted_vehicles);
            if (settings.client_colors) setClientColors(settings.client_colors);
         }
      }).subscribe();
      
    return () => { supabase.removeChannel(channelRes); supabase.removeChannel(channelSet); };
  }, [user]);

  const saveSettingsToSupabase = (newColors: any, newCustom: any, newDeleted: any) => {
    if (!user) return;
    supabase.from('user_settings').upsert({
      user_id: user.id,
      client_colors: newColors,
      custom_vehicles: newCustom,
      deleted_vehicles: newDeleted
    }).then();
  };

  // Check for upcoming reservations (3 days before)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const notifiedList = JSON.parse(localStorage.getItem('luxury_rental_notified_v2') || '[]');
    const newAlerts: {id: string, message: string}[] = [];

    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);

    Object.entries(reservations).forEach(([key, unknownData]) => {
      const data = unknownData as Reservation;
      if (!key.includes('_')) return;
      
      const dateStr = key.substring(0, 10);
      const vehicle = key.substring(11);
      
      const [yyyy, MM, dd] = dateStr.split('-');
      if (!yyyy || !MM || !dd) return;
      
      const resDate = new Date(Number(yyyy), Number(MM) - 1, Number(dd));
      const diffTime = resDate.getTime() - todayMidnight.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // 3 days before
      if (diffDays === 3) {
        // Verify it's the start of a reservation, not a continuation
        const prevDate = new Date(resDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevKey = `${format(prevDate, 'yyyy-MM-dd')}_${vehicle}`;
        const prevData = reservations[prevKey];

        const isContinuation = prevData && prevData.nom === data.nom;

        // Only alert if it's the starting day of the booking
        if (!isContinuation) {
          if (!notifiedList.includes(key)) {
            const alertMsg = `⚠️ Réservation imminente (J-3)\nClient : ${data.nom || 'Sans nom'}\nVéhicule : ${vehicle}\nDate : ${dateStr}`;
            newAlerts.push({
              id: key,
              message: alertMsg
            });
            notifiedList.push(key);
            
            // Native notification trigger
            sendNotification("Luxury Location : Arrivée imminente", `${data.nom || 'Client'} - ${vehicle} (dans 3 jours)`);
          }
        }
      }
    });

    if (newAlerts.length > 0) {
      setUpcomingAlerts(prev => [...prev, ...newAlerts]);
      localStorage.setItem('luxury_rental_notified_v2', JSON.stringify(notifiedList));
    }
  }, [today, reservations, isAuthenticated]);

  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => {
      const newD = new Date(prev);
      newD.setMonth(newD.getMonth() + offset);
      return newD;
    });
  };

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const allVehicles = useMemo(() => {
    return [...VEHICLES, ...customVehicles]
      .filter(v => !deletedVehicles.includes(v))
      .sort((a, b) => a.localeCompare(b));
  }, [customVehicles, deletedVehicles]);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return allVehicles;
    const term = searchTerm.toLowerCase();
    
    return allVehicles.filter(v => {
      // 1. Matches vehicle name
      if (v.toLowerCase().includes(term)) return true;
      
      // 2. Matches any reservation for this vehicle (across all months in the records)
      const hasMatch = Object.entries(reservations).some(([key, res]) => {
        const resData = res as Reservation;
        // key format is "yyyy-MM-dd_VehicleName", so substring(11) gets the exact vehicle name
        if (key.substring(11) !== v) return false;
        
        return resData.nom?.toLowerCase().includes(term) || resData.telephone?.toLowerCase().includes(term);
      });
      
      return hasMatch;
    });
  }, [searchTerm, allVehicles, reservations]);

  const getCellKey = (day: Date, vehicleId: string) => {
    return `${format(day, 'yyyy-MM-dd')}_${vehicleId}`;
  };

  const handleCellMouseDown = (key: string, data: Reservation | undefined) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    if (data) {
      // Reserved, open edit directly
      setNom(data.nom || '');
      setTelephone(data.telephone || '');
      setVersement(data.versement || 'non');
      setMontant(data.montant || '');
      setEditingKeys([key]);
    } else {
      // Toggle selection (Click always works)
      
      // Drag selection is enabled ONLY if already selected >= 2 cells (Desktop only)
      // This allows the 3rd cell selection to initiate a drag.
      if (!isMobile && selectedKeys.length >= 2) {
        isDraggingRef.current = true;
        document.body.classList.add('select-none');
      }

      setNom('');
      setTelephone('');
      setVersement('non');
      setMontant('');
      setApporteur('');
      
      setSelectedKeys(prev => {
        const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
        selectedKeysRef.current = next;
        return next;
      });
    }
  };

  const handleCellMouseEnter = (key: string, isReserved: boolean) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    if (isDraggingRef.current && !isReserved) {
      setSelectedKeys(prev => {
        const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
        selectedKeysRef.current = next;
        return next;
      });
    }
  };

  useEffect(() => {
    const handleEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.classList.remove('select-none');
        if (selectedKeysRef.current.length > 0) {
          // Automatic opening disabled as per user request
          // setEditingKeys(selectedKeysRef.current);
        }
      }
    };
    
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);
  const clearSelection = React.useCallback(() => {
    if (selectedKeysRef.current.length === 0) return;
    setSelectedKeys([]);
    selectedKeysRef.current = [];
    showToast("❌ Sélection annulée", "info");
    console.log("Selection cleared via double tap");
  }, []);

  // Refined Double Tap Logic for Mobile
  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;

    const handleTouchEnd = (e: TouchEvent) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapRef.current;

      if (tapLength < 600 && tapLength > 0) {
        // Double tap sequence detected
        clearSelection();
      }
      lastTapRef.current = currentTime;
    };

    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => container.removeEventListener('touchend', handleTouchEnd);
  }, [clearSelection]);

  // HARD LOCK: Disable all grid interactions on mobile
  useLayoutEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile || !gridContainerRef.current) return;

    const blocker = (e: Event) => {
      e.stopImmediatePropagation();
      // We don't preventDefault() to allow normal scrolling via translate/transform
      // but we block selection events.
    };

    const grid = gridContainerRef.current;
    const events = ["mousedown", "mouseup", "click", "touchstart"];
    
    events.forEach(evt => grid.addEventListener(evt, blocker, { capture: true, passive: false }));
    
    return () => {
      events.forEach(evt => grid.removeEventListener(evt, blocker, { capture: true }));
    };
  }, []);

  const closeModal = () => {
    setEditingKeys([]);
    setSelectedKeys([]);
    selectedKeysRef.current = [];
    setApporteur('');
  };

  const handleSave = async () => {
    if (editingKeys.length === 0 || !user) return;
    
    const firstKey = editingKeys[0];
    const existingRes = reservations[firstKey];
    const isUpdate = !!existingRes;
    
    let finalColor: string | undefined;
    let finalClientId: string | undefined;

    if (isUpdate) {
      finalColor = existingRes.color;
      finalClientId = existingRes.clientId;
    } else {
      const tel = telephone.trim();
      const name = nom.trim().toLowerCase();
      finalClientId = tel ? tel : name;
      finalColor = finalClientId ? clientColors[finalClientId] : undefined;
      
      if (finalClientId && !finalColor) {
        const hue = Math.floor(Math.random() * 360);
        finalColor = `hsl(${hue}, 70%, 45%)`;
        const newColors = { ...clientColors, [finalClientId!]: finalColor! };
        setClientColors(newColors);
        saveSettingsToSupabase(newColors, customVehicles, deletedVehicles);
      }
    }
    
    const newlyAdded: Record<string, Reservation> = {};
    const inserts = editingKeys.map(key => {
      const dateStr = key.substring(0, 10);
      const vehicle = key.substring(11);
      
      const newValues = {
        nom,
        telephone,
        versement,
        montant: versement === 'oui' ? montant : '',
        color: finalColor,
        client_id: finalClientId,
        apporteur: apporteur.trim()
      };
      
      newlyAdded[key] = {
        ...newValues,
        clientId: finalClientId // Keep camelCase for local state to avoid breaking other parts of UI if they depend on it
      };

      return {
        user_id: user.id,
        date: dateStr,
        vehicle: vehicle,
        ...newValues
      };
    });
    
    setReservations(prev => ({ ...prev, ...newlyAdded }));
    closeModal();
    
    const { error } = await supabase.from('reservations').upsert(inserts, { onConflict: 'user_id, date, vehicle' });
    
    if (error) {
      console.error("Error saving reservation:", error);
      showToast("Erreur lors de la sauvegarde: " + error.message, "error");
      // Optionally revert local state here if needed, but for now we'll just alert the user
    } else {
      showToast(isUpdate ? "Réservation mise à jour" : "Réservation ajoutée", "success");
    }
  };

  const handleManualReserve = async () => {
    if (!manualVehicle || !manualStartDate || !manualEndDate || !nom.trim() || !apporteur.trim() || !user) {
      showToast("Veuillez remplir tous les champs obligatoires (incluant l'apporteur)", "error");
      return;
    }

    const start = new Date(manualStartDate);
    const end = new Date(manualEndDate);
    
    if (end < start) {
      showToast("La date de fin doit être après la date de début", "error");
      return;
    }

    // Check availability
    const keys: string[] = [];
    let curr = new Date(start);
    while (curr <= end) {
      const k = getCellKey(curr, manualVehicle);
      if (reservations[k]) {
        showToast(`Le ${format(curr, 'dd/MM')} est déjà réservé`, "error");
        return;
      }
      keys.push(k);
      curr.setDate(curr.getDate() + 1);
    }

    const tel = telephone.trim();
    const name = nom.trim().toLowerCase();
    const finalClientId = tel ? tel : name;
    let finalColor = clientColors[finalClientId];
    
    if (finalClientId && !finalColor) {
      const hue = Math.floor(Math.random() * 360);
      finalColor = `hsl(${hue}, 70%, 45%)`;
      const newColors = { ...clientColors, [finalClientId!]: finalColor! };
      setClientColors(newColors);
      saveSettingsToSupabase(newColors, customVehicles, deletedVehicles);
    }

    const newlyAdded: Record<string, Reservation> = {};
    const inserts = keys.map(key => {
      const dateStr = key.substring(0, 10);
      const vehicle = key.substring(11);
      const newValues = {
        nom,
        telephone: telephone.trim(),
        versement,
        montant: versement === 'oui' ? montant : '',
        color: finalColor,
        client_id: finalClientId,
        apporteur: apporteur.trim()
      };
      newlyAdded[key] = { ...newValues, clientId: finalClientId };
      return { user_id: user.id, date: dateStr, vehicle: vehicle, ...newValues };
    });

    setReservations(prev => ({ ...prev, ...newlyAdded }));
    setManualModalOpen(false);
    showToast(`${keys.length} jours réservés pour ${manualVehicle}`, "success");

    const { error } = await supabase.from('reservations').upsert(inserts, { onConflict: 'user_id, date, vehicle' });
    if (error) {
      console.error("Error in manual reserve:", error);
      showToast("Erreur lors de la sauvegarde", "error");
    }
  };

  const handleDelete = async () => {
    if (editingKeys.length === 0 || !user) return;
    
    setReservations(prev => {
      const copy = { ...prev };
      editingKeys.forEach(key => delete copy[key]);
      return copy;
    });
    closeModal();
    showToast("Réservation annulée", "info");
    
    editingKeys.forEach(async key => {
      const dateStr = key.substring(0, 10);
      const vehicle = key.substring(11);
      const { error } = await supabase.from('reservations').delete().match({ user_id: user.id, date: dateStr, vehicle: vehicle });
      if (error) {
        console.error("Error deleting reservation:", error);
        showToast("Erreur lors de la suppression: " + error.message, "error");
      }
    });
  };

  const handleDeleteDirect = async (day: Date, vehicleId: string) => {
    if (!user) return;
    const dateStr = format(day, 'yyyy-MM-dd');
    const key = `${dateStr}_${vehicleId}`;
    
    setReservations(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    showToast("Réservation annulée", "info");
    
    const { error } = await supabase.from('reservations').delete().match({ user_id: user.id, date: dateStr, vehicle: vehicleId });
    if (error) {
      console.error("Error deleting reservation directly:", error);
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const handleAddVehicle = () => {
    if (!user) return;
    const name = newVehicleName.trim().toUpperCase();
    
    // Close modal and clear input immediately for instant feedback
    setNewVehicleModalOpen(false);
    setNewVehicleName('');

    if (name && !allVehicles.includes(name)) {
      const currentCustom = [...customVehicles, name];
      setCustomVehicles(currentCustom);
      let currentDeleted = deletedVehicles;
      if (deletedVehicles.includes(name)) {
        currentDeleted = currentDeleted.filter(v => v !== name);
        setDeletedVehicles(currentDeleted);
      }
      saveSettingsToSupabase(clientColors, currentCustom, currentDeleted);
      // Auto-close sidebar on mobile after adding vehicle
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    }
  };

  const handleConfirmDeleteVehicle = () => {
    if (!vehicleToDelete || !user) return;
    
    // Close modal immediately for instant feedback
    const vehicleName = vehicleToDelete;
    setVehicleToDelete(null);

    const currentDeleted = deletedVehicles.includes(vehicleName) ? deletedVehicles : [...deletedVehicles, vehicleName];
    if (!deletedVehicles.includes(vehicleName)) {
      setDeletedVehicles(currentDeleted);
      saveSettingsToSupabase(clientColors, customVehicles, currentDeleted);
    }
    
    setReservations(prev => {
      const copy = { ...prev };
      Object.keys(copy).forEach(key => {
        if (key.endsWith(`_${vehicleName}`)) {
          delete copy[key];
        }
      });
      return copy;
    });
    
    
    supabase.from('reservations').delete().match({ user_id: user.id, vehicle: vehicleName }).then();
    // Auto-close sidebar on mobile after deleting vehicle
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };



  const handleTouchMove = (e: React.TouchEvent) => {
    // Mobile drag selection disabled for stability as per requirement
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const td = element?.closest('td[data-key]');
    if (td) {
      const key = td.getAttribute('data-key');
      const isReserved = td.getAttribute('data-reserved') === 'true';
      if (key && !isReserved) {
        setSelectedKeys(prev => {
          if (prev[prev.length - 1] === key) return prev;
          const next = prev.includes(key) ? prev : [...prev, key];
          selectedKeysRef.current = next;
          return next;
        });
      }
    }
  };
  const stats = useMemo(() => {
    let totalReserved = 0;
    const vehicleReservedDays = new Map<string, number>();

    Object.entries(reservations).forEach(([key]) => {
      totalReserved++;
      const vehicle = key.split('_')[1] || '';
      vehicleReservedDays.set(vehicle, (vehicleReservedDays.get(vehicle) || 0) + 1);
    });

    return { totalReserved, vehicleReservedDays };
  }, [reservations]);

  // Apporteurs Stats
  const apporteursStats = useMemo(() => {
    const appStats: Record<string, { clients: number, revenue: number }> = {};
    Object.values(reservations).forEach((rUnknown) => {
      const r = rUnknown as Reservation;
      if (!r.apporteur) return;
      const name = r.apporteur.trim();
      if (!name) return;
      
      if (!appStats[name]) {
        appStats[name] = { clients: 0, revenue: 0 };
      }
      
      appStats[name].clients += 1;
      const rev = parseInt(r.montant || '0', 10);
      if (!isNaN(rev)) {
        appStats[name].revenue += rev;
      }
    });
    return appStats;
  }, [reservations]);

  const ranking = useMemo(() => {
    return Object.entries(apporteursStats)
      .map(([name, data]) => {
        const stats = data as { clients: number, revenue: number };
        return { name, clients: stats.clients, revenue: stats.revenue };
      })
      .sort((a, b) => {
        if (rankingSortBy === 'clients') {
          if (b.clients === a.clients) return b.revenue - a.revenue;
          return b.clients - a.clients;
        }
        if (b.revenue === a.revenue) return b.clients - a.clients;
        return b.revenue - a.revenue;
      });
  }, [apporteursStats, rankingSortBy]);

  if (sessionLoading) return <div className="h-screen flex items-center justify-center bg-black text-white">Chargement...</div>;

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-luxury-bg font-sans selection:bg-luxury-gold selection:text-black text-luxury-text">
      
      {/* MODERN HEADER */}
      <header className="header-modern z-20 flex-col sm:flex-row justify-between gap-4 h-auto md:h-16 px-4 md:px-8">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center">
            <div className="mr-3">
              <LuxuryLogo size={42} />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-lg md:text-xl font-serif tracking-[0.15em] text-luxury-gold uppercase">Luxury Location</span>
              <span className="text-[9px] text-luxury-gold/60 font-medium uppercase tracking-[0.3em] font-sans">
                {format(today, "EEEE d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setNewVehicleModalOpen(true)}
            className="hidden sm:hidden bg-luxury-gold hover:bg-luxury-gold-hover text-black p-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {selectedKeys.length > 0 && (
            <button 
              onClick={() => setEditingKeys(selectedKeys)}
              className="flex bg-luxury-gold hover:bg-luxury-gold-hover text-black px-4 py-1.5 rounded-lg text-sm font-bold transition-all items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-pulse hover:animate-none transform hover:scale-105"
            >
              <CheckCircle2 size={16} strokeWidth={3} />
              <span>Réserver {selectedKeys.length} {selectedKeys.length > 1 ? 'jours' : 'jour'}</span>
            </button>
          )}

          <button 
            onClick={() => setNewVehicleModalOpen(true)}
            className="hidden sm:flex bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 px-4 py-1.5 rounded-lg text-sm font-bold transition-all items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Ajouter véhicule</span>
          </button>

          <div className="flex items-center bg-[#222] border border-[#333] rounded-lg pl-3 pr-4 py-1.5 focus-within:border-luxury-gold transition-all flex-1 sm:flex-none">
            <Search size={16} className="text-gray-500 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full sm:w-32 lg:w-48 placeholder:text-gray-600 text-white"
            />
          </div>
          
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setRankingModalOpen(true)}
              className="flex items-center bg-[#222] border border-[#333] rounded-lg pl-3 pr-4 py-1.5 hover:border-luxury-gold hover:text-luxury-gold transition-colors text-white text-sm"
              title="Classement Apporteurs"
            >
              <Trophy size={16} className="text-luxury-gold mr-2" />
              <span className="font-bold">{ranking.length > 0 ? `#1 ${ranking[0].name}` : "Classement"}</span>
            </button>
            <div className="flex items-center bg-[#222] border border-[#333] rounded-lg px-4 py-1.5 hidden sm:flex">
              <ShieldCheck size={16} className="text-luxury-gold mr-2" />
              <span className="text-sm font-bold">Connecté</span>
            </div>
            
            <button
              onClick={requestNotificationPermission}
              className="flex items-center justify-center bg-[#222] border border-[#333] hover:border-luxury-gold hover:text-luxury-gold transition-all rounded-lg w-10 h-10 lg:w-auto lg:px-4 lg:py-1.5 text-gray-400 group shadow-lg"
              title="Activer les notifications"
            >
              <BellRing size={16} className="lg:mr-2" />
              <span className="text-sm font-bold hidden lg:inline">Alertes</span>
            </button>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              className="flex items-center justify-center bg-[#222] border border-[#333] hover:border-[#ff4444] hover:bg-[#1a0a0a] hover:text-[#ff4444] transition-all rounded-lg w-10 h-10 lg:w-auto lg:px-4 lg:py-1.5 text-gray-400 group shadow-lg"
              title="Déconnexion"
            >
              <LogOut size={16} className="lg:mr-2" />
              <span className="text-sm font-bold hidden lg:inline">Quitter</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER: Date Nav & Stats */}
      <div className="flex-none flex items-center justify-between px-3 sm:px-4 md:px-8 py-2 md:py-3 bg-luxury-bg border-b border-luxury-border z-10 w-full overflow-x-auto scroller-hidden">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "p-1.5 md:p-2 rounded-full transition-all duration-300 flex items-center gap-2",
              isSidebarOpen ? "bg-luxury-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]" : "bg-luxury-card text-luxury-muted hover:text-white border border-luxury-border"
            )}
            title={isSidebarOpen ? "Réduire la liste" : "Afficher la liste"}
          >
            <ArrowUpDown size={18} className={cn("transition-transform duration-500", !isSidebarOpen && "rotate-90")} />
            <span className="text-xs font-bold uppercase tracking-wider hidden md:block">
              {isSidebarOpen ? "Réduire" : "Voitures"}
            </span>
          </button>

          <div className="w-px h-6 bg-luxury-border mx-1 hidden sm:block" />

          <button 
            onClick={() => changeMonth(-1)}
            className="p-1.5 md:p-2 hover:bg-luxury-border rounded-full transition-colors"
          >
            <ChevronLeft size={18} className="md:w-5 md:h-5" />
          </button>
          
          <div className="flex items-center justify-center gap-1.5 md:gap-3">
            <CalendarIcon size={16} className="text-luxury-gold hidden sm:block md:w-[18px] md:h-[18px]" />
            <div className="flex gap-1.5 md:gap-2">
              <select 
                value={currentMonth.getMonth()} 
                onChange={(e) => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(parseInt(e.target.value));
                  setCurrentMonth(newMonth);
                }}
                className="bg-black/80 border border-luxury-border rounded text-xs md:text-sm font-medium tracking-wider uppercase text-white outline-none focus:border-luxury-gold transition-colors cursor-pointer hover:bg-[#222] py-1.5 pl-2 pr-1 md:pl-3 md:pr-2 appearance-none"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i} className="bg-luxury-card text-white">
                    {format(new Date(2026, i, 1), 'MMM', { locale: fr })}
                  </option>
                ))}
              </select>
              <select 
                value={currentMonth.getFullYear()} 
                onChange={(e) => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setFullYear(parseInt(e.target.value));
                  setCurrentMonth(newMonth);
                }}
                className="bg-black/80 border border-luxury-border rounded text-xs md:text-sm font-medium tracking-wider text-white outline-none focus:border-luxury-gold transition-colors cursor-pointer hover:bg-[#222] py-1.5 pl-2 pr-1 md:pl-3 md:pr-2"
              >
                {Array.from({ length: 11 }).map((_, i) => {
                  const y = new Date().getFullYear() - 5 + i;
                  return (
                    <option key={y} value={y} className="bg-luxury-card text-white">
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button 
            onClick={() => changeMonth(1)}
            className="p-1.5 md:p-2 hover:bg-luxury-border rounded-full transition-colors"
          >
            <ChevronRight size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm shrink-0 ml-4">
          <div className="flex flex-col items-end">
            <span className="text-luxury-muted text-[10px] md:text-xs uppercase tracking-wider hidden sm:block">Total Réservations</span>
            <span className="text-luxury-muted text-[10px] md:text-xs uppercase tracking-wider sm:hidden">Total</span>
            <span className="text-lg md:text-xl text-white font-mono leading-tight">{stats.totalReserved} <span className="text-luxury-muted text-xs md:text-sm">j</span></span>
          </div>
        </div>
      </div>

      {/* MOBILE INFO BANNER */}
      <div className="md:hidden mobile-info">
        <Info size={16} />
        📱 الحجز يتم عبر الفورم فقط في الهاتف
      </div>

      {/* GRID CONTAINER */}
      <div 
        ref={gridContainerRef}
        className={cn(
          "flex-1 overflow-auto bg-black relative scroller grid-container-mobile",
          "md:pointer-events-auto max-md:grid-read-only"
        )}
      >
        
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-[45] bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* FAB BUTTON (Mobile Only) */}
        <button 
          onClick={() => {
            setNom('');
            setTelephone('');
            setApporteur('');
            setApporteur(''); // Clear for good measure
            setManualVehicle('');
            setManualModalOpen(true);
          }}
          className="fab-button md:hidden"
          title="Ajouter une réservation"
        >
          <Plus size={32} strokeWidth={2.5} />
        </button>

        <div className="inline-block min-w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            
            {/* STICKY HEADER */}
            <thead className="sticky top-0 z-30 bg-luxury-card border-b-2 border-luxury-border select-none shadow-md">
              <tr>
                <th className={cn(
                  "sticky left-0 z-40 bg-luxury-card border-r-2 border-luxury-border p-4 w-1/4 max-w-[300px] font-semibold text-luxury-gold tracking-wide uppercase text-sm vehicle-column",
                  !isSidebarOpen ? "vehicle-column-closed" : "sidebar-overlay-active"
                )}>
                  {isSidebarOpen ? "Véhicule" : "#"}
                </th>
                
                {/* DAYS OF MONTH */}
                {daysInMonth.map(day => {
                  const isWeekend = [0, 6].includes(day.getDay());
                  const dayIsToday = isToday(day);
                  
                  return (
                    <th 
                      key={day.toISOString()} 
                      className={cn(
                        "p-2 text-center text-xs font-medium border-r border-luxury-border border-opacity-50 min-w-[30px] transition-colors relative",
                        isWeekend && !dayIsToday ? "bg-luxury-bg pb-6" : "",
                        dayIsToday ? "bg-luxury-gold/5 border-t-2 border-t-luxury-gold border-r-luxury-gold/50 border-l border-l-luxury-gold/50 shadow-[inset_0_4px_10px_rgba(212,175,55,0.1)]" : "border-t-2 border-t-transparent"
                      )}
                    >
                      {dayIsToday && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-luxury-gold min-w-[100%] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                      )}
                      <div className="flex flex-col items-center relative z-10">
                        <span className={cn(
                          "uppercase text-[10px] tracking-widest",
                          dayIsToday ? "text-luxury-gold font-bold" : "text-luxury-muted opacity-60"
                        )}>
                          {format(day, 'EEE', { locale: fr })}
                        </span>
                        <span className={cn(
                          "text-base font-mono mt-1", 
                          dayIsToday ? "text-white font-extrabold scale-110 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : (isWeekend ? "text-luxury-gold" : "text-white")
                        )}>
                          {format(day, 'dd')}
                        </span>
                      </div>
                    </th>
                  );
                })}
                
                {/* Stats Columns */}
                <th className="sticky right-0 z-20 bg-luxury-card border-l-2 border-luxury-border px-4 py-2 text-center font-medium text-luxury-muted text-xs uppercase tracking-widest min-w-[80px]">
                  Réservé
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody onTouchMove={handleTouchMove}>
              {filteredVehicles.map((vehicle, index) => {
                const vehicleTotalObj = stats.vehicleReservedDays.get(vehicle) || 0;
                
                return (
                  <tr 
                    key={vehicle} 
                    className="group border-b border-luxury-border hover:bg-luxury-card transition-colors"
                  >
                    {/* Sticky row label (vehicle) */}
                    <td 
                      className={cn(
                        "sticky left-0 z-20 bg-luxury-bg group-hover:bg-luxury-card border-r-2 border-luxury-border p-3 mr-4 cursor-pointer hover:text-luxury-gold transition-colors group/vehicle vehicle-column",
                        !isSidebarOpen ? "vehicle-column-closed" : "sidebar-overlay-active"
                      )}
                      onClick={() => {
                        setVehicleDetailsModal(vehicle);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                    >
                      <div className={cn(
                        "flex items-center justify-between overflow-hidden transition-all duration-300",
                        isSidebarOpen ? "w-[250px]" : "w-full justify-center"
                      )}>
                        {isSidebarOpen && (
                          <span className="text-sm font-medium truncate shrink min-w-0" title={vehicle}>
                            {vehicle}
                          </span>
                        )}
                        <div className={cn(
                          "flex items-center shrink-0 transition-all",
                          isSidebarOpen ? "space-x-2 ml-2" : "ml-0"
                        )}>
                          {isSidebarOpen && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setVehicleToDelete(vehicle);
                              }}
                              className="opacity-0 group-hover/vehicle:opacity-100 text-luxury-muted hover:text-status-red transition-all"
                              title="Supprimer le véhicule"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          <span className={cn(
                            "text-[10px] bg-white/5 rounded-full shrink-0 flex items-center justify-center font-bold",
                            isSidebarOpen ? "text-luxury-muted px-2 py-0.5" : "text-luxury-gold w-6 h-6 border border-luxury-gold/30"
                          )}>
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cells for each day */}
                    {daysInMonth.map(day => {
                      const key = getCellKey(day, vehicle);
                      const data = reservations[key];
                      const isWeekend = [0, 6].includes(day.getDay());
                      const isSelected = selectedKeys.includes(key);
                      
                      const isSearchMatch = searchTerm && data && (
                        data.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        data.telephone?.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                      const isVehicleMatch = searchTerm && vehicle.toLowerCase().includes(searchTerm.toLowerCase());
                      const isDimmed = searchTerm && data && !isSearchMatch && !isVehicleMatch;
                      const dayIsToday = isToday(day);
                      
                      const isMobile = window.innerWidth <= 768;
                      
                      return (
                        <td 
                          key={day.toISOString()} 
                          data-key={key}
                          data-reserved={!!data}
                          className={cn(
                            "border-r border-luxury-border relative aspect-auto p-1 cursor-pointer transition-all hover:brightness-125 saturate-150 transform hover:scale-[1.02] hover:z-10",
                            isWeekend && !dayIsToday ? "bg-white/5 border-opacity-30" : "border-opacity-30",
                            dayIsToday ? "bg-luxury-gold/5 border-r-luxury-gold/30 border-l border-l-luxury-gold/30" : ""
                          )}
                          onMouseDown={!isMobile ? () => handleCellMouseDown(key, data) : undefined}
                          onMouseEnter={!isMobile ? () => handleCellMouseEnter(key, !!data) : undefined}
                          onTouchStart={!isMobile ? () => handleCellMouseDown(key, data) : undefined}
                          onTouchMove={!isMobile ? handleTouchMove : undefined}
                        >
                          <div 
                            style={data?.color ? { backgroundColor: data.color, boxShadow: `0 0 10px ${data.color}` } : {}}
                            className={cn(
                              "w-full h-8 md:h-9 rounded-sm shadow-sm flex items-center justify-center transition-all duration-200 group/inner relative",
                              !data && !isSelected && "bg-[#444] border border-[#666] hover:bg-[#555] overflow-hidden",
                              !data && isSelected && "bg-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.6)] border border-[#60a5fa] text-white",
                              data && !data.color && "bg-status-red text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]",
                              data && data.color && "text-white",
                              isDimmed && "opacity-20 grayscale brightness-50"
                            )}
                            title={!data ? 'Disponible' : undefined}
                          >
                            {data ? (
                              <>
                                <span className="text-[10px] font-bold tracking-tight truncate px-1 uppercase text-white group-hover/inner:opacity-0 transition-opacity whitespace-nowrap">
                                  {data.nom?.substring(0, 5) || 'RÉS'}
                                </span>
                                
                                <div 
                                  style={data.color ? { backgroundColor: data.color, boxShadow: `0 4px 15px ${data.color}` } : {}}
                                  className={cn(
                                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/inner:opacity-100 group-hover/inner:pointer-events-auto z-50 rounded px-2.5 h-[44px] flex w-auto min-w-[max-content] items-center justify-center gap-4 transform scale-95 group-hover/inner:scale-100 transition-all duration-200 border border-white/10",
                                    !data.color && "bg-[#ff3333] shadow-[0_4px_15px_rgba(239,68,68,0.6)]"
                                  )}
                                >
                                  <div className="flex flex-col items-start translate-y-px">
                                    <span className="text-[11px] font-bold uppercase text-white tracking-widest drop-shadow-sm leading-none">
                                      {data.nom || 'RÉSERVÉ'}
                                    </span>
                                    {data.telephone && (
                                      <span className="text-[9px] text-white/80 font-mono tracking-wider leading-tight mt-1">
                                        {data.telephone}
                                      </span>
                                    )}
                                  </div>
                                  <button 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteDirect(day, vehicle);
                                    }}
                                    className="bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm self-center"
                                    title="Supprimer la réservation"
                                  >
                                    <X size={12} strokeWidth={2.5} />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className={cn("w-1.5 h-1.5 rounded-full flex-none", isSelected ? "bg-white" : "bg-[#aaa]")} />
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Stats per row */}
                    <td className="sticky right-0 z-20 bg-luxury-bg group-hover:bg-luxury-card border-l-2 border-luxury-border text-center">
                      <span className={cn(
                        "font-mono text-sm inline-block min-w-[30px]",
                        vehicleTotalObj > 0 ? "text-status-red" : "text-luxury-muted"
                      )}>
                        {vehicleTotalObj > 0 ? vehicleTotalObj : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Missing state if search empty */}
          {filteredVehicles.length === 0 && (
            <div className="p-12 text-center text-luxury-muted w-full left-0 right-0 flex flex-col items-center gap-4 justify-center">
              <Car size={48} className="opacity-20" />
              <p>Aucun véhicule trouvé.</p>
            </div>
          )}
        </div>
      </div>


      {/* EDIT MODAL OVERLAY */}
      {editingKeys.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div 
            className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden w-full max-w-sm border border-[#333] animate-in fade-in zoom-in-95 duration-200 relative flex flex-col"
          >
            <div 
              className="px-5 py-4 border-b border-[#333] flex justify-between items-center bg-[#111] shrink-0"
            >
              <h3 className="font-semibold text-lg text-white">Réservation</h3>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="text-sm bg-[#111] border border-[#333] rounded p-3 text-center space-y-1">
                {editingKeys.length === 1 ? (
                  <>
                    <p className="text-white font-medium">{editingKeys[0].split('_')[1]}</p>
                    <p className="uppercase text-xs text-luxury-gold tracking-wider">
                      {format(new Date(editingKeys[0].split('_')[0]), 'EEEE dd MMMM yyyy', { locale: fr })}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-white font-medium text-lg">{editingKeys.length} sélection(s)</p>
                    <p className="uppercase text-xs text-luxury-gold tracking-wider">Jours à réserver</p>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Nom du client</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                    placeholder="Nom complet"
                    autoFocus
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Téléphone</label>
                  <input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                    placeholder="N° de téléphone"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Apporteur (Requis)</label>
                  <input
                    type="text"
                    value={apporteur}
                    onChange={(e) => setApporteur(e.target.value)}
                    className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                    placeholder="Qui a ramené le client ?"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Versement</label>
                  <select
                    value={versement}
                    onChange={(e) => setVersement(e.target.value as 'oui' | 'non')}
                    className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                  >
                    <option value="non">Non</option>
                    <option value="oui">Oui</option>
                  </select>
                </div>

                {versement === 'oui' && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 fade-in">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Montant</label>
                    <input
                      type="text"
                      value={montant}
                      onChange={(e) => setMontant(e.target.value)}
                      className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                      placeholder="Ex: 500 €"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[#333] bg-[#111] flex justify-between gap-3">
              {editingKeys.some(key => reservations[key]) ? (
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium hover:text-white transition-colors text-gray-400 hover:bg-white/5 rounded"
                >
                  Libérer
                </button>
              ) : (
                <div></div>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium hover:text-white transition-colors text-gray-400"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-status-red hover:bg-[#ff3333] text-white font-semibold rounded shadow transition-all hover:scale-[1.02] active:scale-95"
                >
                  {editingKeys.some(key => reservations[key]) ? "Mettre à jour" : `Réserver ${editingKeys.length} jour${editingKeys.length > 1 ? 's' : ''}`}
                </button>
              </div>
            </div>

            {/* Standardized Close Button */}
            <button onClick={closeModal} className="close-btn" title="Fermer">
              <X size={18} />
            </button>
          </div>
        </div>
      )}


      {/* VEHICLE DETAILS MODAL */}
      {vehicleDetailsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setVehicleDetailsModal(null); }}
        >
          <div 
            className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl border border-[#333] animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] relative"
          >
            <div 
              className="px-5 py-4 border-b border-[#333] flex justify-between items-center bg-[#111] shrink-0"
            >
              <div className="flex items-center gap-3">
                <div className="bg-luxury-gold/10 p-1.5 rounded text-luxury-gold">
                  <Car size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{vehicleDetailsModal}</h3>
                  <p className="text-xs text-luxury-gold tracking-widest uppercase">Historique des réservations</p>
                </div>
              </div>
            </div>
            
            <div className="p-0 overflow-auto flex-1 bg-black/20">
              {(() => {
                const vehicleReservations = Object.entries(reservations)
                  .filter(([key]) => key.split('_')[1] === vehicleDetailsModal)
                  .map(([key, data]) => {
                    const resData: Reservation = data || {};
                    return { dateStr: key.split('_')[0], ...resData };
                  })
                  .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

                if (vehicleReservations.length === 0) {
                  return (
                    <div className="p-12 text-center text-luxury-muted flex flex-col items-center gap-3">
                      <CalendarIcon size={32} className="opacity-20" />
                      <p>Aucune réservation pour ce véhicule.</p>
                    </div>
                  );
                }

                return (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#111] sticky top-0 z-10 border-b border-[#333]">
                      <tr>
                        <th className="px-5 py-3 font-medium text-gray-400 uppercase tracking-wider text-xs">Date</th>
                        <th className="px-5 py-3 font-medium text-gray-400 uppercase tracking-wider text-xs">Client</th>
                        <th className="px-5 py-3 font-medium text-gray-400 uppercase tracking-wider text-xs">Téléphone</th>
                        <th className="px-5 py-3 font-medium text-gray-400 uppercase tracking-wider text-xs text-right">Versement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {vehicleReservations.map((res, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3 font-mono text-luxury-gold">
                            {format(new Date(res.dateStr), 'dd/MM/yyyy')}
                          </td>
                          <td className="px-5 py-3 text-white font-medium">
                            <div className="flex items-center gap-2">
                              {res.color && (
                                <div 
                                  className="w-2.5 h-2.5 rounded-full flex-none shadow-sm" 
                                  style={{ backgroundColor: res.color, boxShadow: `0 0 8px ${res.color}` }} 
                                />
                              )}
                              <span>{res.nom || '-'}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-luxury-muted font-mono">
                            {res.telephone || '-'}
                          </td>
                          <td className="px-5 py-3 text-right">
                            {res.versement === 'oui' ? (
                              <span className="bg-status-green/20 text-status-green px-2 py-1 rounded text-xs font-semibold">
                                {res.montant || 'OUI'}
                              </span>
                            ) : (
                              <span className="text-luxury-muted text-xs uppercase">Non</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            <div className="p-4 border-t border-[#333] bg-[#111] flex justify-end shrink-0">
              <button 
                onClick={() => setVehicleDetailsModal(null)}
                className="px-6 py-2 bg-[#222] hover:bg-[#333] text-white font-semibold rounded shadow transition-all active:scale-95 border border-[#444]"
              >
                Fermer
              </button>
            </div>

            {/* Standardized Close Button */}
            <button onClick={() => setVehicleDetailsModal(null)} className="close-btn" title="Fermer">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* DELETE VEHICLE MODAL */}
      {vehicleToDelete && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setVehicleToDelete(null); }}
        >
          <div 
            className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl border border-[#333] animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] relative"
          >
            <div 
              className="px-5 py-4 border-b border-[#333] flex justify-between items-center bg-[#111] shrink-0"
            >
              <div className="flex items-center gap-3">
                <div className="bg-status-red/20 p-1.5 rounded text-status-red">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Supprimer le véhicule</h3>
                  <p className="text-[10px] text-status-red uppercase tracking-widest font-bold">Action irréversible</p>
                </div>
              </div>
            </div>
            
            <div className="p-0 overflow-auto flex-1 bg-black/20">
              {(() => {
                const vehicleReservations = Object.entries(reservations)
                  .filter(([key]) => key.split('_')[1] === vehicleToDelete)
                  .map(([key, data]) => {
                    const resData: Reservation = data || {};
                    return { dateStr: key.split('_')[0], ...resData };
                  })
                  .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

                if (vehicleReservations.length === 0) {
                  return (
                    <div className="p-12 text-center text-luxury-muted flex flex-col items-center gap-3">
                      <CalendarIcon size={32} className="opacity-20" />
                      <p>Ce véhicule n'a aucune réservation.</p>
                      <p className="text-sm">Il peut être supprimé en toute sécurité.</p>
                    </div>
                  );
                }

                const totalRevenue = vehicleReservations.reduce((sum, res) => {
                  let val = parseInt(res.montant || '0', 10);
                  if (isNaN(val)) val = 0;
                  return sum + val;
                }, 0);

                return (
                  <div>
                    <div className="px-5 py-3 border-b border-[#333] bg-[#0a0a0a] flex justify-between items-center sticky top-0 z-20">
                      <div className="text-sm">
                        <span className="text-gray-400">Total des réservations : </span>
                        <span className="text-white font-bold">{vehicleReservations.length}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Revenus totaux : </span>
                        <span className="text-luxury-gold font-mono font-bold">{totalRevenue.toLocaleString('fr-DZ')} DA</span>
                      </div>
                    </div>
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#111] sticky top-[48px] z-10 border-b border-[#333]">
                        <tr>
                          <th className="px-5 py-3 font-medium text-gray-400 uppercase tracking-wider text-xs">Date</th>
                          <th className="px-5 py-3 font-medium text-gray-400 uppercase tracking-wider text-xs">Client</th>
                          <th className="px-5 py-3 font-medium text-gray-400 uppercase tracking-wider text-xs">Téléphone</th>
                          <th className="px-5 py-3 font-medium text-gray-400 uppercase tracking-wider text-xs text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222]">
                        {vehicleReservations.map((res, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-5 py-3 font-mono text-luxury-gold">
                              {format(new Date(res.dateStr), 'dd/MM/yyyy')}
                            </td>
                            <td className="px-5 py-3 text-white font-medium">
                              <div className="flex items-center gap-2">
                                {res.color && (
                                  <div 
                                    className="w-2.5 h-2.5 rounded-full flex-none shadow-sm" 
                                    style={{ backgroundColor: res.color, boxShadow: `0 0 8px ${res.color}` }} 
                                  />
                                )}
                                <span>{res.nom || '-'}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-luxury-muted font-mono">
                              {res.telephone || '-'}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {res.versement === 'oui' ? (
                                <span className="bg-status-green/20 text-status-green px-2 py-1 rounded text-xs font-semibold">
                                  {res.montant || 'OUI'}
                                </span>
                              ) : (
                                <span className="text-luxury-muted text-xs uppercase">Non</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t border-[#333] bg-[#111] flex justify-between shrink-0">
              <button 
                onClick={() => setVehicleToDelete(null)}
                className="px-6 py-2 text-sm font-medium hover:text-white transition-colors text-gray-400 hover:bg-white/5 rounded"
              >
                Annuler
              </button>
              <button 
                onClick={handleConfirmDeleteVehicle}
                className="px-6 py-2 bg-status-red hover:bg-[#ff3333] text-white font-semibold rounded shadow transition-all active:scale-95 flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span className="truncate max-w-[200px]">Supprimer {vehicleToDelete}</span>
              </button>
            </div>

            {/* Standardized Close Button */}
            <button onClick={() => setVehicleToDelete(null)} className="close-btn" title="Fermer">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* NEW VEHICLE MODAL */}
      {newVehicleModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setNewVehicleModalOpen(false); }}
        >
          <div 
            className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden w-full max-w-sm border border-luxury-gold/30 animate-in fade-in zoom-in-95 duration-200 relative flex flex-col"
          >
            <div 
              className="px-5 py-4 border-b border-[#333] flex justify-between items-center bg-[#111] shrink-0"
            >
              <div className="flex items-center gap-2 text-luxury-gold">
                <Plus size={18} />
                <h3 className="font-semibold text-lg text-white">Nouveau Véhicule</h3>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Nom du véhicule</label>
                <input
                  type="text"
                  value={newVehicleName}
                  onChange={(e) => setNewVehicleName(e.target.value)}
                  className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                  placeholder="EX: RANGE ROVER VELAR"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#333] bg-[#111]">
              <button 
                onClick={handleAddVehicle}
                className="w-full py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-black font-bold rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Ajouter le véhicule
              </button>
            </div>

            {/* Standardized Close Button */}
            <button onClick={() => setNewVehicleModalOpen(false)} className="close-btn" title="Fermer">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* APPORTEURS RANKING MODAL */}
      {rankingModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setRankingModalOpen(false); }}
        >
          <div 
            className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl border border-luxury-gold/30 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] relative"
          >
            <div 
              className="px-5 py-5 border-b border-[#333] flex justify-between items-center bg-[#111] shrink-0"
            >
              <div className="flex items-center gap-3">
                <div className="bg-luxury-gold/20 p-2 rounded-full text-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Classement Apporteurs</h3>
                  <p className="text-[10px] text-luxury-gold uppercase tracking-widest font-bold">Meilleurs générateurs d'affaires</p>
                </div>
              </div>
            </div>
            
            <div className="p-0 overflow-auto flex-1 bg-black/20">
              {ranking.length === 0 ? (
                <div className="p-16 text-center text-luxury-muted flex flex-col items-center gap-4">
                  <Trophy size={48} className="opacity-10" />
                  <p>Aucun apporteur enregistré pour le moment.</p>
                </div>
              ) : (
                <div>
                  <div className="px-5 py-3 border-b border-[#333] bg-[#0a0a0a] flex justify-between items-center sticky top-0 z-20">
                    <span className="text-sm font-medium text-gray-400">Trier par:</span>
                    <div className="flex bg-[#111] border border-[#333] rounded-md p-0.5">
                      <button
                        onClick={() => setRankingSortBy('clients')}
                        className={cn(
                          "px-4 py-1.5 text-xs font-semibold rounded transition-colors",
                          rankingSortBy === 'clients' ? "bg-luxury-gold text-black" : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        Clients
                      </button>
                      <button
                        onClick={() => setRankingSortBy('revenue')}
                        className={cn(
                          "px-4 py-1.5 text-xs font-semibold rounded transition-colors",
                          rankingSortBy === 'revenue' ? "bg-luxury-gold text-black" : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        Revenus
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {ranking.map((r, index) => (
                      <div 
                        key={r.name} 
                        className="bg-[#111] border border-[#333] rounded-lg p-4 flex items-center justify-between hover:border-luxury-gold/50 transition-colors shadow-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner",
                            index === 0 ? "bg-luxury-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]" :
                            index === 1 ? "bg-gray-300 text-black shadow-[0_0_15px_rgba(209,213,219,0.5)]" :
                            index === 2 ? "bg-[#CD7F32] text-black shadow-[0_0_15px_rgba(205,127,50,0.5)]" :
                            "bg-white/10 text-gray-400"
                          )}>
                            #{index + 1}
                          </div>
                          <div>
                            <h4 className="text-white font-medium text-base truncate max-w-[150px] sm:max-w-[200px]">{r.name}</h4>
                            <p className="text-xs text-luxury-muted">
                              {r.clients} client{r.clients > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "font-mono font-bold text-sm sm:text-base",
                            index === 0 ? "text-luxury-gold" : "text-white"
                          )}>
                            {r.revenue.toLocaleString('fr-DZ')} DA
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#333] bg-[#111] flex justify-end shrink-0">
              <button 
                onClick={() => setRankingModalOpen(false)}
                className="px-8 py-2.5 bg-[#222] hover:bg-[#333] text-white font-semibold rounded shadow transition-all active:scale-95 border border-[#444]"
              >
                Fermer
              </button>
            </div>

            {/* Standardized Close Button */}
            <button onClick={() => setRankingModalOpen(false)} className="close-btn" title="Fermer">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div className={cn(
        "fixed bottom-6 right-6 z-[100] transition-all duration-300 transform",
        toast?.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "bg-[#111] border text-white px-5 py-3.5 rounded-lg shadow-xl flex items-center gap-3",
          toast?.type === 'success' ? "border-status-green/50 shadow-[0_4px_20px_rgba(34,197,94,0.15)]" : 
          toast?.type === 'error' ? "border-status-red/50 shadow-[0_4px_20px_rgba(239,68,68,0.2)]" :
          "border-[#444] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        )}>
          {toast?.type === 'success' ? (
            <CheckCircle2 className="text-status-green" size={20} />
          ) : (
            <Info className="text-gray-400" size={20} />
          )}
          <span className="text-sm font-medium tracking-wide">{toast?.message}</span>
        </div>
      </div>

      {/* UPCOMING ALERTS (J-3) */}
      <div className="fixed top-20 right-4 md:right-8 z-[100] flex flex-col pointer-events-none">
        {upcomingAlerts.map(alert => (
          <UpcomingAlertToast 
            key={alert.id} 
            message={alert.message} 
            onClose={() => setUpcomingAlerts(prev => prev.filter(a => a.id !== alert.id))} 
          />
        ))}
      </div>

      {/* MANUAL RESERVATION MODAL (IPHONE STYLE) */}
      {manualModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setManualModalOpen(false); }}
        >
          <div 
            className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden w-full max-w-sm border border-luxury-gold/30 animate-in fade-in zoom-in-95 duration-200 modal-bottom-sheet relative flex flex-col"
          >
            <div 
              className="px-5 py-4 border-b border-[#333] flex justify-between items-center bg-[#111] shrink-0"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-luxury-gold" />
                <h3 className="font-semibold text-lg text-white">Réserver par dates</h3>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Véhicule</label>
                <select
                  value={manualVehicle}
                  onChange={(e) => setManualVehicle(e.target.value)}
                  className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                >
                  <option value="">Sélectionner un véhicule...</option>
                  {allVehicles.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Début</label>
                  <input
                    type="date"
                    value={manualStartDate}
                    onChange={(e) => setManualStartDate(e.target.value)}
                    className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Fin</label>
                  <input
                    type="date"
                    value={manualEndDate}
                    onChange={(e) => setManualEndDate(e.target.value)}
                    className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="w-full h-px bg-[#333] my-4" />

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Nom du client</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold"
                  placeholder="Nom complet"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Téléphone</label>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold"
                  placeholder="Optionnel"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Apporteur (Requis)</label>
                <input
                  type="text"
                  value={apporteur}
                  onChange={(e) => setApporteur(e.target.value)}
                  className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                  placeholder="Qui a ramené le client ?"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#333] bg-[#111] flex flex-col gap-2">
              <button 
                onClick={handleManualReserve}
                className="w-full py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-black font-bold rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Confirmer la réservation
              </button>
              <button 
                onClick={() => setManualModalOpen(false)}
                className="w-full py-2.5 text-sm font-medium text-gray-400 hover:text-white"
              >
                Annuler
              </button>
            </div>

            {/* Standardized Close Button */}
            <button onClick={() => setManualModalOpen(false)} className="close-btn" title="Fermer">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION (IPHONE STYLE) */}
      <nav className="bottom-nav md:hidden">
        <button 
          onClick={() => {
            setNom('');
            setTelephone('');
            setApporteur('');
            setManualVehicle('');
            setManualModalOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-1 text-luxury-gold"
        >
          <div className="bg-luxury-gold/10 p-2 rounded-xl">
            <Plus size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Réserver</span>
        </button>

        <button 
          onClick={() => setRankingModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
        >
          <Trophy size={20} />
          <span className="text-[10px] font-medium uppercase tracking-widest">Classement</span>
        </button>

        <button 
          onClick={() => setNewVehicleModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
        >
          <Plus size={20} />
          <span className="text-[10px] font-medium uppercase tracking-widest">Voiture</span>
        </button>

        <button 
          onClick={async () => await supabase.auth.signOut()}
          className="flex flex-col items-center justify-center gap-1 text-[#ff4444]/60"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium uppercase tracking-widest">Quitter</span>
        </button>
      </nav>
    </div>
  );
}
