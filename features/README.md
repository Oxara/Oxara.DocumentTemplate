# Feature usage guide

> Canonical kaynak: <https://github.com/Oxara/Oxara.DocumentTemplate/tree/main/features>
>
> Bu klasordeki dosyalar ortak Template'in parcasidir. Proje kopyalarinda dogrudan
> degisiklik yapmayin; once Template'i guncelleyip senkron aracini calistirin.

Bu rehberin amaci, `features/` klasorundeki parcalari baska bir HTML sayfasina kopyalarken "hangi dosya neye bagli, HTML'de ne bekliyor, hangi senaryoda ne kullanmaliyim?" sorularini tek yerden cevaplamaktir.

Mevcut `e-gider-pusulasi.html` ornegi tum feature'lari birlikte kullanan tam ornektir. Bu README ise daha sonra ayni feature'lari parca parca tasirken kaybolmamak icindir.

Gorsel ve kopyalanabilir ornekler icin kok dizindeki `index.html` dosyasini acin. Bu sayfa feature'larin kendisini kullanarak hazirlanmis canli bir rehberdir.

## Mental model

Feature'lari iki grupta dusunun:

- `base`: Ortak tasarim zemini. Renk tokenlari, typo, container, tablo, callout, endpoint kartlari gibi dokuman stillerini verir.
- Diger feature'lar: Tek bir davranis veya UI parcasi ekler. Ornegin `theme`, `search`, `sidemenu`.

En guvenli kural:

```text
Bir feature'in CSS dosyasini aliyorsan, yanina base/base.css de al.
```

JS dosyalari ise mumkun oldugunca kendi kendine calisir. Tek siralama kurali: `copy-code.js`, `code-highlight.js` sonrasinda yuklenmelidir.

## Dosya yapisi

```text
features/
  base/
    base.css
  theme/
    theme.css
    theme.js
  code-highlight/
    code-highlight.css
    code-highlight.js
  copy-code/
    copy-code.css
    copy-code.js
  sidemenu/
    sidemenu.css
    sidemenu.js
  scroll-top/
    scroll-top.css
    scroll-top.js
  reading-progress/
    reading-progress.css
    reading-progress.js
  search/
    search.css
    search.js
  features.json
  README.md
```

`features.json` makine/otomasyon icin kisa manifesttir. Insan icin asil aciklama bu README'dedir.

## En hizli tam kurulum

Tum feature'lari mevcut ornekteki gibi kullanmak istiyorsaniz:

```html
<head>
  <link rel="stylesheet" href="features/base/base.css">
  <link rel="stylesheet" href="features/theme/theme.css">
  <link rel="stylesheet" href="features/code-highlight/code-highlight.css">
  <link rel="stylesheet" href="features/copy-code/copy-code.css">
  <link rel="stylesheet" href="features/sidemenu/sidemenu.css">
  <link rel="stylesheet" href="features/scroll-top/scroll-top.css">
  <link rel="stylesheet" href="features/reading-progress/reading-progress.css">
  <link rel="stylesheet" href="features/search/search.css">
</head>
<body>
  <!-- Feature HTML iskeletleri burada olur. Asagidaki bolumlerde tek tek anlatiliyor. -->

  <script src="features/theme/theme.js"></script>
  <script src="features/code-highlight/code-highlight.js"></script>
  <script src="features/copy-code/copy-code.js"></script>
  <script src="features/sidemenu/sidemenu.js"></script>
  <script src="features/scroll-top/scroll-top.js"></script>
  <script src="features/reading-progress/reading-progress.js"></script>
  <script src="features/search/search.js"></script>
</body>
```

## Yukleme sirasi

CSS:

1. `base/base.css`
2. Istedigin feature CSS dosyalari

JS:

1. `theme/theme.js` erken yuklenebilir. Tema tercihini sayfa acilisinda uygular.
2. `code-highlight/code-highlight.js`
3. `copy-code/copy-code.js`
4. Digerleri herhangi bir sirada yuklenebilir: `sidemenu`, `scroll-top`, `reading-progress`, `search`

Pratikte mevcut sira iyi bir varsayilandir:

```html
<script src="features/theme/theme.js"></script>
<script src="features/code-highlight/code-highlight.js"></script>
<script src="features/copy-code/copy-code.js"></script>
<script src="features/sidemenu/sidemenu.js"></script>
<script src="features/scroll-top/scroll-top.js"></script>
<script src="features/reading-progress/reading-progress.js"></script>
<script src="features/search/search.js"></script>
```

## Feature secim rehberi

| Ihtiyac | Kullanilacak feature |
| --- | --- |
| Sadece dokuman sayfasi stilleri, tablo, callout, endpoint kartlari | `base` |
| Light/dark tema butonu | `base` + `theme` |
| Kod bloklarini otomatik formatlama ve renklendirme | `base` + `code-highlight` |
| Kod bloklarina kopyala butonu | `base` + `code-highlight` + `copy-code` |
| Basliklardan otomatik sol/yan menu | `base` + `sidemenu` |
| Sayfa icinde Ctrl+K arama | `base` + `search` |
| Basa don butonu | `base` + `scroll-top` |
| Okuma ilerleme cubugu | `base` + `reading-progress` |
| Mevcut rehber gibi tam dokuman deneyimi | Hepsi |

## base

### Ne zaman kullanilir?

Hemen hemen her durumda kullanilir. Diger CSS dosyalari renk, yuzey, border, shadow gibi tokenlari `base/base.css` icinden alir.

### Dosya

```html
<link rel="stylesheet" href="features/base/base.css">
```

### Sagladigi ortak class'lar

Klavye kullanicilari icin icerige atlama linki:

```html
<a class="skip-link" href="#main-content">Icerige atla</a>
<main id="main-content" tabindex="-1">
  ...
</main>
```

Link normal durumda ekran disindadir, klavye ile odaklandiginda gorunur. Hedef elementte benzersiz bir `id` olmalidir.

Dokuman layout:

```html
<div class="container section-dividers">
  <header class="doc-header">
    <h1>Baslik</h1>
    <p class="subtitle">Alt baslik</p>
    <div class="meta">
      <span>Versiyon</span>
      <span>Tarih</span>
    </div>
  </header>

  <section>
    <h2>Birinci konu</h2>
  </section>
  <section>
    <h2>Ikinci konu</h2>
  </section>
</div>
```

`section-dividers` opsiyoneldir. Eklendiginde ilk section haric, kapsayicinin dogrudan cocugu olan her section basina silik bir ayirici ve nefes alani otomatik eklenir. HTML'e ayri bir cizgi elementi yazilmaz.

Icindekiler kutusu:

```html
<nav class="toc">
  <h2>Icindekiler</h2>
  <ol>
    <li><a href="#s1">Bolum 1</a></li>
  </ol>
</nav>
```

Tablo wrapper:

```html
<div class="table-wrapper">
  <table>
    <thead>
      <tr><th>Alan</th><th>Aciklama</th></tr>
    </thead>
    <tbody>
      <tr><td>Id</td><td>Tekil kimlik</td></tr>
    </tbody>
  </table>
</div>
```

Rowspan ile ortak kural gostermek:

```html
<div class="table-wrapper">
  <table>
    <thead>
      <tr><th>Alan</th><th>Deger</th><th>Kural</th></tr>
    </thead>
    <tbody>
      <tr><td>TypeCode</td><td><code>IADE</code></td><td></td></tr>
      <tr><td>SchemeId</td><td><code>PASAPORTNO</code></td><td></td></tr>
      <tr><td>ChannelCodeName</td><td><code>IADE_PROVIDER</code></td><td rowspan="3">Kargo -> zorunlu</td></tr>
      <tr><td>VerificationInfo.Type</td><td><code>IADEKODU</code></td></tr>
      <tr><td>CargoCompany</td><td>Dolu</td></tr>
    </tbody>
  </table>
</div>
```

Notlar:

- Ayni kural birden fazla satiri kapsiyorsa, kural metnini ilk ilgili satira koyup `rowspan` kullanin.
- `rowspan` olan satirlarin altinda eksik hucre yazmayin; HTML zaten kapsayan hucreyi devam ettirir.
- Base tablo stili `rowspan` hucresi ilk sutundaysa saga, diger sutunlardaysa sola dikey cizgi ekler. Bu nedenle grup etiketi veya ortak kural, kapsadigi satirlardan dogru tarafta ayrilir.

Callout:

```html
<div class="callout callout-info">Bilgilendirme metni</div>
<div class="callout callout-warning">Dikkat edilmesi gereken metin</div>
<div class="callout callout-error">Hata veya yasakli durum</div>
<div class="callout callout-success">Basarili durum</div>
```

Editoryal kullanim:

- Callout, normal paragraftan daha onemli ve okuyucunun eylemini degistiren bilgi icindir.
- Ayni konu icin art arda callout dizmeyin; iliskili riskleri tek kutuda birlestirin.
- Gercek hayat ornegi, ipucu veya ilgili bolum baglantisi tek basina callout nedeni degildir.
- Ornekleri `<p class="content-example"><strong>Ornek:</strong> ...</p>` ile, bolum baglantilarini `<nav class="section-links">...</nav>` ile verin.
- Emoji ile anlam kodlamayin. `Uyari`, `Uygun`, `Uygun degil` gibi acik etiketler kullanin.

Slogan banner:

```html
<div class="slogan-banner">
  <p class="slogan-message">
    <span class="slogan-highlight">Global</span> Kaydet,
    <span class="slogan-highlight">Yerel</span> Goruntule
  </p>
  <p class="slogan-description">Tek kural. Zamani UTC olarak sakla, kullanicinin diliminde goster.</p>
</div>
```

Kisa ve akilda kalici bir ilkeyi, ana kurali veya bolum sonucunu vurgulamak icin kullanin. Uzun aciklama, uyari veya hata metinlerinde slogan yerine uygun `callout` turunu tercih edin.

Icerik resmi:

```html
<figure class="content-figure">
  <img
    src="images/request-flow.webp"
    alt="Request akisini gosteren uygulama ekran goruntusu"
    width="1280"
    height="720"
    loading="lazy"
    decoding="async">
  <figcaption>Request olusturma ekraninin temel alanlari.</figcaption>
</figure>
```

Varyantlar:

- Standart ekran goruntusu ve fotograflar icin `.content-figure` kullanin.
- Dar gorseller icin `content-figure is-compact` kullanin.
- Logo veya kendi zemini olan seffaf gorseller icin `content-figure is-unframed` kullanin.

Kurallar:

- Aciklayici `alt` metni yazin. Gorsel tamamen dekoratifse `alt=""` kullanin.
- Mumkunse gercek `width` ve `height` degerlerini yazin; sayfa yuklenirken layout kaymasini azaltir.
- Ilk ekranda bulunmayan resimlerde `loading="lazy"` kullanin.
- Resmi CSS ile kirpmayin; varsayilan stil gercek en-boy oranini korur.
- Kaynak, tarih veya aciklama gerekiyorsa `figcaption` kullanin.
- Metni resmin icine gommek yerine HTML metni olarak yazmayi tercih edin.

Badge:

```html
<span class="badge-required">Z</span>
<span class="badge-optional">O</span>
<span class="badge-conditional">S</span>
```

Senaryo karti:

```html
<div class="scenario-card">
  <h4 id="scenario-1">Senaryo basligi</h4>
  <p class="scenario-description">Senaryonun kisa aciklamasi.</p>
</div>
```

Endpoint karti:

```html
<div class="endpoint-card">
  <div class="endpoint-header">
    <span class="endpoint-method method-post">POST</span>
    <span class="endpoint-path">/api/example</span>
  </div>
  <div class="endpoint-body">
    <p class="endpoint-description">Endpoint aciklamasi.</p>
  </div>
</div>
```

### Not

`.header-actions` da base icindedir. Theme ve search butonlarini sag uste birlikte koymak icin kullanilir.

```html
<div class="header-actions">
  <!-- search-trigger ve theme-toggle burada olabilir -->
</div>
```

## theme

### Ne zaman kullanilir?

Kullanici light/dark tema degistirebilsin istiyorsaniz kullanin.

### Dosyalar

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/theme/theme.css">

<script src="features/theme/theme.js"></script>
```

### HTML iskeleti

```html
<button class="theme-toggle" onclick="theme.toggleTheme()" aria-label="Tema degistir">
  <span class="theme-toggle-icon">☀️</span>
  <span class="theme-toggle-label">Dark</span>
</button>
```

Genelde sag ustte kullanmak icin:

```html
<div class="header-actions">
  <button class="theme-toggle" onclick="theme.toggleTheme()" aria-label="Tema degistir">
    <span class="theme-toggle-icon">☀️</span>
    <span class="theme-toggle-label">Dark</span>
  </button>
</div>
```

### API

```js
theme.toggleTheme();
theme.setTheme('dark');
theme.setTheme('light');
```

### Davranis

- Secim `localStorage` icinde `theme` key'i ile saklanir.
- Tema `<html data-theme="dark">` veya `<html data-theme="light">` uzerinden uygulanir.
- CSS tokenlari `base.css` icindedir.

### Sik hata

`theme.toggleTheme is not defined` hatasi aliyorsaniz `theme/theme.js` yuklenmemis veya button JS dosyasindan once calisiyordur.

## code-highlight

### Ne zaman kullanilir?

Sayfada HTML/XML, JSON, C#, Bash, YAML veya SQL kod bloklari varsa ve okunabilir formatta gosterilsin istiyorsaniz kullanin.

### Dosyalar

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/code-highlight/code-highlight.css">

<script src="features/code-highlight/code-highlight.js"></script>
```

### HTML kullanimi: normal pre/code

```html
<pre><code class="language-csharp">
BackgroundJob.Enqueue(() => Console.WriteLine("Merhaba"));
</code></pre>
```

### HTML kullanimi: script.code-block

HTML icinde XML/JSON yazarken karakter kacirma derdini azaltmak icin:

```html
<script class="code-block language-xml" type="text/plain">
<Root>
  <Id>123</Id>
</Root>
</script>
```

`code-highlight.js` bunu otomatik olarak `pre > code` blokuna cevirir.

### API

Public helper vardir, genelde kullanmak zorunda degilsiniz:

```js
CodeHighlight.formatCode(code, 'json');
CodeHighlight.highlightXml(xmlText);
CodeHighlight.highlightCode(code, 'csharp');
```

### Desteklenen diller

- `html`, `xml`
- `json`
- `csharp`, `cs`
- `bash`, `shell`, `sh`
- `yaml`, `yml`
- `sql`

Dil, `language-*` class'i ile acikca verilmelidir. Desteklenmeyen diller guvenli bicimde escape edilir ve duz kod metni olarak gosterilir.

### Not

`copy-code` feature'i kullanacaksaniz `code-highlight.js` once, `copy-code.js` sonra yuklenmelidir. Cunku `copy-code.js` sayfadaki `pre` bloklarini bulup buton ekler.

## copy-code

### Ne zaman kullanilir?

Kod bloklarinin sag ustunde "Copy" butonu olsun istiyorsaniz kullanin.

### Dosyalar

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/code-highlight/code-highlight.css">
<link rel="stylesheet" href="features/copy-code/copy-code.css">

<script src="features/code-highlight/code-highlight.js"></script>
<script src="features/copy-code/copy-code.js"></script>
```

### HTML iskeleti

Ekstra HTML gerekmez. Sayfada `pre > code` varsa buton otomatik eklenir:

```html
<pre><code>
curl https://example.com
</code></pre>
```

### Davranis

- Her `pre` icine `.code-copy-button` button ekler.
- Clipboard API basarisiz olursa fallback olarak `document.execCommand('copy')` dener.

### Sik hata

Kod bloklari `script.code-block` olarak yazildiysa ve copy-code butonu gelmiyorsa script sirasi yanlistir. Dogru sira:

```html
<script src="features/code-highlight/code-highlight.js"></script>
<script src="features/copy-code/copy-code.js"></script>
```

## sidemenu

### Ne zaman kullanilir?

Uzun dokumanlarda bolum basliklarindan otomatik sol menu uretmek istiyorsaniz kullanin.

### Dosyalar

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/sidemenu/sidemenu.css">

<script src="features/sidemenu/sidemenu.js"></script>
```

### HTML iskeleti

Body basinda:

```html
<nav class="sidenav" id="sidenav">
  <div class="sidenav-header">
    <span>Icindekiler</span>
    <button class="sidenav-close" onclick="sidemenu.closeSidenav()" aria-label="Menuyu kapat">&times;</button>
  </div>
  <div id="sidenav-body"></div>
</nav>

<div class="sidenav-overlay" id="sidenavOverlay" onclick="sidemenu.closeSidenav()"></div>

<button class="menu-toggle" onclick="sidemenu.toggleSidenav()" aria-label="Menuyu ac">
  <svg viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
</button>
```

Icerik yapisi:

```html
<div class="container">
  <section id="s1">
    <h2 id="s1-title">1. Ana bolum</h2>
    <h3 id="s1-subtitle">Alt bolum</h3>
    <h4 id="s1-detail">Detay baslik</h4>
  </section>
</div>
```

### Neyi tarar?

Varsayilan olarak `.container` icinde sunlari tarar:

```css
section h2[id], section h3[id], section h4[id]
```

Basliklarda `id` yoksa menude link uretemez.

`.demo-output` icindeki basliklar varsayilan olarak menude indekslenmez:

```html
<div class="demo-output">
  <h2 id="demo-title">Yalnizca gorsel ornek</h2>
</div>
```

Bu kapsayicinin altindaki `h2`, `h3` ve `h4` basliklari menude indekslenmez.

### API

```js
sidemenu.toggleSidenav();
sidemenu.closeSidenav();
```

### Opsiyonel config

Mevcut ornekte kullanilmiyor. Defaultlar yeterli degilse JS dosyasindan once ekleyin:

```html
<script>
window.SIDEMENU_CONFIG = {
  contentSelector: '.container',
  scrollOffset: 150,
  mobileBreakpoint: 900,
  groupSelector: '.level-badge',
  groupLabels: {
    TEMEL: 'Temel Seviye',
    ORTA: 'Orta Seviye',
    ILERI: 'Ileri Seviye',
    UZMAN: 'Uzman Seviye'
  }
};
</script>
<script src="features/sidemenu/sidemenu.js"></script>
```

`groupSelector` verilirse `h2` icindeki eslesen etiket menu linkinden cikarilir ve ard arda gelen
ayni etiketli bolumler tek bir grup basligi altinda gosterilir. `groupLabels`, kaynak etiketi
okunabilir menu basligina cevirir. Gruplama gerekmiyorsa bu iki ayari eklemeyin.

### Sik hata

- Menu bos geliyorsa basliklarda `id` yoktur veya `contentSelector` yanlistir.
- Tiklayinca `sidemenu is not defined` diyorsa `sidemenu.js` yuklenmemistir.
- CSS var ama menu acilmiyorsa `#sidenav`, `#sidenavOverlay` veya `#sidenav-body` eksiktir.

## search

### Ne zaman kullanilir?

Uzun dokumanlarda Ctrl+K ile sayfa ici arama istiyorsaniz kullanin.

### Dosyalar

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/search/search.css">

<script src="features/search/search.js"></script>
```

### HTML iskeleti

Tetik butonu:

```html
<button class="search-trigger" onclick="search.openSearch()" aria-label="Arama yap">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="10" cy="10" r="7"/>
    <line x1="21" y1="21" x2="15" y2="15"/>
  </svg>
  <span>Ara</span>
  <kbd>Ctrl+K</kbd>
</button>
```

Genelde tema ile birlikte:

```html
<div class="header-actions">
  <button class="search-trigger" onclick="search.openSearch()" aria-label="Arama yap">
    <span>Ara</span>
    <kbd>Ctrl+K</kbd>
  </button>

  <button class="theme-toggle" onclick="theme.toggleTheme()" aria-label="Tema degistir">
    <span class="theme-toggle-icon">☀️</span>
    <span class="theme-toggle-label">Dark</span>
  </button>
</div>
```

Modal:

```html
<div class="search-overlay" id="searchOverlay" onclick="search.closeSearchOnOverlay(event)">
  <div class="search-modal" onclick="event.stopPropagation()">
    <div class="search-input-wrapper">
      <input type="text" class="search-input" id="searchInput" placeholder="Arama yap..." autocomplete="off">
      <button class="search-close" onclick="search.closeSearch()" aria-label="Kapat">×</button>
    </div>
    <div class="search-results" id="searchResults"></div>
  </div>
</div>
```

### Neyi arar?

Varsayilan olarak `.container` icinde su yapilari indeksler:

- `section`
- `.scenario-card`
- `.endpoint-card`
- `.table-wrapper`
- `.callout`
- `h2[id]`, `h3[id]`, `h4[id]`
- `pre code`, `.code-block`

### API

```js
search.openSearch();
search.closeSearch();
search.closeSearchOnOverlay(event);
search.navigateToResult(anchor, sectionId);
```

### Opsiyonel config

Mevcut ornekte kullanilmiyor. Defaultlari degistirmek isterseniz:

```html
<script>
window.SEARCH_CONFIG = {
  contentSelector: '.container',
  maxResults: 50,
  debounceMs: 200,
  noResultsText: 'Sonuc bulunamadi.',
  sectionTypes: {
    'scenario-card': 'Senaryo',
    'endpoint-card': 'Endpoint',
    'table-wrapper': 'Tablo',
    'callout': 'Not'
  }
};
</script>
<script src="features/search/search.js"></script>
```

### Sik hata

- Ctrl+K calismiyorsa `search.js` yuklenmemis olabilir.
- Modal aciliyor ama sonuc yoksa `.container` yoktur veya aranacak icerik script yuklenmeden sonra dinamik ekleniyordur.
- Sonuca tiklayinca kaymiyorsa ilgili baslik/section icin `id` yoktur.

## scroll-top

### Ne zaman kullanilir?

Uzun sayfalarda kullanici asagi indikten sonra basa kolayca donebilsin istiyorsaniz kullanin.

### Dosyalar

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/scroll-top/scroll-top.css">

<script src="features/scroll-top/scroll-top.js"></script>
```

### HTML iskeleti

```html
<button class="scroll-top" id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Basa don">
  <svg viewBox="0 0 24 24">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
</button>
```

### Opsiyonel config

Mevcut ornekte kullanilmiyor. Butonun daha erken/gec gorunmesini isterseniz:

```html
<script>
window.SCROLL_TOP_CONFIG = { threshold: 400 };
</script>
<script src="features/scroll-top/scroll-top.js"></script>
```

## reading-progress

### Ne zaman kullanilir?

Uzun makale ve teknik dokumanlarda kullanicinin sayfadaki ilerlemesini gostermek istiyorsaniz kullanin. Kisa sayfalarda gerekli degildir.

### Dosyalar

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/reading-progress/reading-progress.css">

<script src="features/reading-progress/reading-progress.js"></script>
```

### HTML iskeleti

```html
<div class="reading-progress" id="readingProgress" aria-hidden="true"></div>
```

Element `body` basinda bulunabilir. Feature varsayilan olarak tum dokumanin kaydirilabilir yuksekligini olcer.

### Opsiyonel config

Belirli bir icerik kapsayicisinin ilerlemesini olcmek veya farkli bir element kimligi kullanmak icin config'i JS dosyasindan once tanimlayin:

```html
<script>
window.READING_PROGRESS_CONFIG = {
  elementId: 'readingProgress',
  contentSelector: '.container'
};
</script>
<script src="features/reading-progress/reading-progress.js"></script>
```

## Minimal kopyalama paketleri

### Sadece tema

```text
features/base/base.css
features/theme/theme.css
features/theme/theme.js
```

HTML:

```html
<button class="theme-toggle" onclick="theme.toggleTheme()" aria-label="Tema degistir">
  <span class="theme-toggle-icon">☀️</span>
  <span class="theme-toggle-label">Dark</span>
</button>
```

### Sadece arama

```text
features/base/base.css
features/search/search.css
features/search/search.js
```

HTML: `search-trigger`, `search-overlay`, `searchInput`, `searchResults`.

### Sadece sidemenu

```text
features/base/base.css
features/sidemenu/sidemenu.css
features/sidemenu/sidemenu.js
```

HTML: `#sidenav`, `#sidenavOverlay`, `#sidenav-body`, `menu-toggle`.

### Kod bloklari + copy-code

```text
features/base/base.css
features/code-highlight/code-highlight.css
features/code-highlight/code-highlight.js
features/copy-code/copy-code.css
features/copy-code/copy-code.js
```

Script sirasi:

```html
<script src="features/code-highlight/code-highlight.js"></script>
<script src="features/copy-code/copy-code.js"></script>
```

## Opsiyonel konfigurasyonlari nereye koymaliyim?

Mevcut `e-gider-pusulasi.html` orneginde config blogu yoktur. Cunku default degerler yeterlidir.

Config blogunu yalnizca defaultlari degistirmek istediginizde ekleyin. Eklerseniz ilgili JS dosyasindan once gelmelidir:

```html
<script>
window.SEARCH_CONFIG = { contentSelector: '.docs-content' };
</script>
<script src="features/search/search.js"></script>
```

## Yeni uygulamaya tasima checklist'i

1. Hangi feature'lara ihtiyacin oldugunu sec.
2. Her feature icin gerekli CSS/JS dosyalarini kopyala.
3. `base/base.css` dosyasini unutma.
4. HTML iskeletini ilgili feature bolumunden kopyala.
5. Script siralamasinda `code-highlight` -> `copy-code` kuralina dikkat et.
6. Icerik container'in `.container` degilse `SEARCH_CONFIG` veya `SIDEMENU_CONFIG` ile override et.
7. Basliklarin menu/arama navigasyonu icin `id` aldigindan emin ol.

## Degisiklik yaparken dikkat

- Public API isimleri feature namespace'i ile baslamali: `search.openSearch()`, `sidemenu.toggleSidenav()`, `theme.toggleTheme()`.
- Yeni bir feature eklersen `features.json` ve bu README'yi beraber guncelle.
- Bir class adini degistirirsen HTML, CSS ve JS selector'larini birlikte ara.
- Kullanilmiyor gibi gorunen semantic utility'leri hemen silme. Ornek: `callout-success` mevcut sayfada olmayabilir ama baska dokumanda gerekli olabilir.

## Handbook icerik formati

- Handbook sayfalari statik, semantik HTML olarak yazilmalidir.
- Icerik bir JavaScript string'i, Markdown sabiti veya runtime template icinde tutulmamalidir.
- `marked`, Markdown parser veya sayfa acilisinda Markdown -> HTML donusumu kullanilmaz.
- Baslik, tablo, kod blogu, callout, sekme ve diagramlar kaynak HTML icinde dogrudan bulunmalidir.
- JavaScript yalnizca feature davranislari icin kullanilir; ana icerigi uretmez.
- Donusum araci kullanilsa bile repoya yazilan nihai `index.html` tamamen statik ve tek basina okunabilir olmalidir.
- Her bolumde bilgi hiyerarsisi once duz metin, sonra gerekli tablo veya kod, en son kritik callout olacak sekilde kurulmalidir.
- Seviye bilgisi baslik rozetinde varsa ayrica callout olarak tekrarlanmamalidir.
- Karar tablolari `Durum / Oneri / Ornek veya gerekce` gibi dolu ve eylem odakli sutunlar kullanmalidir.
- Bos `Kullan` ve `Kullanma` sutunlari, tik/carpı emojileri ve ne anlattigi belirsiz matrisler kullanilmamalidir.

## SVG tema kurali

- Inline SVG'lerde sabit `fill` veya `stroke` hex renkleri kullanilmaz.
- Kart zemini icin `var(--svg-box)`, ana metin icin `var(--svg-text)`, yardimci metin icin `var(--svg-muted)` kullanilir.
- Genel cizgi ve ayiricilar `var(--svg-line)` veya `var(--svg-stroke)` kullanir.
- Anlamsal renkler `var(--svg-brand-s)`, `var(--svg-ok-s)`, `var(--svg-warn-s)` ve `var(--svg-err-s)` tokenlarindan secilir.
- Renkli zemin gerekiyorsa ilgili `--svg-*-bg` tokeni kullanilir.
- Yeni veya donusturulen her diagram hem light hem dark temada kontrol edilir.
- Diagram kendi `<style>` bloguna sahip olabilir; ancak renk degerleri yine ortak tokenlardan gelmelidir.

## Hizli sorun giderme

| Belirti | Muhtemel sebep |
| --- | --- |
| Stil bozuk, renkler yok | `base/base.css` yuklenmemis veya once yuklenmemis. |
| Button tiklaninca `... is not defined` | Ilgili feature JS dosyasi yok veya script sirasinda gec yukleniyor. |
| Sidemenu bos | Basliklarda `id` yok veya `contentSelector` yanlis. |
| Search sonuc bulmuyor | `.container` icinde aranacak icerik yok veya config selector yanlis. |
| Copy Code butonu yok | `copy-code.js` yuklenmemis, `pre > code` yok veya `copy-code.js` code-highlight'tan once yuklenmis. |
| Tema ikon/label guncellenmiyor | `.theme-toggle-icon` veya `.theme-toggle-label` eksik. |


## code-tabs

### Ne zaman kullanılır?

Aynı konunun farklı teknoloji, provider veya yaklaşım örneklerini sekmelerle göstermek için kullanılır.
Her panel kendi içinde yerel olarak değiştirilebilir. Aynı `data-code-tabs-group` değerini taşıyan
paneller, opsiyonel global seçim kontrolüyle birlikte değiştirilebilir.

### Dosyalar

```html
<link rel="stylesheet" href="features/base/base.css">
<link rel="stylesheet" href="features/code-tabs/code-tabs.css">
<script src="features/code-tabs/code-tabs.js"></script>
```

### HTML sözleşmesi

```html
<div class="code-tabs-global" data-code-tabs-global="client">
  <div class="code-tabs-global-copy">
    <span class="code-tabs-global-label">Kod örneği tercihi</span>
    <span class="code-tabs-global-description">Bu gruptaki tüm sekmeli örnekleri birlikte değiştirir.</span>
  </div>
  <div class="code-tabs-global-options" role="group" aria-label="Kod örneği tercihi">
    <button type="button" data-code-option="rest">REST API</button>
    <button type="button" data-code-option="dotnet">.NET Client</button>
  </div>
</div>

<div class="code-tabs" data-code-tabs data-code-tabs-group="client" data-code-tabs-default="rest">
  <div class="code-tabs-list" data-code-tabs-list>
    <button class="code-tab" type="button" data-code-tab data-code-option="rest">REST API</button>
    <button class="code-tab" type="button" data-code-tab data-code-option="dotnet">.NET Client</button>
  </div>
  <div class="code-tab-panel" data-code-panel data-code-option="rest">...</div>
  <div class="code-tab-panel" data-code-panel data-code-option="dotnet">...</div>
</div>
```

### Davranış

- Sekmeye tıklamak yalnızca ilgili paneli değiştirir.
- Global kontrol yalnızca aynı group değerindeki panelleri değiştirir.
- Global tercih `localStorage` içinde group bazında saklanır.
- Sol/sağ ok, Home ve End tuşlarıyla klavye navigasyonu desteklenir.
- Option ve group adları domain bağımsızdır; feature provider isimlerini bilmez.

### Yerlesim standardi

- Global kontrol ilgili konu `section`'i icinde bulunur.
- Ilk eslesen `.code-tabs` panelinden hemen once yer alir.
- `.header-actions` yalnizca arama ve tema gibi sayfa seviyesindeki aksiyonlari icerir; global kod/provider secimi buraya konmaz.
- Kontrolun baslik ve kisa aciklama alani korunur. Yalnizca butonlardan olusan baglamsiz bir toolbar kullanilmaz.
- Global kontrol, ayni `data-code-tabs-group` degerini kullanan en az iki panel varsa tercih edilir. Tek panelde yerel sekmeler genellikle yeterlidir.
