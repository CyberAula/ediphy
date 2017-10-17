import i18n from 'i18next';
/**
 * Gets a translated array of suggested keywords
 * @returns {array} Array of keywords
 */
export function suggestions() {
    return [
        i18n.t("global_config.keylist.Art"),
        i18n.t("global_config.keylist.Biology"),
        i18n.t("global_config.keylist.Chemistry"),
        i18n.t("global_config.keylist.Citizenship"),
        i18n.t("global_config.keylist.Computerscience"),
        i18n.t("global_config.keylist.Economics"),
        i18n.t("global_config.keylist.Education"),
        i18n.t("global_config.keylist.Engineering"),
        i18n.t("global_config.keylist.Foreignlanguages"),
        i18n.t("global_config.keylist.Generalculture"),
        i18n.t("global_config.keylist.Geography"),
        i18n.t("global_config.keylist.Geology"),
        i18n.t("global_config.keylist.History"),
        i18n.t("global_config.keylist.Humanities"),
        i18n.t("global_config.keylist.Literature"),
        i18n.t("global_config.keylist.Maths"),
        i18n.t("global_config.keylist.Music"),
        i18n.t("global_config.keylist.Naturalscience"),
        i18n.t("global_config.keylist.Physics"),
        i18n.t("global_config.keylist.Technology"),
    ];
}

/**
 * Gets the translated array of course status options
 * @returns {array} Options
 */
export function statusOptions() {
    return [
        { label: i18n.t("global_config.status_list.draft"), value: 'draft' },
        { label: i18n.t("global_config.status_list.public"), value: 'final' },
        /* { label: i18n.t("global_config.status_list.final"), value: 'final' }, */
        /* { label: i18n.t("global_config.status_list.revised"), value: 'revised' }, */
        /* { label: i18n.t("global_config.status_list.unavailable"), value: 'unavailable' } */ ];
}

/**
 * Gets the translated array of course context options
 * @returns {array} Array of options
 */
export function contextOptions() {
    return [
        { label: i18n.t("global_config.context_list.school"), value: 'school' },
        { label: i18n.t("global_config.context_list.high_education"), value: 'higher education' },
        { label: i18n.t("global_config.context_list.training"), value: 'training' },
        { label: i18n.t("global_config.context_list.other"), value: 'other' }];
}

/**
 * Gets the translated array of course license options
 * @returns {array} Array of options
 */
export function rightsOptions() {
    return [
        { value: "Public Domain", label: i18n.t("global_config.public_domain") },
        { value: "CreativeCommons BY", label: "CreativeCommons BY" },
        { value: "CreativeCommons BY-SA", label: "CreativeCommons BY-SA" },
        { value: "CreativeCommons BY-ND", label: "CreativeCommons BY-ND" },
        { value: "CreativeCommons BY-NC", label: "CreativeCommons BY-NC" },
        { value: "CreativeCommons BY-NC-SA", label: "CreativeCommons BY-NC-SA" },
        { value: "CreativeCommons BY-NC-ND", label: "CreativeCommons BY-NC-ND" }];
}

/**
 * Array of difficulty levels
 */
export const difLevels = ['very easy', 'easy', 'medium', 'difficult', 'very difficult'];

/**
 * Sort an array of objects alphabetically by value of parameter key
 * @param arr Arary to order
 * @param key Key by which to order the array
 */
function sortByKey(arr, key) {
    return arr.sort((a, b) => a[key].localeCompare(b[key]));
}

/**
 * Returns the alphabetically sorted list of available languages
 * @returns {*}
 */
export function languages() {
    return sortByKey([
        { value: "af", label: i18n.t("languages.Afrikanns") },
        { value: "sq", label: i18n.t("languages.Albanian") },
        { value: "ar", label: i18n.t("languages.Arabic") },
        { value: "hy", label: i18n.t("languages.Armenian") },
        { value: "eu", label: i18n.t("languages.Basque") },
        { value: "bn", label: i18n.t("languages.Bengali") },
        { value: "bg", label: i18n.t("languages.Bulgarian") },
        { value: "ca", label: i18n.t("languages.Catalan") },
        { value: "km", label: i18n.t("languages.Cambodian") },
        { value: "zh", label: i18n.t("languages.Chinese") },
        { value: "hr", label: i18n.t("languages.Croation") },
        { value: "cs", label: i18n.t("languages.Czech") },
        { value: "da", label: i18n.t("languages.Danish") },
        { value: "nl", label: i18n.t("languages.Dutch") },
        { value: "en", label: i18n.t("languages.English") },
        { value: "et", label: i18n.t("languages.Estonian") },
        { value: "fj", label: i18n.t("languages.Fiji") },
        { value: "fi", label: i18n.t("languages.Finnish") },
        { value: "fr", label: i18n.t("languages.French") },
        { value: "ka", label: i18n.t("languages.Georgian") },
        { value: "de", label: i18n.t("languages.German") },
        { value: "el", label: i18n.t("languages.Greek") },
        { value: "gu", label: i18n.t("languages.Gujarati") },
        { value: "he", label: i18n.t("languages.Hebrew") },
        { value: "hi", label: i18n.t("languages.Hindi") },
        { value: "hu", label: i18n.t("languages.Hungarian") },
        { value: "is", label: i18n.t("languages.Icelandic") },
        { value: "id", label: i18n.t("languages.Indonesian") },
        { value: "ga", label: i18n.t("languages.Irish") },
        { value: "it", label: i18n.t("languages.Italian") },
        { value: "ja", label: i18n.t("languages.Japanese") },
        { value: "jw", label: i18n.t("languages.Javanese") },
        { value: "ko", label: i18n.t("languages.Korean") },
        { value: "la", label: i18n.t("languages.Latin") },
        { value: "lv", label: i18n.t("languages.Latvian") },
        { value: "lt", label: i18n.t("languages.Lithuanian") },
        { value: "mk", label: i18n.t("languages.Macedonian") },
        { value: "ms", label: i18n.t("languages.Malay") },
        { value: "ml", label: i18n.t("languages.Malayalam") },
        { value: "mt", label: i18n.t("languages.Maltese") },
        { value: "mi", label: i18n.t("languages.Maori") },
        { value: "mr", label: i18n.t("languages.Marathi") },
        { value: "mn", label: i18n.t("languages.Mongolian") },
        { value: "ne", label: i18n.t("languages.Nepali") },
        { value: "no", label: i18n.t("languages.Norwegian") },
        { value: "fa", label: i18n.t("languages.Persian") },
        { value: "pl", label: i18n.t("languages.Polish") },
        { value: "pt", label: i18n.t("languages.Portuguese") },
        { value: "pa", label: i18n.t("languages.Punjabi") },
        { value: "qu", label: i18n.t("languages.Quechua") },
        { value: "ro", label: i18n.t("languages.Romanian") },
        { value: "ru", label: i18n.t("languages.Russian") },
        { value: "sm", label: i18n.t("languages.Samoan") },
        { value: "sr", label: i18n.t("languages.Serbian") },
        { value: "sk", label: i18n.t("languages.Slovak") },
        { value: "sl", label: i18n.t("languages.Slovenian") },
        { value: "es", label: i18n.t("languages.Spanish") },
        { value: "sw", label: i18n.t("languages.Swahili") },
        { value: "sv", label: i18n.t("languages.Swedish") },
        { value: "ta", label: i18n.t("languages.Tamil") },
        { value: "tt", label: i18n.t("languages.Tatar") },
        { value: "te", label: i18n.t("languages.Telugu") },
        { value: "th", label: i18n.t("languages.Thai") },
        { value: "bo", label: i18n.t("languages.Tibetan") },
        { value: "to", label: i18n.t("languages.Tonga") },
        { value: "tr", label: i18n.t("languages.Turkish") },
        { value: "uk", label: i18n.t("languages.Ukranian") },
        { value: "ur", label: i18n.t("languages.Urdu") },
        { value: "uz", label: i18n.t("languages.Uzbek") },
        { value: "vi", label: i18n.t("languages.Vietnamese") },
        { value: "cy", label: i18n.t("languages.Welsh") },
        { value: "xh", label: i18n.t("languages.Xhosa") }], 'label');
}

