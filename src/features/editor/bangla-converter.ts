/**
 * Unicode to Bijoy (SutonnyMJ / ANSI) Converter for Sun3D Nameplate Canvas
 * 
 * Accurately translates Unicode Bengali (Avro / mobile keyboard) into ANSI SutonnyMJ glyphs
 * with proper vowel re-ordering (ি, ে, ৈ, ো, ৌ), Ref (র্), and compound conjuncts.
 */

const MAIN_CHAR_MAP: [string, string][] = [
  ['।', '|'], ['‘', 'Ô'], ['’', 'Õ'], ['“', 'Ò'], ['”', 'Ó'],
  ['্র্য', 'ª¨'], ['ম্প্র', '¤cÖ'], ['র‌্য', 'i¨'], ['ক্ষ্ম', '²'],
  ['ক্ক', '°'], ['ক্ট', '±'], ['ক্ত', '³'], ['ক্ব', 'K¡'], ['স্ক্র', '¯Œ'], ['ক্র', 'µ'],
  ['ক্ল', 'K¬'], ['ক্ষ', '¶'], ['ক্স', '·'], ['গু', '¸'], ['গ্ধ', '»'], ['গ্ন', 'Mœ'],
  ['গ্ম', 'M¥'], ['গ্ল', 'M­'], ['গ্রু', 'Mªy'], ['ঙ্ক', '¼'], ['ঙ্ক্ষ', '•¶'], ['ঙ্খ', '•L'],
  ['ঙ্গ', '½'], ['ঙ্ঘ', '•N'], ['চ্ছ্ব', '”Q¡'], ['চ্চ', '”P'], ['চ্ছ', '”Q'], ['চ্ঞ', '”T'],
  ['জ্জ্ব', '¾¡'], ['জ্জ', '¾'], ['জ্ঝ', 'À'], ['জ্ঞ', 'Á'], ['জ্ব', 'R¡'], ['ঞ্চ', 'Â'],
  ['ঞ্ছ', 'Ã'], ['ঞ্জ', 'Ä'], ['ঞ্ঝ', 'Å'], ['ট্ট', 'Æ'], ['ট্ব', 'U¡'], ['ট্ম', 'U¥'],
  ['ড্ড', 'Ç'], ['ণ্ট', 'È'], ['ণ্ঠ', 'É'], ['ন্স', 'Ý'], ['ণ্ড', 'Ê'], ['ন্তু', 'š‘'],
  ['ণ্ব', 'Y^'], ['ত্ত্ব', 'Ë¡'], ['ত্ত', 'Ë'], ['ত্থ', 'Ì'], ['ত্ন', 'Zœ'], ['ত্ম', 'Z¥'],
  ['ন্ত্ব', 'š—¡'], ['ত্ব', 'Z¡'], ['থ্ব', '_¡'], ['দ্গ', '˜M'], ['দ্ঘ', '˜N'], ['দ্দ', 'Ï'],
  ['দ্ধ', '×'], ['দ্ব', 'Ø'], ['দ্ভ', '™¢'], ['দ্ম', 'Ù'], ['দ্রু', '`ª“'], ['ধ্ব', 'aŸ'],
  ['ধ্ম', 'a¥'], ['ন্ট', '›U'], ['ন্ঠ', 'Ú'], ['ন্ড', 'Û'], ['ন্ত্র', 'š¿'], ['ন্ত', 'š—'],
  ['স্ত্র', '¯¿'], ['ত্র', 'Î'], ['ন্থ', 'š’'], ['ন্দ', '›`'], ['ন্দ্ব', '›Ø'], ['ন্ধ', 'Ü'],
  ['ন্ন', 'bœ'], ['ন্ব', 'š^'], ['ন্ম', 'b¥'], ['প্ট', 'Þ'], ['প্ত', 'ß'], ['প্ন', 'cœ'],
  ['প্প', 'à'], ['প্ল', 'c­'], ['প্স', 'á'], ['ফ্ল', 'd¬'], ['ব্জ', 'â'], ['ব্দ', 'ã'],
  ['ব্ধ', 'ä'], ['ব্ব', 'eŸ'], ['ব্ল', 'e­'], ['ভ্র', 'å'], ['ম্ন', 'gœ'], ['ম্প', '¤ú'],
  ['ম্ফ', 'ç'], ['ম্ব', '¤^'], ['ম্ভ', '¤¢'], ['ম্ভ্র', '¤£'], ['ম্ম', '¤§'], ['ম্ল', '¤­'],
  ['্র', 'ª'], ['রু', 'i“'], ['রূ', 'iƒ'], ['ল্ক', 'é'], ['ল্গ', 'ê'], ['ল্ট', 'ë'],
  ['ল্ড', 'ì'], ['ল্প', 'í'], ['ল্ফ', 'î'], ['ল্ব', 'j¦'], ['ল্ম', 'j¥'], ['ল্ল', 'j­'],
  ['শু', 'ï'], ['শ্চ', 'ð'], ['শ্ন', 'kœ'], ['শ্ব', 'k¦'], ['শ্ম', 'k¥'], ['শ্ল', 'k­'],
  ['ষ্ক', '®‹'], ['ষ্ক্র', '®Œ'], ['ষ্ট', 'ó'], ['ষ্ঠ', 'ô'], ['ষ্ণ', 'ò'], ['ষ্প', '®ú'],
  ['ষ্ফ', 'õ'], ['ষ্ম', '®§'], ['স্ক', '¯‹'], ['স্ট', '÷'], ['স্খ', 'ö'], ['স্ত', '¯—'],
  ['স্তু', '¯‘'], ['স্থ', '¯’'], ['স্ন', 'mœ'], ['স্প', '¯ú'], ['স্ফ', 'ù'], ['স্ব', '¯^'],
  ['স্ম', '¯§'], ['স্ল', '¯­'], ['হু', 'û'], ['হ্ণ', 'nè'], ['হ্ব', 'nŸ'], ['হ্ন', 'ý'],
  ['হ্ম', 'þ'], ['হ্ল', 'n¬'], ['হৃ', 'ü'], ['র্', '©'], ['্য', '¨'], ['্', '&'],
  ['আ', 'Av'], ['অ', 'A'], ['ই', 'B'], ['ঈ', 'C'], ['উ', 'D'], ['ঊ', 'E'], ['ঋ', 'F'],
  ['এ', 'G'], ['ঐ', 'H'], ['ও', 'I'], ['ঔ', 'J'], ['ক', 'K'], ['খ', 'L'], ['গ', 'M'],
  ['ঘ', 'N'], ['ঙ', 'O'], ['চ', 'P'], ['ছ', 'Q'], ['জ', 'R'], ['ঝ', 'S'], ['ঞ', 'T'],
  ['ট', 'U'], ['ঠ', 'V'], ['ড', 'W'], ['ঢ', 'X'], ['ণ', 'Y'], ['ত', 'Z'], ['থ', '_'],
  ['দ', '`'], ['ধ', 'a'], ['ন', 'b'], ['প', 'c'], ['ফ', 'd'], ['ব', 'e'], ['ভ', 'f'],
  ['ম', 'g'], ['য', 'h'], ['র', 'i'], ['ল', 'j'], ['শ', 'k'], ['ষ', 'l'], ['স', 'm'],
  ['হ', 'n'], ['ড়', 'o'], ['ঢ়', 'p'], ['য়', 'q'], ['ৎ', 'r'],
  ['০', '0'], ['১', '1'], ['২', '2'], ['৩', '3'], ['৪', '4'],
  ['৫', '5'], ['৬', '6'], ['৭', '7'], ['৮', '8'], ['৯', '9'],
  ['া', 'v'], ['ি', 'w'], ['ী', 'x'], ['ু', 'y'], ['ূ', '~'], ['ৃ', '…'],
  ['ে', '‡'], ['ৈ', '‰'], ['ৗ', 'Š'], ['ং', 's'], ['ঃ', 't'], ['ঁ', 'u']
];

function isBanglaPreKar(c: string): boolean {
  return c === 'ি' || c === 'ৈ' || c === 'ে';
}

function isBanglaHalant(c: string): boolean {
  return c === '্';
}

function isBanglaBanjonborno(c: string): boolean {
  return [
    'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
    'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন',
    'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ',
    'স', 'হ', 'ড়', 'ঢ়', 'য়', 'ৎ', 'ং', 'ঃ', 'ঁ'
  ].includes(c);
}

function reArrangeUnicodeText(str: string): string {
  let cY = 0;
  let chars = Array.from(str);

  for (let i = 0; i < chars.length; ++i) {
    if (i < chars.length && isBanglaPreKar(chars[i])) {
      let j = 1;
      while (isBanglaBanjonborno(chars[i - j])) {
        if (i - j < 0) break;
        if (i - j <= cY) break;
        if (isBanglaHalant(chars[i - j - 1])) {
          j += 2;
        } else {
          break;
        }
      }
      const pre = chars.slice(0, i - j);
      const kar = [chars[i]];
      const middle = chars.slice(i - j, i);
      const post = chars.slice(i + 1);

      chars = [...pre, ...kar, ...middle, ...post];
      cY = i + 1;
      continue;
    }

    if (
      i < chars.length - 1 &&
      isBanglaHalant(chars[i]) &&
      chars[i - 1] === 'র' &&
      !isBanglaHalant(chars[i - 2])
    ) {
      let j = 1;
      let aZ = 0;
      while (true) {
        if (isBanglaBanjonborno(chars[i + j]) && isBanglaHalant(chars[i + j + 1])) {
          j += 2;
        } else if (isBanglaBanjonborno(chars[i + j]) && isBanglaPreKar(chars[i + j + 1])) {
          aZ = 1;
          break;
        } else {
          break;
        }
      }
      const pre = chars.slice(0, i - 1);
      const mid1 = chars.slice(i + j + 1, i + j + aZ + 1);
      const mid2 = chars.slice(i + 1, i + j + 1);
      const ref = [chars[i - 1], chars[i]];
      const post = chars.slice(i + j + aZ + 1);

      chars = [...pre, ...mid1, ...mid2, ...ref, ...post];
      i += (j + aZ);
      cY = i + 1;
      continue;
    }
  }

  return chars.join('');
}

export function hasBanglaUnicode(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

export function isSutonnyFont(fontFamily: string | undefined): boolean {
  if (!fontFamily) return false;
  const f = fontFamily.toLowerCase().replace(/[\s-_]/g, '');
  return f.includes('sutonny') || f.includes('sushree');
}

export function isBanglaFont(fontFamily: string | undefined): boolean {
  if (!fontFamily) return false;
  const f = fontFamily.toLowerCase().replace(/[\s-_]/g, '');
  return (
    f.includes('sutonny') ||
    f.includes('sushree') ||
    f.includes('solaiman') ||
    f.includes('kalpurush') ||
    f.includes('bangla') ||
    f.includes('bengali')
  );
}

export function isBijoyText(text: string): boolean {
  if (!text) return false;
  // Common Bijoy / SutonnyMJ ANSI character indicators: †, ‡, ¤, ª, ©, w, v, ¯, š, ³, etc.
  return /[†‡¤ª©¯š³µ¶·»½¾ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ]/.test(text);
}

export function unicodeToBijoy(srcString: string): string {
  if (!srcString) return '';
  // Remove zero-width non-joiner and zero-width joiner characters (ZWNJ / ZWJ)
  let str = srcString.replace(/[\u200B-\u200D\uFEFF]/g, '');
  str = str.replace(/ো/g, 'ো').replace(/ৌ/g, 'ৌ');
  str = reArrangeUnicodeText(str);

  for (const [key, val] of MAIN_CHAR_MAP) {
    str = str.split(key).join(val);
  }

  str = str.replace(/(^|[\s(])‡/g, '$1†');
  return str;
}

export function bijoyToUnicode(srcString: string): string {
  if (!srcString) return '';
  let str = srcString;

  // Reverse mapping from Bijoy ANSI back to Unicode
  // Sort by key length descending to match longest ANSI clusters first
  const reverseMap = [...MAIN_CHAR_MAP].sort((a, b) => b[1].length - a[1].length);

  for (const [uni, bijoy] of reverseMap) {
    if (bijoy && str.includes(bijoy)) {
      str = str.split(bijoy).join(uni);
    }
  }

  // Normalize vowel pairs
  str = str.replace(/ো/g, 'ো').replace(/ৌ/g, 'ৌ');
  return str;
}
