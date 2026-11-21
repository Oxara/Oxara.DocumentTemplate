# Sabit 2D illüstrasyon üretim rehberi ve promptlar

Bu rehber Hero ve Kartlar sayfasının üretim kaynağıdır. Özel artwork isteğe bağlıdır. Özel görsel verilmezse sabit genel atlas/kapalı kitap/dal-yaprak seti tekrar kullanılır; her konu için yeni üretim gerekmez.

## Üretim kuralları

- Boyalı, hafif fasetli 2D illüstrasyon; hacim ışık/gölge ve malzeme dokusuyla verilir. Flat vector/clipart, cartoon veya plastik3D yok.
- Ink#0B1D29, Graphite#173344, Turquoise#19C7B5; muted zeytin/sage yaprak ve sınırlı kâğıt/ahşap/amber detayları. Büyük sarı/turuncu alan ve beyaz kontur yok. Brand nötr/companion kaynakları ile tema rolleri korunur.
- Arka plan, kapalı kitap ve hover dal/yaprak ayrı dosyalardır. Arka plan opak; kitap ve dallar gerçek alpha transparan olmalıdır. Fake dama/renkli zemin şeffaflık sayılmaz.
- Kitap kartta doğrudan karşıdan, düzgün dik cepheyle görünür; hero'da hafif CSS rotation yapılabilir. Masa çevresi görünen kırpık açık kitap kullanılmaz. Kitabın tamamı kadrajda kalır.
- Hover katmanında yalnız dal ve yaprak vardır. Zeytin meyvesi, başka meyve, berry, tomurcuk veya yuvarlak süs yok.
- Solda metin için sakin boş alan; kenarlarda doğal taşma/overscan. Başlık, metin ve butonlar HTML olarak kalır; görsel içine yazı/UI çizilmez.
- Konuya özel alternatifler aynı görsel aileyi korur; aynı sayfa kıvrımı/kitap şablonu her kategoriye dayatılmaz. Kişisel manzara/mascot/masa/scene orchestration ortak template zorunluluğu değildir.
- Mevcut onaylı artwork ve kontrol dilini referans al. Yeni CTA/animasyon tasarımı üretmek bu promptların kapsamı değildir.

## Ortak stil eki

Sophisticated hand-painted, lightly faceted 2D editorial illustration. Rich painted paper/leather texture; volume from soft light and shadow. Deep Ink navy #0B1D29, Graphite #173344 and restrained Turquoise #19C7B5, muted sage/olive leaves and subtle cream/amber materials. Match the supplied approved reference family. No plastic3D, cartoon, flat vector, wireframe, clipart, text, lettering, logos or UI. Preserve quiet space for real HTML content.

## Arka plan promptu

Create one fixed generic documentation hero/card BACKGROUND, landscape1536x1024 or wider. Use the shared painted 2D style. Quiet dark left60% with subtle brush texture for an HTML title. Along right/bottom, graceful overlapping broad cream-paper and teal-paper strata with gentle facets and restrained turquoise rim light; sparse muted sage accents. All shapes extend naturally beyond canvas edges. Opaque full-bleed navy. No book or foreground prop, no person, furniture, scenery, text, icons, frame or grid. Pair with a separate closed-book layer at right.

## Kapalı kitap promptu

Create a single CLOSED documentation hardback, full isolated object on genuine transparent alpha background with clear padding. FRONT-ON, upright rectangular cover, same width at top/bottom; no tilt, rotation, isometric angle or foreshortening. Very thin left spine only. Use shared painted 2D style: navy textured cover, turquoise folded corner protectors, cream paper edge, tiny amber accent. A small embossed abstract stacked-paper emblem, no words/letters/numbers/logos. Entire book visible. No tabletop, scenery or opaque shadow rectangle. It will be front-on in cards and slightly rotated with CSS in hero.

## Dal ve yaprak promptu

Create a sparse decorative BRANCH-AND-LEAF overlay, landscape1536x1024, genuine transparent alpha. Use shared painted 2D style. Fine natural twigs with narrow sage/olive/teal leaves entering from right/bottom; only rightmost30% and bottom15% occupied, left65% clear. Cool restrained turquoise rim and soft cream light. Branches extend beyond crop, no chopped stem ends inside canvas. ONLY branches and leaves: NO olives, fruit, berries, buds, round ornaments, pot, book, text, scenery or opaque rectangle. Clear room for separate book and HTML copy. Subtle hover layer, not a dense foliage wall.

## Meyve kaldırma / düzeltme promptu

Precise edit: remove EVERY olive/fruit/berry/bud/round ornament. Leave ONLY branches and leaves. Preserve existing sparse right/bottom composition, leaf shapes, painted softly faceted 2D style, sage/teal/cream palette, lighting, clear left two-thirds, dimensions and genuine transparency. Repair former fruit spots seamlessly with empty transparency or a continuing fine twig. Do not add objects or rearrange the composition.

## Üretim ve teslim kontrolü

1. Onaylı referansı stil girdisi olarak göster; kopyalanacak konu ile korunacak görsel dili ayır.
2. Her katmanı ayrı üret. Transparan istenenlerde aracın transparency seçeneğini etkinleştir; sonuçta alpha kanalını ve kenarları denetle.
3. Meyve/yazı/kadraj/perspektif hatası varsa hedefli edit uygula; maskeyi veya özgün PNG'yi kaybetme.
4. Orijinal çıktıyı ve kullanılan promptu sakla. WebP exportunda alpha'yı koru; yeni sürüm adı/hash ile ilişkilendir. Özel üretim yoksa aynı sabit seti kullan.
5. Hero + kart/focus/hover, açık/koyu tema,320–390px mobil, reduced-motion ve noJS görünümünü gerçek sayfada incele. Metin okunur, prop tam ve yatay taşma yok olmalı.
6. Teknik test, görsel karşılaştırma ve kullanıcı yaratıcı kabulünü ayrı kaydet. Üretim/entegrasyon commit/push/yayın izni değildir.

## Üretim sırası ve sahipler — 2026-11-21

1. **Brand referansı:** `Oxara.Brand/docs/ILLUSTRATION-FAMILY.md` ve `showcase.html#illustration-family` somut kitap/kart örneklerini ve kabul durumlarını gösterir. Önce mevcut onaylı görsel aile/form/stil okunur; son taslak çıktı başlangıç standardı ilan edilmez.
2. **Ortak nesne sözleşmesi:** aynı aile için en-boy oranı, köşe geometrisi, kalınlık, perspektif, malzeme/ışık, görünür siluet, iç güvenli alan, alpha padding ve export ölçüsü kaydedilir. Eşit canvas tek başına tutarlı nesne değildir. Kitap ve proje kartı ayrı aile olabilir; aile içindeki kare/dikdörtgen karışımı kabul edilmez. Sayısal oran henüz kabul edilmediyse briefte açık karar olarak kalır.
3. **Konu üretimi:** ortak form referansını sabitle, sonra her konu/proje için bir bütünlüklü özgün boyalı/fasetli illüstrasyon üret. Gerçek orijinal karakter/logo korunur; olmayan kurumsal logo/katkı üretilmez. Metin HTML kalır. Yukarıdaki genel “logo yok” promptu, sağlanmış gerçek logoyu özgün biçimiyle koruma isteğini geçersiz kılmaz.
4. **Ayrı asset/export:** her kart/prop ayrı alpha dosyası; background/yaprak ayrı. Prompt, referans, orijinal, maske, ölçü/alpha sınırı, hash ve dönüşüm kaydı korunur. KatalogN öğeli iseN ayrı kaynak kullanılır; tek yedi-kart birleşik raster yeniden kullanılabilir sistem değildir.
5. **DT tüketimi:** [prop/slot/fallback sözleşmesini](ILLUSTRATED-VISUAL-STANDARD.md#ozel-prop-slot-ve-fallback-sozlesmesi) kontrol et. Varsayılan sabit set isteğe bağlı özel kaynakla değiştirilir; otomatik konu üretimi yapılmaz.
6. **Site entegrasyonu:** katalog/grup/sıra, nesnelerin açı/örtüşmesi, route/portal ve kategori kabuğu tüketiciye aittir. Ortak nesne formu siteye mekanik eşit aralıklı grid dayatmaz.
7. **Gerçek kabul:** desktop/mobile, siluet kıyaslama, hover/focus, reduced-motion, görünmezken durma, doğrudan giriş ve portal varış/geri dönüş kontrol edilir. Teknik kaynak doğrulaması, görsel aile kıyası, kullanıcı yaratıcı kabulü ve yayın izni ayrı statüdedir.

Bu sıra bağımlılık akışıdır; mevcut kabul edilmiş kaynak uygunsa her adımda yeniden görsel/kod üretilmez. DT, siteye özgü yedi kategori bölgesinin sahibi değildir; site PAGE-CONTRACTS ve ortak `category-shell` kaynakları tüketilir.

## Aynı ailede yeni kart için form eki

Aşağıdaki alanları üretimden önce doldur; belirsiz alanı modelin keyfî tamamlamasına bırakma. Form referansı hem ilk hem sonraki varyantlarda aynı dosya/hash olmalıdır. Aracın sonucu birebir garanti ettiği varsayılmaz; gerçek alpha/siluet kıyası ayrıca yapılır.

```text
Use the supplied accepted FORM reference [file + SHA256] for this object family.
Keep the same visible silhouette, aspect ratio [W:H], corner geometry [spec],
physical thickness [spec], perspective [spec], material/light direction [spec],
inner safe area [spec] and transparent padding [spec]. Export [canvas W x H].
Create ONE complete painted, lightly faceted 2D topic illustration for [subject].
Integrate the subject as a coherent composition; do not paste a centered icon
or logo plaque into a generic app-window frame. Preserve supplied originals
[identity assets] exactly as instructed; do not redraw the user's character,
invent logos, text or product claims. Genuine alpha, full isolated object.
No multi-card collage, identical icon tiles, plastic3D or fake transparency.
```

## Tüketici örneği: erdemozkara.com Projeler

Bu örnek DT'nin bütün tüketicilerine zorunlu tema veya hareket değildir. Kullanıcı küçük eşit aralıklı app-window/ikon plakalarını reddetti; ayrı büyük, konuya özgü bütünlüklü kartlar ve kitapların doğal dağılım/örtüşme ilkesini istedi. Kitap nesnesine veya albüme dönülmez. Proje kartlarının ortak fiziksel formu korunur; `personal` daha karakterli/serbest/organik, `team` daha ölçülü/teknik-ürün anlatımlı çalışma yönüdür. Bu yorum ve yeni assetler nihai yaratıcı kabul değildir; `group` ayrımı ve gerçek katkı içerikleri siteye aittir.

Projeler hero kartlarında hover büyümesi/yükselmesi/perspektif sıçraması/z-index sırası değişimi yoktur. Sakin bağımsız ortam hareketi, reduced-motion/offscreen pause ve gerçek link focus'u ayrı kontrol edilir. Bu tercih başka kartların onaylı hover davranışını kaldırmaz. Kişisel karakter sağlanan orijinaliyle; Tekin gerçek sol anahtarı/yaprak logosuyla; Madene Hayır doğayı koruma/maden karşıtlığı anlamıyla korunur. Gerçek logo/orijinal yoksa uydurmak yerine eksik kaynak kaydedilir.

Brand'deki yeni proje kartı **taslaktır**; oran/köşe/kalınlık/perspektifin kabul edilmiş ortak görünümüyle yan yana karşılaştırılıp ancak gerçek kullanıcı kabulü sonrası onaylı referansa dönüşebilir.
