import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './authContext';
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    let authTimer;
    const load = async (nextSession) => {
      if (!nextSession?.user) {
        if (mounted) { setSession(null); setProfile(null); setLoading(false); }
        return;
      }
      const { data } = await supabase.from('admin_profiles').select('id, role, active').eq('id', nextSession.user.id).eq('active', true).maybeSingle();
      if (mounted) { setSession(nextSession); setProfile(data ?? null); setLoading(false); }
    };
    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setLoading(true);
      authTimer = window.setTimeout(() => load(nextSession), 0);
    });
    return () => {
      mounted = false;
      window.clearTimeout(authTimer);
      data.subscription.unsubscribe();
    };
  }, []);
  const value = useMemo(() => ({ session, user: session?.user ?? null, profile, loading, isAdmin: Boolean(profile?.active), signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }), signOut: () => supabase.auth.signOut() }), [session, profile, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
