import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsMfa, setNeedsMfa] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function getAuth() {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (mounted) {
        if (error) {
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
             const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
             setNeedsMfa(aal.data?.nextLevel === "aal2" && aal.data?.currentLevel !== "aal2");
          }
        }
        setLoading(false);
      }
    }

    getAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
             const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
             setNeedsMfa(aal.data?.nextLevel === "aal2" && aal.data?.currentLevel !== "aal2");
          } else {
             setNeedsMfa(false);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, needsMfa };
}
