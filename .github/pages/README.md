# Manuel GitHub Pages yayın tarifi

Workflow yalnız manuel dispatch ile incelenen commit ve artifact digest’ini dağıtır. 21 Kasım2026 salt okunur kontrolünde uzak Pages build_type=workflow idi; domain ve environment korumaları değiştirilmez. Yeni release için kaynak/test/artifact bağlaması yeniden doğrulanır.

## Yetkili yayın aşamasındaki sıra

1. Çalışma dalı `draft`, yayın ve default dalı `main`'dir. Yeni işe son yayın
   sonrasında eşitlenmiş `draft` üzerinden başlayın. Değişiklikleri `draft`'a
   commit/push edin ve `draft` → `main` PR'ı açın. Doğrudan `main` push'ı ile
   inceleme adımını atlamayın. Git ve yayın için açık yetki gerekir.
2. PR kapsamını ve ilgili test/artifact kanıtlarını bağımsız QA ve yayın
   sorumlusunun incelemesine sunun. Onaylanan PR'ı normal **merge commit** ile
   `main`'e alın; squash/rebase kullanmayın. İncelemenin ardından ek değişiklik
   gelirse yeniden inceleyin. Bu akış ürün sürümü/tag artışını tek başına gerektirmez.
3. Yayın sorumlusu Pages Source'un **GitHub Actions** olduğunu ve `github-pages`
   environment'ının mevcut koruma/izinli branch ayarlarını doğrular. Mevcut domain,
   URL ve korumalar korunur; ayar zaten doğruysa değiştirilmez. Eski branch/root
   kaynağı kullanılıyorsa yetkili sorumlu merge'den önce geçişi tamamlar.
4. Tam `main` merge commit'inin checkout'undan ilgili build/check/test ve public
   artifact kontrollerini çalıştırın. İncelenen merge commit SHA'sını ve
   `dist/docs/public-manifest.json` içindeki `inventoryDigest` değerini yayın
   kaydına bağlayın. `workflow_dispatch` dosyası `main`'de bulunmalıdır; push bu
   workflow'u çalıştırmaz. Actions → **Publish reviewed DT docs (manual)** → Run
   workflow: `main`'i seçin; `reviewed_sha` alanına incelenen tam merge commit SHA'sını,
   `artifact_digest` alanına onaylı 64 karakterli envanter hash'ini girin.
   Branch ucu ilerlemişse commit karşılaştırması çalışmayı durdurur.
5. Başarılı kurulum, docs build/check/test, public build/check ve digest kapısından
   sonra yalnız `dist/docs` yüklenir. Deploy ayrı job'dır; `needs: build` ve
   `github-pages` environment üzerinden aynı `github-pages` artifact'ini kullanır.
6. Gerçek run sonrası commit, run/deployment kimlikleri, artifact manifesti ve
   dönen Pages URL'siyle canlı kontrol yapılır. Bu kontroller olmadan “yayın geçti”
   denmez. Başarısız digest/test kapısı bypass edilmez.
7. Başarılı yayın ve canlı doğrulama sonrasında `draft`'ı yayımlanan `main`
   commit'ine **fast-forward** edin ve normal push yapın. Örnek: `git fetch origin`,
   `git switch main`, `git merge --ff-only origin/main`, `git switch draft`,
   `git merge --ff-only origin/main`, `git push origin draft`. Yerel `main` henüz
   yoksa `git switch --track origin/main` ile oluşturun. Her iki dalda da farklı
   yerel iş veya commit varsa işi ezmeden durun; fast-forward koşulunu kaldırmayın.
   Yerel ve uzak `draft`/`main` uçlarının hem tam commit SHA'sı hem tree SHA'sı
   birebir eşit olmalıdır; makbuza ikisini de kaydedin. Force push/reset ile
   farklı işi silmeyin. `draft` ilerlemiş veya ayrışmışsa eşitlik sağlanmış gibi
   raporlamayın; ilgili değişiklikleri inceleyip aynı PR/yayın akışıyla çözün.

Yerelde incelenen Windows çalışma ağacı ile daha sonra commit edilmiş Linux
checkout'u satır sonu normalizasyonu nedeniyle farklı byte/hash üretebilir.
Onaylanacak digest, **tam yayın commit'inin** incelenmiş çıktısına ait olmalıdır;
önceki yerel hash'in bütün gelecek commit/runner'larda aynı olduğu varsayılmaz.
Önceki bir başarılı runner/deploy yeni release’in geçtiği anlamına gelmez. Uyumsuzluk varsa yeni artifact
incelenir; digest kapısı kaldırılarak yayın yapılmaz.

## Dar izinler ve bağımlılıklar

- Workflow genelinde `permissions: {}`. Build: `contents: read`, `pages: read`.
  Deploy: yalnız `pages: write`, `id-token: write`; içerik yazımı/PAT yok.
- `configure-pages` için `enablement: false`; eksik Pages kaynağını veya siteyi
  otomatik açmaz. Gerekli dış ayar yukarıdaki yetkili sorumluda kalır.
- Yalnız `workflow_dispatch` vardır. Push, PR, schedule, workflow_run veya
  repository_dispatch tetikleyicisi yoktur. Varsayılan branch dışı run deploy etmez.
- `npm ci --ignore-scripts` kilitli bağımlılıkları kurar. Ürün komutları mevcut
  package.json scriptleridir. Raw repo root, çalışma kayıtları veya başka bir
  dizin artifact olarak yüklenmez. Dosya URL'leri ve consumer API değişmez.
- Tema testleri `OXARA_BRAND_HOME/exports/document-template-web/manifest.json`
  okur. Temiz runner için burada kanonik Brand exportunun byte-identical release
  girdisi tutulur. SHA256, mevcut `docs/BRAND-COMPATIBILITY.evidence.json` ile
  eşleşmeden testler başlamaz. Bu, yeni bir profil veya template fork'u değildir.
  Başka repo checkout'u gerekmez. Manifest değişirse önce kanonik Brand sahibi ve
  tüketici evidence/hash'i birlikte yeniden incelenir; snapshot keyfî değiştirilmez.
  Kaynak checkout HEAD'i, dirty export durumu, export/profile hashleri
  `brand-input.provenance.json` içinde açıkça kayıtlıdır; CI bunları mevcut
  consumer evidence ile karşılaştırır. Bu offline girdi, yerelde kanonik sibling
  ile çalışan `sync-brand-consumer.mjs --check` kontrolünün yerine geçmez;
  mevcut testte skip/fallback/pass istisnası eklenmedi.
- Bu `.github` dosyaları `dist/docs` public allowlist'ine dahil değildir.

## İncelenen sabit sürümler — 2026-11-21

GitHub'ın resmî release API'sindeki tag→commit eşlemesi ve aşağıdaki commitlerin
`action.yml` girdileri incelendi. Workflow tag yerine tam commit kullanır.

| Action | Release | Sabit commit |
| --- | --- | --- |
| actions/checkout | [v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| actions/setup-node | [v7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0) | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| actions/configure-pages | [v6.0.0](https://github.com/actions/configure-pages/releases/tag/v6.0.0) | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` |
| actions/upload-pages-artifact | [v5.0.0](https://github.com/actions/upload-pages-artifact/releases/tag/v5.0.0) | `fc324d3547104276b827a68afc52ff2a11cc49c9` |
| actions/deploy-pages | [v5.0.1](https://github.com/actions/deploy-pages/releases/tag/v5.0.1) | `368f82528645a54fb793d4d04e342629a3f51346` |

Upload action'ın içindeki upload-artifact bağımlılığı da tam SHA ile sabittir:
`bbbca2ddaa5d8feaa63e36b76fdaad77386f024f` (v7.0.0). Node `26.13.0` tam sürümdür;
[resmî SHA256 listesinde](https://nodejs.org/dist/v26.13.0/SHASUMS256.txt) Linux x64
tar.xz girdisi doğrulandı. GitHub-hosted `ubuntu-24.04` runner imajı sabit bir
container digest'i değildir; dış runner/deployment davranışı henüz sınanmadı.

## Resmî sözleşmeler

- [Custom Pages workflow, artifact ve job/environment sözleşmesi](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Pages publishing source seçimi](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [workflow_dispatch ve default branch koşulu](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch)

Dokümandaki örnek major sürümler yerine release API'sinde doğrulanan güncel
sürümler sabitlendi. Bu, GitHub.com içindir; GHES uyumluluğu varsayılmaz.

The reviewed web input includes typed web-action, companion-palette and resolver source hashes. CI binds these manifest inputs and the explicit published release status and source commit to the provenance snapshot; it does not treat the source checkout HEAD as a new Brand release. The live sibling sync validator checks all eight source hashes and resolves the three aliases through the verified Brand resolver.
