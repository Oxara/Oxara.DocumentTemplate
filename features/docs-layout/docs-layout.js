/**
 * DOCS-LAYOUT.JS — Çok sayfalı doküman navigasyonu ve sayfa içi başlıklar
 * Bağımlılık: docs-layout.css
 */
(function () {
    'use strict';

    var sidebar;
    var overlay;
    var tocLinks = [];

    var menuButtons = [];
    var mobile = window.matchMedia('(max-width: 860px)');
    var returnFocus;
    var previousOverflow = '';

    function setNavigationState(open) {
        menuButtons.forEach(function (button) { button.setAttribute('aria-expanded', String(open)); });
        if (!sidebar) return;
        sidebar.inert = mobile.matches && !open;
        if (mobile.matches && !open) sidebar.setAttribute('aria-hidden', 'true');
        else sidebar.removeAttribute('aria-hidden');
        if (mobile.matches && open) {
            sidebar.setAttribute('role', 'dialog');
            sidebar.setAttribute('aria-modal', 'true');
        } else {
            sidebar.removeAttribute('role');
            sidebar.removeAttribute('aria-modal');
        }
    }

    function closeNavigation(restoreFocus) {
        var wasOpen = sidebar && sidebar.classList.contains('open');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        if (wasOpen) document.body.style.overflow = previousOverflow;
        setNavigationState(false);
        if (wasOpen && restoreFocus !== false && returnFocus && returnFocus.isConnected) returnFocus.focus();
    }

    function toggleNavigation() {
        if (!sidebar || !overlay || !mobile.matches) return;
        if (sidebar.classList.contains('open')) { closeNavigation(); return; }
        returnFocus = document.activeElement;
        previousOverflow = document.body.style.overflow;
        sidebar.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        setNavigationState(true);
        var first = sidebar.querySelector('a[href], button:not([disabled])');
        if (first) first.focus();
    }

    function handleNavigationKey(event) {
        if (!sidebar || !mobile.matches || !sidebar.classList.contains('open')) return;
        if (event.key === 'Escape') { event.preventDefault(); closeNavigation(); return; }
        if (event.key !== 'Tab') return;
        var items = Array.from(sidebar.querySelectorAll('a[href], button:not([disabled])')).filter(function (item) { return !item.hidden; });
        var first = items[0], last = items[items.length - 1];
        if (!first) return;
        if (!sidebar.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
        }
    }

    function buildToc() {
        var container = document.querySelector('[data-docs-toc]');
        var article = document.querySelector('.docs-article');
        if (!container || !article) return;

        var headings = Array.from(article.querySelectorAll(':scope > section > h2[id], :scope > section > h3[id]'));
        headings.forEach(function (heading) {
            var link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = heading.textContent.replace(/^\d+\.\s*/, '').trim();
            link.dataset.level = heading.tagName === 'H3' ? '3' : '2';
            container.appendChild(link);
            tocLinks.push({ link: link, heading: heading });
        });

        if (headings.length === 0) {
            var toc = document.querySelector('.docs-toc');
            if (toc) toc.hidden = true;
        }
    }

    function setActiveToc() {
        if (tocLinks.length === 0) return;
        var offset = window.scrollY + 140;
        var active = tocLinks[0];
        tocLinks.forEach(function (entry) {
            if (entry.heading.offsetTop <= offset) active = entry;
        });
        tocLinks.forEach(function (entry) {
            entry.link.classList.toggle('active', entry === active);
        });
    }

    function markCurrentPage() {
        var current = new URL(window.location.href);
        document.querySelectorAll('.docs-nav-link').forEach(function (link) {
            var target = new URL(link.getAttribute('href'), current);
            var active = !target.hash && target.origin === current.origin && target.pathname === current.pathname;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    function init() {
        sidebar = document.querySelector('[data-docs-sidebar]');
        overlay = document.querySelector('[data-docs-overlay]');

        menuButtons = Array.from(document.querySelectorAll('[data-docs-nav-toggle]'));
        if (sidebar) {
            sidebar.id = sidebar.id || 'docs-navigation';
            sidebar.setAttribute('aria-label', 'Doküman gezinmesi');
        }
        menuButtons.forEach(function (button) {
            if (sidebar) button.setAttribute('aria-controls', sidebar.id);
            button.addEventListener('click', toggleNavigation);
        });
        closeNavigation(false);
        mobile.addEventListener('change', function () { closeNavigation(false); });
        if (overlay) overlay.addEventListener('click', closeNavigation);
        if (sidebar) {
            sidebar.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () { closeNavigation(false); });
            });
        }

        document.addEventListener('keydown', handleNavigationKey);

        markCurrentPage();
        buildToc();
        setActiveToc();
        window.addEventListener('scroll', setActiveToc, { passive: true });
    }

    window.docsLayout = {
        toggleNavigation: toggleNavigation,
        closeNavigation: closeNavigation
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
