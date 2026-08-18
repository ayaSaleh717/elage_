import {
  Bot,
  Send,
  User,
  Stethoscope,
  MapPin,
  Sparkles,
  ArrowRight,
  Brain,
  Zap,
  Shield,
  Clock,
  MessageSquare,
  Heart,
  Activity,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import doctorsData from "@/components/data/doctor.json";
import { GoogleGenAI } from "@google/genai";
import { apiService } from "@/services/api";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_MODEL = "gemini-3.6-flash";

if (!GEMINI_API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not configured");
}

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  })
  : null;

interface Message {
  role: "assistant" | "user";
  content: string;
  doctorRecommendations?: {
    specialty: string;
    doctors: typeof doctorsData.doctors;
  }[]; questionsAsked?: string[];
}

interface GeminiQuestionResponse {
  type: "question";
  question: string;
}
interface GeminiSummaryResponse {
  type: "summary";
  summary: string;
  specialties: string[];
}

type GeminiResponse =
  | GeminiQuestionResponse
  | GeminiSummaryResponse;
/**
 * ============================================================
 * SYSTEM PROMPT
 * ============================================================
 */

const SYSTEM_PROMPT = `
أنت مساعد طبي ذكي يعمل في منصة لحجز المواعيد الطبية.

مهمتك:
جمع معلومات أولية عن أعراض المريض من خلال أسئلة قصيرة، ثم تقديم ملخص للحالة واقتراح الاختصاصات الطبية الأنسب التي يمكن للمريض مراجعتها.

القواعد الإلزامية:

1. اسأل سؤالاً واحداً فقط في كل رد.
2. لا تسأل أكثر من 6 أسئلة متابعة بعد الشكوى الأولى.
3. عندما تحصل على معلومات كافية، أرسل summary بدلاً من سؤال جديد.
4. لا تقدم تشخيصاً نهائياً.
5. لا تصف أو تنصح بأي دواء.
6. لا تشرح طريقة تفكيرك.
7. استخدم اللغة العربية فقط.
8. لا تكتب Markdown.
9. لا تكتب أي نص خارج JSON.
10. لا تستخدم قوائم مرقمة داخل السؤال.
11. السؤال يجب أن يكون جملة واحدة فقط.
12. summary يجب أن يكون مختصراً، جملة أو جملتين فقط.
13. عند إرسال summary يجب أن تقترح من 1 إلى 3 اختصاصات طبية مناسبة.
14. يجب أن تكون جميع الاختصاصات المقترحة من القائمة المحددة أدناه حرفياً.
15. رتّب الاختصاصات من الأكثر مناسبة إلى الأقل مناسبة.
16. لا تقترح اختصاصات عشوائية.
17. إذا كانت الأعراض يمكن أن ترتبط بأكثر من اختصاص، اقترح الاختصاصات الأكثر ارتباطاً فقط.
18. إذا لم تكن المعلومات كافية، اسأل سؤالاً واحداً بدلاً من إعطاء التخصصات.
19. لا تكرر سؤالاً سبق طرحه.
20. إذا كانت المعلومات كافية لاتخاذ توجيه عام، انتقل إلى summary.
21. إذا ظهرت أعراض خطيرة مثل ألم صدر شديد، صعوبة شديدة في التنفس، فقدان الوعي، نزيف شديد، ضعف مفاجئ في أحد الأطراف، أو ألم شديد جداً ومفاجئ، يجب أن يكون السؤال التالي أو الملخص واضحاً بأن الحالة تحتاج تقييماً طبياً عاجلاً، دون تقديم تشخيص.

الاختصاصات المسموح باقتراحها فقط:

[
"طب عام",
"طب القلب",
"طب الأطفال",
"طب الأسرة",
"طب العيون",
"طب الأعصاب",
"الأمراض الجلدية",
"أمراض النساء",
"جراحة عامة",
"جراحة العظام",
"جراحة الأعصاب",
"جراحة التجميل",
"جراحة الأوعية",
"جراحة الصدر",
"جراحة المسالك",
"الأمراض الصدرية",
"الأمراض الباطنية",
"أمراض الغدد",
"أمراض الكلى",
"أمراض الدم",
"أمراض الروماتيزم",
"أمراض المناعة",
"أمراض الهضم",
"أمراض الأنف والأذن والحنجرة",
"الطب النفسي",
"طب الطوارئ",
"طب التخدير",
"طب الأورام",
"طب الجلدية والتجميل",
"طب الشيخوخة",
"طب الفيزياء والتأهيل"
]

صيغة السؤال يجب أن تكون بالضبط:

{
  "type": "question",
  "question": "سؤال واحد فقط باللغة العربية"
}

صيغة الملخص يجب أن تكون بالضبط:

{
  "type": "summary",
  "summary": "ملخص قصير للحالة باللغة العربية",
  "specialties": [
    "الاختصاص الأول",
    "الاختصاص الثاني"
  ]
}

مهم:
specialties يجب أن تحتوي على 1 إلى 3 اختصاصات فقط.
يجب أن تكون الاختصاصات مطابقة حرفياً للقائمة المسموح بها.
لا تضف أي مفاتيح أخرى.
`;
/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isQuotaError = (error: unknown): boolean => {
  const message =
    error instanceof Error
      ? error.message
      : JSON.stringify(error);

  return (
    message.includes("429") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("quota") ||
    message.includes("Quota exceeded")
  );
};

const isInvalidJsonError = (error: unknown): boolean => {
  const message =
    error instanceof Error
      ? error.message
      : JSON.stringify(error);

  return (
    message.includes("JSON") ||
    message.includes("SyntaxError") ||
    message.includes("invalid JSON")
  );
};

/**
 * محاولة استخراج JSON في حال رجع Gemini نصاً يحتوي JSON
 */
const extractJsonObject = (text: string): string => {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

/**
 * تنظيف السؤال بحيث يكون سؤالاً واحداً فقط
 */
const SPECIALTIES = [
  "طب عام",
  "طب القلب",
  "طب الأطفال",
  "طب الأسرة",
  "طب العيون",
  "طب الأعصاب",
  "الأمراض الجلدية",
  "أمراض النساء",
  "جراحة عامة",
  "جراحة العظام",
  "جراحة الأعصاب",
  "جراحة التجميل",
  "جراحة الأوعية",
  "جراحة الصدر",
  "جراحة المسالك",
  "الأمراض الصدرية",
  "الأمراض الباطنية",
  "أمراض الغدد",
  "أمراض الكلى",
  "أمراض الدم",
  "أمراض الروماتيزم",
  "أمراض المناعة",
  "أمراض الهضم",
  "أمراض الأنف والأذن والحنجرة",
  "الطب النفسي",
  "طب الطوارئ",
  "طب التخدير",
  "طب الأورام",
  "طب الجلدية والتجميل",
  "طب الشيخوخة",
  "طب الفيزياء والتأهيل",
] as const;

type Specialty = (typeof SPECIALTIES)[number];

const normalizeSpecialty = (
  specialty: string
): Specialty => {
  const value = specialty.trim();

  const exactMatch = SPECIALTIES.find(
    (item) => item === value
  );

  return exactMatch || "طب عام";
};

const normalizeSpecialties = (
  specialties: unknown
): Specialty[] => {
  if (!Array.isArray(specialties)) {
    return ["طب عام"];
  }

  const normalized = specialties
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) =>
      normalizeSpecialty(item)
    );

  return [
    ...new Set(normalized),
  ].slice(0, 3) as Specialty[];
};

/**
 * تنظيف السؤال بحيث يكون سؤالاً واحداً فقط
 */
const normalizeQuestion = (question: string): string => {
  return question
    .trim()
    .replace(/[؟?]+/g, "؟")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * ============================================================
 * COMPONENT
 * ============================================================
 */

const AIConsultation = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "مرحباً بك! أنا المساعد الطبي الذكي. سأساعدك في جمع معلومات أولية عن حالتك وتوجيهك للتخصص المناسب.\n\nما هي الشكوى الرئيسية التي تعاني منها؟",
      questionsAsked: ["ما هي الشكوى الرئيسية التي تعاني منها؟"],
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const [inputError, setInputError] =
    useState<string | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  /**
   * ==========================================================
   * SCROLL
   * ==========================================================
   */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * ==========================================================
   * TYPING EFFECT
   * ==========================================================
   */

  useEffect(() => {
    if (!isLoading) {
      setTypingEffect(false);
      return;
    }

    setTypingEffect(true);

    const timer = setTimeout(() => {
      setTypingEffect(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLoading]);

  /**
   * ==========================================================
   * VALIDATE INPUT
   * ==========================================================
   */

  const validateInput = (
    text: string
  ): {
    isValid: boolean;
    error?: string;
  } => {
    const trimmed = text.trim();

    if (!trimmed) {
      return {
        isValid: false,
        error: "الرجاء إدخال وصف للأعراض",
      };
    }

    if (trimmed.length > 500) {
      return {
        isValid: false,
        error:
          "الوصف طويل جداً. الرجاء اختصار الوصف إلى 500 حرف",
      };
    }

    const hasArabic = /[\u0600-\u06FF]/.test(
      trimmed
    );

    if (!hasArabic && trimmed.length > 10) {
      return {
        isValid: false,
        error:
          "الرجاء إدخال الوصف باللغة العربية",
      };
    }

    const invalidPatterns = [
      /^[0-9\s]+$/,
      /^(.)\1+$/,
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(trimmed)) {
        return {
          isValid: false,
          error:
            "الوصف غير صالح. الرجاء إدخال وصف حقيقي للأعراض",
        };
      }
    }

    return {
      isValid: true,
    };
  };

  /**
   * ==========================================================
   * EXTRACT QUESTIONS
   * ==========================================================
   */

  const extractQuestions = (
    content: string
  ): string[] => {
    const questions: string[] = [];

    const matches =
      content.match(/[^؟?]*[؟?]/g);

    if (matches) {
      for (const question of matches) {
        const normalized =
          normalizeQuestion(question);

        if (normalized.length > 5) {
          questions.push(normalized);
        }
      }
    }

    return [...new Set(questions)];
  };

  /**
   * ==========================================================
   * DOCTORS
   * ==========================================================
   */

  const findDoctorsBySpecialty = (
    specialty: string
  ) => {
    const normalized =
      normalizeSpecialty(specialty);

    return doctorsData.doctors.filter(
      (doc) =>
        doc.available &&
        doc.specialty === normalized
    );
  };

  const findDoctorsBySpecialties = (
    specialties: string[]
  ) => {
    return specialties.map((specialty) => ({
      specialty: normalizeSpecialty(specialty),
      doctors: findDoctorsBySpecialty(
        specialty
      ),
    }));
  };
  /**
   * ==========================================================
   * GEMINI CALL
   * ==========================================================
   */

  const callGemini = async (
    conversation: Message[]
  ): Promise<GeminiResponse> => {
    if (!GEMINI_API_KEY || !ai) {
      throw new Error(
        "VITE_GEMINI_API_KEY is not configured"
      );
    }

    /**
     * Gemini conversation.
     *
     * مهم:
     * لا نرسل كل metadata الموجودة في Message.
     */
    const contents = conversation.map(
      (msg) => ({
        role:
          msg.role === "user"
            ? "user"
            : "model",
        parts: [
          {
            text: msg.content,
          },
        ],
      })
    );

    /**
     * Structured JSON schema.
     *
     * لا نستخدم nullable هنا لتقليل احتمالية
     * خروج JSON غريب أو غير مكتمل.
     */
    const responseSchema = {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["question", "summary"],
        },

        question: {
          type: "string",
        },

        summary: {
          type: "string",
        },

        specialties: {
          type: "array",
          items: {
            type: "string",
            enum: SPECIALTIES,
          },
        },
      },

      required: ["type"],
    };

    /**
     * Retry فقط للأخطاء المؤقتة.
     *
     * لا نكرر الطلب 429 عشر مرات لأن هذا قد يزيد
     * استهلاك quota.
     */
    let response;

    try {
      response =
        await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents,
          config: {
            systemInstruction:
              SYSTEM_PROMPT,

            temperature: 0.2,

            /**
             * JSON صغير جداً.
             */
            maxOutputTokens: 300,

            responseMimeType:
              "application/json",

            responseSchema,
          },
        });
    } catch (error) {
      /**
       * إذا كان 429 ننتظر محاولة واحدة فقط.
       */
      if (isQuotaError(error)) {
        console.warn(
          "Gemini quota/rate limit reached."
        );

        await sleep(2500);

        response =
          await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
              systemInstruction:
                SYSTEM_PROMPT,

              temperature: 0.2,
              maxOutputTokens: 300,

              responseMimeType:
                "application/json",

              responseSchema,
            },
          });
      } else {
        throw error;
      }
    }

    const rawText =
      response.text?.trim();

    if (!rawText) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    console.log(
      "Gemini raw response:",
      rawText
    );

    /**
     * محاولة parse مباشرة.
     */
    let parsed: any;

    try {
      parsed = JSON.parse(rawText);
    } catch (firstError) {
      /**
       * محاولة ثانية إذا كان SDK أعاد JSON
       * داخل ```json ... ```
       */
      try {
        const extracted =
          extractJsonObject(rawText);

        parsed = JSON.parse(extracted);
      } catch (secondError) {
        console.error(
          "Gemini returned invalid JSON:",
          {
            rawText,
            firstError,
            secondError,
          }
        );

        throw new Error(
          "Gemini returned invalid JSON"
        );
      }
    }

    /**
     * ========================================================
     * VALIDATION
     * ========================================================
     */

    if (
      parsed.type !== "question" &&
      parsed.type !== "summary"
    ) {
      throw new Error(
        "Invalid Gemini response type"
      );
    }

    /**
     * QUESTION
     */
    if (parsed.type === "question") {
      if (
        typeof parsed.question !== "string" ||
        !parsed.question.trim()
      ) {
        throw new Error(
          "Gemini question is missing"
        );
      }

      return {
        type: "question",
        question: normalizeQuestion(
          parsed.question
        ),
      };
    }

    /**
     * SUMMARY
     */
    if (
      typeof parsed.summary !== "string" ||
      !parsed.summary.trim()
    ) {
      throw new Error(
        "Gemini summary is missing"
      );
    }

    const summary =
      parsed.summary
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const specialties =
      normalizeSpecialties(
        parsed.specialties
      );

    return {
      type: "summary",
      summary,
      specialties,
    };
  };

  /**
   * ==========================================================
   * FALLBACK
   * ==========================================================
   *
   * هذا الـ fallback لا يعتمد على Gemini.
   * والأهم أنه يسأل سؤالاً واحداً فقط.
   */

  const getFallbackResponse = (
    conversation: Message[]
  ): GeminiResponse => {
    const userMessages =
      conversation.filter(
        (m) => m.role === "user"
      );

    const allText = userMessages
      .map((m) => m.content)
      .join(" ")
      .toLowerCase();

    const count = userMessages.length;

    /**
     * الأسئلة التي تم طرحها سابقاً.
     */
    const askedQuestions =
      conversation
        .filter(
          (m) =>
            m.role === "assistant" &&
            m.questionsAsked
        )
        .flatMap(
          (m) => m.questionsAsked || []
        );

    const wasAsked = (
      keyword: string
    ) =>
      askedQuestions.some((q) =>
        q.includes(keyword)
      );

    /**
     * بعد 4 رسائل من المستخدم:
     * نعمل summary.
     */
    if (count >= 4) {
      let specialties: Specialty[] = [
        "طب عام",
      ];
     if (
  /صدر|قلب|خفقان|ضيق تنفس/.test(
    allText
  )
) {
  specialties = [
    "طب القلب",
    "الأمراض الصدرية",
  ];
} else if (
  /صداع|دوخة|دوار|تنميل|إغماء/.test(
    allText
  )
) {
  specialties = [
    "طب الأعصاب",
  ];
} else if (
  /بطن|معدة|غثيان|قيء|إسهال|إمساك/.test(
    allText
  )
) {
  specialties = [
    "أمراض الهضم",
    "الأمراض الباطنية",
  ];
} else if (
  /جلد|طفح|حكة|حبوب/.test(allText)
) {
  specialties = [
    "الأمراض الجلدية",
    "طب الجلدية والتجميل",
  ];
} else if (
  /عين|رؤية|نظر/.test(allText)
) {
  specialties = [
    "طب العيون",
  ];
} else if (
  /طفل|رضيع/.test(allText)
) {
  specialties = [
    "طب الأطفال",
  ];
} else if (
  /عظم|مفصل|ركبة|ظهر|كتف/.test(
    allText
  )
) {
  specialties = [
    "جراحة العظام",
    "طب الفيزياء والتأهيل",
  ];
}
return {
  type: "summary",
  summary:
    "بناءً على المعلومات التي قدمتها، توجد أعراض تحتاج إلى تقييم طبي لتحديد السبب وتوجيهك للاختصاصات الأنسب.",
  specialties,
};
    }

    /**
     * السؤال الأول بعد الشكوى:
     * المدة.
     */
    if (!wasAsked("متى")) {
      return {
        type: "question",
        question:
          "منذ متى بدأت هذه الأعراض؟",
      };
    }

    /**
     * السؤال الثاني:
     * مكان الألم.
     */
    if (
      /ألم|وجع|مغص/.test(allText) &&
      !wasAsked("أين")
    ) {
      return {
        type: "question",
        question:
          "أين تشعر بالألم أو الانزعاج تحديداً؟",
      };
    }

    /**
     * السؤال الثالث:
     * أعراض مرافقة.
     */
    if (!wasAsked("أعراض أخرى")) {
      return {
        type: "question",
        question:
          "هل توجد أعراض أخرى مصاحبة مثل الحرارة أو الغثيان أو القيء؟",
      };
    }

    /**
     * السؤال الرابع:
     * الشدة.
     */
    if (!wasAsked("شدة")) {
      return {
        type: "question",
        question:
          "كيف تقيّم شدة الأعراض من 1 إلى 10؟",
      };
    }

    return {
  type: "summary",
  summary:
    "بناءً على المعلومات المقدمة، يُنصح بتقييم الحالة لدى طبيب لتحديد السبب والتخصصات الأنسب.",
  specialties: ["طب عام"],
};
  };

  /**
   * ==========================================================
   * HANDLE SEND
   * ==========================================================
   */

  const handleSend = async () => {
    setInputError(null);

    const validation =
      validateInput(input);

    if (!validation.isValid) {
      setInputError(
        validation.error ||
        "خطأ في الإدخال"
      );
      return;
    }

    if (isLoading) {
      return;
    }

    const userInput =
      input.trim();

    const userMessage: Message = {
      role: "user",
      content: userInput,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      let response: GeminiResponse;

      try {
        response =
          await callGemini(
            updatedMessages
          );
      } catch (geminiError) {
        console.error(
          "Gemini consultation error:",
          geminiError
        );

        /**
         * إذا quota انتهت، fallback مباشرة.
         * لا نضيع وقت المستخدم بإعادة الطلب عدة مرات.
         */
        response =
          getFallbackResponse(
            updatedMessages
          );
      }

      /**
       * ========================================================
       * QUESTION
       * ========================================================
       */

      if (response.type === "question") {
        const question =
          normalizeQuestion(
            response.question
          );

        const questions =
          extractQuestions(question);

        const aiMessage: Message = {
          role: "assistant",
          content: question,
          questionsAsked:
            questions.length > 0
              ? questions
              : [question],
        };

        setMessages((prev) => [
          ...prev,
          aiMessage,
        ]);

        return;
      }

      /**
       * ========================================================
       * SUMMARY
       * ========================================================
       */

      if (response.type === "summary") {
        const specialties =
          normalizeSpecialties(
            response.specialties
          );

        const summary =
          response.summary.trim();

        console.log(
          "===== ملخص حالة المريض ====="
        );
        console.log(
          "الملخص:",
          summary
        );
        console.log(
          "الاختصاصات المقترحة:",
          specialties
        );
        console.log(
          "التاريخ:",
          new Date().toISOString()
        );
        console.log(
          "عدد رسائل المستخدم:",
          updatedMessages.filter(
            (m) => m.role === "user"
          ).length
        );
        console.log(
          "============================"
        );

        const doctorRecommendations =
          findDoctorsBySpecialties(
            specialties
          );

        const specialtiesText = specialties
          .map((s) => `• ${s}`)
          .join("\n");

        // Save consultation to API
        try {
          const consultationData = {
            diagnosis: summary,
            suggested_specialization: specialties[0] || "طب عام",
          };

          console.log("===== Sending AI Consultation to API =====");
          console.log("Request data:", consultationData);
          console.log("===========================================");

          const response = await apiService.addPatientAIConsultation(consultationData);

          console.log("===== AI Consultation API Response =====");
          console.log("Response:", response);
          console.log("=========================================");
        } catch (error) {
          console.error("Failed to save AI consultation:", error);
          // Don't block the UI if API call fails
        }

        const aiMessage: Message = {
          role: "assistant",
          content: `${summary}\n\nالاختصاصات المقترحة:\n${specialtiesText}`,
          doctorRecommendations,
        };

        setMessages((prev) => [
          ...prev,
          aiMessage,
        ]);
      }
    } catch (error) {
      console.error(
        "Final AI consultation error:",
        error
      );

      /**
       * آخر fallback مضمون.
       */
      const emergencyFallback =
        getFallbackResponse(
          updatedMessages
        );

      if (
        emergencyFallback.type ===
        "question"
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              emergencyFallback.question,
            questionsAsked: [
              emergencyFallback.question,
            ],
          },
        ]);
      } else {
        const specialties =
          normalizeSpecialties(
            emergencyFallback.specialties
          );

        const doctorRecommendations =
          findDoctorsBySpecialties(
            specialties
          );

        const fallbackMessage: Message = {
          role: "assistant",
          content:
            emergencyFallback.summary,
          doctorRecommendations,
        };

        setMessages((prev) => [
          ...prev,
          fallbackMessage,
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ==========================================================
   * INPUT
   * ==========================================================
   */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInput(e.target.value);

    if (inputError) {
      setInputError(null);
    }
  };

  /**
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50 flex flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="container max-w-5xl flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-teal-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-primary/30">
                <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>

              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>

            <div>
              <h1 className="font-display font-bold text-foreground text-sm sm:text-lg flex items-center gap-1 sm:gap-2">
                المساعد الطبي الذكي

                <div className="hidden sm:flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <Zap className="w-4 h-4 text-primary" />
                </div>
              </h1>

              <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  تقييم أولي
                </span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  متاح 24/7
                </span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  محادثة ذكية
                </span>
              </div>

              <p className="sm:hidden text-[10px] text-muted-foreground">
                تقييم أولي • متاح 24/7
              </p>
            </div>
          </div>

          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

              <span className="hidden sm:inline">
                العودة للرئيسية
              </span>

              <span className="sm:hidden">
                الرئيسية
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 container max-w-5xl py-3 sm:py-6 px-2 sm:px-4 lg:px-6 flex flex-col">
        {/* WELCOME */}
        {messages.length === 1 && (
          <div className="mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-primary/5 via-teal-50/50 to-emerald-50/30 dark:from-primary/10 dark:via-teal-900/20 dark:to-emerald-900/10 rounded-xl sm:rounded-2xl border border-primary/20 p-4 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-teal-100 dark:from-primary/30 dark:to-teal-900 flex items-center justify-center shadow-md shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-foreground text-xs sm:text-sm mb-2">
                    كيف يعمل المساعد الطبي الذكي؟
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          1
                        </span>
                      </div>

                      <span>
                        صف أعراضك
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          2
                        </span>
                      </div>

                      <span>
                        أجب عن الأسئلة
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          3
                        </span>
                      </div>

                      <span>
                        احصل على التوجيه
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 space-y-4 sm:space-y-5 mb-4 overflow-y-auto max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-220px)] px-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="animate-fade-in-up"
            >
              <div
                className={`flex gap-2 sm:gap-3 ${msg.role === "user"
                    ? "flex-row-reverse"
                    : ""
                  }`}
              >
                {/* AVATAR */}
                <div
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-md ${msg.role ===
                      "assistant"
                      ? "bg-gradient-to-br from-primary/20 via-teal-100/80 to-emerald-100/60"
                      : "bg-gradient-to-br from-blue-100 via-blue-50 to-sky-50"
                    }`}
                >
                  {msg.role ===
                    "assistant" ? (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  )}

                  {msg.role ===
                    "assistant" && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                </div>

                {/* MESSAGE */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role ===
                      "assistant"
                      ? "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-foreground rounded-tr-md"
                      : "bg-gradient-to-br from-primary via-teal-500 to-emerald-400 text-white shadow-md rounded-tl-md"
                    }`}
                >
                  {msg.content}
                </div>
              </div>

              {/* DOCTORS */}
              {msg.doctorRecommendations &&
                msg.doctorRecommendations.some(
                  (item) => item.doctors.length > 0
                ) && (
                <div className="mr-8 sm:mr-12 mt-3 sm:mt-4 space-y-5">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      الاختصاصات المقترحة والأطباء المتاحون
                    </p>
                  </div>

                  {msg.doctorRecommendations.map(
                    (recommendation) => {
                      if (
                        recommendation.doctors.length === 0
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={recommendation.specialty}
                          className="space-y-3"
                        >
                          {/* SPECIALTY */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Stethoscope className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <p className="text-xs sm:text-sm font-bold text-foreground">
                                {recommendation.specialty}
                              </p>
                            </div>
                            <span className="text-[10px] sm:text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                              {recommendation.doctors.length} طبيب
                            </span>
                          </div>

                          {/* DOCTORS */}
                          <div className="grid gap-2 sm:gap-3">
                            {recommendation.doctors.map(
                              (doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className="relative shrink-0">
                                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 via-teal-50/80 to-emerald-50/60 flex items-center justify-center">
                                        <span className="text-xs sm:text-sm font-bold text-primary">
                                          {doc.name.charAt(0)}
                                        </span>
                                      </div>

                                      {doc.available && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                                        {doc.name}
                                      </p>

                                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] text-muted-foreground mt-1">
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                          {doc.specialty}
                                        </span>

                                        <span className="hidden sm:flex items-center gap-1">
                                          <MapPin className="w-3 h-3" />
                                          {doc.location}
                                        </span>

                                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                                          ⭐ {doc.rating}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <Link
                                    to={`/reservation?doctor=${doc.id}`}
                                  >
                                    <Button
                                      size="sm"
                                      className="rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-teal-500 text-white text-[10px] sm:text-xs gap-1 px-2 sm:px-3"
                                    >
                                      حجز
                                      <ChevronRight className="w-3 h-3" />
                                    </Button>
                                  </Link>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          ))}

          {/* LOADING */}
          {isLoading && (
            <div className="flex gap-2 sm:gap-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-xl sm:rounded-2xl rounded-tr-md px-4 sm:px-5 py-3 sm:py-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{
                        animationDelay:
                          "0.15s",
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{
                        animationDelay:
                          "0.3s",
                      }}
                    />
                  </div>

                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {typingEffect
                      ? "يكتب..."
                      : "يُحلل الأعراض..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 pt-3 sm:pt-4 pb-2">
          <div className="relative">
            <div
              className={`flex gap-2 sm:gap-3 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl border p-1.5 sm:p-2 shadow-xl ${inputError
                  ? "border-red-300"
                  : "border-slate-200 dark:border-slate-700"
                }`}
            >
              <Input
                placeholder="اكتب أعراضك هنا..."
                value={input}
                onChange={
                  handleInputChange
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="h-10 sm:h-12 border-0 bg-transparent shadow-none focus-visible:ring-0 text-xs sm:text-sm"
                disabled={isLoading}
              />

              <Button
                onClick={handleSend}
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary via-teal-500 to-emerald-400 text-white shrink-0 shadow-lg"
                disabled={
                  isLoading ||
                  !input.trim()
                }
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* ERROR */}
            {inputError && (
              <div className="mt-2">
                <div className="flex items-center justify-center gap-1.5 text-red-600 text-[10px] sm:text-xs font-medium bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <span>
                    {inputError}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-3">
            <p className="text-center text-[9px] sm:text-[11px] text-muted-foreground/70 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              تقييم أولي لا يغني عن زيارة الطبيب
            </p>

            <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground/50">
              <Activity className="w-3 h-3" />
              <span>
                مدعوم بـ Gemini AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultation;