-- Darb - Category Seed Data
-- 24 Main Categories

INSERT INTO categories (name_ar, icon, sort_order) VALUES
('برمجة وتقنية', 'laptop', 1),
('تصميم جرافيك وفيديو', 'palette', 2),
('كتابة وترجمة', 'pen', 3),
('تسويق ودعاية', 'megaphone', 4),
('البناء والتشييد', 'building', 5),
('السباكة والكهرباء', 'tool', 6),
('النجارة والأثاث', 'wood', 7),
('الخياطة والتطريز والأزياء', 'needle', 8),
('صيانة الكترونيات', 'tv', 9),
('صيانة سيارات', 'car', 10),
('صيانة عامة', 'wrench', 11),
('التعليم والدروس الخصوصية', 'book', 12),
('الدورات والتدريب', 'graduation', 13),
('النظافة والخدمات المنزلية', 'broom', 14),
('الطبخ وتجهيز الطعام', 'cooking', 15),
('النقل والتوصيل', 'truck', 16),
('العناية الشخصية والجمال', 'mirror', 17),
('الصحة والتمريض', 'hospital', 18),
('الخدمات الزراعية والحيوانية', 'plant', 19),
('الحرف اليدوية والتراث', 'handcraft', 20),
('تنظيم حفلات ومناسبات', 'party', 21),
('تصوير وفيديو', 'camera', 22),
('خدمات قانونية ومعاملات', 'document', 23),
('خدمات أخرى', 'dots', 24);

-- Note: Subcategories will be added programmatically via admin panel
-- This SQL file is for the initial migration
