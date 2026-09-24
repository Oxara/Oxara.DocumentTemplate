# Oxara Brand asset provenance

DocumentTemplate kurumsal marka assetleri, aktif `Oxara.Brand` çalışma
ağacındaki `document-template-web` profilinin normatif exportundan alınır.
Consumer dosyaları elle çizilmez, yeniden renklendirilmez veya farklı bir
geometriyle üretilmez.

- Consumer authorization: `Oxara-Brand-Consumer-1.0`
- Base geometry: `ox-v1`
- Profile: `document-template-web`
- Profile SHA-256: `7753c63dc4587ee9d75e49c157e87b54d9c87d743ba9626b28ab50e0e3034990`
- Manifest SHA-256: `4111e6e7e69ae13b1f8b1bf7fd2c6286ad7476078f43323f35bdb0c6c0434e4f`
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
