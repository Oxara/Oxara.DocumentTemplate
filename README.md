# Oxara Document Template

Handbook ve guide projelerinde kullanilan ortak, domain-free dokuman arayuzu.

Canli feature rehberi: `feature-guide.html`

## CDN kullanimi

Production ortaminda surum etiketini sabitleyin:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/base/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/theme/theme.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/code-highlight/code-highlight.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/copy-code/copy-code.css">

<script src="https://cdn.jsdelivr.net/gh/Oxara/Oxara.DocumentTemplate@v1.0.0/features/theme/theme.js"></script>
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
- Projelerdeki `features/` klasorleri dagitim kopyasidir; projeye ozel feature uretilmez.
- Ortak davranis gerekiyorsa once bu Template guncellenir, sonra hedef projeler senkronlanir.
- Domain'e ozel icerik, renk veya davranis ortak feature'a eklenmez. Proje ihtiyaci ayri bir proje CSS dosyasinda tutulur.
- Handbook ana icerigi statik ve semantik HTML olarak yazilir; Markdown parser veya runtime icerik uretimi kullanilmaz.

## Yapi

```text
Oxara.DocumentTemplate/
  index.html
  feature-guide.html
  features/
    base/
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

1. `index.html` dosyasini yeni proje klasorune kopyalayin.
2. Ihtiyac duyulan feature listesini belirleyin.
3. `tools/sync-features.ps1` ile feature'lari proje klasorune dagitin.
4. Projeye ozel stilleri `document.css` gibi ayri bir dosyada tutun.

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
