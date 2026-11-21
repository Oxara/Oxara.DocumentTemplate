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
