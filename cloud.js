(function(){
  const CFG=window.LGS_CLOUD_CONFIG||{};
  const clients={};
  function configured(){return !!(CFG.url&&CFG.publishableKey&&window.supabase?.createClient)}
  function c(mode='student'){
    if(!configured()) throw new Error('Bulut yapılandırması tamamlanmamış.');
    if(!clients[mode]) clients[mode]=window.supabase.createClient(CFG.url,CFG.publishableKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:`lgs2027-${mode}-auth`}
    });
    return clients[mode];
  }
  function msg(e){return e?.message||String(e||'Bilinmeyen hata')}
  async function session(mode){const {data,error}=await c(mode).auth.getSession();if(error)throw error;return data.session}
  async function signUpParent(email,password){
    const {data,error}=await c('parent').auth.signUp({email,password}); if(error)throw error;
    return {session:data.session,user:data.user,needsConfirmation:!data.session};
  }
  async function signInParent(email,password){const {data,error}=await c('parent').auth.signInWithPassword({email,password});if(error)throw error;return data;}
  async function signOutParent(){const {error}=await c('parent').auth.signOut();if(error)throw error;}
  async function parentFamily(){const s=await session('parent');if(!s)return null;const {data,error}=await c('parent').from('families').select('*').eq('owner_id',s.user.id).maybeSingle();if(error)throw error;return data;}
  async function createFamily(familyName,studentName){const {data,error}=await c('parent').rpc('create_family',{p_family_name:familyName,p_student_name:studentName});if(error)throw error;return Array.isArray(data)?data[0]:data;}
  async function createPairingCode(){const {data,error}=await c('parent').rpc('create_pairing_code');if(error)throw error;return Array.isArray(data)?data[0]:data;}
  async function parentSnapshots(){const fam=await parentFamily();if(!fam)return {family:null,snapshots:[]};const {data,error}=await c('parent').from('student_snapshots').select('*').eq('family_id',fam.id).order('updated_at',{ascending:false});if(error)throw error;return {family:fam,snapshots:data||[]};}
  async function ensureStudentSession(){let s=await session('student');if(s)return s;const {data,error}=await c('student').auth.signInAnonymously();if(error)throw error;return data.session;}
  async function studentLink(){const s=await session('student');if(!s)return null;const {data,error}=await c('student').from('family_members').select('family_id,created_at').eq('user_id',s.user.id).maybeSingle();if(error)throw error;return data;}
  async function claimPairingCode(code){await ensureStudentSession();const clean=String(code||'').replace(/\D/g,'').slice(0,8);if(clean.length!==8)throw new Error('Eşleştirme kodu 8 haneli olmalı.');const {data,error}=await c('student').rpc('claim_pairing_code',{p_code:clean});if(error)throw error;return Array.isArray(data)?data[0]:data;}
  async function pushStudentSnapshot(payload){
    const s=await session('student'); if(!s)return {ok:false,reason:'no-session'};
    const link=await studentLink(); if(!link)return {ok:false,reason:'not-linked'};
    const row={family_id:link.family_id,student_user_id:s.user.id,state:payload,updated_at:new Date().toISOString()};
    const {error}=await c('student').from('student_snapshots').upsert(row,{onConflict:'student_user_id'});if(error)throw error;return {ok:true};
  }
  async function pullStudentSnapshot(){const s=await session('student');if(!s)return null;const {data,error}=await c('student').from('student_snapshots').select('*').eq('student_user_id',s.user.id).maybeSingle();if(error)throw error;return data;}
  async function studentSignOut(){const {error}=await c('student').auth.signOut();if(error)throw error;}
  window.LGS_CLOUD={configured,cfg:()=>({...CFG}),session,signUpParent,signInParent,signOutParent,parentFamily,createFamily,createPairingCode,parentSnapshots,ensureStudentSession,studentLink,claimPairingCode,pushStudentSnapshot,pullStudentSnapshot,studentSignOut,msg};
})();
