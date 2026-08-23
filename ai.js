(function(){
  const MODEL_CHAIN=['gemini-3.7-flash','gemini-3.6-flash','gemini-3.5-flash','gemini-3.5-flash-lite','gemini-3.1-flash-lite','gemini-2.5-flash','gemini-2.5-flash-lite'];
  const TIMEOUT_MS=18000;
  function extractText(json){return json?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim()||''}
  async function callModel(apiKey,model,prompt,{json=false}={}){
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);
    try{
      const body={contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:1800}};
      if(json) body.generationConfig.responseMimeType='application/json';
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify(body)});
      let payload={}; try{payload=await res.json()}catch(_){payload={}}
      if(!res.ok){const err=new Error(payload?.error?.message||`HTTP ${res.status}`);err.status=res.status;throw err}
      const text=extractText(payload); if(!text){const err=new Error('Boş AI yanıtı');err.status=502;throw err} return text;
    }finally{clearTimeout(timer)}
  }
  function teacherPrompt({topic,question,context,mode='teach'}){
    const modeRule={hint:'Önce yalnızca küçük bir ipucu ver; doğrudan cevabı söyleme.',teach:'Kavramı basitten başlayarak kısa, örnekli ve sınav odaklı öğret.',solve:'Önce yöntem, sonra adımlar, en sonda sonucu ver. Öğrenciyi düşünmeye yönlendir.',review:'Öğrencinin eksiğini teşhis et ve 10 dakikalık mini tekrar planı oluştur.'}[mode]||'';
    return `Sen Türkiye'de 8. sınıf LGS öğrencisine destek olan güvenilir bir öğretmensin. Yanıt dili Türkçe olsun. ${modeRule}\nGereksiz uzunluk kullanma. Bilmediğin bilgiyi uydurma. Matematik ve Fende işlem adımlarını; sözel derslerde gerekçeyi açıkla. Ekranda temiz görünsün: LaTeX, dolar işaretiyle matematik, ters bölü komutları veya Markdown kod bloğu kullanma. Çarpma için ×, bölme için ÷, eşitsizliklerde ≤ ve ≥ gibi doğrudan Unicode sembolleri kullan. Başlık ve madde işaretlerini sade tut.\nKonu: ${topic||'Genel LGS'}\n${context?`Uygulama özeti: ${context}\n`:''}Öğrencinin isteği: ${question}`;
  }
  async function ask({apiKey,topic,question,context,mode,localFallback}){
    const attempts=[]; if(!apiKey)return{text:localFallback(),mode:'local',model:'Yerel Öğretmen',attempts,reason:'no-key'};
    const prompt=teacherPrompt({topic,question,context,mode});
    for(const model of MODEL_CHAIN){const started=Date.now();try{const text=await callModel(apiKey,model,prompt);attempts.push({model,ok:true,ms:Date.now()-started});return{text,mode:'online',model,attempts}}catch(error){const status=Number(error.status)||0;attempts.push({model,ok:false,status,message:String(error.message||error),ms:Date.now()-started});if(status===400&&String(error.message).toLowerCase().includes('api key'))break;if(status===401||status===403)break}}
    return{text:localFallback(),mode:'local',model:'Yerel Öğretmen',attempts,reason:'fallback'};
  }
  const QUIZ_FORBIDDEN=[/LGS sorusu çözerken/i,/en çok hangisine dikkat/i,/doğru bir yaklaşım/i,/soru kökünü/i,/verileri ve isteneni/i,/çözümü kontrol etmeden/i,/her soruda aynı seçeneği/i,/genel sınav takti/i];
  function validQuizQuestion(q){
    if(!q||typeof q.q!=='string'||q.q.trim().length<15)return false;
    if(!Array.isArray(q.o)||q.o.length!==4||new Set(q.o.map(x=>String(x).trim())).size!==4)return false;
    const a=Number(q.a);if(!Number.isInteger(a)||a<0||a>3)return false;
    const hay=[q.q,...q.o,String(q.e||'')].join(' ');return !QUIZ_FORBIDDEN.some(r=>r.test(hay));
  }
  async function generateQuiz({apiKey,topic,subject,lesson,officialOutcomes=[],count=10}){
    if(!apiKey) throw new Error('AI anahtarı yok');
    const kazanims=(officialOutcomes||[]).slice(0,8).map(o=>`${o.code||''} ${o.text||o}`.trim()).join(' | ');
    const prompt=`8. sınıf LGS için ${count} adet tamamen özgün, akademik olarak gerçek çoktan seçmeli soru üret.
Ders: ${subject}
Konu: ${topic}
Konu özeti: ${lesson}
${kazanims?`MEB kazanımları: ${kazanims}
`:''}
ZORUNLU KALİTE KURALLARI:
- Her soru doğrudan ${topic} bilgisini, kavramını, yorumunu veya ilgili MEB kazanımını ölçsün.
- Genel sınav taktiği, "soruyu dikkatli oku", "verilenleri ayır", "çözümü kontrol et" gibi konu dışı/dolgu soru KESİNLİKLE üretme.
- Seçenekler konuya özgü ve makul çeldirici olsun.
- Kolay, orta ve zor düzey karışık olsun; en az 4 soru yorum, deney, tablo, kısa senaryo veya çıkarım gerektirsin.
- Doğru cevap gerekçesi kısa ama öğretici olsun.
- Yayınevi veya MEB sorularını kopyalama.
- SADECE JSON döndür. Biçim: {"questions":[{"q":"...","o":["A","B","C","D"],"a":0,"e":"kısa çözüm","difficulty":"kolay|orta|zor"}]}. a değeri 0-3 tamsayı olmalı.`;
    const attempts=[];
    for(const model of MODEL_CHAIN){try{const text=await callModel(apiKey,model,prompt,{json:true});const parsed=JSON.parse(text);const qs=(Array.isArray(parsed.questions)?parsed.questions:[]).filter(validQuizQuestion).slice(0,count);if(qs.length>=Math.min(6,count)){return{questions:qs,model,attempts,filtered:(parsed.questions?.length||0)-qs.length}}throw new Error(`Kalite filtresinden yalnız ${qs.length} soru geçti`)}catch(e){attempts.push({model,ok:false,message:String(e.message||e)});if(e.status===401||e.status===403)break}}
    throw new Error('Kazanıma uygun AI test üretilemedi');
  }
  window.LGS_AI={MODEL_CHAIN,ask,generateQuiz,validQuizQuestion};
})();
