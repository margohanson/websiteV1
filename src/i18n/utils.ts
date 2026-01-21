// i18n utility functions for the Ariane Mader website

// Type definitions
export type Locale = 'en' | 'de';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'de'];

// Import all translation files
import enCommon from './en/common.json';
import enPages from './en/pages.json';
import enMeta from './en/meta.json';
import deCommon from './de/common.json';
import dePages from './de/pages.json';
import deMeta from './de/meta.json';

// Translation dictionaries
const translations: Record<Locale, Record<string, any>> = {
    en: {
        common: enCommon,
        pages: enPages,
        meta: enMeta,
    },
    de: {
        common: deCommon,
        pages: dePages,
        meta: deMeta,
    },
};

/**
 * Get a translation string by key using dot notation
 * Falls back to English if translation is missing
 * @param key - Dot notation key, e.g., 'common.nav.home' or 'pages.home.title'
 * @param locale - The locale to get the translation for
 * @returns The translated string, or the key if not found
 */
export function t(key: string, locale: Locale = defaultLocale): string {
    const result = getNestedValue(translations[locale], key);

    // Fallback to English if not found in current locale
    if (result === undefined && locale !== 'en') {
        const fallback = getNestedValue(translations.en, key);
        if (fallback !== undefined) return fallback;
    }

    return result ?? key;
}

/**
 * Get a translation object (for arrays or nested structures)
 * @param key - Dot notation key
 * @param locale - The locale to get the translation for
 * @returns The translated object/array, or undefined if not found
 */
export function tObj<T = any>(key: string, locale: Locale = defaultLocale): T | undefined {
    const result = getNestedValue(translations[locale], key);

    // Fallback to English if not found in current locale
    if (result === undefined && locale !== 'en') {
        return getNestedValue(translations.en, key);
    }

    return result;
}

/**
 * Extract locale from URL pathname
 * @param pathname - The URL pathname (e.g., '/de/about' or '/about')
 * @returns The locale
 */
export function getLocale(pathname: string): Locale {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment === 'de') {
        return 'de';
    }

    return 'en';
}

/**
 * Get the localized path for a given path
 * @param path - The base path (without locale prefix, e.g., '/about')
 * @param locale - The target locale
 * @returns The localized path
 */
export function getLocalizedPath(path: string, locale: Locale): string {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Remove any existing locale prefix
    let basePath = normalizedPath;
    if (normalizedPath.startsWith('/de/')) {
        basePath = normalizedPath.slice(3);
    } else if (normalizedPath === '/de') {
        basePath = '/';
    }

    // Add locale prefix for non-default locale
    if (locale === 'de') {
        return basePath === '/' ? '/de' : `/de${basePath}`;
    }

    return basePath;
}

/**
 * Get the alternate URL for language switching
 * @param currentPath - Current URL path
 * @param currentLocale - Current locale
 * @returns Path in the other language
 */
export function getAlternatePath(currentPath: string, currentLocale: Locale): string {
    const targetLocale: Locale = currentLocale === 'en' ? 'de' : 'en';

    // Get the base path without locale
    let basePath = currentPath;
    if (currentPath.startsWith('/de/')) {
        basePath = currentPath.slice(3);
    } else if (currentPath === '/de') {
        basePath = '/';
    }

    return getLocalizedPath(basePath, targetLocale);
}

/**
 * Helper to get nested object value by dot notation
 */
function getNestedValue(obj: Record<string, any>, key: string): any {
    return key.split('.').reduce((current, part) => {
        return current?.[part];
    }, obj);
}

/**
 * Get all navigation items for a locale
 */
export function getNavItems(locale: Locale) {
    const items = tObj<Array<{ key: string; href: string }>>('common.nav.items', locale) ?? [];
    return items.map(item => ({
        text: t(`common.nav.${item.key}`, locale),
        href: getLocalizedPath(item.href, locale),
    }));
}
