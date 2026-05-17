// i18n Handler - Manages language switching and DOM updates
class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('budgetable-lang') || 'en';
    this.supportedLangs = ['en', 'es', 'fr', 'de', 'zh'];
    this.init();
  }

  init() {
    // Set current language
    if (!this.supportedLangs.includes(this.currentLang)) {
      this.currentLang = 'en';
    }
    
    // Apply translations on page load
    this.updatePage();
    
    // Add language switcher if not already present
    this.setupLanguageSwitcher();
  }

  t(key) {
    return translations[this.currentLang]?.[key] || translations['en']?.[key] || key;
  }

  getArray(key) {
    return translations[this.currentLang]?.[key] || translations['en']?.[key] || [];
  }

  setLanguage(lang) {
    if (this.supportedLangs.includes(lang)) {
      this.currentLang = lang;
      localStorage.setItem('budgetable-lang', lang);
      this.updatePage();
    }
  }

  updatePage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = this.t(key);
      
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });

    // Update all elements with data-i18n-html attribute
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });

    // Update language selector if it exists
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
      langSelect.value = this.currentLang;
    }

    // Update active link
    this.updateActiveNav();
  }

  setupLanguageSwitcher() {
    // Check if language switcher already exists
    if (document.getElementById('language-select')) return;

    // Find the nav-links element
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Create language switcher
    const langItem = document.createElement('li');
    langItem.style.marginLeft = 'auto';
    
    const langSelect = document.createElement('select');
    langSelect.id = 'language-select';
    langSelect.style.cssText = `
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid var(--line);
      background: var(--card);
      color: var(--ink);
      cursor: pointer;
      font-size: 0.9rem;
      font-family: inherit;
    `;

    // Add language options
    this.supportedLangs.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = this.getLanguageName(lang);
      if (lang === this.currentLang) {
        option.selected = true;
      }
      langSelect.appendChild(option);
    });

    // Handle language change
    langSelect.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });

    langItem.appendChild(langSelect);
    navLinks.appendChild(langItem);
  }

  getLanguageName(lang) {
    const names = {
      en: '🇬🇧 English',
      es: '🇪🇸 Español',
      fr: '🇫🇷 Français',
      de: '🇩🇪 Deutsch',
      zh: '🇨🇳 中文'
    };
    return names[lang] || lang;
  }

  updateActiveNav() {
    // Update active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'landing.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'landing.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18n();
});
