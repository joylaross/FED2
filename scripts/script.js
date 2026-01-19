/********/
/* Header menu */
/********/
const menuButton = document.querySelector('header > button[aria-label="Menu openen"]');
const mainNav = document.querySelector('header > nav[aria-label="Hoofdmenu"]');
const mainNavList = document.querySelector('header > nav[aria-label="Hoofdmenu"] > ul');

if (menuButton && mainNav && mainNavList) {
	const openMenu = () => {
		menuButton.setAttribute("aria-expanded", "true");

		document.body.setAttribute("data-scroll", "locked");
		document.body.setAttribute("data-menu", "open");

		document.body.classList.add("is-menu-open", "is-scroll-locked");
	};

	const closeMenu = () => {
		menuButton.setAttribute("aria-expanded", "false");

		document.body.removeAttribute("data-scroll");
		document.body.removeAttribute("data-menu");

		document.body.classList.remove("is-menu-open", "is-scroll-locked");
	};

	menuButton.addEventListener("click", () => {
		const isOpen = document.body.getAttribute("data-menu") === "open";

		if (isOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	});

	mainNav.addEventListener("click", (event) => {
		if (!mainNavList.contains(event.target)) {
			closeMenu();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeMenu();
		}
	});
}
/* Bronnen
- MDN querySelector: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
- MDN addEventListener: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- MDN aria-expanded: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-expanded
- WAI-ARIA APG Disclosure/Menu Button: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- MDN keydown event: https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
*/

/*****************************************/
/* Andere promoties en nieuwe producten 1-3 */
/*****************************************/
const carousel3 = document.querySelector("section:nth-of-type(3) ul");
const prev3 = document.querySelector("section:nth-of-type(3) .carousel-prev");
const next3 = document.querySelector("section:nth-of-type(3) .carousel-next");

if (carousel3 && prev3 && next3) {
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const getScrollStep = () => {
		const firstItem = carousel3.querySelector("li");
		if (!firstItem) {
			return carousel3.clientWidth * 0.8;
		}

		const itemWidth = firstItem.getBoundingClientRect().width;
		const gap = parseFloat(getComputedStyle(carousel3).gap) || 0;

		return itemWidth + gap;
	};

	prev3.addEventListener("click", () => {
		const scrollStep = getScrollStep();

		carousel3.scrollBy({
			left: -scrollStep,
			behavior: prefersReducedMotion ? "auto" : "smooth",
		});
	});

	next3.addEventListener("click", () => {
		const scrollStep = getScrollStep();

		carousel3.scrollBy({
			left: scrollStep,
			behavior: prefersReducedMotion ? "auto" : "smooth",
		});
	});
}
/* Bronnen (horizontaal scrollen & carousel)
- MDN scrollBy(): https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy
- MDN addEventListener: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- WAI-ARIA APG Carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- web.dev Horizontal scrolling: https://web.dev/patterns/layout/horizontal-scrolling/
*/

/***************************/
/* Bestsellers carrousel 1-5 */
/***************************/
const carousel = document.querySelector("section:nth-of-type(5) ul");
const prevbtn = document.querySelector("section:nth-of-type(5) .carousel-prev");
const nextbtn = document.querySelector("section:nth-of-type(5) .carousel-next");

if (carousel && prevbtn && nextbtn) {
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const getScrollStep = () => {
		const firstItem = carousel.querySelector("li");
		if (!firstItem) {
			return carousel.clientWidth * 0.8;
		}

		const itemWidth = firstItem.getBoundingClientRect().width;
		const gap = parseFloat(getComputedStyle(carousel).gap) || 0;

		return itemWidth + gap;
	};

	prevbtn.addEventListener("click", () => {
		const scrollStep = getScrollStep();

		carousel.scrollBy({
			left: -scrollStep,
			behavior: prefersReducedMotion ? "auto" : "smooth",
		});
	});

	nextbtn.addEventListener("click", () => {
		const scrollStep = getScrollStep();

		carousel.scrollBy({
			left: scrollStep,
			behavior: prefersReducedMotion ? "auto" : "smooth",
		});
	});
}
/* Bronnen (bestsellers carousel)
- MDN scrollBy(): https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy
- MDN addEventListener: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- WAI-ARIA APG Carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- web.dev Horizontal scrolling: https://web.dev/patterns/layout/horizontal-scrolling/
*/

/*****************************/
/* Ontdek voordelen – carousel 2-2 */
/*****************************/
document.querySelectorAll(".carousel-wrapper").forEach((wrapper) => {
	const list = wrapper.querySelector("ul");
	const prevButton = wrapper.querySelector(".prev");
	const nextButton = wrapper.querySelector(".next");

	if (!list || !prevButton || !nextButton) {
		return;
	}

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	let items = [];
	let gap = 0;
	let itemWidth = 0;
	let visibleItems = 0;
	let position = 0;
	let maxPosition = 0;
	let rafId = null;

	const readMeasurements = () => {
		items = Array.from(list.children);

		if (items.length === 0) {
			return false;
		}

		gap = parseFloat(getComputedStyle(list).gap) || 0;
		itemWidth = items[0].getBoundingClientRect().width + gap;

		if (!itemWidth) {
			return false;
		}

		visibleItems = Math.max(1, Math.round(list.getBoundingClientRect().width / itemWidth));
		maxPosition = itemWidth * items.length;

		return true;
	};

	const cancelAnimation = () => {
		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};

	const setScrollLeft = (value) => {
		list.scrollLeft = value;
	};

	const smoothScrollTo = (target) => {
		cancelAnimation();

		if (prefersReducedMotion) {
			setScrollLeft(target);
			return;
		}

		wrapper.classList.add("is-animating");

		const start = list.scrollLeft;
		const distance = target - start;
		const duration = 250;
		let startTime = null;

		const animate = (time) => {
			if (!startTime) {
				startTime = time;
			}

			const progress = Math.min((time - startTime) / duration, 1);
			setScrollLeft(start + distance * progress);

			if (progress < 1) {
				rafId = requestAnimationFrame(animate);
				return;
			}

			wrapper.classList.remove("is-animating");
			rafId = null;
		};

		rafId = requestAnimationFrame(animate);
	};

	const buildClones = () => {
		if (wrapper.dataset.carouselCloned === "true") {
			return;
		}

		const originalItems = Array.from(list.children);
		if (originalItems.length === 0) {
			return;
		}

		originalItems.slice(-visibleItems).forEach((item) => {
			list.prepend(item.cloneNode(true));
		});

		originalItems.slice(0, visibleItems).forEach((item) => {
			list.append(item.cloneNode(true));
		});

		wrapper.dataset.carouselCloned = "true";
	};

	const initCarousel = () => {
		if (!readMeasurements()) {
			return;
		}

		buildClones();

		readMeasurements();

		position = itemWidth * visibleItems;
		setScrollLeft(position);
	};

	const goNext = () => {
		position += itemWidth;
		smoothScrollTo(position);

		if (position >= maxPosition + itemWidth * visibleItems) {
			position = itemWidth * visibleItems;
			setScrollLeft(position);
		}
	};

	const goPrev = () => {
		position -= itemWidth;
		smoothScrollTo(position);

		if (position <= 0) {
			position = maxPosition;
			setScrollLeft(position);
		}
	};

	initCarousel();

	nextButton.addEventListener("click", () => {
		goNext();
	});

	prevButton.addEventListener("click", () => {
		goPrev();
	});

	window.addEventListener("resize", () => {
		cancelAnimation();
		initCarousel();
	});
});
/* Bronnen
- MDN querySelectorAll: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
- MDN scrollLeft: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
- MDN getComputedStyle: https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
- MDN cloneNode: https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
- MDN requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
- WAI-ARIA APG Carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
*/

/*******************************/
/* Carousel voordelen sectie 2-3 */
/*******************************/
const voordelenSection = document.querySelector("section:nth-of-type(3)");

if (voordelenSection) {
	const articles = Array.from(voordelenSection.querySelectorAll("article"));
	const buttons = voordelenSection.querySelectorAll("header button[data-direction]");

	if (articles.length > 0) {
		buttons.forEach((button) => {
			button.addEventListener("click", () => {
				const currentArticle = button.closest("article");
				const currentIndex = articles.indexOf(currentArticle);

				if (currentIndex === -1) {
					return;
				}

				const direction = button.dataset.direction;
				const nextIndex =
					direction === "next"
						? (currentIndex + 1) % articles.length
						: (currentIndex - 1 + articles.length) % articles.length;

				articles.forEach((article) => article.classList.remove("active"));
				articles[nextIndex].classList.add("active");
			});
		});
	}
}

/****************************/
/* Footer details open/close */
/****************************/
const footerDetails = document.querySelectorAll(
	'section[aria-label="Footer navigatie"] details'
);

if (footerDetails.length > 0) {
	const desktopMQ = window.matchMedia("(min-width: 64em)");

	const setFooterDetailsState = () => {
		footerDetails.forEach((detail) => {
			if (desktopMQ.matches) {
				detail.setAttribute("open", "");
			} else {
				detail.removeAttribute("open");
			}
		});
	};

	setFooterDetailsState();

	if (typeof desktopMQ.addEventListener === "function") {
		desktopMQ.addEventListener("change", setFooterDetailsState);
	} else {
		window.addEventListener("resize", setFooterDetailsState);
	}
}

/********************/
/* Theme toggle      */
/********************/
const themeToggleButton = document.querySelector("[data-theme-toggle]");
const root = document.documentElement;

const setTheme = (theme) => {
	root.setAttribute("data-theme", theme);

	if (!themeToggleButton) {
		return;
	}

	const isDark = theme === "dark";
	themeToggleButton.setAttribute("aria-pressed", String(isDark));
	themeToggleButton.setAttribute(
		"aria-label",
		isDark ? "Schakel lichte modus in" : "Schakel donkere modus in"
	);
};

const getSavedTheme = () => {
	const saved = localStorage.getItem("theme");
	if (saved === "light" || saved === "dark") {
		return saved;
	}
	return "light";
};

setTheme(getSavedTheme());

if (themeToggleButton) {
	themeToggleButton.addEventListener("click", () => {
		const current = root.getAttribute("data-theme") || "light";
		const next = current === "dark" ? "light" : "dark";

		setTheme(next);
		localStorage.setItem("theme", next);
	});
}

/* Bronnen
- MDN closest(): https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
- MDN dataset: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
- MDN classList: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
- MDN NodeList.forEach(): https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
- MDN matchMedia(): https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
- MDN resize event: https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event
- MDN localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
*/

/********************/
/* Lettergrootte instellen */
/********************/
const fontSizeButtons = document.querySelectorAll(
	'nav[aria-label="Snelkoppelingen"] fieldset[data-font-size] button[data-font]'
);

if (fontSizeButtons.length > 0) {
	const setFontSize = (size) => {
		document.documentElement.dataset.font = size;

		fontSizeButtons.forEach((button) => {
			const isActive = button.dataset.font === size;
			button.setAttribute("aria-pressed", String(isActive));
		});

		try {
			localStorage.setItem("fontSize", size);
		} catch (error) {
		}
	};

	fontSizeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			setFontSize(button.dataset.font);
		});
	});

	let savedFontSize = null;

	try {
		savedFontSize = localStorage.getItem("fontSize");
	} catch (error) {
		savedFontSize = null;
	}

	setFontSize(savedFontSize || "md");
}
/* Bronnen
- MDN querySelectorAll: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
- MDN dataset (data-*): https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
- MDN localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- WAI-ARIA APG Button pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/
*/
 
/********************/
/* Fade in */
/********************/
const firstSection = document.querySelector("main > section:first-of-type");

if (firstSection) {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	firstSection.classList.add("has-fade");

	const reveal = () => {
		if (prefersReducedMotion) {
			firstSection.classList.add("is-visible");
			return;
		}

		requestAnimationFrame(() => {
			firstSection.classList.add("is-visible");
		});
	};

	if (document.readyState === "loading") {
		window.addEventListener("DOMContentLoaded", reveal);
	} else {
		reveal();
	}
}

/* Bronnen
- MDN querySelector: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
- MDN classList: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
- MDN DOMContentLoaded: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
- MDN requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
- MDN matchMedia: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
*/

/********************/
/* Koffiebonen */
/********************/
const htmlElement = document.documentElement;

const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)"
).matches;

const beanRainDuration = 1700;

const canAnimateBeans = () => !prefersReducedMotion;

const triggerBeanRain = () => {
	if (!canAnimateBeans()) return;
	if (htmlElement.classList.contains("is-bean-rain")) return;

	htmlElement.classList.add("is-bean-rain");

	window.setTimeout(() => {
		htmlElement.classList.remove("is-bean-rain");
	}, beanRainDuration);
};

window.addEventListener(
	"wheel",
	(event) => {
		const atTop = window.scrollY <= 0;
		const scrollingUp = event.deltaY < 0;

		if (atTop && scrollingUp) {
			triggerBeanRain();
		}
	},
	{ passive: true }
);

/* Bronnen
- MDN matchMedia(): https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
- MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN classList: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
- MDN wheel event: https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
- web.dev Reduced motion: https://web.dev/prefers-reduced-motion/
*/

/********************/
/* Winkelwagen */
/********************/
const addToCartButtons = document.querySelectorAll("[data-add-to-cart]");
const cartCountElement = document.querySelector("[data-cart-count]");
const cartLink = document.querySelector("[data-cart-link]");

const safeGetItem = (key) => {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
};

const safeSetItem = (key, value) => {
	try {
		localStorage.setItem(key, value);
	} catch {
	}
};

const getCartCount = () => {
	const saved = safeGetItem("cartCount");
	const number = Number(saved);
	return Number.isFinite(number) ? number : 0;
};

const setCartCount = (count) => {
	if (cartCountElement) {
		cartCountElement.textContent = String(count);
	}

	document.documentElement.dataset.cartState = count > 0 ? "has-items" : "empty";

	if (cartLink) {
		cartLink.setAttribute("aria-label", `Winkelmand (${count})`);
	}

	safeSetItem("cartCount", String(count));
};

let cartCount = getCartCount();
setCartCount(cartCount);

addToCartButtons.forEach((button) => {
	button.addEventListener("click", () => {
		cartCount += 1;
		setCartCount(cartCount);
	});
});

/* Bronnen
- MDN querySelectorAll: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
- MDN localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- MDN textContent: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
- W3C Accessible Name: https://www.w3.org/TR/accname-1.2/
*/






  









   