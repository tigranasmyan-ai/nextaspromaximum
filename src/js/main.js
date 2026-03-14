$(document).ready(function () {
    const animationDuration = 200;

    /**
     * Search
     */
    const $search = $('.js-search');
    const $searchInput = $('.js-search__input');
    const $searchDropdown = $('.js-search__dropdown');
    const $searchClose = $('.js-search__close');

    $searchInput.on('keyup click focus', function (e) {
        if ($(this).val().trim().length > 0 || e.type === 'keyup') {
            $searchDropdown.fadeIn(animationDuration);
            $search.addClass('loaded');
        }
    });

    $searchClose.click(function () {
        $searchDropdown.fadeOut();
        $search.removeClass('loaded');
        $searchInput.val('');
    });

    $(document).click(function (event) {
        if (!$(event.target).closest($search).length) {
            $searchDropdown.fadeOut(200);
            $search.removeClass('loaded');
        }
    });

    /**
     * Mega menu dropdown
     */
    const megaMenuItem = '.js-mega-menu__item';
    const megaMenuList = '.js-mega-menu__list';

    $(megaMenuItem).hover(function () {
        $(this).find(`> ${megaMenuList}`).stop().fadeIn(animationDuration);
    }, function () {
        $(this).find(`> ${megaMenuList}`).stop().fadeOut(animationDuration);
    });

    /**
     * Header actions
     */
    const headerAction = '.js-header-action';
    const headerActionDropdown = '.js-header-action-dropdown';

    $(headerAction).hover(function () {
        $(this).find(headerActionDropdown).stop().fadeIn(animationDuration);
    }, function () {
        $(this).find(headerActionDropdown).stop().fadeOut(animationDuration);
    });

    /**
     * Toogle theme
     */
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        $("html").attr("data-theme", savedTheme);
    }

    const html = 'html';

    $(".js-theme-toggle").click(function () {
        let currentTheme = $(html).attr("data-theme");
        let newTheme = currentTheme === "dark" ? "light" : "dark";

        $(html).attr("data-theme", newTheme);

        localStorage.setItem("theme", newTheme);
    });

    /**
     * Fast catalog
     */
    const fastCatalogToggleButton = '.js-fast-catalog__toggle';
    const fastCatalog = '.js-fast-catalog';
    const fastCatalogList = '.js-fast-catalog__list';
    const fastCatalogShowMoreSubMenu = '.js-fast-catalog__show-more-submenu';
    const fasCatalogShowMenu = '.js-fast-catalog__show-more';
    const fastCatalogLink = '.js-fast-catalog__link';

    $(fasCatalogShowMenu).on('click', function () {
        const $btn = $(this);
        const $list = $btn.closest(fastCatalogList);

        const isOpen = $list.toggleClass('show-all').hasClass('show-all');

        $btn.text(isOpen ? $btn.data('hide-text') : $btn.data('show-text'));
    });

    $(fastCatalogShowMoreSubMenu).click(function (e) {
        e.preventDefault();

        $(this).toggleClass('active')

        $(this).closest(fastCatalogLink).next().stop().slideToggle(animationDuration);
    });

    $(fastCatalogToggleButton).click(function (e) {
        e.stopPropagation(); // prevent document click

        $(this).toggleClass('active');
        $(fastCatalog).fadeToggle();
    });

    $(fastCatalog).click(function (e) {
        e.stopPropagation();
    });

    $(document).click(function () {
        $(fastCatalog).fadeOut();
        $(fastCatalogToggleButton).removeClass('active');
    });

    /**
     * Header fixed
     */
    const header = '.js-header';

    $(window).on('scroll', function () {
        let scrollTop = $(this).scrollTop();

        // На 100px делаем шапку fixed, но оставляем скрытой за верхом экрана
        if (scrollTop > 200) {
            $(header).addClass('site-header--fixed');
        } else {
            $(header).removeClass('site-header--fixed');
        }
    });

    $(window).trigger('scroll');

    new Swiper('.js-header-catalog-slider', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })
});