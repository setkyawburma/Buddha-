import React, { useState, useEffect, useRef } from 'react';
import { Home, Book, Sun, Moon, Settings as SettingsIcon, Heart, Play, Pause, FastForward, Rewind, ArrowLeft, ChevronRight } from 'lucide-react';

interface Prayer {
  id: string;
  titleMyanmar: string;
  titlePali?: string;
  categoryId: string;
  paliText?: string;
  burmeseText: string;
  translation?: string;
}

const CATEGORIES = [
  { id: '1', titleMyanmar: 'ဘုရားရှိခိုး', titleEnglish: 'Buddha Vandana' },
  { id: '2', titleMyanmar: 'သရဏဂုံ', titleEnglish: 'Three Refuges' },
  { id: '3', titleMyanmar: 'ငါးပါးသီလ', titleEnglish: 'Five Precepts' },
  { id: '4', titleMyanmar: 'ပရိတ်တရားတော်များ', titleEnglish: 'Parittas' },
  { id: '5', titleMyanmar: 'မေတ္တာပို့', titleEnglish: 'Metta' }
];

const PRAYERS: Prayer[] = [
  {
    id: 'p1',
    titleMyanmar: 'နမောတဿ',
    titlePali: 'Namo Tassa',
    categoryId: '1',
    paliText: 'နမော တဿ ဘဂဝတော အရဟတော သမ္မာသမ္ဗုဒ္ဓဿ။',
    burmeseText: 'အရဟတော - လူနတ်ဗြဟ္မာတို့၏ ပူဇော်အထူးကို ခံယူတော်မူထိုက်ပါပေသော၊ ...',
    translation: 'Homage to the Blessed One, the Exalted One, the Fully Enlightened One.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activePrayer, setActivePrayer] = useState<Prayer | null>(null);
  
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const savedDark = localStorage.getItem('phayarsar-dark');
    if (savedDark) setDarkMode(savedDark === 'true');
    const savedFavs = localStorage.getItem('phayarsar-favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  useEffect(() => {
    localStorage.setItem('phayarsar-dark', darkMode.toString());
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('phayarsar-favs', JSON.stringify(newFavs));
  };

  const renderContent = () => {
    if (activePrayer) {
      return <PrayerReader prayer={activePrayer} onBack={() => setActivePrayer(null)} fontSize={fontSize} isFav={favorites.includes(activePrayer.id)} onToggleFav={() => toggleFavorite(activePrayer.id)} />;
    }
    
    switch (activeTab) {
      case 'home': return <HomeTab onSelect={setActivePrayer} />;
      case 'prayers': return <PrayersTab onSelect={setActivePrayer} />;
      case 'daily': return <DailyTab onSelect={setActivePrayer} />;
      case 'favorites': return <FavoritesTab onSelect={setActivePrayer} favs={favorites} />;
      case 'settings': return <SettingsTab darkMode={darkMode} setDarkMode={setDarkMode} fontSize={fontSize} setFontSize={setFontSize} />;
      default: return <HomeTab onSelect={setActivePrayer} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-20 flex flex-col items-center transition-colors duration-300">
      <main className="w-full max-w-2xl px-4 py-6 md:py-12 flex-1">
        {renderContent()}
      </main>
      
      {!activePrayer && (
        <nav className="fixed bottom-0 left-0 w-full bg-ivory dark:bg-darkink border-t border-neutralgray dark:border-forest md:w-20 md:h-full md:flex-col md:border-r md:border-t-0 flex justify-around p-4 z-50">
          <NavItem icon={<Home />} label="ပင်မ" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<Book />} label="ဘုရားစာ" active={activeTab === 'prayers'} onClick={() => setActiveTab('prayers')} />
          <NavItem icon={<Sun />} label="နေ့စဉ်" active={activeTab === 'daily'} onClick={() => setActiveTab('daily')} />
          <NavItem icon={<Heart />} label="နှစ်သက်" active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
          <NavItem icon={<SettingsIcon />} label="ပြင်ဆင်" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-forest dark:text-darkforest' : 'text-gray-500 hover:text-ink dark:hover:text-ivory'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      <span className="text-xs font-burmese">{label}</span>
    </button>
  );
}

function HomeTab({ onSelect }: { onSelect: (p: Prayer) => void }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="text-center space-y-2 mt-8">
        <h1 className="text-3xl font-burmese font-bold text-forest dark:text-darkforest">ဘုရားစာ</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Buddhist Prayers & Daily Chanting</p>
      </header>
      
      <div className="bg-white dark:bg-[#1f221f] p-6 rounded-2xl shadow-sm border border-neutralgray dark:border-forest/30">
        <h2 className="text-xl font-burmese mb-2">ယနေ့ ဘုရားရှိခိုးကြမယ်</h2>
        <p className="text-sm opacity-70 mb-4">Start your daily morning devotion.</p>
        <button onClick={() => onSelect(PRAYERS[0])} className="w-full py-3 bg-forest text-ivory rounded-lg flex items-center justify-center gap-2 hover:bg-forest/90 transition-colors">
          <Play size={18} /> Continue Reading
        </button>
      </div>
      
      <div>
        <h3 className="font-burmese mb-4 text-lg border-b border-neutralgray dark:border-forest/30 pb-2">Browse Categories</h3>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.slice(0,4).map(c => (
            <button key={c.id} className="p-4 text-left border border-neutralgray dark:border-forest/30 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition">
              <div className="font-burmese font-bold">{c.titleMyanmar}</div>
              <div className="text-xs opacity-60 mt-1">{c.titleEnglish}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrayersTab({ onSelect }: { onSelect: (p: Prayer) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-burmese font-bold mb-6">ဘုရားစာများ</h2>
      {CATEGORIES.map(c => (
        <div key={c.id} className="space-y-3">
          <h3 className="text-lg font-burmese text-forest dark:text-darkforest">{c.titleMyanmar}</h3>
          <div className="space-y-2">
            {PRAYERS.filter(p => p.categoryId === c.id).map(p => (
              <button key={p.id} onClick={() => onSelect(p)} className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1f221f] rounded-xl border border-neutralgray dark:border-forest/30 hover:border-gold transition-colors">
                <span className="font-burmese">{p.titleMyanmar}</span>
                <ChevronRight size={18} className="opacity-50" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyTab({ onSelect }: { onSelect: (p: Prayer) => void }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-burmese font-bold mb-6">နေ့စဉ်ဝတ်ရွတ်စဉ်</h2>
      <div className="bg-white dark:bg-[#1f221f] rounded-2xl border border-neutralgray dark:border-forest/30 overflow-hidden">
        <div className="p-4 bg-forest/10 border-b border-neutralgray dark:border-forest/30">
          <h3 className="font-burmese font-bold">Morning Routine (နံနက်ခင်း)</h3>
        </div>
        <div className="p-2">
          {PRAYERS.map((p, i) => (
             <button key={p.id} onClick={() => onSelect(p)} className="w-full flex items-center gap-3 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-left transition-colors">
               <div className="w-6 h-6 rounded-full bg-forest/20 text-forest flex items-center justify-center text-xs">{i+1}</div>
               <span className="font-burmese flex-1">{p.titleMyanmar}</span>
             </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FavoritesTab({ onSelect, favs }: { onSelect: (p: Prayer) => void, favs: string[] }) {
  const favoritePrayers = PRAYERS.filter(p => favs.includes(p.id));
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-burmese font-bold mb-6">အနှစ်သက်ဆုံး</h2>
      {favoritePrayers.length === 0 ? (
        <p className="text-center opacity-50 py-12">No favorite prayers yet.</p>
      ) : (
        <div className="space-y-2">
          {favoritePrayers.map(p => (
            <button key={p.id} onClick={() => onSelect(p)} className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1f221f] rounded-xl border border-neutralgray dark:border-forest/30 transition-colors hover:border-gold">
              <span className="font-burmese">{p.titleMyanmar}</span>
              <Heart size={18} className="text-red-500 fill-red-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({ darkMode, setDarkMode, fontSize, setFontSize }: { darkMode: boolean, setDarkMode: (v: boolean) => void, fontSize: number, setFontSize: (v: number) => void }) {
  return (
    <div className="space-y-6 font-burmese animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">အပြင်အဆင်</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1f221f] rounded-xl border border-neutralgray dark:border-forest/30">
          <span>Dark Mode (ညဖတ်)</span>
          <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-forest' : 'bg-gray-300'}`}>
             <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${darkMode ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        
        <div className="p-4 bg-white dark:bg-[#1f221f] rounded-xl border border-neutralgray dark:border-forest/30 space-y-4">
          <div className="flex justify-between items-center">
            <span>Font Size (စာလုံးအရွယ်အစား)</span>
            <span className="font-sans">{fontSize}px</span>
          </div>
          <input type="range" min="14" max="32" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-forest" />
        </div>
      </div>
    </div>
  );
}

function PrayerReader({ prayer, onBack, fontSize, isFav, onToggleFav }: { prayer: Prayer, onBack: () => void, fontSize: number, isFav: boolean, onToggleFav: () => void }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  const scroll = () => {
    if (isScrolling && contentRef.current) {
      window.scrollBy(0, speed);
      requestRef.current = requestAnimationFrame(scroll);
    }
  };

  useEffect(() => {
    if (isScrolling) requestRef.current = requestAnimationFrame(scroll);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isScrolling, speed]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (e.isTrusted && isScrolling) setIsScrolling(false);
    };
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchmove', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [isScrolling]);

  return (
    <div className="min-h-screen pb-32 animate-fade-in">
      <header className="sticky top-0 bg-ivory/90 dark:bg-darkink/90 backdrop-blur-md p-4 flex items-center justify-between border-b border-neutralgray dark:border-forest/30 z-40 mb-8 -mx-4 px-4 transition-colors duration-300">
        <button onClick={onBack} className="p-2 -ml-2 text-forest dark:text-darkforest hover:opacity-80 transition-opacity"><ArrowLeft /></button>
        <span className="font-burmese font-bold truncate max-w-[200px] text-center">{prayer.titleMyanmar}</span>
        <button onClick={onToggleFav} className="p-2 -mr-2 hover:opacity-80 transition-opacity">
          <Heart size={22} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
        </button>
      </header>

      <div ref={contentRef} style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }} className="font-burmese max-w-prose mx-auto text-justify space-y-6">
        {prayer.titlePali && <h2 className="text-center text-gold font-bold mb-8 text-xl">{prayer.titlePali}</h2>}
        
        {prayer.paliText && (
          <div className="p-6 bg-black/5 dark:bg-white/5 rounded-2xl mb-8">
            <p className="font-bold text-forest dark:text-darkforest text-center leading-[2.5]">{prayer.paliText}</p>
          </div>
        )}
        
        <p className="whitespace-pre-wrap">{prayer.burmeseText}</p>
        
        {prayer.translation && (
          <p className="mt-8 pt-8 border-t border-neutralgray/50 opacity-80 text-sm font-sans italic">{prayer.translation}</p>
        )}
      </div>
      
      {/* Floating Auto-Scroll Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white dark:bg-white dark:text-ink px-6 py-3 rounded-full flex items-center gap-6 shadow-xl z-50 transition-colors duration-300">
        <button onClick={() => setSpeed(s => Math.max(0.5, s - 0.5))} className="hover:opacity-70 transition-opacity"><Rewind size={20}/></button>
        <button onClick={() => setIsScrolling(!isScrolling)} className="bg-forest text-white p-3 rounded-full shadow-lg hover:bg-forest/80 transition-colors">
          {isScrolling ? <Pause fill="currentColor" size={24}/> : <Play fill="currentColor" size={24}/>}
        </button>
        <button onClick={() => setSpeed(s => Math.min(3, s + 0.5))} className="hover:opacity-70 transition-opacity"><FastForward size={20}/></button>
      </div>
    </div>
  );
}
