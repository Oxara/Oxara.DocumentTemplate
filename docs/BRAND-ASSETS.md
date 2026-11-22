# Oxara Brand asset provenance

DocumentTemplate kurumsal marka assetleri, yayımlanmış `Oxara.Brand v1.1.0` kaynağının `document-template-web` release exportundan alınır.
Consumer dosyaları elle çizilmez, yeniden renklendirilmez veya farklı bir
geometriyle üretilmez.

- Consumer authorization: `Oxara-Brand-Consumer-1.0`
- Base geometry: `ox-v1`
- Profile: `document-template-web`
- Profile SHA-256: `ce1ccb1ee33d87e0b103e17f64834b3699440030308ac84e33d7388d4a5e2aa5`
- Manifest SHA-256: `2caecbe84b38557975c117cb71962dfac40d166b76b296fc0bbacbd7593d1129`
- Identity accent: Oxara Turquoise 500 `#19C7B5`
- Consumer: `Oxara.DocumentTemplate`

## OG kapakları: Brand üretimi, DT tüketimi

Yeni ürün/doküman başlatırken OG kapağını Brand'in ortak medya ailesinden isteyin.
Kanonik [kapak master'ı](../../Oxara.Brand/templates/media-card-master.svg),
[exporter](../../Oxara.Brand/scripts/export-media-profile.mjs),
[media profile şeması](../../Oxara.Brand/schemas/media-profile.schema.json) ve
[export manifest şeması](../../Oxara.Brand/schemas/media-export-manifest.schema.json)
Oxara.Brand'a aittir. Bu bağlantılar kardeş checkout içindir. Kaynak eksikse Brand
sahibinden profil/çıktı devri isteyin; DT içinde ikinci master veya OG generator kurmayın.

Ortak oran, lacivert zemin, font, logo ve güvenli alanın sahibi Brand'dir; ürün adı,
kısa işlev metni ve ürüne özgü işaret profil girdileridir. Yeni ortak kapak dili
Brand'in güncel palet, dal/yaprak ve glow kaynaklarından geliştirilir; eski
erdemozkara.com OG'si yeni tasarım için zorunlu veya onaylı görsel referans değildir.
Brand sahibi önce tek ürün önizlemesi hazırlar ve yeni adayı değerlendirmeye sunar.
Mevcut canlı kapak, yeni adayın onayı ve yayın yetkisi olmadan değiştirilmez.

DT sahibi ürün adını, kısa açıklamayı, kanonik sayfa URL'sini ve görsel alt metnini
doğrular; bunları Brand sahibine kapak ihtiyacı olarak aktarır. Brand sahibi kendi
profil/export akışından üretilen adayın profil/manifest, çıktı yolu ve hash bilgisini
devreder. DT yalnız onaylanan çıktıyı açıkça belirlenmiş tüketici yoluna bağlar;
bu görev mevcut `document-template-web` pinine OG eklemez veya Brand sync başlatmaz.

Entegrasyonda DT; `canonical`, `og:url`, `og:title`, `og:description`, `og:image`
ve Twitter kartı alanlarının ürünle tutarlılığını, mutlak görsel URL'sini, gerçek
dosyanın boyut/MIME bilgisini, alt metnini ve public artifact'e dahil oluşunu
kontrol eder. Yayın sonrası HTTP erişimi ve sunulan görselin onaylı çıktıyla
eşleşmesi ayrıca doğrulanır. Yeni kapaklar kullanıcı görsel onayı ve ayrı yayın
yetkisi olmadan yayımlanmaz veya LinkedIn'e yüklenmez. Bu rehber bağlantısı bir
kapak üretildiği, onaylandığı ya da yayımlandığı anlamına gelmez.

DT metadata bağlaması `docs/site-metadata.json` içindedir: kanonik base URL,
ürün sahibinin alt metni, tüketilen output ID ve public görsel yolu burada tutulur.
`docs/product-media.manifest.json`, Brand teslim manifestinin byte-identical
kopyasıdır; medya girdisi yayımlanmış [Brand v1.3.0](https://github.com/Oxara/Oxara.Brand/releases/tag/v1.3.0)
paketinden alınır ve release commit'i manifestte korunur. Bu medya girdisi,
yukarıdaki sabit web asset pininden ayrıdır.
`npm run docs:build` ortak metadata'yı üretir; `npm run docs:check` ve
`npm run docs:public:check` manifest/hash, PNG ölçü/MIME ve public dosya dahil
oluşunu doğrular. Home kanonik base URL'yi, rehberler kendi dosya URL'lerini
kullanır; tema önizlemesi kendi kanonik URL'siyle `noindex,follow` kalır.
Public paket kontrolü ayrıca `node scripts/docs-metadata.mjs --root dist/docs --check`
ile çalıştırılabilir. Özel teslim klasörünün yolu metadata'ya veya runtime'a yazılmaz.

## Manifest compatibility set

Manifestteki 21 logical asset ID, source path ve consumer destination alanı
aşağıdaki gibi korunur. Destination değeri `—` olan rasterlar, farklı
boyutlarda geometri ve render doğrulaması için Brand exportunda tutulur; consumer
reposuna kopyalanmaz.

| Logical asset ID | Brand export path | Consumer destination |
| --- | --- | --- |
| `favicon.ico` | `favicon.ico` | `assets/favicon.ico` |
| `app-icon.180` | `png/app-icon-180.png` | `apple-touch-icon.png` |
| `app-icon.192` | `png/app-icon-192.png` | `assets/oxara-mark-192.png` |
| `app-icon.512` | `png/app-icon-512.png` | `assets/oxara-mark.png` |
| `app-icon.96` | `png/app-icon-96.png` | `assets/oxara-mark-96.png` |
| `favicon.png.16` | `png/favicon-16.png` | — |
| `favicon.png.32` | `png/favicon-32.png` | — |
| `favicon.png.48` | `png/favicon-48.png` | `favicon-48.png` |
| `mark.header.dark.24` | `png/mark-header-dark-24.png` | — |
| `mark.header.dark.28` | `png/mark-header-dark-28.png` | — |
| `mark.header.dark.32` | `png/mark-header-dark-32.png` | — |
| `mark.header.dark.48` | `png/mark-header-dark-48.png` | — |
| `mark.header.dark.64` | `png/mark-header-dark-64.png` | — |
| `mark.header.light.24` | `png/mark-header-light-24.png` | — |
| `mark.header.light.28` | `png/mark-header-light-28.png` | — |
| `mark.header.light.32` | `png/mark-header-light-32.png` | — |
| `mark.header.light.48` | `png/mark-header-light-48.png` | — |
| `mark.header.light.64` | `png/mark-header-light-64.png` | — |
| `favicon.svg` | `svg/favicon.svg` | `assets/favicon.svg` |
| `mark.header.dark` | `svg/mark-header-dark.svg` | `assets/oxara-mark-on-dark.svg` |
| `mark.header.light` | `svg/mark-header-light.svg` | `assets/oxara-mark.svg` |

## UI color roles

- `--identity-accent`: yalnız kurumsal kimlik ve kontrollü marka göstergesi;
  Turquoise 500 değerini taşır.
- `--ui-primary`, `--ui-primary-hover`, `--ui-primary-foreground`: birincil
  eylem yüzeyi, hover durumu ve beyaz foreground. Her iki temada yüzey
  `#19C7B5`, foreground `#FFFFFF` kalır. Ölçülen `2.13:1` kontrast, kullanıcı
  tarafından onaylanan dar CTA istisnasıdır; erişilebilirlik başarısı sayılmaz.
- `--ui-link*`: yüzeye göre kontrastı doğrulanmış metin bağlantıları.
- `--ui-focus`: klavye focus halkası.
- `--ui-indicator`: ilerleme ve küçük durum göstergeleri.
- `--ui-secondary-*`: düşük vurgulu ikincil eylemler ve nötr yüzeyler.

Identity accent ve primary action ayrı roller olarak kalır fakat aynı canonical
Turquoise değerine resolve olur. DocumentTemplate site veya doküman tipine özgü token yayımlamaz.
Brand geçişi; başlıkları butonlaştırmayı, gradient/glow eklemeyi, içerik
gridlerini kartlaştırmayı veya layout hiyerarşisini değiştirmeyi kapsamaz.

## Web action roles

The published Brandv1.1.0 web export binds primaryBackground, primaryForeground and primaryHover to typed aliases in Brand assets/tokens/web-actions.json. Current pairs are #19C7B5 / #0B1D29 and #BAC68D / #0B1D29; no contrast exception is carried forward. Non-web color.semantic.uiPrimary is unchanged. Source hashes for web actions, companion palette and the canonical resolver are checked before consumption.

This input is the real Brandv1.1.0 release artifact from commit7d9598cff104700c3d4bc95ddbc0d5fba27f5f50. The byte-identical manifest is retained under .github/pages with its published tag/commit and source-input hashes; the working-tree export is not relabelled. Use OXARA_BRAND_HOME for the verified release-artifact root (which contains exports/document-template-web and the required provenance sources).
