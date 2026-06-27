export const CAMEROON_CITIES = [
  'Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi',
  'Limbe', 'Buea', 'Kumba', 'Dschang', 'Nkongsamba'
];

export const MTN_PREFIXES = ['650','651','652','653','654','655','656','657','658','659','670','671','672','673','674','675','676','677','678','679'];
export const ORANGE_PREFIXES = ['690','691','692','693','694','695','696','697','698','699'];
export const ALL_CAMEROON_PREFIXES = [...MTN_PREFIXES, ...ORANGE_PREFIXES];

export function isValidCameroonPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g,'').replace('+237','').replace('00237','');
  if (cleaned.length !== 9) return false;
  return ALL_CAMEROON_PREFIXES.includes(cleaned.substring(0, 3));
}

export function isMTNNumber(phone: string): boolean {
  const cleaned = phone.replace(/\s/g,'').replace('+237','').replace('00237','');
  return MTN_PREFIXES.includes(cleaned.substring(0, 3));
}

export function isOrangeNumber(phone: string): boolean {
  const cleaned = phone.replace(/\s/g,'').replace('+237','').replace('00237','');
  return ORANGE_PREFIXES.includes(cleaned.substring(0, 3));
}

export function formatXAF(amount: number): string {
  return `XAF ${amount.toLocaleString('fr-CM')}`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g,'');
  const local = cleaned.startsWith('237') ? cleaned.slice(3) : cleaned;
  return `+237 ${local.slice(0,3)} ${local.slice(3,6)} ${local.slice(6)}`;
}

export const MIN_RENTAL_AGE = 23;

export function isOldEnoughToRent(dob: Date): boolean {
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) return age - 1 >= MIN_RENTAL_AGE;
  return age >= MIN_RENTAL_AGE;
}
