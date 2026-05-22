export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 1, name: 'سباكة', icon: 'water-pipe', color: '#1565C0' },
  { id: 2, name: 'كهرباء', icon: 'flash', color: '#F9A825' },
  { id: 3, name: 'نجارة', icon: 'saw-blade', color: '#6D4C41' },
  { id: 4, name: 'دهان', icon: 'format-paint', color: '#00897B' },
  { id: 5, name: 'تبريد وتكييف', icon: 'snowflake', color: '#0288D1' },
  { id: 6, name: 'بناء وتشييد', icon: 'hammer', color: '#5D4037' },
  { id: 7, name: 'حدادة', icon: 'fire', color: '#BF360C' },
  { id: 8, name: 'جبس وأسقف', icon: 'wall', color: '#78909C' },
  { id: 9, name: 'بلاط وسيراميك', icon: 'grid', color: '#455A64' },
  { id: 10, name: 'نقل وتوصيل', icon: 'truck', color: '#E65100' },
  { id: 11, name: 'تنظيف', icon: 'spray-bottle', color: '#00ACC1' },
  { id: 12, name: 'تصميم داخلي', icon: 'sofa', color: '#6A1B9A' },
  { id: 13, name: 'برمجة وتقنية', icon: 'laptop', color: '#1B5E20' },
  { id: 14, name: 'تصميم جرافيك', icon: 'palette', color: '#C62828' },
  { id: 15, name: 'تسويق إلكتروني', icon: 'megaphone', color: '#283593' },
  { id: 16, name: 'تصوير وفيديو', icon: 'camera', color: '#37474F' },
  { id: 17, name: 'تعليم وتدريب', icon: 'school', color: '#4A148C' },
  { id: 18, name: 'صيانة أجهزة', icon: 'tools', color: '#BDBDBD' },
  { id: 19, name: 'خياطة وتفصيل', icon: 'needle', color: '#880E4F' },
  { id: 20, name: 'طبخ وحلويات', icon: 'chef-hat', color: '#E65100' },
  { id: 21, name: 'عناية شخصية', icon: 'spa', color: '#AD1457' },
  { id: 22, name: 'رعاية أطفال', icon: 'baby-bottle', color: '#EC407A' },
  { id: 23, name: 'صحة ولياقة', icon: 'heart-pulse', color: '#D32F2F' },
  { id: 24, name: 'خدمات منزلية', icon: 'home', color: '#388E3C' },
];
