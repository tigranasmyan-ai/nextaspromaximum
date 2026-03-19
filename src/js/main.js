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
    const megaMenuItem = '.js-menu-mega__item';
    const megaMenuList = '.js-menu-mega__list';

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
     * Toggle theme
     */
    const $html = $('html');
    const themeToggleSelector = '.js-theme-toggle';
    const themeTextSelector = '.theme-switch__text';

    function updateThemeText(theme) {
        $(themeToggleSelector).each(function () {
            const $toggle = $(this);
            const $text = $toggle.find(themeTextSelector);
            if ($text.length) {
                const text = theme === 'dark' ? $text.data('dark-theme-text') : $text.data('light-theme-text');
                $text.text(text);
            }
        });
    }

    // Initialize toggle text based on the theme already set in <head>
    updateThemeText($html.attr("data-theme"));

    $(document).on('click', themeToggleSelector, function () {
        let currentTheme = $html.attr("data-theme");
        let newTheme = currentTheme === "dark" ? "light" : "dark";

        $html.attr("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeText(newTheme);
    });

    /**
     * Fast catalog
     */
    const fastCatalogToggleButton = '.js-fast-catalog__toggle';
    const fastCatalog = '.js-fast-catalog';

    const fastCatalogList = '.js-catalog-item__list';
    const fastCatalogShowMoreSubMenu = '.js-catalog-item__show-more-submenu';
    const fasCatalogShowMenu = '.js-catalog-item__show-more';
    const fastCatalogLink = '.js-catalog-item__link';

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

    new Swiper('.js-header-catalog-card-slider', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    /**
     * Fixed bar menu
     */
    let currentLevel = 0;

    $('.js-fixed-bar-menu__link').each(function () {
        const $subMenu = $(this).next('.fixed-bar-menu__sub-menu');
        if ($subMenu.length > 0) {
            const title = $(this).contents().filter(function () {
                return this.nodeType === 3;
            }).text().trim();

            $subMenu.prepend(`
                <div class="fixed-bar-menu__header">
                    <a href="#" class="fixed-bar-menu__back js-fixed-bar-back">
                       <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 3.42627L2 8.42627M2 8.42627L6 13.4263M2 8.42627H14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                       </svg>
                    </a>
                    
                    <span class="fixed-bar-menu__title">
                        <span>${title}</span>
                        
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 12" fill="none">
                            <path d="M1 1L5 6L1 11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            `);
        }
    });

    $('.js-fixed-bar-menu__chevron').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $link = $(this).closest('.js-fixed-bar-menu__link');
        const $subMenu = $link.next('.fixed-bar-menu__sub-menu');

        if ($subMenu.length > 0) {
            const $parents = $link.parents('.fixed-bar__content, .fixed-bar-menu__sub-menu');
            $parents.addClass('is-frozen');

            // Slide forward
            currentLevel++;
            $('.fixed-bar__slide').css('transform', `translateX(-${currentLevel * 100}%)`);
        }
    });

    $(document).on('click', '.js-fixed-bar-back', function (e) {
        e.preventDefault();
        const $subMenu = $(this).closest('.fixed-bar-menu__sub-menu');
        const $parentContainer = $subMenu.parent().closest('.fixed-bar__content, .fixed-bar-menu__sub-menu');

        // Slide backward
        currentLevel--;
        $('.fixed-bar__slide').css('transform', `translateX(-${currentLevel * 100}%)`);

        setTimeout(() => {
            $parentContainer.removeClass('is-frozen');
        }, 300);
    });

    const leftMenuOffcanvas = document.getElementById('LeftMenu');
    if (leftMenuOffcanvas) {
        leftMenuOffcanvas.addEventListener('hidden.bs.offcanvas', function () {
            currentLevel = 0;
            $('.fixed-bar__slide').css('transform', `translateX(0)`);
            $('.fixed-bar__content, .fixed-bar-menu__sub-menu').removeClass('is-frozen');
        });
    }

    new Swiper('.js-catalog-card-slider', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            init(swiper) {
                if (swiper.isBeginning) {
                    swiper.el.classList.add('is-first');
                }
            },

            reachBeginning(swiper) {
                swiper.el.classList.add('is-first');
                swiper.el.classList.remove('is-last');
            },

            reachEnd(swiper) {
                swiper.el.classList.add('is-last');
                swiper.el.classList.remove('is-first');
            },

            fromEdge(swiper) {
                swiper.el.classList.remove('is-first', 'is-last');
            }
        }
    });

    $('.js-product-card-gallery-dot').hover(function () {
        $(this).closest('.js-product-card').find('.js-product-card-gallery-picture').removeClass('active').eq($(this).index()).addClass('active');
        $(this).closest('.js-product-card').find('.js-product-card-gallery-bullet').removeClass('active').eq($(this).index()).addClass('active');
    }, function () {
        $(this).closest('.js-product-card').find('.js-product-card-gallery-picture').removeClass('active').eq(0).addClass('active');
        $(this).closest('.js-product-card').find('.js-product-card-gallery-bullet').removeClass('active').eq(0).addClass('active');
    });

    new Swiper('.js-reviews-slider', {
        spaceBetween: 15,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            991: {
                slidesPerView: 2,
            },
        },
    });

    new Swiper('.js-products-view-slider', {
        spaceBetween: 15,
        slidesPerView: 6,

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 10
            },
            768: {
                slidesPerView: 3
            },
            1024: {
                slidesPerView: 5
            }
        }
    });


    const input = document.querySelectorAll(".phone");

    input.forEach(function (item) {
        window.intlTelInput(item);
    });


    $('.js-validation-form').each(function () {
        $(this).validate({
            errorPlacement: function (error, element) {
                const $wrapper = element.closest('.form-input-wrapper');
                const $checkboxLabel = element.closest('.checkbox');

                if ($wrapper.length) {
                    error.insertAfter($wrapper);
                } else if ($checkboxLabel.length) {
                    error.insertAfter($checkboxLabel);
                } else {
                    error.insertAfter(element);
                }
            }
        });
    })

    /**
     * Mobile Search Toggle
     */
    const $body = $('body');
    const $searchOverlay = $('.site-header__search');

    $(document).on('click', '.js-search-mobile-opener', function (e) {
        e.preventDefault();
        $searchOverlay.addClass('is-active');
        $body.addClass('is-frozen');
    });

    $(document).on('click', '.js-search__close', function () {
        $searchOverlay.removeClass('is-active');
        $body.removeClass('is-frozen');
    });

    /**
     * Password toggle
     */
    $(document).on('click', '.js-password-toggle', function () {
        const $btn = $(this);
        const $input = $btn.closest('.form-input-wrapper').find('.form-input');
        const isPassword = $input.attr('type') === 'password';

        $input.attr('type', isPassword ? 'text' : 'password');
        $btn.toggleClass('is-active', isPassword);
    });

    /**
     * Range
     */

    const sliders = document.querySelectorAll('.js-range-slider');

    sliders.forEach(slider => {
        const el = slider.querySelector('.js-range-slider__element');
        const inputMin = slider.querySelector('.js-range-slider__input-min');
        const inputMax = slider.querySelector('.js-range-slider__input-max');

        const min = parseFloat(slider.dataset.min);
        const max = parseFloat(slider.dataset.max);
        const startMin = parseFloat(slider.dataset.startMin);
        const startMax = parseFloat(slider.dataset.startMax);
        const step = parseFloat(slider.dataset.step);

        function formatNumber(val) {
            const parts = val.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join('.');
        }

        function parseNumber(val) {
            return parseFloat(val.toString().replace(/\s/g, '')) || 0;
        }

        noUiSlider.create(el, {
            start: [startMin, startMax],
            connect: true,
            step: step,
            range: {
                'min': min,
                'max': max
            }
        });

        el.noUiSlider.on('update', function (values, handle) {
            const value = parseFloat(values[handle]);
            const formattedValue = formatNumber(value);
            if (handle) {
                inputMax.value = formattedValue;
            } else {
                inputMin.value = formattedValue;
            }
        });

        [inputMin, inputMax].forEach((input, index) => {
            input.addEventListener('change', function () {
                const val = parseNumber(this.value);
                const setArr = [null, null];
                setArr[index] = val;
                el.noUiSlider.set(setArr);
            });

            input.addEventListener('input', function () {
                // Allow only numbers, spaces, and dot
                const selectionStart = this.selectionStart;
                const originalLength = this.value.length;
                
                let val = this.value.replace(/[^\d.\s]/g, '');
                const num = parseNumber(val);
                
                if (!isNaN(num)) {
                    val = formatNumber(val.replace(/\s/g, ''));
                }
                
                this.value = val;

                // Simple cursor position height adjustment
                const newLength = this.value.length;
                this.setSelectionRange(selectionStart + (newLength - originalLength), selectionStart + (newLength - originalLength));
            });
        });
    });

    const compareSlider = new Swiper('.js-compare-products-slider', {
        slidesPerView: 5,
        spaceBetween: 15,
        breakpoints: {
            0: {
                slidesPerView: 2,
                spaceBetween: 10
            },
            768: {
                slidesPerView: 3
            },
            1024: {
                slidesPerView: 5
            }
        }
    });

    const compareDetails = new Swiper('.js-compare-products-details', {
        slidesPerView: 5,
        spaceBetween: 0,
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3
            },
            1024: {
                slidesPerView: 5
            }
        }
    });

    if (compareSlider && compareDetails) {
        const sliders = Array.isArray(compareSlider) ? compareSlider : [compareSlider];
        const details = Array.isArray(compareDetails) ? compareDetails : [compareDetails];

        sliders.forEach(s => {
            s.controller.control = details;
        });

        details.forEach(d => {
            d.controller.control = sliders;
        });
    }

    /**
     * Compare details synchronized hover
     */
    $(document).on('mouseenter', '.js-compare-products-details .compare-list-item', function() {
        const index = $(this).index();
        const $parents = $(this).closest('.js-compare-products-details');
        
        $parents.find('.compare-list').each(function() {
            $(this).find('.compare-list-item').eq(index).addClass('is-hovered');
        });
    });

    $(document).on('mouseleave', '.js-compare-products-details .compare-list-item', function() {
        const $parents = $(this).closest('.js-compare-products-details');
        $parents.find('.compare-list-item').removeClass('is-hovered');
    });

    /**
     * Counter
     */
    $(document).on('click', '.js-counter__btn--plus', function() {
        const $counter = $(this).closest('.js-counter');
        const $input = $counter.find('.js-counter__input');
        const max = parseFloat($counter.data('max'));
        const step = parseFloat($counter.data('step')) || 1;
        let val = parseFloat($input.val());

        if (isNaN(max) || val + step <= max) {
            $input.val(val + step).trigger('change');
        }
    });

    $(document).on('click', '.js-counter__btn--minus', function() {
        const $counter = $(this).closest('.js-counter');
        const $input = $counter.find('.js-counter__input');
        const min = parseFloat($counter.data('min')) || 1;
        const step = parseFloat($counter.data('step')) || 1;
        let val = parseFloat($input.val());

        if (val - step >= min) {
            $input.val(val - step).trigger('change');
        }
    });

    $(document).on('change', '.js-counter__input', function() {
        const $counter = $(this).closest('.js-counter');
        const $minusBtn = $counter.find('.js-counter__btn--minus');
        const $plusBtn = $counter.find('.js-counter__btn--plus');
        const val = parseFloat($(this).val());
        const min = parseFloat($counter.data('min')) || 1;
        const max = parseFloat($counter.data('max'));

        $minusBtn.prop('disabled', val <= min);
        if (!isNaN(max)) {
            $plusBtn.prop('disabled', val >= max);
        }
    });

    $('.js-counter__input').trigger('change');
});