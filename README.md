# Oxara Document Template

Handbook, guide ve teknik makalelerde kullanilan ortak, domain-free dokuman arayuzu.

Demo ve canli dokumantasyon: <https://oxara.github.io/Oxara.DocumentTemplate/>

## Tasarim yaklasimi

Template'in varsayilan yapisi cok sayfalidir:

- `index.html` kisa bir karsilama ve konu secim sayfasidir.
- Her ana konu ayri bir HTML sayfasinda tutulur.
- Sol menu sayfalar arasinda gezinmeyi saglar.
- Sag menu yalnizca aktif sayfanin `h2` ve `h3` basliklarini gosterir.
- Header aksiyon alaninda yazar veya ana site donus baglantisi icin `author-link`
  feature'i kullanilir.
- Header marka isaretinde text kisaltmasi yerine `assets/oxara-mark.svg`
  uzerinden `oxara-brand-mark` kullanilir; favicon ve PNG logo varyantlari da
  DocumentTemplate asset kaynagindan gelir.
- Ana icerik kolonu okunabilir bir genislikte tutulur.
- Kutu, callout ve vurgu yuzeyleri yalnizca anlam tasidiklarinda kullanilir.
- Giris sayfasindaki konu kartinin tamami baglantidir; kart icinde tekrar eden CTA metni kullanilmaz.
- Konu kartlari icerige gore boyutlanir; sabit veya minimum kart yuksekligi verilmez.

Tek sayfalik makale veya kisa rehberlerde eski `sidemenu` feature'i kullanilabilir. Uzun
handbook'lar icin varsayilan tercih `docs-layout` olmalidir.

## Baslangic

Repoyu fork'layin veya indirin. Template'in kullandigi tekil CSS ve JavaScript
feature dosyalari `features/` klasorunde bulunur. Birden fazla feature'i hazir
giris noktasindan yukleyen paketler `feature-packages/` klasorundedir.

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
