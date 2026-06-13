# Oxara Document Template

Handbook, guide ve teknik makalelerde kullanilan ortak, domain-free dokuman arayuzu.

Canli dokumantasyon ve feature rehberi: <https://oxara.github.io/Oxara.DocumentTemplate/>

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

## CDN kullanimi

Production ortaminda surum etiketini sabitleyin:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/base/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/theme/theme.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/docs-layout/docs-layout.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/code-highlight/code-highlight.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/copy-code/copy-code.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/navigation-progress/navigation-progress.css">

<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/theme/theme.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/docs-layout/docs-layout.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/code-highlight/code-highlight.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/copy-code/copy-code.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@refs/tags/v1.0.2/features/navigation-progress/navigation-progress.js"></script>
```

Gelistirme sirasinda en guncel `main` branch'i kullanilabilir:

```text
https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@main/features/...
```

`@main` degisebilir ve cache nedeniyle gec guncellenebilir. Production projelerinde daima
`@refs/tags/v1.0.2` gibi bir tag veya commit SHA kullanin.

Tum feature asset yollarini `features/features.json` manifestinde bulabilirsiniz.

## Kaynak kurali

- `features/` altindaki `base` ve diger feature'lar bu repoda gelistirilir.
- Projeler varsayilan olarak surumlenmis jsDelivr URL'lerini kullanir; yerel `features/` kopyasi tutulmaz.
- Ortak davranis gerekiyorsa once bu Template guncellenir, sonra hedef projeler senkronlanir.
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
5. Tuketici projeler yeni etikete acikca gecirilir.

Yayinlanmis bir etiket silinmez, yeniden olusturulmaz veya baska bir commit'e
zorla tasinmaz. Duzeltmeler her zaman yeni bir patch surumuyle yayinlanir.

## Yeni dokuman

1. Ihtiyac duyulan feature listesini belirleyin.
2. Gerekli CSS ve JS dosyalarini surumlenmis jsDelivr URL'leriyle ekleyin.
3. Uzun icerigi konu bazli HTML sayfalarina bolun.
4. Sol navigasyonu tum sayfalarda ayni bilgi mimarisiyle kullanin.
5. Gerekli feature HTML iskeletlerini canli rehberden alin.
6. Projeye ozel stilleri `document.css` gibi ayri bir dosyada tutun.
7. Giris kartlarinda `Konuyu ac` gibi tekrar eden aksiyon satirlari kullanmayin.

## Yayin standardi

Her handbook ve guide yayinlanmadan once ayni temel dosya ve metadata standardini
saglamalidir:

- Kok dizinde projeyi ve canli dokumani aciklayan tek bir `README.md` bulunur.
- Kok dizinde projenin kullanim kosullarini tanimlayan bir `LICENSE` dosyasi
  bulunur. Oxara dokuman projelerinde varsayilan lisans MIT'dir.
- `README.md`, `og-image.svg` kapak gorselini en ustte gosterir.
- Kok dizinde 1200 x 630 boyutunda bir `og-image.svg` bulunur.
- Her HTML sayfasinda kendisine ait `canonical` ve `og:url` adresi bulunur.
- Her HTML sayfasinda tek bir `og:image` ve tek bir `twitter:image` bulunur; ikisi
  de kokteki ayni mutlak `og-image.svg` URL'sine baglanir.
- Sosyal gorsel metadata'sinda `image/svg+xml`, 1200 x 630 olcu ve erisilebilir
  alt metin bilgileri yer alir. Twitter kart tipi `summary_large_image` olur.
- Handbook OG gorselleri ortak yerlesimi kullanir: koyu zemin ve panel, ortali
  marka isareti, baslik, kisa aciklama, kapsam satiri, seviye rozetleri, konu
  ozeti ve yayin adresi. Yalnizca marka rengi ve icerik metni degisir.
- Handbook `README.md` dosyalari su sirayi izler: kapak, deger onerisi, canli
  baglantilar, cozuldugu problemler, hedef kitle, seviyeli icerik haritasi,
  yaklasim, production ilkeleri, teknik yapi, katki ve lisans.
- `sitemap.xml`, index dahil yayinlanan tum HTML sayfalarini icerir.
- Yeni sayfa eklendiginde veya yol degistirildiginde sitemap ve metadata birlikte
  guncellenir.
- Bir dokumanda ortak tasarim, navigasyon, metadata veya yayin yapisi degistiginde
  ayni template'i kullanan diger dokumanlar da kontrol edilir.
- Ortak bir eksik veya tutarsizlik tekrar ediyorsa yalnizca ilgili proje
  duzeltilmez; kural ve otomatik kontrol Template reposuna eklenir.

Bu kontrolleri calistirmak:

```powershell
.\tools\validate-document.ps1 -DocumentRoot ..\ornek-handbook
```

Metadata ve sitemap'i tum HTML sayfalarindan yeniden olusturmak:

```powershell
.\tools\update-document-metadata.ps1 `
  -DocumentRoot ..\ornek-handbook `
  -SiteUrl https://oxara.github.io/ornek-handbook/ `
  -SiteName "Ornek Gelistirici El Kitabi"
```

Tum handbook klasorunu birlikte kontrol etmek:

```powershell
.\tools\validate-handbook-suite.ps1 -HandbooksRoot ..\..\Handbooks
```

Donusumu tamamlanan secili handbook'lari kontrol etmek:

```powershell
.\tools\validate-handbook-suite.ps1 `
  -HandbooksRoot ..\..\Handbooks `
  -Projects hangfire-handbook,elasticsearch-handbook
```

`tools/sync-features.ps1` yalnizca offline veya vendored asset gerektiren istisnai projeler icindir.

Tum feature'lari dagitmak:

```powershell
.\tools\sync-features.ps1 -TargetRoot ..\ornek-handbook
```

Sadece secilen feature'lari dagitmak:

```powershell
.\tools\sync-features.ps1 `
  -TargetRoot ..\ornek-handbook `
  -Features theme,code-highlight,copy-code,sidemenu
```

`base` her zaman otomatik eklenir. `copy-code` secilirse `code-highlight` da otomatik eklenir.

## Lisans

MIT
