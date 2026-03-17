import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
  { id: 'individual', icon: '🧑‍🍳', title: 'Individual User', subtitle: 'Donate surplus food', description: 'Have leftover food from a party or event? Donate it to those who need it most.', color: 'from-orange-50 to-amber-50', border: 'border-orange-200', accent: 'bg-orange-100 text-orange-700', btn: 'bg-primary-500 hover:bg-primary-600' },
  { id: 'banquet', icon: '🏛️', title: 'Banquet / Marriage Hall', subtitle: 'Schedule food donations', description: 'Large events always have excess food. Plan ahead and coordinate food pickups.', color: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', accent: 'bg-emerald-100 text-emerald-700', btn: 'bg-forest-600 hover:bg-forest-700' },
  { id: 'public', icon: '📢', title: 'Public Reporter', subtitle: 'Report food wastage', description: 'Spotted food being wasted? Report it and help authorities take action.', color: 'from-sky-50 to-blue-50', border: 'border-sky-200', accent: 'bg-sky-100 text-sky-700', btn: 'bg-sky-600 hover:bg-sky-700' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (user) { navigate('/dashboard'); return null; }

  return (
    <div className="min-h-screen">
      <section className="hero-gradient relative overflow-hidden py-24 px-4">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-lg">🌱</span>
            <span className="text-sm font-medium text-gray-700">Fighting food waste, one meal at a time</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 mb-6 leading-tight">
            Turning Surplus<br /><span className="text-primary-500">Into Purpose</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 font-light leading-relaxed">
            FoodBridge connects food donors, banquet halls, and community reporters to minimize food waste and feed those in need.
          </p>
          <div className="flex justify-center gap-8 mt-10 text-sm font-medium text-gray-500">
            <div className="flex flex-col items-center gap-1"><span className="text-3xl font-display font-bold text-primary-500">2.4M+</span><span>Meals Saved</span></div>
            <div className="w-px bg-gray-200" />
            <div className="flex flex-col items-center gap-1"><span className="text-3xl font-display font-bold text-forest-600">12K+</span><span>Active Donors</span></div>
            <div className="w-px bg-gray-200" />
            <div className="flex flex-col items-center gap-1"><span className="text-3xl font-display font-bold text-sky-600">850+</span><span>Cities Covered</span></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-3">Choose Your Role</h2>
            <p className="text-gray-500 text-lg">Select how you want to contribute to reducing food waste</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <div key={role.id} className={`role-card rounded-3xl border-2 ${role.border} bg-gradient-to-br ${role.color} p-8 flex flex-col cursor-pointer`}>
                <div className={`w-16 h-16 rounded-2xl ${role.accent} flex items-center justify-center text-3xl mb-5 shadow-sm`}>{role.icon}</div>
                <span className={`inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${role.accent} w-fit mb-3`}>{role.subtitle}</span>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1">{role.description}</p>
                <div className="flex gap-3">
                  <button onClick={() => navigate(`/register/${role.id}`)} className={`flex-1 ${role.btn} text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 hover:shadow-md active:scale-95`}>Register</button>
                  <button onClick={() => navigate(`/login/${role.id}`)} className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-sm border border-gray-200 transition-all duration-200 hover:shadow-sm active:scale-95">Login</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-14">How FoodBridge Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: '📝', title: 'Sign Up', desc: 'Register with your role and start contributing to the mission.' },
              { step: '02', icon: '🍱', title: 'Report / Donate', desc: 'List surplus food, schedule pickups, or report wastage incidents.' },
              { step: '03', icon: '🤝', title: 'Make Impact', desc: 'Food reaches those in need, and waste is tracked and reduced.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="relative mb-5">
                  <span className="text-8xl font-display font-black text-gray-100 select-none leading-none">{item.step}</span>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">{item.icon}</div>
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}