# Buton envanteri ve görev taksonomisi

> Bu belge uygulama öncesi sahip envanterinin tarihli kaydıdır. Güncel kanonik kullanım kuralı [tasarım rehberindedir](DESIGN-GUARDRAILS.md#shared-primary-and-secondary-actions): resimsel hero CTA’ları ve quiet araçlar ortak kaynaklıdır; düz resource-card ailesi özgün38px ikon/metin görünümünü korur. Aşağıdaki ilk tarama sayımları güncel release kabulü veya canlı tüketici durumu diye okunmamalıdır.


2026-11-21 · Brand, DocumentTemplate ve erdemozkara.com sahiplerinin kaynak ve temsili görünüm incelemelerinin konsolidasyonu. Kanonik belge sahibi DT'dir; kimlik/palet Brand'de, içerik ve sahne davranışları sitede kalır.

## Kapsam ve sürüm sınırı

- **DT yerel aday:** `features/base/actions.css` ortak primary/secondary uygulamasını ve gerçek `http://127.0.0.1:4203/` hero örneğini içerir. İki varyant aynı biçim/hareketi kullanır, renkleri farklıdır. Kalıcı hover 1/3/6 saniyede, focus ve reduced-motion ile doğrulandı. Bağımsız QA ve yaratıcı kabul ayrı kapılardır; yeni tasarım yayımlanmadı.
- **Brand ve site:** sahip raporları mevcut kendi görünümlerini kapsar. Yeni yerel DT buton uygulaması bu tüketicilere taşınmış değildir. “DT kopyası” ifadesi yayımlanmış ortak bileşenin tüketici kopyasını anlatır.
- Generated HTML, `dist`, immutable runtime kopyaları, aynı guide'ın tekrarları ve tarihî maketler yeni aile sayılmaz. Tabloların satır/örnek adetleri toplanarak toplam kontrol sayısı üretilmez.
- Bu belge karar ve kapsam kaydıdır; yeni API, toplu dönüşüm, tüketici sync'i veya yayın yetkisi vermez.

## Ortak karar

**Primary ve secondary dışında üçüncü bir genel CTA önceliği gerekmiyor.** Bunlar önemli ve destekleyen eylemin görsel önceliğidir; HTML öğesinin görevini değiştirmez.

**Quiet/utility görünüm ihtiyacı gerçektir:** kopyalama, aramayı temizleme, geçişi tekrar oynatma ve hata sonrası tekrar deneme gibi yardımcı eylemler vardır. Bu ihtiyaç üçüncü güçlü vurgu rengi veya “tertiary CTA” demek değildir. Bu tur yeni class/API tasarlanmaz.

| Eksen | Ne belirler? | Ayrı tutulacak örnekler |
| --- | --- | --- |
| Görev ve semantik | Kontrolün ne yaptığı | Hedefe gitmek için `a href`; işlem için `button`; sekme için tab; açılır açıklama için `summary`; arama/range için uygun input. |
| Görsel öncelik | Eylemin bağlamdaki ağırlığı | Primary / secondary; yardımcı eylemde düşük vurgu. Kart, footer veya primary renk kullanımı tek başına öncelik belirlemez. |
| Sunum ve boyut | Aynı görevin nasıl gösterildiği | Metin, ikon+metin, icon-only; kompakt/geniş; touch hedefi. Icon-only yeni CTA türü değildir. |
| Durum | Kontrolün o andaki hali | Hover, focus-visible, geçici `:active`, disabled, loading/busy, başarı/hata geri bildirimi. |
| Seçim | Kalıcı/bağlamsal seçim ilişkisi | Sayfada `aria-current`, sekmede `aria-selected`, basılı tercih butonunda `aria-pressed`; birbirinin yerine kullanılmaz. |
| İşlem niyeti | Gerçek işlemin anlamı | Mevcut kapsamda silme veya form gönderimi yok. Hata kurtarma destructive işlem, “Copied” bildirimi success CTA değildir. |

Klavye focus görünürlüğü, ilk bakışta primary'ye yönelen görsel dikkatle aynı şey değildir. Yardımcı kontrolün focus'u güçlü olabilir; normal görünümü ana eylemle yarışmamalıdır.

## DocumentTemplate aileleri

Kaynaklar DT'nin kanonik sahipleridir. İçerik URL'leri/menü sırası [pages.json](pages.json) ve [gezinme üreticisinden](../scripts/build-docs-navigation.mjs) gelir; üretilmiş sayfalar ikinci stil sahibi değildir.

| ID / görev ve örnek | Kaynak / seçici | Mevcut görünüm ve karar |
| --- | --- | --- |
| D01 · Ana/alternatif eylem: Başlangıç rehberi / Feature referansı | [base/actions.css](../features/base/actions.css); `.docs-primary-action`, `.docs-secondary-action` | Yerel yeni aday: ortak 48px form, kalıcı hover ve aynı çerçeve/yaprak hareketi. **Primary/secondary**; navigasyon link, işlem button olarak kalır. |
| D02 · Kartın ayrı hedefleri: depo / paket / demo | [resource-card.css](../features/resource-card/resource-card.css); `__link`, `__action`, `__action--primary` | Metin linkleri veya eski 38px bölünmüş ikon/dolgu aksiyonları. Yeni CTA ile henüz aynı uygulama değildir. Hedefler bağımsız kalmalı; kart bütünü tek hedefe çevrilmemeli. |
| D03 · Resimsel kart hedefi ve kaynak | [illustrated-card.css](../features/illustrated-card/illustrated-card.css); `.card-link`, `.card-source` | Görsel üzerinde geniş hedef ve küçük kaynak linki. Kart navigasyonu; içindeki eylem metni ikinci buton değildir. |
| D04 · Konu kartı: Başlangıç / Kod Özellikleri | [docs-layout.css](../features/docs-layout/docs-layout.css); `.docs-home-card` | Başlık/açıklamalı tam alan linki. Navigasyon kartı; CTA kaplamasına zorlanmaz. |
| D05 · Üst menü / rehber menüsü / TOC | Aynı docs-layout; `.docs-top-links`, `.docs-nav-link`, `.docs-toc`; ayrıca [sidemenu](../features/sidemenu/sidemenu.js) bölüm linkleri | Metin ve etkin sayfa/başlık işareti. Gezinme; etkinlik CTA önceliği değildir. |
| D06 · Önceki / sonraki doküman | docs-layout; `.docs-page-link`; sayfa kataloğu | Yön etiketi ve hedef başlığını birlikte gösterir. Sıralı navigasyon; otomatik primary/secondary eşlemesi gerekmez. |
| D07 · Siteye dönüş / içeriğe atlama | [author-link.css](../features/author-link/author-link.css), `.author-link`; [base.css](../features/base/base.css), `.skip-link`, içerik linkleri | Küçük kimlik yüzeyi, normal metin linki, odakta görünen skip-link. Link semantiği ve skip-link erişilebilirlik istisnası korunur. |
| D08 · Gezinme panelini aç/kapat | [docs-layout.js](../features/docs-layout/docs-layout.js), `[data-docs-nav-toggle]`; sidemenu `.menu-toggle`, `.sidenav-close` | Kompakt menü / ×. Drawer kontrolü; iki uygulamanın expanded, Escape ve focus davranışları korunmalı. CTA değildir. |
| D09 · Aramayı aç/kapat / sonuç seçmek | [search.js](../features/search/search.js), [search.css](../features/search/search.css); `.search-trigger`, `.search-close`, `.search-result-item` | Kısayollu tetikleyici, modal kapatma ve metin sonuçları. İlk ikisi yardımcı işlem; sonuç seçimi navigasyon. Girdi ayrı form kontrolüdür. |
| D10 · Tema tercihi | [theme.css](../features/theme/theme.css), [theme.js](../features/theme/theme.js); `.theme-toggle` | 38px ikon kontrolü; erişilebilir ad sonraki eylemi anlatır. Tercih değiştiren araç; icon-only sunum eksenidir. |
| D11 · Kod kopyalama | [copy-code.js](../features/copy-code/copy-code.js); `.code-copy-button` | Kod bloğunda hover/focus ile görünen 24px yardımcı eylem. “Copied” geçici geri bildirimdir; success buton türü değildir. |
| D12 · Tablo değeri kopyalama | [copy-table.js](../features/copy-table/copy-table.js); `.copy-table-button` | Satır yanında yaklaşık 28,8px nötr kontrol; başarı/hata durumları var. Clipboard görevi ortak, veri bağlamı farklıdır; handler'lar kör birleştirilmez. |
| D13 · Yerel içerik sekmesi: REST / .NET | [code-tabs.js](../features/code-tabs/code-tabs.js); `[data-code-tabs]`, `.code-tab` | Panel sekmeleri; `tablist/tab`, `aria-selected`, roving tabindex. Yeni CTA görünümüne taşınmaz. |
| D14 · Grup genelinde tercih: Lokal / Dev / Production | Aynı code-tabs; `[data-code-tabs-global] [data-code-option]` | Bölüm/header içinde gruplanmış seçenekler; `aria-pressed`. Aynı gruptaki panelleri değiştirir; seçili durum primary değildir. |
| D15 · Örnek ayrıntısını aç/kapat | base; `details.example-details > summary` | Native disclosure ve açılır içerik. Yeni CTA veya genel accordion API'si gerektirmez. |
| D16 · Başa dön | [scroll-top.css](../features/scroll-top/scroll-top.css); `.scroll-top` | Kaydırınca beliren 40px yuvarlak ikon. Viewport yardımcı kontrolü; primary renk kullanması primary görev yapmaz. |

**Gerçek sayımlar:** 10 kaynak HTML'in DOM yapısı incelendi; `pre/code/script/style/template` içeriği ve generated kopyalar dışlandı. Headerlarda 10 tema ve 9 arama tetikleyicisi; 8 rehber menü tetikleyicisi, 9 arama kapatma, 14 pagination linki vardır. Yerel yeni CTA örnekleri 3 primary / 2 secondary'dir. Toplam 4 yerel tab paneli ve 3 global seçim kapsayıcısı bulunur. Bunlar aile sayısı değildir.

Temsili canlı Kod Özellikleri sayfasında 3 tab paneli, 3 global seçim grubu, 13 kod-copy ve 9 tablo-copy kontrolü görüldü; gizli paneller dahildir. Aynı üreticinin tekrarları ayrı aile sayılmadı.

**Mevcut olmayan/yalnız mevcut olan:** Kaynak örneklerde `a[download]`, submit formu veya media player bulunmadı; ayrı download/media CTA ihtiyacı kanıtlanmadı. `code-highlight`, reading-progress ve navigation-progress kendi başına buton değildir. `.plain-button` CSS'i mevcut, incelenen örneklerde aktif kullanım kanıtı yok. Tema önizlemesinin yerel CSS'i ve changelog tarihî maketleri yeni kanonik aile değildir.

## Brand aileleri

Brand sunum/referans içeriği ve yerel kontroller Brand sahibindedir. Referans kartlarının ortak stili DT vendor tüketimidir; içerik sahipliği Brand'de kalır.

| ID / görev ve örnek | Kaynak / seçici | Mevcut görünüm ve karar |
| --- | --- | --- |
| B01 · Tüm varlıkları incele | [showcase.html](../../Oxara.Brand/showcase.html); `.hero-actions .button.primary`; yerel | Turkuaz/beyaz kapsül. Primary görünümündeki navigasyon linki; `a href="#assets"` kalır. |
| B02 · Kullanım rehberi / Logo ölçüleri | Aynı sunum; `.hero-actions .button`; yerel | İki şeffaf/nötr çerçeveli alternatif link. Secondary; üçüncü öncelik gerektirmez. |
| B03 · Poz referansını indir | Aynı sunum; `.mascot-notes .button[download]`; yerel | Secondary kapsül görünümü. İndirme semantiği ayrı; yeni download rengi gerekmez. |
| B04 · Bölüm gezinmesi / geri dönüş | Sunum `.topbar nav a`; [USAGE-GUIDE.html](../../Oxara.Brand/docs/USAGE-GUIDE.html), `header a`, `nav a`, `footer a`; yerel | Düz metin veya altı çizili link. Sunumda 5, rehberde 7 bölüm linki; logo/footer dönüşleri ayrıca vardır. CTA değil. |
| B05 · Rehber içi kaynak/açıklama | USAGE-GUIDE `section a`; yerel | 10 altı çizili içerik bağlantısı. Butonlaştırılmaz. |
| B06 · Görseli incele / Kaynak bilgisi | Sunum referans kartları `.resource-card__link`; stil DT vendor, içerik Brand | 5 kart × 2 küçük link. D02 kart navigasyonu; CTA hareketi zorunlu değil. |
| B07 · Galeride Görüntüle / Kaynağı indir | Sunum `render()`, `.card-actions a`; yerel | İki kompakt nötr link: önizleme navigasyonu ve indirme. Kart bütünü tıklanabilir değil. |
| B08 · 128px / Loader koyu / JSON | Sunum `.link-list a`; yerel | Küçük nötr yüzeyli kaynak linkleri. 38 link; 25'i `#downloads` içinde. Her indirme primary yapılmaz. |
| B09 · Tümü / Logolar / Maskot filtresi | Sunum `.filter`, `aria-pressed`; yerel | 6 seçenek; seçilmeyen nötr, seçilen turkuaz/Ink. Tek seçimli filtre, CTA önceliği değil. |
| B10 · Açık / Koyu demo yüzeyi | Sunum `.surface-mode`, `applySurface()`; yerel | 2 segment. Yalnız demo yüzeyini değiştirir; global tema düğmesi değildir. |
| B11 · Geçişi tekrar oynat | Sunum `#splash-replay.replay-button`; yerel | Küçük nötr outline yardımcı eylem. Reduced-motion'da disabled olması yeni loading türü kanıtlamaz. |
| B12 · Varlık arama | Sunum `input#search[type=search]`; yerel | Beyaz girdi, turkuaz focus sınırı/halo. Form girdisi; ayrı submit veya search-close butonu yok. |

**Sayım ve aktiflik:** `assets` dizisinin 23 kaydı tek `render()` şablonuyla 23 kart / 46 bağlantı oluşturur. Galeride Maskot filtresinin 2 sonuç üretmesi doğrulandı; 23 mevcut kayıt ile o anda görünen 2 kayıt farklı ölçülerdir. [Build üreticisinin](../../Oxara.Brand/scripts/build-showcase-site.mjs) sunum/dist çıktıları ikinci aile sayılmaz.

Brand'de destructive işlem, submit formu, kopyalama, global tema, hamburger, modal-close, pagination veya media player yok. Renk kodları statik metindir; `.content-action` yükleme maketi gerçek buton değildir.

## erdemozkara.com aileleri

**DT kopyası**, mevcut ortak bileşenin site kopyasıdır; yeni yerel actions.css henüz tüketilmiyor. **Yerel**, sitenin içerik/sahne kaynağıdır. D-kodları yukarıdaki ortak görev ailesine karşılık gelir.

| ID / görev ve örnek | Site kaynağı / seçici ve sahiplik | Mevcut görünüm ve karar |
| --- | --- | --- |
| S01 · Projeleri incele / Okumaya başla | [category-shell.css](../../erdemozkara.com/features/discover/category-shell.css), `.collection-cta` yerel; [docs-layout.css](../../erdemozkara.com/features/docs-layout/docs-layout.css), `.docs-primary-action` DT kopyası | Turkuaz primary yönlendirme linki. 5 kategori + 5 rehber girişi; `a` kalır. |
| S02 · Keşfet / teras / LinkedIn / GitHub | [home.css](../../erdemozkara.com/features/home/home.css), `.opening-copy>.primary`; [terrace-hub.css](../../erdemozkara.com/features/home/terrace-hub.css), `.terrace-path>a`; yerel | Boyalı yaprak/plaka, 6 hedef. Sahneye özgü navigasyon; düz secondary'ye çevrilmez. |
| S03 · Keşfet / İletişim / Masaya dön / Tanışalım | [shell/site.css](../../erdemozkara.com/features/shell/site.css), `.home-nav a`; [category-shell.mjs](../../erdemozkara.com/scripts/category-shell.mjs), `categoryClosing`, `.collection-back`; yerel | Metin/alt çizgi navigasyonu. Footer Tanışalım otomatik primary değildir. |
| S04 · Okuyucudan siteye dönüş | [author-link.css](../../erdemozkara.com/features/author-link/author-link.css), `.author-link`; DT kopyası | Küçük yüzeyli kapsül; D07 navigasyon linki. |
| S05 · Kategori / konu / Kişisel-Ekip bağlantıları | category-shell `.collection-categories`, `.hero-topics`; [projects-template.mjs](../../erdemozkara.com/scripts/projects-template.mjs) grup linkleri; yerel | Metin/aktif çizgisi; link navigasyonu. `aria-current`, hash hedefi ve progressive enhancement korunur. |
| S06 · Masa hotspot/portal: kitap / bilgisayar / yapboz | [desk.css](../../erdemozkara.com/features/discover/desk.css), `.studio-point`; [desk.mjs](../../erdemozkara.com/features/discover/desk.mjs); yerel | 7 hedef; nokta/kapsül ve açılan etiket. Touch armed durumu ve portal geçişi CTA varyantı değildir. |
| S07 · Rehberi aç / tüm kartı açma | [collection-template.mjs](../../erdemozkara.com/scripts/collection-template.mjs), `.card-link`; yerel şablon + DT illustrated-card | D03 resimsel navigasyon kartı. Eylem metni ikinci bağımsız buton değildir. |
| S08 · Site / kaynak kod / kurumsal kimlik | [projects.css](../../erdemozkara.com/features/projects/projects.css), `.project-visit`; [collection.css](../../erdemozkara.com/features/discover/collection.css), `.resource-actions a`; yerel | Altı çizili düşük vurgulu hedef linkleri. Projelerde 7 ana + 2 bağlı hedef aynı aile; otomatik secondary kaplama yok. |
| S09 · Tümü / Kişisel / Ekip | [catalogue-finder.css](../../erdemozkara.com/features/discover/catalogue-finder.css), `.catalogue-filters button`; yerel | 3 filtre kontrolü, seçili renk/çizgi ve `aria-pressed`. CTA rekabeti değil. |
| S10 · Aramayı temizle | Aynı catalogue-finder, `[data-catalogue-clear]`; yerel | Sade yardımcı eylem; 5 kategoride aynı aile, yalnız gerektiğinde görünür. |
| S11 · Tema | [theme.css](../../erdemozkara.com/features/theme/theme.css), `.theme-toggle`; DT kopyası | D10: 38px ikon tercih kontrolü. |
| S12 · Ara / × | [search.css](../../erdemozkara.com/features/search/search.css), `.search-trigger`, `.search-close`; DT kopyası | D09 modal araçları. Kısayol, erişilebilir ad ve focus dönüşü korunur. |
| S13 · Doküman menüsü | [docs-layout.css](../../erdemozkara.com/features/docs-layout/docs-layout.css), `.docs-menu-toggle`; [sidemenu.css](../../erdemozkara.com/features/sidemenu/sidemenu.css), `.sidenav-close`; DT kopyası | D08 drawer. Makalenin legacy sidemenu yolu ayrıca korunur. |
| S14 · Copy / Copied | [copy-code.js](../../erdemozkara.com/features/copy-code/copy-code.js), `.code-copy-button`; DT kopyası | D11 yardımcı eylem; geri bildirim success türü değildir. |
| S15 · Redis CLI / .NET | [code-tabs.css](../../erdemozkara.com/features/code-tabs/code-tabs.css), `.code-tab`, `.code-tabs-global button`; DT kopyası | D13/D14: tab ve tercih grubu. `aria-selected` ile `aria-pressed` ayrıdır. |
| S16 · PostgreSQL Bulk Insert örneğini aç/kapat | [base.css](../../erdemozkara.com/features/base/base.css), `details.example-details > summary`; DT kopyası | D15 native disclosure. 25 sayfada 52 kullanım, tek aile. |
| S17 · Önceki / sonraki doküman | docs-layout `.docs-page-link`; DT kopyası | D06 sıralı navigasyon; sayısal pagination veya CTA butonu değil. |
| S18 · Başa dön | [scroll-top.css](../../erdemozkara.com/features/scroll-top/scroll-top.css), `.scroll-top`; DT kopyası | D16: 40px viewport yardımcı kontrolü. |
| S19 · Bölümler / Çocukluk… | [story.mjs](../../erdemozkara.com/features/story/story.mjs); [identity/site.css](../../erdemozkara.com/features/identity/site.css), `.story-toolbar`, `.story-chapters button`; yerel | Saydam şerit/liste; menü-disclosure ve sahne seçimi. 17 bölüm seçeneği tek aile. |
| S20 · Hikâye önceki/sonraki / ilerleme | Aynı story ve identity kaynağı; `.story-controls`, `#story-progress`; yerel | 44px oklar + range. Sahne transport; uçtaki disabled durumu ve slider ayrı eksenlerdir. |
| S21 · Tekrar dene | [home.mjs](../../erdemozkara.com/features/home/home.mjs), [identity/site.mjs](../../erdemozkara.com/features/identity/site.mjs); `.loading button`, `.story-loading button`; yerel | Hata durumunda görünen sakin kurtarma eylemi. Hata oluşması danger türü gerektirmez. |

**Sayım ve aktiflik:** Site sahibi `work` ve legacy alias kopyaları dışındaki 154 kaynak HTML'i ve runtime üreticilerini inceledi. 140 sayfadaki arama kontrolü tek ailedir. Copy-table bileşeni mevcut fakat etkin kullanım bulunmadı. `.plain-button` geçen 33 sayfada yalnız stil kopyası vardır; bunlar 33 aktif kontrol veya yeni aile değildir. Temsili okuyucu, iletişim, Projeler ve hikâye görünümü incelendi.

Gerçek silme işlemi, submit formu veya video/audio oynatıcı yok. Hikâyedeki Atari anlatı görseli media kontrol ihtiyacı oluşturmaz. Transport/range ile media player aynı görev sayılmaz.

## Gerekli ve gereksiz ek türler

| Sonuç | Kanıt ve sınır |
| --- | --- |
| **Gerekli: düşük vurgulu yardımcı eylem sözleşmesi** | DT copy, Brand replay, site temizleme/tekrar deneme gerçek ihtiyaçtır. Quiet/utility görünüm; yeni güçlü CTA veya yeni vurgu rengi değil. |
| **Gerekli: görev bileşenlerini korumak** | Tab/seçim, menü/modal, disclosure, navigasyon/kart/sahne ve input/range kendi semantik/klavye davranışlarını taşır. CTA yaprak hareketi her copy/close kontrolüne yayılmaz. |
| **Gerekli: bağımsız sunum/durum eksenleri** | Icon-only, boyut/hedef alanı, disabled/loading, focus ve feedback mevcut görevlerde gereklidir; primary/secondary kardeşleri değildir. |
| **Gereksiz: üçüncü genel CTA/tertiary vurgu rengi** | Üç sahip incelemesi ek bir güçlü görsel öncelik gerektiren görev bulmadı. Normal link veya utility ihtiyacı bunun gerekçesi değildir. |
| **Gereksiz: şimdiden danger/success/form/download/media varyantları** | Destructive/submit/player görevi yok; indirme zaten link, Copied ise feedback. Gerçek yeni ihtiyaç gelmeden tür/API eklenmez. |

## Öncelikli sonraki adımlar ve migration istisnaları

1. **Yerel DT adayını bağımsız QA ve kullanıcı kabulünden geçirmek.** Teknik hover/focus geçişi yaratıcı kabul veya yayın değildir. Kalıcı vurgu, kontrast ve komşu yüzeyler korunmalı; önceki beyaz/turkuaz dar istisna yardımcı kontrole genellenmemeli.
2. **Sahiplik ve tüketici sınırını korumak.** Brand'in yerel kapsül butonları, site `.collection-cta` ve eski DT/hero kuralları ayrı kaynaklardır. Yeni DT sync'inde eski kurallar ortak sahibi ezmemeli. Brand [PRODUCT-EXPERIENCE](../../Oxara.Brand/docs/PRODUCT-EXPERIENCE.md) / usage guide uzlaşması ayrıca gerekir. Site resimsel `.primary`, plaka, hotspot ve story kontrolleri toplu dönüşüm dışındadır.
3. **Utility ve durum ilkelerini ayrı karara bağlamak.** Yeni CTA'da disabled/loading sunumu henüz tanımlı değildir; mevcut loader `disabled`/`aria-busy` kullanır. Copy-code/table feedback davranışları farklıdır. Görsel ve durum ilkeleri ortaklaştırılabilir; veri/handler sorumlulukları kör birleştirilmez.
4. **Hedef alanı ve semantiği ayrı değerlendirmek.** Tema/arama 38px, docs-menu 34px, scroll-top 40px, code-copy 24px ve table-copy yaklaşık 28,8px örnekleri vardır. Bu kaynak/görünüm ölçüleri tek başına WCAG başarısızlığı değildir; gerçek hit area, hedefler arası boşluk ve proje standardı ayrıca ölçülmelidir. Touch/yoğunluk istisnası bu değerlendirmeyle belirlenmeli. Search sonuçları tıklanabilir `div`; hikâyenin Ana sayfaya dön kontrolü `button` ile `location.assign('/')` kullanıyor: uygun navigasyon semantiğine geçiş adaylarıdır.
5. **Karardan sonra kontrollü geçiş planlamak.** Normal linkler butonlaştırılmaz; kartın birden çok hedefi kaybolmaz; menü kapatma/focus dönüşü, selected/pressed ve progressive enhancement korunur. Brand ve site sync'ini kendi sahipleri ayrı doğrular. Bu belge ürün/API değişikliği, yeni asset, genel test/build veya yayın başlatmaz.
