# Ink / Graphite tema uyumu

2026-11-20 kullanıcı kararı: Ink `#0B1D29`, Graphite `#173344`.
Brand kimlik/neutral kaynağıdır; DocumentTemplate arayüz semantiklerinin sahibidir.
Turkuaz kimlik ve ana CTA aynı kalır. Koyu görünüm kişisel sitenin manzarasını
veya maskotunu ortak şablona zorunlu olarak taşımaz.

## Tek kaynak

- `features/base/theme-tokens.json`: açık/koyu yüzey, metin, durum, kod, scrollbar,
  arama ve SVG rolleri.
- Brand'ın `document-template-web` manifesti: kimlik, Ink/Graphite, ana CTA ve
  tema bazlı okunabilir link/focus değerleri.
- `scripts/theme-colors.mjs`: bu kaynakları birleştirir.
- `scripts/sync-brand-consumer.mjs`: üretilen `theme-colors.css` ve kimlik
  varlıklarını senkronlar; `--check` salt okunur fark kontrolüdür.
- `base.css`, `theme-colors.css` dosyasını kendisi import eder. Tüketici yalnız
  `base.css` kullanıyorsa aynı alt dosya yapısını da taşımalıdır.

Koyu sayfa Ink, kart/panel Graphite, ikinci yüzey `#204354`, kod `#091824`.
Metin `#E6F0EF`, ikincil metin `#AFC4CB`, küçük bilgi `#99B4C0`.
`surface-muted` her iki temada tanımlıdır; hover şeffaflığa düşmez.

## Bileşen kapsamı

| Özellik | İncelenen yüzey/davranış | Doğrulama yeri |
| --- | --- | --- |
| base | Metin, tablo, callout, badge, endpoint, senaryo, details, SVG, inline code | document-components.html ve theme-preview.html |
| resource-card | Kart, ikincil metin, link ve aksiyon ikonları | document-components.html |
| author-link | Normal, hover ve focus | Tüm doküman başlıkları |
| docs-layout | Üst bar, sidebar, TOC, mobil çekmece, pagination, landing | index.html ve doküman sayfaları |
| theme | İki tema, ikon ve hover/focus | Tüm önizlemeler |
| code-highlight | Kod zemini ve bütün syntax rolleri | code-features.html |
| copy-code | Normal/hover/copied, klavyeyle kopyalama | theme-preview.html |
| copy-table | Hücre zemini, buton, copied/error ve kopyalama | code-features.html / theme-preview.html |
| sidemenu | Gerçek eski tip drawer aç/kapat/Escape; bulunmayan sayfada güvenli no-op | theme-preview.html ve regression testi |
| scroll-top | Nötr ok ikonu, turkuaz zemin, görünürlük | Uzun dokümanlar |
| reading-progress | İnce turkuaz ilerleme göstergesi | Doküman / tema önizlemesi |
| navigation-progress | Ortak renk ailesi ve yerel sayfa geçişi | Dokümanlar arası bağlantı |
| search | Trigger, modal, overlay, input, sonuç/vurgu, Escape | theme-preview.html |
| code-tabs | Normal/seçili sekme, panel, pointer ve klavye | code-features.html / theme-preview.html |

## Kontroller

`npm test`: teknik yayın motoru, davranış yükleyicisi, tema kontrast/freshness ve
drawer Escape regression testleri. Renk testleri normal/ikincil metni, syntax
rollerini, durum çiftlerini, arama vurgusunu ve focus'u gerçek tokenlarla ölçer.
Ana CTA'nın dar beyaz/turkuaz istisnası başka küçük metin/ikonlara yayılmaz.

Açık temada link/focus aynı turkuaz ailesinin koyu tonunu kullanır; yeni bir
ürün aksanı değildir. Dekoratif çizgi ve gölgeye normal metin eşiği uygulanmaz.
Kopyalandı durumunun ön planı temaya göre seçilir. Arama vurgusu anlamı korur.

Tarayıcı incelemesi: altı sayfa iki temada, üç mobil sayfa; sekme, kopyalama,
iki drawer türü, arama/Escape ve gezinme. Bu kapsamlı WCAG sertifikası değildir.
Görsel/siteye özel hero geçişi tüketici entegrasyonunda ayrıca doğrulanır.

[Canlı bileşen önizlemesi](theme-preview.html).
