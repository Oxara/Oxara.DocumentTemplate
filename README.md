# Oxara DocumentTemplate

El kitapları, rehberler ve teknik makaleler için statik HTML, CSS ve JavaScript
bileşenleri. İçerik ve ürüne özel görseller tüketicide; ortak okuma, gezinme,
tema ve bileşen davranışları bu depoda yönetilir.

[Canlı dokümantasyon](https://oxara.github.io/Oxara.DocumentTemplate/) ·
[Sürüm 1.2.3](https://github.com/Oxara/Oxara.DocumentTemplate/releases/tag/v1.2.3) ·
[Değişiklikler](docs/changelog.html)

## Başlangıç

Repoyu indirin veya fork'layın; sayfalar statik bir HTTP sunucusuyla çalışır.
Yerel incelemede `npm run preview` kullanın (varsayılan `http://127.0.0.1:4203/`;
başka port: `npm run preview -- 4204`). Bu geliştirme sunucusu HTML/CSS/JS dahil
kaynakları `Cache-Control: no-cache` ve içerik tabanlı ETag ile her kullanımda
doğrular; browser cache açık kalır. Genel `python -m http.server` bu politikayı
sağlamaz ve eski menü/scriptlerin güncel dosyalarla karışmasına yol açabilir.
Docs üreticisi HTML kaynaklarını içerik hash'li `assets/docs-runtime/<revision>/`
grafiğine bağlar. CSS importları, görseller ve paket yükleyicisinin feature
scriptleri aynı değişmez ağaçtadır; bir alt kaynak değişirse HTML yeni revizyona
bağlanır. Üretilmiş ağacı elle düzenlemeyin; `npm run docs:build` kullanın.
Önceki revizyonlar açık eski sayfaların bağımlılıkları için korunur. Eski açık
HTML geriye dönük değişmez; normal yenileme yeni HTML'i ve yeni kaynak URL'lerini
alır. Hosting'in HTML doğrulama politikası ayrıca tüketiciye aittir. Bu sunucu
hosting/yayın değildir.
Hazır paketi sayfanızın göreli yoluna göre yükleyin:

```html
<script src="features/theme/theme-boot.js"></script>
<link rel="stylesheet" href="feature-packages/core.css">
<script src="feature-packages/core.js"></script>
```

`theme-boot.js` CSS'ten önce yüklenir; kayıtlı açık/koyu tercih ilk kareye uygulanır.
Sayfa içeriği statik ve semantik HTML'dir; runtime Markdown dönüştürmesi gerekmez.
Ayrıntılar: [başlangıç](docs/getting-started.html),
[paketler ve feature referansı](docs/reference.html).

## Bileşenler ve kaynakları

| Kaynak | Sorumluluk |
| --- | --- |
| `features/` ve `features/features.json` | Tekil bileşenler, bağımlılıklar ve varlık listesi |
| `feature-packages/` | Core/full CSS ve üretilmiş davranış girişleri |
| `scripts/behavior-packages.mjs` | Tek kaynaklı script sırası ve ortak yükleyici |
| `features/base/theme-tokens.json` | Ortak semantik tema rolleri |
| `assets/presentation/` | Sabit boyalı 2D hero/kart varsayılanları |
| `docs/` | Canlı örnekler, kullanım ve tasarım sözleşmeleri |
| `tools/release-checks/` | Statik web yayın denetim motoru |

Uzun belgelerde `docs-layout`, kısa tek sayfalarda isteğe bağlı `sidemenu`
kullanılır. Sol menü sayfalar arasında, sağ menü aktif sayfanın başlıklarında
gezinir. Arama, kod/tablo kopyalama, kod sekmeleri, okuma ilerlemesi ve tema
kontrolleri ihtiyaç duyulan feature veya paketle eklenebilir.

Core ve full girişleri aynı kaynak dosyadan üretilir. İndirmeler birlikte
başlar, klasik scriptler tanımlı sırayla çalışır; iki paket ortak in-flight
kaydını paylaşır. Tema, arama ve sidemenu düğmeleri kendi API'leri yüklenene
kadar devre dışıdır; ilk tıklama henüz yüklenmemiş bir fonksiyonu çağıramaz.
Giriş dosyaları elle değiştirilmez:

```powershell
node scripts/build-behavior-packages.mjs
node scripts/build-behavior-packages.mjs --check
```

## Dokümantasyon gezinmesi

Menü, arama dizini ve önceki/sonraki zincirinin tek kaynağı `docs/pages.json` dosyasıdır. Yeni rehber önce bu kataloğa eklenir; HTML içindeki ortak gezinme blokları ayrı ayrı düzenlenmez.

```powershell
npm run docs:build
npm run docs:check
npm test
```

`docs:build` mevcut içeriği koruyarak ortak blokları ve eksik bölüm başlık adreslerini üretir. `docs:check` drift, yerel link/anchor/asset, ARIA hedefi ve feature bağımlılıklarını denetler. Tarayıcıda mobil/masaüstü ve gerçek etkileşim kontrolünün yerine geçmez.

## Tasarım, hero ve kartlar

Okunabilir içerik, tutarlı bilgi yoğunluğu ve erişilebilir gezinme önceliklidir.
Brand değişikliği düzeni yeniden tasarlama izni değildir. Başlıkları pill/badge
veya butona dönüştürmeyin; dekorasyon için yeni panel ve kartlar eklemeyin.
[Tasarım sınırları](docs/DESIGN-GUARDRAILS.md) normatif kaynaktır.

Tek hedefli konu kartı tam yüzey bağlantı olabilir. Depo, demo, paket veya mağaza
hedefleri farklıysa `resource-card` içinde ayrı ve açık bağlantılar kullanılır.
İç içe link ve aynı hedef için tekrarlanan aksiyon satırları kullanılmaz.

`document-hero` core/full paketlerinde, `illustrated-card` full paketindedir.
Base yerel Manrope ve JetBrains Mono fontlarını, OFL lisanslarını ve kaynak
provenance'ını içerir; tekil kurulumda manifestteki base `assets` alanı da taşınır.
Tüketicinin mevcut typography foundation'u varsa yalnız gerekli bileşenleri ve
semantik tema renklerini kullanabilir.

Özel artwork verilmezse aynı sabit atlas, kapalı kitap ve meyvesiz dal/yaprak
seti kullanılır. Konu başına veya çalışma anında görsel üretilmez.
Özel arka plan/prop/growth slotları varsayılanları değiştirir; kişisel sahne,
maskot, katalog veya biyografi ortak template'e taşınmaz.

- [Canlı hero/kart örnekleri ve API](docs/illustrated-presentation.html)
- [Görsel standart](docs/ILLUSTRATED-VISUAL-STANDARD.md)
- [Kalıcı üretim kuralları ve promptlar](docs/ILLUSTRATION-GENERATION.md)
- [Tüketici entegrasyonu](docs/ILLUSTRATED-CONSUMER-INTEGRATION.md)
- [Tema uyumu](docs/THEME-COMPATIBILITY.md) ve [tema önizlemesi](docs/theme-preview.html)

Bir feature'ı tek başına kopyalarken manifestteki `requires` ve `assets`
bağımlılıklarını da taşıyın. Ürüne özel metin, adres ve CSS tüketicide kalır.

## Brand eşleme ve geliştirme

OX geometrisi, kimlik renkleri ve izinli istisnaların sahibi Oxara.Brand'dır.
Eşleme varsayılan olarak kardeş depoyu kullanır; başka konum için
`OXARA_BRAND_HOME` verilebilir. Üretilen `theme-colors.css`, `base.css` ile
birlikte tüketilir. [Brand kaynak bilgisi](docs/BRAND-ASSETS.md).

```powershell
npm ci --ignore-scripts
node scripts/sync-brand-consumer.mjs
npm test
node scripts/sync-brand-consumer.mjs --check
```

`--check` yazmadan drift denetler. Testler tema kontrastı, loader sırası/hata
akışı, hero lifecycle, drawer güvenliği ve yayın denetimi regresyonlarını kapsar.

## Yayın ve sürümleme

[Audit → quality → finalize](tools/release-checks/README.md) motoru tüketicinin
release config'iyle çalışır. `quality`, aynı artifact'e bağlı gerçek tarayıcı
kanıtını ve kaynak kontrollerini ister. `finalize` paket hazırlığını doğrular;
Git veya hosting yayını yapmaz. Teknik geçiş ve yaratıcı kabul ayrı kayıtlardır.
`routingMode: "cloudflare-pages"`, denetimde `.html` kaynaklarını hosting'in
uzantısız adresleriyle eşler. Varsayılan dosya modu ve GitHub Pages değişmez;
ortak yol politikası `scripts/public-route-addresses.mjs` sahibindedir.

Kullanıcıya görünen değişiklikler aynı commit'te [changelog](docs/changelog.html)
içine yazılır. Sürüm commit'i annotated SemVer etiketi ve aynı notlarla GitHub
Release üzerinden yayımlanır. Yayımlanmış etiket değiştirilmez; düzeltme yeni
patch sürümüdür. Tarihî GitHub Pages yapılandırması `main` dalı/kök çıktısını kullanır; bu çalışma
hosting ayarını değiştirmez. Çalışma ağacını bütünüyle yayınlamak, `work/` gibi
özel kayıtları taşıyabilir. İncelenen public dağıtım sınırı `dist/docs/` dizinidir:

```powershell
npm run docs:build
npm run docs:public
npm run docs:public:check
```

Üretici yalnız on sayfa, bileşen/paket kaynakları, aktif içerik revizyonlu graph,
bağımlı görseller/fontlar/lisanslar ve isteğe bağlı teknik Markdown rehberlerini
taşır. `work`, `.planning`, AGENTS, test/araç kaynakları ve tarihî runtime graphları
çıktıda bulunmaz. `public-manifest.json` bütün public dosyaları hash ile tanımlar.
Bu çıktı GitHub Pages artifact'i olarak kullanılabilir; Actions/Pages ayarı veya
canlı yayın bu komutlarla yapılmaz. Raw repo root dağıtımı bu artifact'in özel
kaynak sınırı garantisini devralmaz. Yayın onayından sonra yayın sorumlusu mevcut
Pages source ayarını doğrular; onaylı dağıtım işi `dist/docs/` dizinini artifact
olarak yükleyecek şekilde seçilir. Bu onay ve hosting geçişi yapılana kadar
`main`/root yapılandırmasının değiştiği varsayılmaz. Dosya URL'leri ve consumer
API'leri aynı kalır; yeni route veya hosting sağlayıcısı zorunlu değildir.

İncelemeye hazır [manuel Pages workflow'u](.github/workflows/pages-manual.yml)
ve [yayın runbook'u](.github/pages/README.md), yalnız `workflow_dispatch` ile
incelenen commit ve artifact digest'ini doğrular; yalnız `dist/docs` yüklenir.
Önce yetkili sorumlu Pages source'u Actions'a çevirir, ardından incelenen commit
yetkili olarak alınır ve manuel run seçilir. Bu yerel hazırlık hosting ayarını
değiştirmez ve yayın yapmaz.

## Lisans

[MIT](LICENSE).
