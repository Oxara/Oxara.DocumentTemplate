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

Tek sayfalik makale veya kisa rehberlerde eski `sidemenu` feature'i kullanilabilir. Uzun
handbook'lar icin varsayilan tercih `docs-layout` olmalidir.

## CDN kullanimi

Production ortaminda surum etiketini sabitleyin:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/base/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/theme/theme.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/docs-layout/docs-layout.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/code-highlight/code-highlight.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/copy-code/copy-code.css">

<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/theme/theme.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/docs-layout/docs-layout.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/code-highlight/code-highlight.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/copy-code/copy-code.js"></script>
```

Gelistirme sirasinda en guncel `main` branch'i kullanilabilir:

```text
https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@main/features/...
```

`@main` degisebilir ve cache nedeniyle gec guncellenebilir. Production projelerinde daima
`@v1.0.0` gibi bir tag veya commit SHA kullanin.

Tum feature asset yollarini `features/features.json` manifestinde bulabilirsiniz.

## Kaynak kurali

- `features/` altindaki `base` ve diger feature'lar bu repoda gelistirilir.
- Projeler varsayilan olarak surumlenmis jsDelivr URL'lerini kullanir; yerel `features/` kopyasi tutulmaz.
- Ortak davranis gerekiyorsa once bu Template guncellenir, sonra hedef projeler senkronlanir.
- Domain'e ozel icerik, renk veya davranis ortak feature'a eklenmez. Proje ihtiyaci ayri bir proje CSS dosyasinda tutulur.
- Handbook ana icerigi statik ve semantik HTML olarak yazilir; Markdown parser veya runtime icerik uretimi kullanilmaz.

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
    features.json
    README.md
  tools/
    sync-features.ps1
```

## Yeni dokuman

1. Ihtiyac duyulan feature listesini belirleyin.
2. Gerekli CSS ve JS dosyalarini surumlenmis jsDelivr URL'leriyle ekleyin.
3. Uzun icerigi konu bazli HTML sayfalarina bolun.
4. Sol navigasyonu tum sayfalarda ayni bilgi mimarisiyle kullanin.
5. Gerekli feature HTML iskeletlerini canli rehberden alin.
6. Projeye ozel stilleri `document.css` gibi ayri bir dosyada tutun.

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
