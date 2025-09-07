export type SelectItem = { label: string; value: string };

export const categories: SelectItem[] = [
  {
    value: 'all',
    label: 'همه',
  },
  {
    value: 'personal',
    label: 'شخصی',
  },
  {
    value: 'work',
    label: 'کاری',
  },
  {
    value: 'fun',
    label: 'تفریحی',
  },
];

export const priorities: SelectItem[] = [
  {
    value: 'all',
    label: 'همه',
  },
  {
    value: 'high',
    label: 'بالا',
  },
  {
    value: 'medium',
    label: 'متوسط',
  },
  {
    value: 'low',
    label: 'پایین',
  },
];

export const statuses: SelectItem[] = [
  {
    value: 'all',
    label: 'همه',
  },
  {
    value: 'completed',
    label: 'تکمیل شده',
  },
  {
    value: 'in-progress',
    label: 'در حال انجام',
  },
  {
    value: 'not_started',
    label: 'بدون وضعیت',
  },
];

export const sortOptions: SelectItem[] = [
  {
    value: 'latest',
    label: 'جدیدترین ها',
  },
  {
    value: 'oldest',
    label: 'قدیمی ها',
  },
];
