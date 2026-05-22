# خطة التطوير الفنية (للمبرمج - Vibe Coder)

> هذا المخطط يوضح ترتيب البناء خطوة بخطوة، من الصفر إلى أول إصدار.

---

## الخطوة 1: إعداد البيئة (Day 1)

```
شغلني/
├── server/           # Backend (Node.js + Express)
│   ├── package.json
│   ├── index.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── controllers/
├── client/           # Frontend (React + Vite + Tailwind)
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/
└── README.md
```

**المطلوب:**
- Node.js + Express backend
- React + Vite + Tailwind frontend
- PostgreSQL (أو MySQL)
- GitHub repo

---

## الخطوة 2: قاعدة البيانات (Database Schema)

### الجداول الأساسية:

```sql
-- المستخدمين
Users: id, name, phone, password_hash, role (skill_owner | client | admin)
       id_verified (boolean), city, created_at

-- الخدمات (يلنشرها صاحب المهارة)
Services: id, user_id (skill_owner), category, title, description
          price, images (json), city, status (active|inactive)
          created_at

-- الطلبات (ينشرها صاحب العمل)
Requests: id, user_id (client), category, description, images (json)
          budget_min, budget_max, duration, city, status (open|in_progress|completed|cancelled)
          created_at

-- العروض (يقدمها أصحاب المهارات على الطلبات)
Offers: id, request_id, user_id (skill_owner), price, description
        duration, status (pending|accepted|rejected|cancelled)
        created_at

-- الصفقات (بعد قبول العرض)
Transactions: id, request_id, offer_id, service_id (nullable)
              client_id, skill_owner_id, amount, platform_fee
              status (pending_payment|in_progress|completed|disputed|cancelled)
              client_confirmed (boolean), created_at, completed_at

-- المحفظة
Wallets: id, user_id, balance (decimal), created_at

-- حركات المحفظة
WalletTransactions: id, wallet_id, type (deposit|withdraw|payment|refund|fee)
                    amount, reference_type, reference_id, created_at

-- التقييمات
Reviews: id, transaction_id, reviewer_id, reviewee_id, rating (1-5)
         comment, created_at

-- طلبات السحب (صاحب المهارة يسحب فلوسه)
Withdrawals: id, user_id, amount, wallet_type (karimi|jeeb|etc)
             wallet_number, status (pending|approved|rejected|completed)
             created_at
```

---

## الخطوة 3: ترتيب بناء الـ API (من الأهم للأقل أهمية)

### المرحلة 1 - الأساسيات (شغالة)
```
1. POST /api/auth/register     - تسجيل (اسم + جوال + كلمة سر)
2. POST /api/auth/login        - تسجيل دخول
3. POST /api/auth/verify-otp   - تأكيد رقم الجوال
4. GET  /api/users/profile     - عرض الملف الشخصي
5. PUT  /api/users/profile     - تعديل الملف الشخصي
```

### المرحلة 2 - الخدمات والطلبات
```
6.  POST   /api/services        - إضافة خدمة
7.  GET    /api/services        - عرض كل الخدمات
8.  GET    /api/services/:id    - عرض خدمة معينة
9.  POST   /api/requests        - نشر طلب
10. GET    /api/requests        - عرض كل الطلبات
11. GET    /api/requests/:id    - عرض طلب معين
12. POST   /api/offers          - تقديم عرض على طلب
13. GET    /api/offers/:request_id - عرض عروض طلب معين
```

### المرحلة 3 - الدفع والصفقات
```
14. POST /api/wallets/deposit     - إيداع في المحفظة
15. POST /api/transactions        - إنشاء صفقة (بعد قبول العرض)
16. POST /api/transactions/pay    - دفع المبلغ للمنصة
17. PUT  /api/transactions/confirm - تأكيد الاستلام
18. POST /api/withdrawals         - طلب سحب
19. GET  /api/withdrawals         - عرض طلبات السحب
```

### المرحلة 4 - تقييم + بحث
```
20. POST /api/reviews          - تقييم بعد الصفقة
21. GET  /api/search?q=        - بحث ذكي
```

### المرحلة 5 - Admin
```
22. GET  /api/admin/users      - كل المستخدمين
23. GET  /api/admin/transactions - كل الصفقات
24. PUT  /api/admin/dispute/:id - حل نزاع
25. PUT  /api/admin/withdrawals/:id - الموافقة على سحب
```

---

## الخطوة 4: واجهة المستخدم (الصفحات المطلوبة)

### صفحات عامة (بدون تسجيل)
1. **الصفحة الرئيسية** - بحث، وخدمات مميزة
2. **نتائج البحث** - عرض الخدمات والطلبات

### صفحات المستخدم
3. **تسجيل/دخول**
4. **الملف الشخصي**
5. **المحفظة** - الرصيد، الإيداع، السحب
6. **إضافة خدمة** - نموذج اختيارات
7. **خدماتي** - قائمة خدماتي
8. **نشر طلب** - نموذج طلب
9. **طلباتي** - قائمة طلباتي
10. **العروض** - العروض المقدمة على طلباتي
11. **الصفقات** - الصفقات النشطة والسابقة
12. **التقييم** - تقييم بعد إتمام الصفقة

### صفحة Admin
13. **لوحة التحكم** - مستخدمين، صفقات، نزاعات، سحوبات

---

## الخطوة 5: الترتيب الزمني للبناء

| الأسبوع | المهمة |
|---|---|
| **الأسبوع 1** | إعداد البيئة + قاعدة البيانات + API Authentication |
| **الأسبوع 2** | API الخدمات والطلبات + العروض + واجهاتها |
| **الأسبوع 3** | API الدفع والمحفظة + الصفقات + واجهاتها |
| **الأسبوع 4** | نظام التقييم + البحث + Admin panel |
| **الأسبوع 5** | اختبارات + تجربة مستخدم + تحسينات |
| **الأسبوع 6** | إطلاق تجريبي (Beta) + تصحيح أخطاء |

---

## ملاحظات للمبرمج (Vibe Coder)

1. **استخدم Cursor أو Windsurf أو Claude** لكتابة الكود. كل ما تحتاجه هو:
   - اعط السؤال: "Create Express API for user registration with OTP"
   - اختبر الكود
   - صحح الأخطاء

2. **ابدأ بخطوة صغيرة:** سوّي تسجيل الدخول أولاً. اختبره. بعدين أضف الخدمات. اختبر. وهكذا.

3. **ركز على الجوال أولاً:** كل التصميم يكون Mobile-First (لأن معظم المستخدمين في اليمن على الجوال)

4. **PWA:** تأكد إن التطبيق يشتغل كـ Progressive Web App عشان اللي ما عنده متجر جوجل

5. **الأمان:** كل API يحتاج Token (JWT)، رقم الجوال ما يظهر أبداً للطرف الآخر
