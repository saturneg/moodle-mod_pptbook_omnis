define(['jquery'], function($) {
    'use strict';

    const SEL = {
        link:   '.pptbook-zoom',
        modal:  '#pptbook-modal',
        img:    '#pptbook-modal-img',
        prev:   '#pptbook-modal-prev',
        next:   '#pptbook-modal-next'
    };

    let items = [];      // [{src, alt}, ...] — все картинки на странице
    let current = -1;    // индекс открытой картинки

    const collect = () => {
        items = [];
        $(SEL.link).each(function() {
            const $a = $(this);
            items.push({
                src: $a.data('full') || $a.attr('href'),
                alt: $a.find('img').attr('alt') || ''
            });
        });
    };

    const show = (idx) => {
        if (idx < 0) { idx = items.length - 1; }
        if (idx >= items.length) { idx = 0; }
        current = idx;
        const it = items[current];
        const $img = $(SEL.img);
        $img.attr('src', it.src);
        $img.attr('alt', it.alt || '');
        // Скрываем кнопки, если картинка одна.
        const multi = items.length > 1;
        $(SEL.prev).toggle(multi);
        $(SEL.next).toggle(multi);
    };

    const open = (idx) => {
        const $m = $(SEL.modal);
        if (!items.length || !items[idx] || !items[idx].src) {
            return;
        }
        show(idx);
        $m.css('display', 'flex').attr('aria-hidden', 'false');
        $('body').addClass('pptbook-modal-open');
    };

    const close = () => {
        const $m = $(SEL.modal);
        const $img = $(SEL.img);
        $m.css('display', 'none').attr('aria-hidden', 'true');
        $img.removeAttr('src');
        $('body').removeClass('pptbook-modal-open');
        current = -1;
    };

    const bind = () => {
        // Клик по миниатюре -> открыть нужный индекс.
        $(document).on('click', SEL.link, function(e) {
            e.preventDefault();
            if (!items.length) { collect(); }
            const idx = $(SEL.link).index(this);
            if (idx >= 0) { open(idx); }
        });

        // Клик по фону/картинке -> закрыть.
        $(document).on('click', SEL.modal, function(e) {
            const id = e.target.id;
            if (id === 'pptbook-modal' || id === 'pptbook-modal-img') {
                close();
            }
        });

        // Кнопки листания (не закрывают модалку).
        $(document).on('click', SEL.prev, function(e) {
            e.stopPropagation();
            show(current - 1);
        });
        $(document).on('click', SEL.next, function(e) {
            e.stopPropagation();
            show(current + 1);
        });

        // Клавиатура: Esc — закрыть, ←/→ — листать.
        $(document).on('keyup', function(e) {
            const $m = $(SEL.modal);
            if ($m.css('display') === 'none') { return; }
            if (e.key === 'Escape') {
                close();
            } else if (e.key === 'ArrowRight') {
                show(current + 1);
            } else if (e.key === 'ArrowLeft') {
                show(current - 1);
            }
        });
    };

    return {init: bind};
});