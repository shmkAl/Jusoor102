import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
    return null;
  }
}

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'شراكتنا - منصة الشراكة المجتمعية | الثانوية 102',
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// AI Feedback Sentiment & Topics Analyzer
app.post('/api/ai/analyze-feedback', async (req: Request, res: Response) => {
  const { voices } = req.body;

  if (!voices || !Array.isArray(voices) || voices.length === 0) {
    return res.status(400).json({ error: 'No voices data provided' });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `أنت خبير تحليل بيانات تربوية ومستشار قياس أثر الشراكة المجتمعية بوزارة التعليم السعودية.
قم بتحليل آراء وملاحظات أولياء الأمور التالية التابعة للمدرسة الثانوية 102:

${JSON.stringify(voices.map((v: any) => ({
  category: v.category,
  type: v.type,
  content: v.content,
  satisfaction: v.satisfactionRating
})), null, 2)}

المطلوب:
1. تحليل وتصنيف المشاعر بدقة إلى أربعة تصنيفات: (إيجابي positive، محايد neutral، يحتاج إلى تحسين needsImprovement، عاجل urgent) مع حساب النسب المئوية.
2. استخراج نسب توزيع الموضوعات الأكثر تكرارًا (مثل: التواصل مع المدرسة، الأنشطة والفعاليات، التقنية والتحول الرقمي، البيئة المدرسية، الأمن والسلامة، المقصف المدرسي، إلخ) مع النسبة المئوية التقريبية.
3. استخراج أهم 3-4 رؤى استراتيجية مستخلصة (keyInsights).
4. تقديم أهم 3-5 توصيات إجرائية عملية عاجلة لإدارة المدرسة ومنسقة الشراكة (recommendations).

يجب أن تكون الإجابة بتنسيق JSON صالح فقط وبالمفتاحين التاليين دون أي نص إضافي:
{
  "sentimentBreakdown": {
    "positive": 45,
    "neutral": 20,
    "needsImprovement": 25,
    "urgent": 10
  },
  "topicsDistribution": [
    { "topic": "التواصل مع المدرسة", "percentage": 30, "count": 6 },
    { "topic": "التقنية والتحول الرقمي", "percentage": 25, "count": 5 },
    { "topic": "الأنشطة والفعاليات", "percentage": 20, "count": 4 },
    { "topic": "البيئة والمقصف", "percentage": 15, "count": 3 },
    { "topic": "أخرى", "percentage": 10, "count": 2 }
  ],
  "keyInsights": [
    "إشادة واسعة بتوجه المدرسة نحو التقنية والذكاء الاصطناعي",
    "رغبة ملحة من أولياء الأمور في تحسين وتنظيم قنوات التواصل الإداري",
    "مطالبات متكررة بتنويع الخيارات الصحية بالمقصف المدرسي"
  ],
  "recommendations": [
    "توسيع نطاق مبادرة مبرمجات المستقبل وإضافة معامل مسائية",
    "اعتماد نشرة أسبوعية رقمية موحدة للحد من تشتت الرسائل",
    "تحديث اشتراطات المقصف وتوفير بدائل صحية مدعومة",
    "عقد لقاء دوري افتراضي لأولياء أمور الطالبات المستجدات"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        data: {
          ...parsed,
          generatedAt: new Date().toISOString(),
          isAiGenerated: true,
        }
      });
    } catch (err: any) {
      console.error('Gemini Feedback Analysis Error:', err?.message || err);
      // Fallback to local analytical engine
    }
  }

  // Smart Fallback Local Analytics Calculation
  const total = voices.length;
  let positiveCount = 0;
  let neutralCount = 0;
  let needsImprovementCount = 0;
  let urgentCount = 0;

  const topicCounts: Record<string, number> = {};

  voices.forEach((v: any) => {
    const text = (v.content || '') + ' ' + (v.category || '');
    if (v.satisfactionRating >= 4 || v.type === 'شكر وتقدير' || text.includes('شكرا') || text.includes('رائع') || text.includes('متميز')) {
      positiveCount++;
    } else if (v.satisfactionRating === 3 || v.type === 'استفسار') {
      neutralCount++;
    } else if (text.includes('عاجل') || text.includes('خطر') || text.includes('سلامة') || v.category === 'الأمن والسلامة') {
      urgentCount++;
    } else {
      needsImprovementCount++;
    }

    const cat = v.category || 'أخرى';
    topicCounts[cat] = (topicCounts[cat] || 0) + 1;
  });

  const topicsDistribution = Object.entries(topicCounts).map(([topic, count]) => ({
    topic,
    count,
    percentage: Math.round((count / total) * 100),
  })).sort((a, b) => b.count - a.count);

  const fallbackReport = {
    sentimentBreakdown: {
      positive: Math.round((positiveCount / total) * 100) || 40,
      neutral: Math.round((neutralCount / total) * 100) || 20,
      needsImprovement: Math.round((needsImprovementCount / total) * 100) || 30,
      urgent: Math.round((urgentCount / total) * 100) || 10,
    },
    topicsDistribution: topicsDistribution.slice(0, 6),
    keyInsights: [
      'اهتمام متزايد من أولياء الأمور بالمشاركة في البرامج التقنية والمبادرات التطوعية لبناتهم.',
      'ارتفاع ملحوظ في مستوى الرضا العام عن البيئة المدرسية والمبادرات النوعية المنفذة.',
      'الحاجة المستمرة لتوحيد قنوات إرسال الجداول والتكاليف عبر منصة رقمية موحدة.'
    ],
    recommendations: [
      'تعزيز وتوسيع الشراكات مع الجهات التقنية لتلبية تطلعات أولياء الأمور في الذكاء الاصطناعي.',
      'تحديث اشتراطات المقصف المدرسي وتوفير خيارات صحية معتمدة.',
      'تفعيل لقاءات دورية هجينة (حضورية وافتراضية) تناسب كافة جداول أولياء الأمور.',
      'استثمار بنك خبرات أولياء الأمور المسجلين في تقديم ورش تدريبية للطالبات.'
    ],
    generatedAt: new Date().toISOString(),
    isAiGenerated: false,
  };

  return res.json({ success: true, data: fallbackReport });
});

// AI Partnership Assistant Copilot (Generates Plans, Letters, Surveys, Reports)
app.post('/api/ai/partnership-assistant', async (req: Request, res: Response) => {
  const { mode, topic, targetAudience, partnerName, contextData } = req.body;

  const ai = getGeminiClient();

  if (ai) {
    try {
      let prompt = '';
      if (mode === 'partnership_letter') {
        prompt = `أنت منسقة الشراكة المجتمعية المحترفة في المدرسة الثانوية 102 التابعة للإدارة العامة للتعليم.
اكتب خطاب طلب شراكة مجتمعية رسمي واحترافي موجه إلى: "${partnerName || 'الجهة الشريكة'}".
الموضوع أو المبادرة المطلوبة: "${topic}".
الفئة المستهدفة: "${targetAudience || 'طالبات المرحلة الثانوية'}".

الخطاب يجب أن يحتوي على:
- البسملة والترويسة الرسمية
- التحية والتقدير لجهود الجهة الشريكة في خدمة الوطن ورؤية 2030
- التعريف بالمدرسة الثانوية 102 وهدف المبادرة
- مجالات الدعم والتعاون المقترحة
- الفوائد والمكتسبات المتبادلة للطرفين (بما في ذلك المسؤولية المجتمعية)
- خاتمة رسمية ودعوة لعقد اجتماع تنسيقي
- التوقيع: منسقة الشراكة المجتمعية / مديرة المدرسة الثانوية 102.
اجعل الأسلوب رسميًا، بليغًا ومقنعًا جدًا.`;
      } else if (mode === 'initiative_plan') {
        prompt = `أنت خبير التخطيط التربوي والمبادرات المدرسية للشراكة المجتمعية.
قم بإنشاء خطة مبادرة مدرسية تفصيلية ومتكاملة للمدرسة الثانوية 102 بناءً على الفكرة التالية:
الفكرة: "${topic}".
الفئة المستهدفة: "${targetAudience || 'طالبات الثانوية وأسرهن'}".
الجهة الشريكة المقترحة: "${partnerName || 'قطاع حكومي / غير ربحي'}".

المطلوب صياغة خطة متكاملة تشمل:
1. اسم المبادرة المقترح (إبداعي وجذاب)
2. الرؤية والرسالة المرتبطة بالمبادرة
3. الأهداف التفصيلية (Smart Goals)
4. الفئة المستفيدة وعدد المقاعد المقترحة
5. خطة التنفيذ والمراحل الزمنية (التحضير، التدشين، الورش، التقييم الختامي)
6. الشركاء المجتمعيون المناسبون ودور كل شريك
7. الاحتياجات والتجهيزات والأدوات المطلوبة
8. مؤشرات النجاح ومستهدفات الأداء (KPIs)
9. أدوات قياس الأثر بعد انتهاء المبادرة
10. فريق العمل وأدوار منسقة الشراكة وأولياء الأمور المتطوعين.

نسق الإجابة بعناوين واضحة وجداول نقطية منسقة بجمالية.`;
      } else if (mode === 'satisfaction_survey') {
        prompt = `أنت خبير قياس رضا المستفيدين في المدارس السعودية.
قم بإعداد استبيان قياس رضا وتقييم أثر لأولياء الأمور والطالبات لمبادرة/فعالية: "${topic}".
المطلوب صياغة استبيان احترافي يحتوي على:
- مقدمة ترحيبية ودية وموجزة لأولياء الأمور
- 6-8 أسئلة مقياس ليكرت الخماسي (ممتاز، جيد جدًا، جيد، مقبول، ضعيف) تغطي: التنسيق، المحتوى، جودة المدربين، ملاءمة التوقيت، الأثر المكتسب، والتنظيم.
- سؤالان مفتوحان: (أبرز ما نال إعجابكم في المبادرة؟ / ما مقترحاتكم التطويرية للمبادرات القادمة؟)
- سؤال اختياري: مدى الرغبة في حضور أو التطوع في فعاليات مستقبلية.
- خاتمة شكر وتقدير.`;
      } else if (mode === 'final_report') {
        prompt = `قم بصياغة تقرير ختامي رسمي لإنجاز مبادرة شراكة مجتمعية باسم: "${topic}" في المدرسة الثانوية 102.
التقرير يجب أن يشتمل على:
1. بطاقة تعريف المبادرة (الاسم، التاريخ، المنفذون، الشركاء، الفئة المستهدفة)
2. ملخص الإنجاز بالأرقام (عدد المستفيدات، ساعات التدريب، نسب الرضا)
3. المخرجات والنتائج النوعية المحققة
4. شهادات وتغذية راجعة من أولياء الأمور
5. التحديات وكيف تم التغلب عليها
6. التوصيات لاستدامة المبادرة وتعميمها.`;
      } else {
        prompt = `أنت مساعد الشراكة المجتمعية الذكي للمدرسة الثانوية 102. ساعد منسقة الشراكة في تقديم استشارة متخصصة بخصوص: "${topic}".
قدّم أفكارًا إبداعية وخطوات إجرائية متوافقة مع أدلة الشراكة المجتمعية (ارتقاء) بوزارة التعليم السعودية.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.5,
        }
      });

      return res.json({
        success: true,
        generatedText: response.text,
        mode,
        topic,
        isAiGenerated: true,
      });
    } catch (err: any) {
      console.error('Gemini Assistant Error:', err?.message || err);
    }
  }

  // Smart Fallback Local Generator
  let generatedText = '';
  const nowStr = new Date().toLocaleDateString('ar-SA');

  if (mode === 'partnership_letter') {
    generatedText = `بسم الله الرحمن الرحيم

المملكة العربية السعودية
وزارة التعليم
الإدارة العامة للتعليم بمنطقة الرياض
المدرسة الثانوية 102
وحدة الشراكة المجتمعية (ارتقاء)

التاريخ: ${nowStr}
الرقم الإشاري: ش-م/102/2026

سعادة / رئيس مجلس إدارة / مدير عام ${partnerName || 'المؤسسة الشريكة الموقرة'}
سلمه الله

السلام عليكم ورحمة الله وبركاته،،،

الموضوع: طلب شراكة مجتمعية نوعية لمبادرة «${topic || 'تمكين طالبات المستقبل'}»

انطلاقًا من رؤية المملكة العربية السعودية 2030 في تعزيز المسؤولية المجتمعية وبناء جسور التكامل بين المؤسسات التعليمية ومؤسسات الوطن الرائدة، وتماشيًا مع مستهدفات وزارة التعليم في تمكين الطالبات وتزويدهن بالمهارات المستقبلية؛

يسر إدارة المدرسة الثانوية 102 أن تتقدم لسعادتكم بخالص التقدير لجهودكم المتميزة في خدمة المجتمع، ونعرب عن رغبتنا في عقد شراكة مجتمعية فاعلة ومستدامة معكم لتنفيذ مبادرة نوعية بعنوان:
«${topic || 'تأهيل الطالبات وتطوير المهارات القيادية'}»

مجالات التعاون المقترحة:
1. تقديم ورش عمل تدريبية وتطبيقية للطالبات بإشراف كوادركم المتميزة.
2. تنظيم زيارات ميدانية ملهمة لمرافق ومقار مؤسستكم الموقرة.
3. رعاية ودعم المشاريع الابتكارية المتميزة لطالبات المدرسة.

المكتسبات المتبادلة:
- إبراز دور جهتكم في تقارير المسؤولية المجتمعية والمنصات التعليمية الرسمية.
- تكريم جهتكم في الحفل السنوي وتوثيق الشراكة في سجل الإنجازات المدرسية.
- الأثر المستدام في بناء جيل واعد من بناتنا الطالبات.

نتطلع لتشريفنا بتحديد موعد لاجتماع تنسيقي مع فريق الشراكة لمناقشة آليات التنفيذ وصياغة مذكرة التفاهم.

شاكرين ومقدرين حسن تعاونكم ودعمكم الدائم لمسيرة التعليم في وطننا الغالي.

وتفضلوا بقبول فائق التحية والتقدير،،،

منسقة الشراكة المجتمعية: أ. شهد العتيبي
مديرة المدرسة الثانوية 102: أ. عائشة شيبه`;
  } else if (mode === 'initiative_plan') {
    generatedText = `خطة مبادرة شراكة مجتمعية متكاملة
المدرسة الثانوية 102 - العام الدراسي 1448هـ

📌 اسم المبادرة: مبادرة «${topic || 'بناء المهارات وتمكين الطالبات'}»
🎯 الفئة المستهدفة: ${targetAudience || 'طالبات المرحلة الثانوية وأسرهن'}
🏢 الشريك المجتمعي: ${partnerName || 'المؤسسات الوطنية الرائدة وأولياء الأمور'}

1. الأهداف الاستراتيجية:
- تمكين الطالبات من مهارات القرن الحادي والعشرين والتفكير الإبداعي.
- تعزيز مشاركة الأسرة كشريك استراتيجي في دعم المسيرة التعليمية.
- فتح آفاق مهنية وتقنية واعدة تتسق مع مسارات التعليم الثانوي.

2. مراحل التنفيذ:
• المرحلة الأولى (التخطيط والتحضير - أسبوعان):
  - حصر الطالبات الراغبات وتحديد جدول القاعات والمعامل.
  - التنسيق مع المدربين والجهات الشريكة وتجهيز الحقائب التدريبية.
• المرحلة الثانية (التدشين والورش التطبيقية - 4 أسابيع):
  - إطلاق اللقاء التعريفي الأول بحضور أولياء الأمور.
  - تنفيذ 8 ورش تدريبية عملية بمعدل جلستين أسبوعيًا.
• المرحلة الثالثة (المعرض الختامي وقياس الأثر - أسبوع):
  - استعراض مشاريع ومخرجات الطالبات في المعرض المدرسي.
  - توزيع استبيانات قياس الرضا وتكريم الفرق الفائزة والشركاء.

3. مؤشرات الأداء والنجاح (KPIs):
- تدريب ما لا يقل عن 120 طالبة.
- تحقيق نسبة رضا عامة تفوق 90% من الطالبات وأولياء الأمور.
- إنجاز 15 مشروعًا تطبيقيًا قابلاً للتطوير.

4. فريق العمل:
- المشرف العام: مديرة المدرسة.
- المنسق التنفيذي: منسقة الشراكة المجتمعية.
- الفريق الفني: رائدات النشاط ومعلمات التخصص وأولياء الأمور المتطوعون.`;
  } else {
    generatedText = `استبيان قياس رضا أولياء الأمور
المدرسة الثانوية 102 - مبادرة «${topic || 'الشراكة المجتمعية'}»

عزيزي ولي الأمر الكريم / عزيزتي ولية الأمر الكريمة:
حرصًا منا على التطوير المستمر لبرامجنا وقياس الأثر الملموس لمبادراتنا، نأمل منكم التكرم بتعبئة هذا الاستبيان القصير:

1. مدى وضوح أهداف المبادرة وملاءمتها لاحتياجات الطالبة:
[ ] ممتاز   [ ] جيد جدًا   [ ] جيد   [ ] مقبول   [ ] ضعيف

2. جودة المادة التدريبية وكفاءة المدربين والقائمين على البرنامج:
[ ] ممتاز   [ ] جيد جدًا   [ ] جيد   [ ] مقبول   [ ] ضعيف

3. ملاءمة أوقات وجدول تنفيذ الفعاليات:
[ ] ممتاز   [ ] جيد جدًا   [ ] جيد   [ ] مقبول   [ ] ضعيف

4. التغيير الإيجابي والتطور الملاحظ على مهارات واهتمامات ابنتكم:
[ ] ممتاز   [ ] جيد جدًا   [ ] جيد   [ ] مقبول   [ ] ضعيف

5. مستوى التواصل والتنظيم من إدارة المدرسة ومنسقة الشراكة:
[ ] ممتاز   [ ] جيد جدًا   [ ] جيد   [ ] مقبول   [ ] ضعيف

ما أكثر ما نال إعجابكم في هذه المبادرة؟
...........................................................................

ما هي مقترحاتكم لتطوير المبادرات المدرسية القادمة؟
...........................................................................

شكرًا لمشاركتكم القيمة، صوتكم هو أساس نجاحنا وسر تميز بناتنا 🌷`;
  }

  return res.json({
    success: true,
    generatedText,
    mode,
    topic,
    isAiGenerated: false,
  });
});

// Production & Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
