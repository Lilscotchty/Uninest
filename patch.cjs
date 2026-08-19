const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(`  const fetchProfile = async (userId: string) => {
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) setProfile(data as UserProfile);
    setProfileLoading(false);
  };`, `  const fetchProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) setProfile(data as UserProfile);
    } catch (err) {
      console.warn("Failed to fetch profile", err);
    }
    setProfileLoading(false);
  };`);

code = code.replace(`      }
      else {
        if (!isAuthRedirect) setProfileLoading(false);
      }
    });`, `      }
      else {
        if (!isAuthRedirect) setProfileLoading(false);
      }
    }).catch(err => {
      console.warn("Failed to get session", err);
      setProfileLoading(false);
    });`);

code = code.replace(`      } catch (err) {
        console.error("Error fetching properties:", err);
      }`, `      } catch (err) {
        console.warn("Error fetching properties, using local fallback data", err);
      }`);

fs.writeFileSync('src/context/AppContext.tsx', code);
