# Hero, kapak ve kart görsel standardı

2026-11-20. Mod: mevcut onaylı standardı koru. Kaynak: kullanıcının Brand sohbetindeki açık talimatı ve 01a1e910-55d3-7a12-a099-6cb89a12a35e sohbetinden bu göreve aktarılan görsel sınırlar. Standardizasyon yeni estetik üretme yetkisi değildir.

## Kabul durumu

Ortak document-hero / illustrated-card API, paket ve fallback mekanizması uygulanmıştır. İlk geometrik SVG taslağı reddedilen teknik denemedir; aktif varsayılan değildir. Kullanıcı ardından açıkça “ee düzeltin. sabit 2d illüstration görsel üretip onu kullanın” dedi. Bu yetkiyle ImageGen üzerinden boyalı atlas/kapalı kitap/hover yaprakları üretildi ve `assets/presentation/*-painted-v1.webp` olarak sabit varsayılanlara bağlandı. Kitap kartta karşıdan; hero'da yalnız CSS ile hafif rotation alır. Özel art slotları aynı şekilde varsayılanı değiştirir. Görsel üretim/entegrasyon talebi tamamlanmıştır; ayrıca yaratıcı kullanıcı kabulü varsayılmaz. Yeni estetik veya konuya özel görsel üretimi bu karardan otomatik türetilmez.

## Bağlayıcı dil

- Resimsel, boyalı, hafif fasetli 2D illüstrasyon; hacim ışık/gölgeden gelir. Plastik 3D, cartoon, düz clipart, genel SVG ikon veya jenerik template estetiğine geçilmez. Teknik API başarısı görsel kalite düşüşünü meşrulaştırmaz.
- Ink #0B1D29, Graphite #173344, Turquoise #19C7B5; isteğe bağlı zeytin ve sınırlı sıcak ahşap/kâğıt/amber malzemeler. Lacivert yüzeyler korunur; kömür siyahı, baskın sarı/turuncu ve dikkat dağıtan beyaz konturlar eklenmez. Her iki temada okunurluk sağlanır.
- Hero: arka plan ve kapalı temsilci prop ayrı katmanlardır. Metne ferah alan, dengeli tipografi, çok hafif rotation/float/parallax ve ölçülü yumuşak gölge. Masa çevresi görünen kırpık açık kitap hero kapağı değildir.
- Aynı rehber kitabı kartta doğrudan karşıdan aynı cepheyle, hero'da hafif rotation ile tutarlı kullanılır. Konuya özel normal teknik kompozisyon + eşleşmiş hover zeytin katmanı (EFCore/Hangfire dahil) korunur. Default sabit olabilir; özel konu kartlarının hepsine aynı fonu veya yaprak/sayfa kıvrımını zorlamaz. Makale/paket/araç kendi konusunu anlatabilir; yapraklar ortak aksan olabilir.
- Masa nesnesi/kategori/rota eşlemesi site SITE-PRESENTATION ve route registry sahibindedir; bu belge değişken site eşlemesini kopyalamaz. Beyaz dikdörtgen flash ve bütün masayı hero'ya taşıma yok. Masa/karakter/doğa DT'nin zorunlu davranışı değildir.
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

Üretim kuralları ve yeniden kullanılabilir promptlar: [ILLUSTRATION-GENERATION.md](ILLUSTRATION-GENERATION.md). Public Hero ve Kartlar sayfasındaki generation-rules/prompt-examples adresleri, ürünün görsel seçeneklerine ve isteğe bağlı teknik rehber girişine açılır; üretici promptları ana anlatıma gömülmez.

<a id="ozel-prop-slot-ve-fallback-sozlesmesi"></a>

## Özel prop, slot ve fallback sözleşmesi

2026-11-21 gerçek kaynak: `features/document-hero/document-hero.css`. `data-document-hero` yalnız hareket seçicisi değildir; CSS sabit dekorasyon da ekler:

| Durum | Güncel davranış | Tüketici kontrolü |
| --- | --- | --- |
| `.document-hero-art` yok | `::before` sabit atlas ve scrim çizer | Özel background sağlayınca slot/katmanı açıkça ver |
| `.document-hero-book` yok | `::after` sabit kitap çizer; özel propun başka sınıfla bulunması bunu engellemez | Özel prop kapsayıcısında mevcut `.document-hero-book` slot markerını kullan; kitapla çift çizim olmadığını doğrula |
| `data-hero-layout="text"` | Varsayılan pseudo background/kitap kapatılır; metin düzeni seçilir | Bunu genel özel prop API'si sanma; ilgili layout kuralını ve tüketici yerleşimini kontrol et |

Örnek özel prop slotu: `<div class="document-hero-book"><img src="project-prop.webp" alt="" aria-hidden="true"></div>`. Sınıfın tarihî adı nesneyi kitaba dönüştürmez, fakat mevcut width/rotation/grid kuralları taşır. Çoklu prop grubunda sarmalayıcı sözleşmesini ve özel yerleşimi kontrollü tanımla; yalnız yeni sınıf ekleyerek fallback'in kapandığını varsayma. Site düzeltmesi ürün sahibindedir; DT kopyasında fork yapılmaz.

**Açık API değerlendirmesi:** semantik `prop` slotu ile açık default/none/custom seçimi, kitap adlı marker bağımlılığını uzun vadede kaldırabilir. Bugün böyle yeni data-attribute/API uygulanmış değildir. Karar ve uyumluluk/göç testleri DT sahibinde yapılmadan belgede çalışıyor diye sunulmaz; bu görev runtime değiştirmez.

Kaynak testine ek olarak computed `::before`/`::after` content/display/background ve gerçek görüntüde tek prop/no çift kitap kontrol edilir. NoJS, forced-colors, print, her iki tema ve dar ekranda link/metin işlevi korunur.

## Nesne ailesi ve kapsamlı hareket kontrolü

Brand `docs/ILLUSTRATION-FAMILY.md` kitap/kartın somut form/stil referansını tutar; [üretim rehberi](ILLUSTRATION-GENERATION.md) referans → ortak form → konu → alpha/export → DT tüketimi → site → QA sırasını tanımlar. Aynı ailede canvas ve **görünür siluet**, köşe, kalınlık ve perspektif beraber kıyaslanır. Yeni Projeler kartı taslağı final onaylı defaulta dönüşmez.

Projeler hero'sundaki hover öne geçmeme kararı tüketiciye özgüdür. Hover ile scale/translate/elevation/z-index değişmez; ambient motion ve focus ayrı incelenir. Ortak `illustrated-card` bileşeninin onaylı hover davranışı bu kararla topluca kaldırılmaz. Site kategori header/hero-topics/wave/collection-more/footer kabuğu ve route/portal ilişkisi siteye aittir.

QA kaydında kaynak/asset hashleri + slot/pseudo kontrolü + eşleşen viewport'ta görsel kıyas + normal/reduced/hidden/offscreen hareket + klavye/touch ve portal başlangıç/orta/son ayrı satırlardır. Yeni public byte eski Phase17 veya release pass'ini devralmaz; audit → runtime → quality → finalize zinciri yeni aday digestine bağlanır. Bu belge güncellemesi ürünün yaratıcı kabulünü veya yayın yetkisini kapatmaz.

## Bileşen kullanımı ve mevcut ürün kabuğu

Bir DT bileşenini kullanma talebi, tüketicinin bütün sayfasını DT doküman sitesine dönüştürme yetkisi değildir. Brand mevcut hero/üst menü/sunum kabuğunu korur; yalnız gereken referans kartı alanında ortak resource-card tüketilir. Brand kendi temel reset/tipografisini sağlar; komponentin semantik renk rolleri ayrı theme-colors kaynağından gelir. Bu sınırlı tüketimde global base/reset ve docs-layout CSS yüklenmez. Genel tüketici manifestinin base bağımlılığı değişmez; burada mevcut host için açık entegrasyon sınırı kayıtlıdır. Kamuya dönük sunum ürünün kullanımını açıklar; üretici/ajan komutları ayrı teknik rehberde kalır. Teknik promptlar ILLUSTRATION-GENERATION.md içinde korunur; public ana sayfada prompt sekmeleri veya üretim checklisti bulunmaz. Mevcut code-tabs/kopyalama bileşenleri gerçek kod örnekleri için kullanılabilir.
