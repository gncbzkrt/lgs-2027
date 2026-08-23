# LGS 2027 Akıllı Çalışma — FROZEN v2.1.1 MEB TAM

Bu paket 2026–2027 eğitim öğretim yılında 8. sınıfta yürürlükte olan MEB programlarını tam kazanım/öğrenme çıktısı listeleriyle içerir.

## Müfredat
- Matematik: 52 resmî kazanım
- Türkçe: 76 resmî kazanım
- Fen Bilimleri: 61 resmî kazanım
- T.C. İnkılap Tarihi ve Atatürkçülük: 39 resmî kazanım
- Din Kültürü ve Ahlak Bilgisi: 28 resmî kazanım
- İngilizce: 70 resmî öğrenme çıktısı
- Toplam: 326

Uygulamadaki 183 çalışma konusu korunmuştur. Konu ekranları ilgili MEB kazanımlarını gösterir. Türkçe'nin dinleme/izleme, konuşma, okuma ve yazma alanlarındaki 76 kazanımı ayrıca eksiksiz MEB Müfredat penceresinde bulunur.

## Özellikler
- Öğrencinin istediği konuyu seçebilmesi
- Konu anlatımı ve cihaz TTS ile sesli dinleme
- Yerel çevrimdışı test motoru
- Gemini katmanlı AI öğretmen ve AI test üretimi
- Yanlış defteri ve aralıklı tekrar
- Dershane/okulda işlenen konuyu işaretleme
- Deneme ve gelişim takibi
- PIN korumalı veli paneli
- JSON yedekleme/geri yükleme
- PWA / çevrimdışı önbellek
- MEB kazanım kodu ve tam kazanım listesi

## Kurulum
Dosyaların tamamını HTTPS sunan bir statik web alanına yükleyin (ör. GitHub Pages). `index.html` kök dizinde kalmalıdır. Telefonda Chrome/Safari ile adresi açıp Ana Ekrana Ekle / Uygulamayı Yükle seçeneğini kullanın.

## Önemli kapsam notu
2027 LGS resmî kılavuzu 23 Ağustos 2026 itibarıyla yayımlanmış değildir. Bu nedenle uygulamadaki **8. sınıf öğretim programı kapsamı tamdır**, ancak 2027 merkezi sınav kılavuzu yayımlandığında sınavın resmî kapsamı ve olası istisnaları ayrıca kontrol edilmelidir.

Ayrıntılı kaynak ve sayım için `MUFREDAT_KONTROL.txt` dosyasına bakın.


## v2.1.1 Görüntüleme Düzeltmesi
- Gemini yanıtlarında Markdown işaretleri artık biçimlendirilir.
- `$...$`, `\times`, `\div`, `\le`, `\ge`, `\sqrt`, `\frac` gibi temel LaTeX çıktıları telefon ekranında okunur sembollere dönüştürülür.
- AI promptu LaTeX yerine doğrudan Unicode matematik sembolleri kullanacak şekilde sıkılaştırıldı.
- Service Worker önbelleği v2.1.1 olarak yenilendi.
