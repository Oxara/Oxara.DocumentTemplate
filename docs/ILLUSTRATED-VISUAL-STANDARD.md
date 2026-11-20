# Hero, kapak ve kart görsel standardı

2026-11-20. Mod: mevcut onaylı standardı koru. Kaynak: kullanıcının Brand sohbetindeki açık talimatı ve 01a1e910-55d3-7a12-a099-6cb89a12a35e sohbetinden bu göreve aktarılan görsel sınırlar. Standardizasyon yeni estetik üretme yetkisi değildir.

## Kabul durumu

Ortak document-hero / illustrated-card API, paket ve fallback mekanizması uygulanmıştır. İlk geometrik SVG taslağı reddedilen teknik denemedir; aktif varsayılan değildir. Kullanıcı ardından açıkça “ee düzeltin. sabit 2d illüstration görsel üretip onu kullanın” dedi. Bu yetkiyle ImageGen üzerinden boyalı atlas/kapalı kitap/hover yaprakları üretildi ve `assets/presentation/*-painted-v1.webp` olarak sabit varsayılanlara bağlandı. Kitap kartta karşıdan; hero'da yalnız CSS ile hafif rotation alır. Özel art slotları aynı şekilde varsayılanı değiştirir. Görsel üretim/entegrasyon talebi tamamlanmıştır; ayrıca yaratıcı kullanıcı kabulü varsayılmaz. Yeni estetik veya konuya özel görsel üretimi bu karardan otomatik türetilmez.

## Bağlayıcı dil

- Resimsel, boyalı, hafif fasetli 2D illüstrasyon; hacim ışık/gölgeden gelir. Plastik 3D, cartoon, düz clipart, genel SVG ikon veya jenerik template estetiğine geçilmez. Teknik API başarısı görsel kalite düşüşünü meşrulaştırmaz.
- Ink #0B1D29, Graphite #173344, Turquoise #19C7B5; isteğe bağlı zeytin ve sınırlı sıcak ahşap/kâğıt/amber malzemeler. Lacivert yüzeyler korunur; kömür siyahı, baskın sarı/turuncu ve dikkat dağıtan beyaz konturlar eklenmez. Her iki temada okunurluk sağlanır.
- Hero: arka plan ve kapalı temsilci prop ayrı katmanlardır. Metne ferah alan, dengeli tipografi, çok hafif rotation/float/parallax ve ölçülü yumuşak gölge. Masa çevresi görünen kırpık açık kitap hero kapağı değildir.
- Aynı rehber kitabı kartta doğrudan karşıdan aynı cepheyle, hero'da hafif rotation ile tutarlı kullanılır. Konuya özel normal teknik kompozisyon + eşleşmiş hover zeytin katmanı (EFCore/Hangfire dahil) korunur. Default sabit olabilir; özel konu kartlarının hepsine aynı fonu veya yaprak/sayfa kıvrımını zorlamaz. Makale/paket/araç kendi konusunu anlatabilir; yapraklar ortak aksan olabilir.
- Masa geçişleri sitede kalır: rehber kitap, makale dosya, paket ekran, araç küp. Beyaz dikdörtgen flash ve bütün masayı hero'ya taşıma yok. Masa/karakter/doğa DT'nin zorunlu davranışı değildir.
- Onaylı navigasyonun dili korunur. Çapraz ok veya yeni parlak turkuaz dikdörtgen CTA varsayılan bir görsel standart ilan edilmez. Ana sayfanın ayrı konturlu koyu ahşap/turkuaz ışık/zeytin yapraklı resimsel butonları da her dokümana körlemesine yayılmaz. Yeni CTA tasarımı ayrı karşılaştırmalı kabul gerektirir.
- Sakin ve amaçlı hareket; metne okuma süresi, reduced-motion, klavye/touch/mobil odak. Kesik resim kenarı/boş şerit yerine yeterli overscan ve doğal kadraj kırpması. Teknik animasyon açıklamaları ürün metnine taşınmaz.

## Kaynak ve somut referanslar

Kimlik: Oxara.Brand `docs/NEUTRAL-PALETTE.md`, `docs/COMPANION-COLORS.md`, `assets/tokens/companion-colors.json`. Tema rolleri: [THEME-COMPATIBILITY.md](THEME-COMPATIBILITY.md). Bunlar resimsel kalite yerine yalnız token uyumunu kanıtlamaz; ikisi ayrı incelenir.

Onaylı site referansları (erdemozkara.com deposu): `work/review/phase15/handbook-light.jpg`, `handbook-dark.jpg`, `collection-guides.jpg`, `guides-mobile.jpg`; gerçek kaynaklar `assets/discover/guide-*-v6.webp` ve konuya özgü `collection-*-{background,prop,growth}-*.webp`. Yeni taslak karşılıkları `work/review/phase16/template-desktop.jpg`, `template-mobile.jpg`, `template-cards.jpg`. Bunlar DT'ye kişisel içerik kopyalama talimatı değildir; kalite/katman/kadraj referansıdır.

## Uygulama ve kabul sırası

1. Mevcut onaylı hero/kapak/kartı masaüstü ve mobilde karşılaştır.
2. Yapı/davranış/tema API'sini görünüşü koruyarak ortaklaştır.
3. Sabit default için yeni yaratıcı alternatif gerekiyorsa ayrı somut karşılaştırmalı önizleme hazırla; onaylı siteyi değiştirme.
4. Kaynak ve runtime testlerinden ayrı görsel kabul kaydı tut. Onaylanmamış varsayılanı “onaylı standart” veya “görsel iş tamamlandı” diye raporlama.

Commit/push/merge/tag/yayın için ayrıca açık kullanıcı yetkisi gerekir.

Son kullanıcı düzeltmesi: yalnız dal ve yaprak; zeytin meyvesi görünmez. Aktif growth katmanı growth-leaves-v2.webp; meyveli v1 aktif kaynaklardan çıkarıldı. Arka plan/kitap korunur.

Üretim kuralları ve yeniden kullanılabilir promptlar: [ILLUSTRATION-GENERATION.md](ILLUSTRATION-GENERATION.md); canlı sunumda generation-rules bölümü.
