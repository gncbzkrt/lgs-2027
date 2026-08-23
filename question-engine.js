(function(){
  const base=[
    ['mat','Pozitif Tam Sayıların Çarpanları','24 sayısının pozitif çarpanlarından biri hangisidir?',['5','6','7','9'],1,'24, 6’ya kalansız bölünür.'],
    ['mat','Asal Çarpanlara Ayırma','60 sayısının asal çarpanlarına ayrılmış biçimi hangisidir?',['2²·3·5','2·3²·5','2²·5²','3·4·5'],0,'60=2·2·3·5=2²·3·5.'],
    ['mat','EBOB ve EKOK','18 ve 30 sayılarının EBOB’u kaçtır?',['3','6','9','12'],1,'Ortak bölenlerin en büyüğü 6’dır.'],
    ['mat','EBOB ve EKOK','4 ve 6 dakikada bir çalan iki zil birlikte çaldı. Kaç dakika sonra yine birlikte çalar?',['8','10','12','24'],2,'EKOK(4,6)=12.'],
    ['mat','Bilimsel Gösterim','0,00072 sayısının bilimsel gösterimi hangisidir?',['7,2×10⁻⁴','7,2×10⁴','72×10⁻⁴','0,72×10⁻⁴'],0,'0,00072=7,2×10⁻⁴.'],
    ['mat','Kareköklü İfadelerde İşlemler','2√3+5√3 işleminin sonucu nedir?',['7√3','10√3','7√6','√21'],0,'Benzer köklü ifadelerin katsayıları toplanır.'],
    ['mat','Pisagor Bağıntısı','Dik kenarları 6 cm ve 8 cm olan dik üçgenin hipotenüsü kaç cm’dir?',['10','12','14','16'],0,'6²+8²=36+64=100, √100=10.'],
    ['mat','Olasılık Değeri','Bir olayın olasılığı aşağıdaki hangi aralıkta olabilir?',['-1 ile 1','0 ile 1','1 ile 10','Yalnız 0'],1,'Olasılık 0 ile 1 arasındadır.'],
    ['mat','Eğim','Bir doğru sağa gidildikçe yükseliyorsa eğimi için hangisi söylenir?',['Negatiftir','Pozitiftir','Sıfırdır','Tanımsızdır'],1,'Sağa doğru yükselen doğrunun eğimi pozitiftir.'],
    ['tur','Konu ve Ana Fikir','Bir metinde yazarın vermek istediği temel mesaja ne denir?',['Konu','Ana fikir','Başlık','Örnek'],1,'Ana fikir metnin temel yargısıdır.'],
    ['tur','Fiilimsiler','“Koşarak eve geldi.” cümlesinde fiilimsi hangisidir?',['eve','geldi','koşarak','o'],2,'-arak eki zarf-fiil ekidir.'],
    ['tur','Yazım Kuralları','Hangi cümlede “de” doğru yazılmıştır?',['Ben de geliyorum.','Bende geliyorum.','Sen deki kalem güzel.','Ev de kimse yok.'],0,'Bağlaç olan de ayrı yazılır.'],
    ['tur','Neden-Sonuç ve Amaç-Sonuç','“Yağmur yağdığı için maç ertelendi.” cümlesindeki anlam ilişkisi hangisidir?',['Amaç-sonuç','Neden-sonuç','Koşul','Karşılaştırma'],1,'Ertelemenin nedeni yağmur yağmasıdır.'],
    ['tur','Öznel-Nesnel Yargılar','“Bu roman 200 sayfadır.” cümlesi hangisidir?',['Öznel','Nesnel','Abartılı','Koşullu'],1,'Doğrulanabilir bilgi olduğu için nesneldir.'],
    ['tur','Noktalama İşaretleri','Soru cümlesinin sonuna hangi işaret gelir?',['Nokta','Virgül','Soru işareti','İki nokta'],2,'Soru cümlesi soru işaretiyle biter.'],
    ['fen','Mevsimlerin Oluşumu','Mevsimlerin oluşmasının temel nedeni hangisidir?',['Dünya-Güneş uzaklığı','Eksen eğikliği ve dolanma','Ay’ın dolanması','Güneş’in dönmesi'],1,'Eksen eğikliği ve dolanma birlikte mevsimleri oluşturur.'],
    ['fen','Kalıtım','DNA’nın belirli bir özellik için bilgi taşıyan bölümüne ne denir?',['Gen','Hücre','Organ','Doku'],0,'Gen DNA’nın işlevsel bölümüdür.'],
    ['fen','Adaptasyon','Kutup ayılarının kalın yağ tabakasına, çöl tilkilerinin ise büyük kulaklara sahip olması aşağıdakilerden hangisine örnektir?',['Adaptasyon','Modifikasyon','Mitoz','Yapay seçilim'],0,'Canlıların yaşadıkları çevrede hayatta kalma ve üreme şansını artıran kalıtsal özellikleri adaptasyondur.'],
    ['fen','Adaptasyon','Aynı türden iki bitki popülasyonundan kurak bölgede yaşayanların zamanla daha derin köklü bireylerden oluşması hangi açıklamayla en iyi ifade edilir?',['Çevreye uyum sağlayan kalıtsal özelliklerin nesiller boyunca seçilmesi','Her bitkinin yaşamı boyunca kökünü isteyerek uzatması','Kök uzunluğunun yalnızca sulama miktarıyla anlık değişmesi','Bütün bireylerin aynı anda aynı mutasyonu geçirmesi'],0,'Adaptasyon bireyin isteğiyle oluşmaz; kalıtsal varyasyonlardan çevreye avantaj sağlayanların nesiller boyunca seçilmesiyle popülasyonda yaygınlaşır.'],
    ['fen','Adaptasyon','Bir böcek türünde yeşil bireyler yapraklı ortamda kuşlar tarafından daha az fark ediliyor ve daha çok yavru bırakıyor. Uzun yıllar sonra yeşil bireylerin oranının artması hangi kavramla ilişkilidir?',['Adaptasyon ve doğal seçilim','Sadece modifikasyon','Mayozun durması','Edinilmiş özelliğin doğrudan aktarılması'],0,'Çevrede avantaj sağlayan kalıtsal özelliğe sahip bireylerin daha fazla üremesi doğal seçilim yoluyla adaptif özelliğin yaygınlaşmasına katkı sağlar.'],
    ['fen','Adaptasyon','Aşağıdakilerden hangisi adaptasyon ile modifikasyon arasındaki doğru farktır?',['Adaptasyon kalıtsal ve nesiller boyunca seçilmiş olabilir; modifikasyon çevre etkisiyle bireyde oluşur ve kalıtsal değildir.','İkisi de her zaman kalıtsaldır.','Modifikasyon yalnız hayvanlarda görülür.','Adaptasyon bireyin yaşamı sırasında ihtiyaca göre oluşur.'],0,'Adaptasyon popülasyon düzeyinde kalıtsal özelliklerle ilişkilidir; modifikasyon çevre etkisiyle fenotipte oluşan, kalıtsal olmayan değişimdir.'],
    ['fen','Adaptasyon','Bir araştırmacı farklı gaga yapısına sahip kuşların farklı besin kaynaklarında hayatta kalma başarılarını karşılaştırıyor. Bu araştırma en doğrudan hangi soruya kanıt sağlayabilir?',['Gaga yapısının çevreye uyum ve beslenme başarısıyla ilişkisine','Kuşların bütün özelliklerinin sonradan kazanıldığına','Her çevrede aynı gaga yapısının avantajlı olduğuna','Adaptasyonların bir nesilde isteğe bağlı oluştuğuna'],0,'Farklı gaga yapılarının farklı çevresel koşullarda sağladığı avantaj, adaptasyonun çevreyle ilişkisini değerlendirmeye yarar.'],
    ['fen','Katı Basıncı','Aynı ağırlıktaki cismin zemine yaptığı basıncı artırmak için ne yapılmalıdır?',['Temas alanı artırılır','Temas alanı azaltılır','Kütle azaltılır','Sıvıya konur'],1,'Alan azalırsa P=F/A gereği basınç artar.'],
    ['fen','Sıvı Basıncı','Aynı sıvıda derinlik arttıkça sıvı basıncı nasıl değişir?',['Azalır','Artar','Değişmez','Sıfır olur'],1,'Sıvı basıncı derinlikle artar.'],
    ['fen','Asitler ve Bazlar','pH değeri 7’den küçük olan çözelti genellikle nasıldır?',['Bazik','Asidik','Nötr','Tuzlu'],1,'pH<7 asidik çözeltiyi gösterir.'],
    ['fen','Kaldıraçlar','Kaldıraçlarda kuvvet kolunu artırmak genellikle ne sağlar?',['Kuvvet kazancını artırır','Yükü ağırlaştırır','İşi yok eder','Enerjiyi artırır'],0,'Kuvvet kolu büyüdükçe gereken kuvvet azalabilir.'],
    ['ink','Atatürk İlkeleri','Millî egemenlik en doğrudan hangi ilkeyle ilişkilidir?',['Devletçilik','Cumhuriyetçilik','Laiklik','İnkılapçılık'],1,'Cumhuriyetçilik millet iradesini esas alır.'],
    ['ink','Lozan Barış Antlaşması','Lozan Barış Antlaşması hangi yıl imzalanmıştır?',['1919','1920','1923','1938'],2,'Lozan 24 Temmuz 1923’te imzalandı.'],
    ['ink','Mondros Ateşkes Antlaşması','Mondros Ateşkes Antlaşması hangi savaşın sonunda imzalanmıştır?',['Balkan Savaşları','I. Dünya Savaşı','Kurtuluş Savaşı','II. Dünya Savaşı'],1,'Mondros, I. Dünya Savaşı sonunda imzalandı.'],
    ['ink','Misak-ı Millî ve TBMM','Misak-ı Millî kararları temel olarak neyi ifade eder?',['Millî sınırlar ve bağımsızlık hedefini','Saltanatın güçlenmesini','Kapitülasyonların genişlemesini','İşgallerin kabulünü'],0,'Misak-ı Millî millî sınır ve bağımsızlık hedeflerini ortaya koyar.'],
    ['din','Kader ve Kaza İnancı','Gerekli çabayı gösterdikten sonra sonucu Allah’a bırakmaya ne denir?',['Tevekkül','İsraf','Kaza','İnfak'],0,'Tevekkül çabayla birlikte düşünülür.'],
    ['din','Zekât ve Sadaka İbadeti','Hangisi sadaka kapsamında değerlendirilebilir?',['Yalnız para','Güzel söz ve yardım','Sadece zekât','Sadece bayram yardımı'],1,'Sadaka maddi yardımla sınırlı değildir.'],
    ['din','İnsan İradesi ve Sorumluluğu','İnsanın seçim yapabilme gücüne ne denir?',['İrade','Kaza','Rızık','Ecel'],0,'İrade seçme ve karar verme gücüdür.'],
    ['eng','Friendship Vocabulary','“Would you like to join us?” sorusuna olumlu cevap hangisidir?',["I'm sorry, I can't.","I'd love to.",'Never.','I dislike it.'],1,"I'd love to daveti kabul eder."],
    ['eng','Describing Simple Processes','Bir sürecin son adımını belirtmek için en uygun kelime hangisidir?',['First','Next','Finally','Because'],2,'Finally son adımı belirtir.'],
    ['eng','Accepting and Refusing','Hangisi kibar bir davet reddidir?',["I'd love to.","Sure.","I'm sorry, but I can't.","Great idea!"],2,"I'm sorry, but I can't kibar ret ifadesidir."],
    ['eng','Responsibilities','“You must tidy your room.” cümlesi ne ifade eder?',['Tercih','Sorumluluk/zorunluluk','Geçmiş olay','Tahmin'],1,'must zorunluluk bildirir.']
  ].map((x,i)=>({id:'q'+(i+1),s:x[0],t:x[1],q:x[2],o:x[3],a:x[4],e:x[5],difficulty:i%3===0?'zor':i%3===1?'orta':'kolay'}));
  const FORBIDDEN_PATTERNS=[
    /LGS sorusu çözerken/i,/en çok hangisine dikkat/i,/doğru bir yaklaşım/i,/soru kökünü/i,
    /verileri ve isteneni/i,/çözümü kontrol etmeden/i,/her soruda aynı seçeneği/i,/sadece tarih ezberlemek/i,
    /metindeki kanıtı yok saymak/i,/bağlamı okumadan/i,/genel sınav/i
  ];
  function isQualityQuestion(q){
    if(!q||typeof q.q!=='string'||q.q.trim().length<12)return false;
    if(!Array.isArray(q.o)||q.o.length!==4||new Set(q.o.map(x=>String(x).trim())).size!==4)return false;
    if(!Number.isInteger(Number(q.a))||Number(q.a)<0||Number(q.a)>3)return false;
    const hay=[q.q,...q.o,String(q.e||'')].join(' ');
    return !FORBIDDEN_PATTERNS.some(r=>r.test(hay));
  }
  function allFor(topic){return base.filter(q=>q.t===topic).filter(isQualityQuestion)}
  function localCount(topic){return allFor(topic).length}
  function randomForSubject(id,count=10){const topics=[];const s=window.LGS_DATA.subjects.find(x=>x.id===id);s?.units.forEach(u=>topics.push(...u.topics));let pool=topics.flatMap(allFor);return shuffle(pool).slice(0,Math.min(count,pool.length))}
  function mixed(count=10){let pool=base.filter(isQualityQuestion);return shuffle(pool).slice(0,Math.min(count,pool.length))}
  function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
  window.LGS_QUESTIONS={base,allFor,localCount,isQualityQuestion,randomForSubject,mixed,shuffle};
})();
