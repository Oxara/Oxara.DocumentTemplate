# Oxara Document Template

Handbook, guide ve teknik makalelerde kullanılan ortak, domain-free doküman arayüzü.

Demo ve canli dokumantasyon: <https://oxara.github.io/Oxara.DocumentTemplate/>

## Tasarım yaklaşımı

Template'in varsayılan yapısı çok sayfalıdır:

- `index.html` kısa bir karşılama ve konu seçim sayfasıdır.
- Her ana konu ayri bir HTML sayfasinda tutulur.
- Sol menu sayfalar arasinda gezinmeyi saglar.
- Sag menu yalnizca aktif sayfanin `h2` ve `h3` basliklarini gosterir.
- Header aksiyon alaninda yazar veya ana site donus baglantisi icin `author-link`
  feature'i kullanilir.
- Header marka işaretinde metin kısaltması yerine açık ve koyu yüzeylere uygun
  gerçek iki renkli Oxara SVG çıktıları kullanılır; favicon ve PNG logo
  varyantları da aynı normatif Brand exportundan gelir. Kaynak ve yetkilendirme
  bilgisi [`docs/BRAND-ASSETS.md`](docs/BRAND-ASSETS.md) dosyasındadır.
- Ana icerik kolonu okunabilir bir genislikte tutulur.
- Kutu, callout ve vurgu yuzeyleri yalnizca anlam tasidiklarinda kullanilir.
- Giris sayfasindaki konu kartinin tamami baglantidir; kart icinde tekrar eden CTA metni kullanilmaz.
- Konu kartlari icerige gore boyutlanir; sabit veya minimum kart yuksekligi verilmez.
- Bir kaynak kartında depo, demo, paket veya mağaza gibi birden fazla hedef varsa
  kartın tamamı tek hedefe bağlanmaz; `resource-card` içindeki hedefler
  ayrı ve açık bağlantılar olarak gösterilir.
- Marka ve token değişiklikleri layout veya component yeniden tasarımı için yetki
  vermez. Başlıkları pill, badge veya buton görünümüne çevirmek, dekoratif gradient
  veya glow eklemek ve mevcut listeleri kartlaştırmak varsayılan olarak reddedilir.
  Ayrıntılı red kriterleri [`docs/DESIGN-GUARDRAILS.md`](docs/DESIGN-GUARDRAILS.md)
  dosyasındadır.

Tek sayfalik makale veya kisa rehberlerde eski `sidemenu` feature'i kullanilabilir. Uzun
handbook'lar icin varsayilan tercih `docs-layout` olmalidir.

## Baslangic

Yayın adayı için sürdürülen, AIO uyumlu `audit`, `quality`, `finalize` komutları
[Static web release checks](tools/release-checks/README.md) altında bulunur.
Bu araç eski DevKit çalışmış gibi rapor üretmez ve hiçbir Git/yayın işlemi yapmaz.

Repoyu fork'layin veya indirin. Template'in kullandigi tekil CSS ve JavaScript
feature dosyalari `features/` klasorunde bulunur. Birden fazla feature'i hazir
giris noktasindan yukleyen paketler `feature-packages/` klasorundedir.

Brand kimliği ve canonical consumer assetleri tek kontrollü komutla yenilenir.
Komut varsayılan olarak kardeş `Oxara.Brand` reposunu kullanır; farklı konum için
`OXARA_BRAND_HOME` ayarlanabilir. `--check` yazma yapmadan drift denetler:

```powershell
node scripts/sync-brand-consumer.mjs
node scripts/sync-brand-consumer.mjs --check
```

```html
<script src="features/theme/theme-boot.js"></script>
<link rel="stylesheet" href="feature-packages/core.css">

<script src="feature-packages/core.js"></script>
```

Tema kullanan sayfalarda `features/theme/theme-boot.js` CSS'ten once
calismalidir. Bu kucuk boot parcasi yalnizca localStorage'daki gecerli `light`
veya `dark` tercihini uygular; boylece dark modda beyaz flash, light modda siyah
flash olusturmaz.

Hazir paket yeterli degilse ihtiyaciniz olan feature dosyalarini yerel
`features/` klasorunden tek tek ekleyin. Dosya listesi ve bagimliliklar
[`features/features.json`](features/features.json) manifestinde bulunur. Hazir
paket listesi [`feature-packages/packages.json`](feature-packages/packages.json)
dosyasindadir.

Opsiyonel görsel açılışların sınırları ve ortak scrollbar/tema davranışı için
[Illustrated consumer integration](docs/ILLUSTRATED-CONSUMER-INTEGRATION.md) belgesine bakın.

## Feature kullanimi

- `features/` altindaki `base` ve diger feature'lar bu repoda gelistirilir.
- `feature-packages/` altindaki dosyalar feature degil, birden fazla feature'i
  birlikte yukleyen kolaylik paketleridir.
- Domain'e ozel icerik, renk veya davranis ortak feature'a eklenmez. Proje ihtiyaci ayri bir proje CSS dosyasinda tutulur.
- Handbook ana icerigi statik ve semantik HTML olarak yazilir; Markdown parser veya runtime icerik uretimi kullanilmaz.
- Kod orneklerinde okuyucuya yalnizca gercek JSON, XML veya kaynak kod gosterilir.
  `script.code-block` gibi teknik kapsayicilar sadece Template feature kullanimini
  anlatan orneklerde gorunur.

## Yapi

```text
Oxara.DocumentTemplate/
  index.html
  assets/
    example-article-cover.svg
  docs/
    getting-started.html
    document-components.html
    code-features.html
    navigation.html
    configuration.html
    reference.html
    changelog.html
  features/
    base/
    resource-card/
    author-link/
    docs-layout/
    theme/
    code-highlight/
    copy-code/
    copy-table/
    code-tabs/
    sidemenu/
    search/
    scroll-top/
    reading-progress/
    navigation-progress/
    features.json
  feature-packages/
    core.css
    core.js
    full.css
    full.js
    packages.json
```

## Surum yonetimi

Kullaniciya donuk her degisiklik ayni commit veya pull request icinde
[`docs/changelog.html`](docs/changelog.html) sayfasina eklenir.

Yeni surum yayinlanirken:

1. `Unreleased` maddeleri tarihli surum basligina tasinir.
2. Degisiklik ve changelog birlikte commit edilir.
3. Commit icin yeni bir annotated SemVer etiketi olusturulur.
4. Etiket origin'e gonderilir ve ayni notlarla GitHub Release olusturulur.

Yayinlanmis bir etiket silinmez, yeniden olusturulmaz veya baska bir commit'e
zorla tasinmaz. Duzeltmeler her zaman yeni bir patch surumuyle yayinlanir.

## Yeni dokuman

1. Ihtiyac duyulan feature listesini belirleyin.
2. Gerekli CSS ve JS dosyalarini yerel `features/` yollarindan ekleyin veya uygunsa `feature-packages/` altindaki `core` / `full` paketlerinden birini kullanin.
3. Uzun icerigi konu bazli HTML sayfalarina bolun.
4. Sol navigasyonu tum sayfalarda ayni bilgi mimarisiyle kullanin.
5. Gerekli feature HTML iskeletlerini canli rehberden alin.
6. Projeye ozel stilleri `document.css` gibi ayri bir dosyada tutun.
7. Giris kartlarinda `Konuyu ac` gibi tekrar eden aksiyon satirlari kullanmayin.

## Lisans

MIT

### Generated behavior entries

`node scripts/build-behavior-packages.mjs` generates `feature-packages/core.js`
and `full.js` from `scripts/behavior-packages.mjs`. Use `--check` to reject drift,
and `node --test scripts/behavior-packages.test.mjs` for lifecycle regressions.
Downloads start together; ordered classic-script evaluation retains feature
initialization order. Both entries share a per-document in-flight registry.
Consumer copies belong in the Brand shared-file drift contract.

## Tema uyumu

Ink/Graphite semantik sistemi ve14bileşen kapsamı: [THEME-COMPATIBILITY](docs/THEME-COMPATIBILITY.md). [Canlı tema önizlemesi](docs/theme-preview.html). Theme kaynağını değiştirdikten sonra `node scripts/sync-brand-consumer.mjs`, `npm test` ve `node scripts/sync-brand-consumer.mjs --check` çalıştırılır.

### Illustrated presentation implementation

Fixed painterly 2D defaults replace the initial vector demo following the user’s explicit generate-and-use instruction. Follow the [visual constraints](docs/ILLUSTRATED-VISUAL-STANDARD.md).

The landing uses registered document-hero; [live defaults and API](docs/illustrated-presentation.html). Omit custom art/prop slots to use fixed assets/presentation/atlas-painted-v1.webp and book-painted-v1.webp. Supply slots to override them; no topic-specific generation is required. document-hero is in core/full; illustrated-card is in full or imported with resource-card. Personal artwork/catalog/biography remain consumer-owned.

For a custom feature copy, include its `assets` and `requires` manifest entries along with CSS/JS. All default illustrations are fixed painterly WebP assets maintained in this repository. The normal landing intentionally supplies no custom image slots, proving the fallback contract rather than a consumer-specific mockup.

Görsel üretim kuralları, katman promptları ve meyvesiz dal/yaprak düzeltmesi: [ILLUSTRATION-GENERATION.md](docs/ILLUSTRATION-GENERATION.md). Canlı Görselli Sunum sayfasında da bulunur.
