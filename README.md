# Oxara Document Template

Handbook, guide ve teknik makalelerde kullanilan ortak, domain-free dokuman arayuzu.

Demo ve canli dokumantasyon: <https://oxara.github.io/Oxara.DocumentTemplate/>

## Tasarim yaklasimi

Template'in varsayilan yapisi cok sayfalidir:

- `index.html` kisa bir karsilama ve konu secim sayfasidir.
- Her ana konu ayri bir HTML sayfasinda tutulur.
- Sol menu sayfalar arasinda gezinmeyi saglar.
- Sag menu yalnizca aktif sayfanin `h2` ve `h3` basliklarini gosterir.
- Ana icerik kolonu okunabilir bir genislikte tutulur.
- Kutu, callout ve vurgu yuzeyleri yalnizca anlam tasidiklarinda kullanilir.
- Giris sayfasindaki konu kartinin tamami baglantidir; kart icinde tekrar eden CTA metni kullanilmaz.
- Konu kartlari icerige gore boyutlanir; sabit veya minimum kart yuksekligi verilmez.

Tek sayfalik makale veya kisa rehberlerde eski `sidemenu` feature'i kullanilabilir. Uzun
handbook'lar icin varsayilan tercih `docs-layout` olmalidir.

## Baslangic

Repoyu fork'layin veya indirin. Template'in kullandigi tum ortak CSS ve JavaScript
dosyalari `features/` klasorunde bulunur; ek bir paket veya uzak kaynak gerekmez.

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/theme/theme.css">
<link rel="stylesheet" href="features/docs-layout/docs-layout.css">

<script src="features/theme/theme.js"></script>
<script src="features/docs-layout/docs-layout.js"></script>
```

Ihtiyaciniz olan diger feature dosyalarini ayni sekilde yerel `features/`
klasorunden ekleyin. Dosya listesi ve bagimliliklar
[`features/features.json`](features/features.json) manifestinde bulunur.

## Feature kullanimi

- `features/` altindaki `base` ve diger feature'lar bu repoda gelistirilir.
- Domain'e ozel icerik, renk veya davranis ortak feature'a eklenmez. Proje ihtiyaci ayri bir proje CSS dosyasinda tutulur.
- Handbook ana icerigi statik ve semantik HTML olarak yazilir; Markdown parser veya runtime icerik uretimi kullanilmaz.
- Kod orneklerinde okuyucuya yalnizca gercek JSON, XML veya kaynak kod gosterilir.
  `script.code-block` gibi teknik kapsayicilar sadece Template feature kullanimini
  anlatan orneklerde gorunur.

## Yapi

```text
Oxara.DocumentTemplate/
  index.html
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
    docs-layout/
    theme/
    code-highlight/
    copy-code/
    code-tabs/
    sidemenu/
    search/
    scroll-top/
    reading-progress/
    navigation-progress/
    features.json
  tools/
    sync-features.ps1
    update-document-metadata.ps1
    validate-document.ps1
    validate-handbook-suite.ps1
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
2. Gerekli CSS ve JS dosyalarini yerel `features/` yollarindan ekleyin.
3. Uzun icerigi konu bazli HTML sayfalarina bolun.
4. Sol navigasyonu tum sayfalarda ayni bilgi mimarisiyle kullanin.
5. Gerekli feature HTML iskeletlerini canli rehberden alin.
6. Projeye ozel stilleri `document.css` gibi ayri bir dosyada tutun.
7. Giris kartlarinda `Konuyu ac` gibi tekrar eden aksiyon satirlari kullanmayin.

## Lisans

MIT
