# LGS 2027 Akıllı Çalışma — v2.2 MEB TAM + Veli Bulut

Bu sürüm, v2.1.1'in tüm özelliklerini korur ve öğrenci–veli cihazları arasında ücretsiz bulut senkronizasyonu ekler.

## Güvenlik modeli

- Öğrenci cihazında **Veli sekmesi ve Veli PIN'i yoktur**.
- Veli kendi cihazında **Veli cihazı** rolünü seçer.
- Veli hesabı e-posta + veli tarafından belirlenen parola ile Supabase Auth üzerinde açılır.
- Veli parolası çalışma verilerine yazılmaz ve öğrenci cihazına gönderilmez.
- Öğrenci cihazı yalnızca velinin oluşturduğu **15 dakika geçerli, tek kullanımlık 8 haneli eşleştirme kodunu** kullanır.
- Öğrenci Supabase'te anonim, cihaz-özel bir oturumla bağlanır.
- Buluta giden öğrenci snapshot'ında Gemini API anahtarı **yoktur**.
- PWA'da yalnız Supabase **publishable key** kullanılır. Secret/service_role key kesinlikle kullanılmaz.
- Veritabanı erişimi RLS (Row Level Security) ile veli ailesi / öğrenci cihazı düzeyinde sınırlandırılmıştır.

## Kurulum dosyaları

- `SUPABASE_KURULUM.sql`: Supabase SQL Editor'da bir kez çalıştırılır.
- `cloud-config.js`: Supabase Project URL ve Publishable Key bu dosyaya yazılır.
- `cloud.js`: Auth, eşleştirme ve senkronizasyon motoru.

## Kullanım akışı

### Veli telefonu
1. Uygulamayı aç → **Veli cihazı**.
2. Veli hesabı oluştur / giriş yap.
3. Aile profili oluştur.
4. **Kod oluştur** → 8 haneli tek kullanımlık kodu öğrenciye ver.

### Öğrenci telefonu
1. Güncellemeden sonra mevcut çalışma verileri korunur ve cihaz otomatik **Öğrenci cihazı** olarak devam eder.
2. Ayarlar → **Veli ile bulut eşleştirme**.
3. Velinin verdiği 8 haneli kodu gir → Eşleştir.
4. Mevcut çalışma verisi anında buluta yüklenir; bundan sonra her değişiklik otomatik senkronize edilir.

## Ücretsiz kullanım

Supabase Free plan aile içi bu kullanım için yeterli kapasite sağlar. Ücretsiz projeler uzun süre hiç kullanılmazsa duraklatılabilir; uygulama yerel/çevrimdışı çalışmaya devam eder ve proje yeniden aktif olduğunda senkronizasyon kaldığı yerden devam eder.

## MEB müfredatı

- Matematik: 52
- Türkçe: 76
- Fen Bilimleri: 61
- T.C. İnkılap Tarihi ve Atatürkçülük: 39
- Din Kültürü ve Ahlak Bilgisi: 28
- İngilizce: 70
- Toplam: 326 resmî kazanım / öğrenme çıktısı
