# Oxara.DocumentTemplate — çalışma başlangıcı

Oturum başında `C:/Users/Erdem ÖZKARA/.oxara/agent-tooling/policy/core.md` okunur; kullanıcı/proje talimatları korunur. Devam işinde `node "C:/Users/Erdem ÖZKARA/.oxara/agent-tooling/src/state.mjs" resume --project "<repo-root>"` ile kapsamı eşleşen görev bulunur; en yeni görev otomatik seçilmez. Mevcut yerel değişiklikleri ve başka chat'in dosya/plan sahipliğini koru.

## İlgili kaynağa giriş

- Önce [README](README.md) ve [tasarım sınırları](docs/DESIGN-GUARDRAILS.md). DT ortak okuma/bileşen/tema davranışını yönetir; içerik, kişisel sahneler, katalog ve sayfa kompozisyonu tüketicide kalır.
- Hero, kitap, görselli kart veya özel prop işi: [çalışan örnekler ve API](docs/illustrated-presentation.html) → [görsel standart ve mevcut fallback sözleşmesi](docs/ILLUSTRATED-VISUAL-STANDARD.md) → [üretim sırası ve promptlar](docs/ILLUSTRATION-GENERATION.md) → [tüketici entegrasyonu](docs/ILLUSTRATED-CONSUMER-INTEGRATION.md).
- Üretimden önce yerel [Brand görsel ailesi](../Oxara.Brand/docs/ILLUSTRATION-FAMILY.md), [somut sunum](../Oxara.Brand/showcase.html#illustration-family) ve [hashli referans manifestindeki](../Oxara.Brand/assets/illustration-references/manifest.json) mevcut kitap/kart ailesini incele. Onaylı referans/form → konu → alpha/export → DT slot/default → tüketici kompozisyonu → gerçek QA sırasını koru. Taslak yeni kart onaylı default değildir. Bu bağlantılar kardeş checkout içindir; yoksa kanonik bağımlılığın eksikliğini belirt, form/API uydurma. Bütün sohbet geçmişi normal başlangıç kaynağı değildir.
- Feature ekleme/değiştirmede `features/features.json`, ilgili `features/<feature>/` ve README'deki paket üreticileri; Brand eşlemesinde [BRAND-ASSETS](docs/BRAND-ASSETS.md) ve [tema uyumu](docs/THEME-COMPATIBILITY.md) esas alınır.

## Yazım ve doğrulama

Kanonik feature/üreticiyi değiştir; üretilmiş bundle veya tüketici kopyasında çatallama yapma. Özel hero'da `.document-hero-book` yokluğunda otomatik kitap pseudo'su oluştuğunu gerçek CSS ve computed pseudo ile kontrol et; henüz değerlendirmede olan semantik prop API'sini mevcutmuş gibi kullanma. İlgili kaynak testleriyle birlikte gerçek desktop/mobile ve gerekiyorsa tema, focus/hover, reduced-motion/hidden/offscreen davranışını doğrula. Projeler'e özgü form/hover kararı bütün DT tüketicilerinin davranışını değiştirmez. Teknik geçiş, kullanıcı yaratıcı kabulü ve yayın yetkisi ayrıdır. Kalıcı karar ve açık işleri kanonik belge/görev kaydına işle. Commit/push/merge/tag/yayın için açık yetki gerekir.
