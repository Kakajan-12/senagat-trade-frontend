import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';

export default createMiddleware({
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
    localePrefix: 'as-needed'
});

export const config = {
    matcher: [
        '/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif)).*)'
    ]
};
