/**
 * COPY-CODE.JS — pre bloklarına otomatik "Copy" butonu ekler
 * Bağımlılık: copy-code.css, code-highlight.js (code-highlight'tan sonra yüklenmeli)
 *
 * Kullanım:
 *   <script src="code-highlight/code-highlight.js"></script>
 *   <script src="copy-code/copy-code.js"></script>
 *
 * copy-code.js, code-highlight.js'in DOM işlemlerini tamamlamasından sonra
 * çalışması için aynı DOMContentLoaded kuyruğunu kullanır.
 * code-highlight.js olmadan yalnızca mevcut pre > code bloklarına buton ekler.
 */
(function () {
    'use strict';

    var COPY_LABEL   = 'Copy';
    var COPIED_LABEL = '✓ Copied';
    var RESET_MS     = 1500;

    function attachCopyButtons() {
        document.querySelectorAll('pre').forEach(function (codeBlockWrapper) {
            /* Zaten buton varsa tekrar ekleme */
            if (codeBlockWrapper.querySelector('.code-copy-button')) return;

            var code = codeBlockWrapper.querySelector('code');
            if (!code) return;

            var copyButton = document.createElement('button');
            copyButton.className = 'code-copy-button';
            copyButton.type      = 'button';
            copyButton.textContent = COPY_LABEL;

            var resetTimer;
            copyButton.setAttribute('aria-live', 'polite');
            copyButton.addEventListener('click', function () {
                clearTimeout(resetTimer);
                copyButton.classList.remove('is-copied', 'is-error');
                var text = code.textContent || '';
                copyButton.disabled = true;
                copyButton.setAttribute('aria-busy', 'true');
                var restoreFocus = false;
                function fallback() {
                    return new Promise(function (resolve, reject) {
                        var field = document.createElement('textarea');
                        field.value = text;
                        field.setAttribute('readonly', '');
                        field.style.cssText = 'position:fixed;top:-999px;opacity:0';
                        document.body.appendChild(field);
                        field.select();
                        try {
                            if (document.execCommand('copy')) resolve();
                            else reject(new Error('Copy command failed'));
                        } catch (error) { reject(error); }
                        finally { restoreFocus = document.activeElement === field; field.remove(); }
                    });
                }
                var operation = navigator.clipboard && navigator.clipboard.writeText
                    ? navigator.clipboard.writeText(text).catch(fallback) : fallback();
                operation.then(function () {
                    copyButton.textContent = COPIED_LABEL;
                    copyButton.classList.add('is-copied');
                }).catch(function () {
                    copyButton.textContent = 'Copy failed';
                    copyButton.classList.add('is-error');
                }).finally(function () {
                    copyButton.disabled = false;
                    copyButton.removeAttribute('aria-busy');
                    if (restoreFocus) copyButton.focus({preventScroll:true});
                    resetTimer = setTimeout(function () {
                        copyButton.textContent = COPY_LABEL;
                        copyButton.classList.remove('is-copied', 'is-error');
                    }, RESET_MS);
                });
            });

            codeBlockWrapper.appendChild(copyButton);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachCopyButtons);
    } else {
        attachCopyButtons();
    }
})();
