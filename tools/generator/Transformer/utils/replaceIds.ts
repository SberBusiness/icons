const hasIdRegExp = /\sid="/;

// Следующие регулярки с флагом g (хранят lastIndex): использовать только в replace/matchAll, не в test/exec.
// Пробел перед id исключает совпадения с атрибутами вида data-test-id.
const idAttrRegExp = /(?<=\s)id="([^"]+)"/g;
// href, xlink:href, xlinkHref
const hrefAttrRegExp = /(?<=\s)((?:xlink:?)?href)="#([^"]+)"/gi;
// Одна кавычка вокруг ссылки: ' или её сущности (&quot;, &apos;, &#39;, &#x27;; SVGO сериализует двойные как &quot;).
const urlQuotePattern = String.raw`(?:&(?:quot|apos|#39|#x27);|')`;
// Начало ссылки: url(#, url('#, url(&quot;#.
const urlOpenPattern = String.raw`url\(\s*${urlQuotePattern}?#`;
// Только атрибуты со ссылками url(#...): имя="...url(#id)...", чтобы не перебирать цвета вида fill="#FFFFFF".
const urlAttrRegExp = new RegExp(String.raw`\b([a-zA-Z:-]+)="([^"]*${urlOpenPattern}[^"]*)"`, 'g');
// Группа с id ленивая, чтобы закрывающая кавычка (в т.ч. &quot;) не попала в id.
const urlRefRegExp = new RegExp(String.raw`${urlOpenPattern}([^)]+?)${urlQuotePattern}?\s*\)`, 'g');

/**
 * Переименовывает id и ссылки на них вида url(#id) и href="#id" в атрибутах.
 * Ссылки внутри инлайн стилей не обрабатываются (SVGO выносит стили в атрибуты через convertStyleToAttrs).
 *
 * Значения изменённых атрибутов выводятся как JSX шаблонные строки `{`...`}`, поэтому префикс может содержать
 * JS выражение вида `${uniqueId}`.
 *
 * @param src Исходный svg в react-нотации.
 * @param prefix Префикс, добавляемый к каждому id.
 */
export const replaceIds = (src: string, prefix: string): string => {
    // Большинство иконок без id: не запускаем regex-проходы зря.
    if (!hasIdRegExp.test(src)) {
        return src;
    }

    const makeId = (id: string) => `${prefix}${id}`;
    const makeAttr = (attr: string, value: string) => `${attr}={\`${value}\`}`;
    const ids = new Set<string>();
    const withIds = src.replace(idAttrRegExp, (_, id) => {
        ids.add(id);
        return makeAttr('id', makeId(id));
    });

    return withIds
        .replace(hrefAttrRegExp, (match, attr, id) => (ids.has(id) ? makeAttr(attr, `#${makeId(id)}`) : match))
        .replace(urlAttrRegExp, (match, attr, value) => {
            const newValue = value.replace(urlRefRegExp, (ref, id) => (ids.has(id) ? `url(#${makeId(id)})` : ref));

            return newValue === value ? match : makeAttr(attr, newValue);
        });
};
