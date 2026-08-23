# v2.2.3 RLS + E-posta Dönüş Düzeltmesi

- Supabase RLS sonsuz döngü düzeltildi.
- Veli e-posta doğrulamasında uygulama kök adresi açıkça redirect olarak gönderilir.
- Mevcut kurulum için `SUPABASE_RLS_HOTFIX_v2_2_3.sql` dosyasını bir kez çalıştırın.

# LGS 2027 Akıllı Çalışma — v2.2.2 MEB TAM + Veli Bulut

Bu paket, v2.2 bulut sürümünün tam kontrol edilip düzeltilmiş sürümüdür.

- 6 LGS dersi / 326 resmî MEB kazanım-öğrenme çıktısı
- Öğrenci ve veli için ayrı cihaz rolleri
- Veli e-posta/parolası yalnız Supabase Auth üzerinde; öğrenci cihazına gönderilmez
- 8 haneli, 15 dakika geçerli tek kullanımlık eşleştirme kodu
- Öğrenci çalışma verilerinin veli paneline bulut senkronizasyonu
- Supabase publishable key kullanımı; secret/service_role key kullanılmaz
- cloud-config cache problemi v2.2.2'de giderildi
- Öğrenci temel çalışma motoru çevrimdışı çalışmaya devam eder

## Kurulum
1. `SUPABASE_KURULUM.sql` dosyasını Supabase SQL Editor'da bir kez çalıştırın.
2. Authentication > Anonymous Sign-ins ve Email provider açık olmalıdır.
3. Authentication > URL Configuration içine GitHub Pages adresini girin.
4. `cloud-config.js` içinde Project URL + publishable key bulunmalıdır.
5. Paketin tüm dosyalarını GitHub Pages reposunun köküne yükleyin.

## v2.2.4 eşleştirme düzeltmesi
- Öğrenci eşleştirme ve ilk snapshot artık tek Supabase RPC işlemidir.
- Eşleştirme sırasında öğrenci cihaz rolü zorunlu olarak korunur.
- Veli ekranına yanlış yönlenme engellendi.
- Mevcut Supabase projesinde SUPABASE_PAIR_HOTFIX_v2_2_4.sql bir kez çalıştırılmalıdır.
