/** Optional illustrated landing hero. Artwork/content remain consumer-owned. */
(function () {
    'use strict';
    if (window.documentHero) { window.documentHero.init(); return; }
    var states = new Map(), observer, listeners, frame = 0;
    var reduced = matchMedia('(prefers-reduced-motion: reduce)');
    var narrow = matchMedia('(max-width: 700px)');
    function paused() { return document.hidden || reduced.matches || narrow.matches; }
    function paint() {
        frame = 0;
        // Measure all active instances before changing any style.
        var values = Array.from(states.values()).map(function (state) {
            return { state: state, y: !paused() && state.visible
                ? Math.min(14, Math.max(0, -state.hero.getBoundingClientRect().top * .04)) : 0 };
        });
        values.forEach(function (row) {
            row.state.prop.style.setProperty('--document-book-y', row.y + 'px');
            row.state.hero.dataset.heroMotion = paused() || !row.state.visible ? 'paused' : 'running';
        });
    }
    function refresh() {
        if (paused()) { cancelAnimationFrame(frame); frame = 0; paint(); }
        else if (!frame) frame = requestAnimationFrame(paint);
    }
    function find(root) {
        return (root.matches && root.matches('[data-document-hero]') ? [root] : [])
            .concat(Array.from(root.querySelectorAll('[data-document-hero]')));
    }
    function init(root) {
        root = root || document;
        find(root).forEach(function (hero) {
            if (states.has(hero)) return;
            if (hero.dataset.heroLayout === 'text') return;
            var prop = hero.querySelector('.document-hero-book') || hero;
            if (!listeners) {
                listeners = new AbortController();
                var options = { signal: listeners.signal };
                addEventListener('scroll', function () {
                    if (Array.from(states.values()).some(function (state) { return state.visible; })) refresh();
                }, { passive: true, signal: listeners.signal });
                addEventListener('resize', refresh, options);
                document.addEventListener('visibilitychange', refresh, options);
                reduced.addEventListener('change', refresh, options);
                narrow.addEventListener('change', refresh, options);
                if (typeof IntersectionObserver !== 'undefined') observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) { var state = states.get(entry.target); if (state) state.visible = entry.isIntersecting; });
                    refresh();
                });
            }
            states.set(hero, { hero: hero, prop: prop, visible: !observer });
            if (observer) observer.observe(hero);
        });
        if (states.size) refresh();
    }
    function destroy(root) {
        Array.from(states.keys()).forEach(function (hero) {
            if (root && root !== hero && !root.contains(hero)) return;
            if (observer) observer.unobserve(hero);
            states.get(hero).prop.style.removeProperty('--document-book-y');
            delete hero.dataset.heroMotion; states.delete(hero);
        });
        if (!states.size) {
            cancelAnimationFrame(frame); frame = 0;
            if (observer) observer.disconnect(); observer = null;
            if (listeners) listeners.abort(); listeners = null;
        }
    }
    window.documentHero = { init: init, destroy: destroy };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); }, { once: true });
    else init();
})();
