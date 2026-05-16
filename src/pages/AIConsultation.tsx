import { Bot, Send, User, Stethoscope, MapPin, Sparkles, ArrowRight, Brain, Zap, Shield, Clock, MessageSquare, Heart, Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import doctorsData from "@/components/data/doctor.json";

interface Message {
  role: "assistant" | "user";
  content: string;
  doctorRecommendation?: typeof doctorsData.doctors;
  questionsAsked?: string[]; // Track questions asked in this message
}

const GEMINI_API_KEY = "AIzaSyBmaEEyUifENQtQxAJRQzMk3g1SWSyYFLI";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `  أنت طبيب ذكي متخصص في التشخيص الأولي. تتحدث بالعربية فقط. و تفهم اللهجة العامية

دورك:
1. اسأل المريض عن أعراضه بالتفصيل
2. اطرح أسئلة متابعة لفهم الحالة بشكل أفضل (مثل: منذ متى؟ هل هناك أعراض أخرى؟ هل تتناول أدوية؟)
3. بعد جمع معلومات كافية (عادة بعد 2-3 أسئلة)، قدم:
   - التشخيص المحتمل
   - توصيات طبية أولية
   - التخصص الطبي المناسب للمتابعة

عند تقديم التشخيص النهائي، أضف في نهاية ردك سطراً بهذا الشكل بالضبط:
[SPECIALTY:اسم التخصص]

التخصصات المتاحة هي: طب القلب، طب الأطفال، طب الأسرة، الأمراض الجلدية، طب العيون، طب الأعصاب، جراحة عامة، أمراض نساء

ملاحظات مهمة:
- كن ودوداً ومطمئناً
- لا تقدم تشخيصاً نهائياً من السؤال الأول، اسأل أسئلة متابعة أولاً
- ذكّر المريض دائماً أن هذا تشخيص أولي ويجب مراجعة طبيب متخصص
- إذا كانت الأعراض خطيرة (ألم صدر حاد، صعوبة تنفس، نزيف شديد)، انصح بالذهاب للطوارئ فوراً`;

const AIConsultation = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "مرحباً بك! أنا المساعد الطبي الذكي. سأساعدك في التشخيص الأولي وتوجيهك للطبيب المناسب.\n\nمن فضلك، أخبرني ما هي الأعراض التي تعاني منها؟",
      questionsAsked: ["ما هي الأعراض التي تعاني منها؟"]
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [pendingQuestions, setPendingQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      setTypingEffect(true);
      const timer = setTimeout(() => setTypingEffect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Validate input
  const validateInput = (text: string): { isValid: boolean; error?: string } => {
    const trimmed = text.trim();
    
    if (!trimmed) {
      return { isValid: false, error: "الرجاء إدخال وصف للأعراض" };
    }
    
    if (trimmed.length < 3) {
      return { isValid: false, error: "الوصف قصير جداً. الرجاء إدخال وصف مفصل أكثر" };
    }
    
    if (trimmed.length > 500) {
      return { isValid: false, error: "الوصف طويل جداً. الرجاء اختصار الوصف إلى 500 حرف" };
    }
    
    // Check for invalid characters or gibberish
    const arabicRegex = /[\u0600-\u06FF\s]/;
    const hasArabic = arabicRegex.test(trimmed);
    
    if (!hasArabic && trimmed.length > 10) {
      return { isValid: false, error: "الرجاء إدخال الوصف باللغة العربية" };
    }
    
    // Check for common invalid patterns
    const invalidPatterns = [
      /^[0-9\s]+$/, // Only numbers and spaces
      /^[^\u0600-\u06FF]+$/, // No Arabic characters at all
      /^(.)\1+$/, // Repeated single character
    ];
    
    for (const pattern of invalidPatterns) {
      if (pattern.test(trimmed)) {
        return { isValid: false, error: "الوصف غير صالح. الرجاء إدخال وصف حقيقي للأعراض" };
      }
    }
    
    return { isValid: true };
  };

  // Extract questions from assistant message
  const extractQuestions = (content: string): string[] => {
    const questions: string[] = [];
    
    // Look for numbered questions (1. 2. 3.)
    const numberedQuestions = content.match(/\d+\.\s*([^\n]+)/g);
    if (numberedQuestions) {
      questions.push(...numberedQuestions.map(q => q.replace(/^\d+\.\s*/, '').trim()));
    }
    
    // Look for bullet questions (- • *)
    const bulletQuestions = content.match(/[-•*]\s*([^\n]+)/g);
    if (bulletQuestions) {
      questions.push(...bulletQuestions.map(q => q.replace(/^[-•*]\s*/, '').trim()));
    }
    
    // Look for question marks
    const questionMarkMatches = content.match(/[^.!?]*\?/g);
    if (questionMarkMatches) {
      questions.push(...questionMarkMatches.map(q => q.trim()).filter(q => q.length > 5));
    }
    
    // Remove duplicates
    return [...new Set(questions)];
  };

  // Check if user answered the questions
  const checkIfQuestionsAnswered = (userInput: string, questions: string[]): { answered: boolean; unansweredQuestions: string[] } => {
    if (questions.length === 0) {
      return { answered: true, unansweredQuestions: [] };
    }
    
    const userText = userInput.toLowerCase();
    const unanswered: string[] = [];
    
    for (const question of questions) {
      const questionLower = question.toLowerCase();
      
      // Check if question is about specific topics
      if (questionLower.includes("متى") || questionLower.includes("منذ متى")) {
        // Check for time references
        const timePatterns = [/يوم/, /ساعة/, /أسبوع/, /شهر/, /سنة/, /\d+/];
        const hasTimeReference = timePatterns.some(pattern => pattern.test(userText));
        if (!hasTimeReference) {
          unanswered.push(question);
        }
      } 
      else if (questionLower.includes("أين") || questionLower.includes("مكان")) {
        // Check for location references
        const locationPatterns = [/رأس/, /بطن/, /صدر/, /ظهر/, /يد/, /رجل/, /جانب/, /يمين/, /يسار/];
        const hasLocationReference = locationPatterns.some(pattern => pattern.test(userText));
        if (!hasLocationReference) {
          unanswered.push(question);
        }
      }
      else if (questionLower.includes("كم") || questionLower.includes("درجة")) {
        // Check for quantity/number references
        const numberPatterns = [/\d+/, /قليل/, /كثير/, /متوسط/, /خفيف/, /شديد/];
        const hasNumberReference = numberPatterns.some(pattern => pattern.test(userText));
        if (!hasNumberReference) {
          unanswered.push(question);
        }
      }
      else {
        // Generic check - see if user mentioned something related to the question
        const questionKeywords = questionLower.split(/\s+/).filter(word => word.length > 3);
        const hasRelevantKeywords = questionKeywords.some(keyword => userText.includes(keyword));
        
        // Also check if response is too short (likely not answering the question)
        const isDetailedResponse = userText.length > 15;
        
        if (!hasRelevantKeywords && !isDetailedResponse) {
          unanswered.push(question);
        }
      }
    }
    
    return {
      answered: unanswered.length === 0,
      unansweredQuestions: unanswered
    };
  };

  const findDoctorsBySpecialty = (specialty: string) => {
    return doctorsData.doctors.filter(
      (doc) => doc.specialty === specialty && doc.available
    );
  };

  const extractSpecialty = (content: string): string | null => {
    const match = content.match(/\[SPECIALTY:(.*?)\]/);
    return match ? match[1].trim() : null;
  };

  const cleanContent = (content: string): string => {
    return content.replace(/\[SPECIALTY:.*?\]/g, "").trim();
  };

  const callGemini = async (conversation: Message[]): Promise<string> => {
    const contents = [];
    contents.push({
      role: "user",
      parts: [{ text: SYSTEM_PROMPT + "\n\nالمريض يبدأ المحادثة:" }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "مرحباً بك! أنا المساعد الطبي الذكي. سأساعدك في التشخيص الأولي وتوجيهك للطبيب المناسب.\n\nمن فضلك، أخبرني ما هي الأعراض التي تعاني منها؟" }],
    });

    for (const msg of conversation.slice(1)) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }),
    });

    if (!response.ok) {
      throw new Error("فشل الاتصال بالذكاء الاصطناعي");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، حدث خطأ. حاول مرة أخرى.";
  };

  const getFallbackResponse = (conversation: Message[]): string => {
    const userMessages = conversation.filter((m) => m.role === "user");
    const lastMsg = userMessages[userMessages.length - 1]?.content.toLowerCase() || "";
    const msgCount = userMessages.length;

    // Common symptom patterns with detailed questions
    const symptomPatterns = [
      { 
        pattern: /صداع|رأس|مغص|دوار/, 
        response: "أفهم أنك تعاني من صداع أو دوار. لأتمكن من مساعدتك بشكل أفضل، أحتاج إلى بعض التفاصيل:\n\n1. منذ متى تعاني من هذه الأعراض؟ (ساعات، أيام، أسابيع)\n2. هل هي مستمرة أم تأتي وتذهب؟\n3. هل هناك أي محفزات تزيدها؟ (ضوء، صوت، حركة)\n4. على مقياس من 1 إلى 10، كم تقيّم شدة الألم؟" 
      },
      { 
        pattern: /بطن|معدة|مغص|غثيان/, 
        response: "أفهم أنك تعاني من ألم في البطن. من فضلك، أجب على هذه الأسئلة:\n\n1. أين بالضبط تشعر بالألم؟ (أعلى البطن، أسفل البطن، اليمين، اليسار)\n2. منذ متى بدأ الألم؟\n3. هل يزداد بعد الأكل أو الشرب؟\n4. هل هناك أعراض أخرى مصاحبة؟ (غثيان، قيء، إسهال)" 
      },
      { 
        pattern: /قلب|صدر|نفس|ضيق/, 
        response: "ألم الصدر أو ضيق التنفس يحتاج اهتماماً. أخبرني بالتفصيل:\n\n1. هل الألم مستمر أم يأتي ويذهب؟\n2. هل يزداد مع المجهود أو الراحة؟\n3. هل تشعر بخفقان أو دوخة؟\n4. منذ متى وأنت تعاني من هذه الأعراض؟\n\n⚠️ إذا كان الألم شديداً ومفاجئاً، أنصحك بالتوجه للطوارئ فوراً." 
      },
      { 
        pattern: /حرارة|سخونة|حمى/, 
        response: "أفهم ��نك تعاني من حرارة. لأعطيك تشخيصاً أولياً، أحتاج إلى:\n\n1. ما هي درجة حرارتك؟ (إذا قستها)\n2. منذ متى وأنت تعاني من الحرارة؟\n3. هل هناك أعراض أخرى مصاحبة؟ (سعال، ألم في الحلق، تعب)\n4. هل تتناول أي أدوية لخفض الحرارة؟" 
      },
      { 
        pattern: /سعال|كحة|بلغم/, 
        response: "أفهم أنك تعاني من سعال. دعني أسألك:\n\n1. هل السعال جاف أم مصحوب ببلغم؟\n2. ما لون البلغم إذا كان موجوداً؟\n3. منذ متى وأنت تسعل؟\n4. هل يزداد السعال ليلاً أو عند الاستلقاء؟" 
      },
    ];

    if (msgCount === 1) {
      // Try to match with known symptom patterns
      for (const { pattern, response } of symptomPatterns) {
        if (pattern.test(lastMsg)) {
          return response;
        }
      }
      
      // Generic response for unknown symptoms with detailed questions
      return "شكراً لمشاركتي أعراضك. لأتمكن من مساعدتك بشكل أفضل، أحتاج إلى مزيد من التفاصيل:\n\n1. منذ متى تعاني من هذه الأعراض؟ (مدة دقيقة)\n2. هل هناك أعراض أخرى مصاحبة؟ (اذكرها جميعاً)\n3. هل تتناول أي أدوية حالياً؟\n4. على مقياس من 1 إلى 10، كم تقيّم شدة الأعراض؟\n5. هل لديك أي أمراض مزمنة؟ (سكري، ضغط، حساسية)" 
    }

    if (msgCount === 2) {
      // Check if user provided enough details in first response
      const firstUserMsg = userMessages[0]?.content.toLowerCase() || "";
      const secondUserMsg = userMessages[1]?.content.toLowerCase() || "";
      
      // Check if second response is detailed enough
      const isDetailed = secondUserMsg.length > 20;
      const hasNumbers = /\d+/.test(secondUserMsg);
      const hasTimeReference = /يوم|ساعة|أسبوع|شهر|سنة/.test(secondUserMsg);
      
      if (!isDetailed || (!hasNumbers && !hasTimeReference)) {
        return "شكراً على هذه المعلومات. لكني أحتاج إلى تفاصيل أكثر دقة:\n\n- منذ متى بالضبط؟ (عدد الساعات أو الأيام)\n- ما هي شدة الأعراض بالأرقام؟ (مثلاً: الألم 7/10)\n- هل هناك محفزات محددة تزيد الأعراض؟\n- هل جربت أي علاج من قبل؟"
      }
      
      return "شكراً على هذه المعلومات. سؤال أخير:\n\n- هل لديك أي أمراض مزمنة (سكري، ضغط، حساسية)؟\n- هل حدث لك هذا من قبل؟\n- هل هناك تاريخ عائلي لأمراض مشابهة؟\n- هل تتناول أي أدوية بانتظام؟"
    }

    // After 3+ messages, check if we have enough information
    const allText = userMessages.map((m) => m.content).join(" ").toLowerCase();
    const totalChars = allText.length;
    const hasDetailedInfo = totalChars > 50;
    const hasTimeInfo = /يوم|ساعة|أسبوع|شهر|سنة|\d+/.test(allText);
    const hasLocationInfo = /رأس|بطن|صدر|ظهر|يد|رجل|جانب|يمين|يسار/.test(allText);
    
    if (!hasDetailedInfo || !hasTimeInfo || !hasLocationInfo) {
      // Still need more details
      const missingDetails = [];
      if (!hasTimeInfo) missingDetails.push("مدة الأعراض (منذ متى)");
      if (!hasLocationInfo) missingDetails.push("موقع الألم بالضبط");
      if (!hasDetailedInfo) missingDetails.push("وصف مفصل للأعراض");
      
      return `أحتاج إلى بعض التفاصيل الإضافية لأعطيك تشخيصاً دقيقاً:\n\n${missingDetails.map((detail, i) => `${i + 1}. ${detail}`).join('\n')}\n\nمن فضلك، قدم لي هذه المعلومات المهمة.`
    }

    // We have enough information, provide diagnosis
    if (allText.includes("صداع") || allText.includes("رأس") || allText.includes("دوار")) {
      return "بناءً على الأعراض التي وصفتها، التشخيص الأولي:\n\n🔍 التشخيص المحتمل: صداع توتري أو صداع نصفي\n\n💊 التوصيات:\n- تناول مسكن خفيف مثل الباراسيتامول\n- الراحة في مكان هادئ ومظلم\n- شرب كمية كافية من الماء\n- تجنب الكافيين والتوتر\n\n⚕️ أنصحك بمراجعة طبيب أعصاب إذا استمر الصداع.\n\n[SPECIALTY:طب الأعصاب]";
    }
    if (allText.includes("قلب") || allText.includes("صدر") || allText.includes("ضيق")) {
      return "بناءً على الأعراض التي وصفتها، التشخيص الأولي:\n\n🔍 التشخيص المحتمل: قد يكون قلق أو مشكلة قلبية تحتاج فحص\n\n💊 التوصيات:\n- تجنب الكافيين والتوتر\n- مارس تمارين التنفس العميق\n- الراحة وتجنب المجهود الشديد\n\n⚠️ أنصحك بمراجعة طبيب قلب.\n\n[SPECIALTY:طب القلب]";
    }
    if (allText.includes("بطن") || allText.includes("معدة") || allText.includes("غثيان")) {
      return "بناءً على الأعراض التي وصفتها، التشخيص الأولي:\n\n🔍 التشخيص المحتمل: اضطراب هضمي أو التهاب معدة\n\n💊 التوصيات:\n- تناول وجبات خفيفة ومتكررة\n- تجنب الأطعمة الدسمة والحارة\n- شرب كميات كافية من الماء\n\n⚕️ أنصحك بمراجعة طبيب باطنية.\n\n[SPECIALTY:طب الأسرة]";
    }
    
    // Generic diagnosis for unknown symptoms
    return "بناءً على الأعراض التي وصفتها، التشخيص الأولي:\n\n🔍 التشخيص المحتمل: حالة تحتاج فحص سريري\n\n💊 التوصيات:\n- الراحة والتغذية السليمة\n- شرب كمية كافية من الماء\n- مراقبة الأعراض وتطورها\n\n⚕️ أنصحك بمراجعة طبيب أسرة لإجراء الفحص اللازم.\n\n[SPECIALTY:طب الأسرة]";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // Clear error when user starts typing
    if (inputError) {
      setInputError(null);
    }
  };

  const handleSend = async () => {
    // Clear previous error
    setInputError(null);
    
    // Validate input
    const validation = validateInput(input);
    if (!validation.isValid) {
      setInputError(validation.error || "خطأ في الإدخال");
      return;
    }

    if (isLoading) return;

    const userInput = input.trim();
    const userMessage: Message = { role: "user", content: userInput };
    
    // Check if there are pending questions from the last assistant message
    const lastAssistantMessage = [...messages].reverse().find(msg => msg.role === "assistant");
    if (lastAssistantMessage?.questionsAsked && lastAssistantMessage.questionsAsked.length > 0) {
      const checkResult = checkIfQuestionsAnswered(userInput, lastAssistantMessage.questionsAsked);
      
      if (!checkResult.answered && checkResult.unansweredQuestions.length > 0) {
        // User didn't answer all questions - ask for more details
        const followUpMessage: Message = {
          role: "assistant",
          content: `شكراً على ردك. لأتمكن من مساعدتك بشكل أفضل، أحتاج إلى بعض التفاصيل الإضافية:\n\n${checkResult.unansweredQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nمن فضلك، أجب على هذه الأسئلة لتتمكن من الحصول على تشخيص دقيق.`,
          questionsAsked: checkResult.unansweredQuestions
        };
        
        setMessages(prev => [...prev, userMessage, followUpMessage]);
        setInput("");
        return;
      }
    }

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const aiContent = await callGemini(updatedMessages);
      const specialty = extractSpecialty(aiContent);
      const cleanedContent = cleanContent(aiContent);
      
      // Extract questions from the AI response
      const questions = extractQuestions(cleanedContent);
      
      const aiMessage: Message = { 
        role: "assistant", 
        content: cleanedContent,
        questionsAsked: questions.length > 0 ? questions : undefined
      };

      if (specialty) {
        const recommendedDoctors = findDoctorsBySpecialty(specialty);
        if (recommendedDoctors.length > 0) {
          aiMessage.doctorRecommendation = recommendedDoctors;
        }
      }
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI consultation error:", error);
      
      // Get the last assistant message to check for questions
      const lastMsg = [...messages].reverse().find(msg => msg.role === "assistant");
      const lastQuestions = lastMsg?.questionsAsked || [];
      
      // Check if user answered previous questions
      const checkResult = checkIfQuestionsAnswered(userInput, lastQuestions);
      
      if (!checkResult.answered && checkResult.unansweredQuestions.length > 0) {
        // Ask for more details in fallback mode
        const followUpMessage: Message = {
          role: "assistant",
          content: `يبدو أنني لم أحصل على إجابات كاملة. لأتمكن من مساعدتك، أحتاج إلى:\n\n${checkResult.unansweredQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nمن فضلك، قدم لي هذه التفاصيل المهمة.`,
          questionsAsked: checkResult.unansweredQuestions
        };
        setMessages((prev) => [...prev, followUpMessage]);
      } else {
        // Show error message to user
        const errorMessage: Message = {
          role: "assistant",
          content: "عذراً، حدث خطأ في معالجة طلبك. الرجاء:\n\n1. التأكد من اتصال الإنترنت\n2. إعادة المحاولة\n3. إذا استمر الخطأ، يمكنك التواصل مع الدعم الفني\n\nفي الوقت الحالي، يمكنني مساعدتك ببعض المعلومات العامة بناءً على وصفك."
        };
        
        // Try to provide fallback response
        try {
          const fallbackResponse = getFallbackResponse(updatedMessages);
          const specialty = extractSpecialty(fallbackResponse);
          const cleanedContent = cleanContent(fallbackResponse);
          
          // Extract questions from fallback response
          const questions = extractQuestions(cleanedContent);
          
          const fallbackMessage: Message = { 
            role: "assistant", 
            content: cleanedContent,
            questionsAsked: questions.length > 0 ? questions : undefined
          };

          if (specialty) {
            const recommendedDoctors = findDoctorsBySpecialty(specialty);
            if (recommendedDoctors.length > 0) {
              fallbackMessage.doctorRecommendation = recommendedDoctors;
            }
          }
          setMessages((prev) => [...prev, fallbackMessage]);
        } catch {
          // If fallback also fails, show the error message
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm shadow-slate-200/20 dark:shadow-slate-900/20">
        <div className="container max-w-5xl flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-teal-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-primary/30 animate-pulse-slow">
                <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-ping opacity-75" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-sm sm:text-lg flex items-center gap-1 sm:gap-2">
                المساعد الطبي الذكي
                <div className="hidden sm:flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  <Zap className="w-4 h-4 text-primary animate-pulse" />
                </div>
              </h1>
              <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  تشخيص أولي
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  متاح 24/7
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  محادثة ذكية
                </span>
              </div>
              <p className="sm:hidden text-[10px] text-muted-foreground">تشخيص أولي • متاح 24/7</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-slate-700 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 gap-1 sm:gap-2 transition-all group text-xs sm:text-sm px-2 sm:px-3">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">العودة للرئيسية</span>
              <span className="sm:hidden">الرئيسية</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 container max-w-5xl py-3 sm:py-6 px-2 sm:px-4 lg:px-6 flex flex-col">
        {/* Welcome Card */}
        {messages.length === 1 && (
          <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            <div className="animate-fade-in">
              <div className="bg-gradient-to-br from-primary/5 via-teal-50/50 to-emerald-50/30 dark:from-primary/10 dark:via-teal-900/20 dark:to-emerald-900/10 rounded-xl sm:rounded-2xl border border-primary/20 dark:border-primary/30 p-4 sm:p-6 shadow-sm">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-teal-100 dark:from-primary/30 dark:to-teal-900 flex items-center justify-center shadow-md shrink-0">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground text-xs sm:text-sm mb-2">كيف يعمل المساعد الطبي الذكي؟</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-[10px] sm:text-xs font-bold text-primary">1</span>
                        </div>
                        <span className="text-[11px] sm:text-xs">صف أعراضك بالتفصيل</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-[10px] sm:text-xs font-bold text-primary">2</span>
                        </div>
                        <span className="text-[11px] sm:text-xs">أجِب على أسئلة المتابعة</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-[10px] sm:text-xs font-bold text-primary">3</span>
                        </div>
                        <span className="text-[11px] sm:text-xs">احصل على تشخيص أولي</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips - hidden on mobile */}
            <div className="hidden sm:block animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  نصائح سريعة لإدخال أفضل:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-800/70">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">✓</span>
                    </div>
                    <span>أعاني من صداع شديد في الجانب الأيمن منذ يومين</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-800/70">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">✓</span>
                    </div>
                    <span>أشعر بألم في البطن مع غثيان بعد الأكل</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-800/70">
                    <div className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-red-700 dark:text-red-400">✗</span>
                    </div>
                    <span>تجنب الإدخال القصير جداً مثل "ألم"</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-800/70">
                    <div className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-red-700 dark:text-red-400">✗</span>
                    </div>
                    <span>تجنب الرموز أو النصوص غير العربية</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4 sm:space-y-5 mb-4 overflow-y-auto max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-220px)] px-1">
          {messages.map((msg, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-primary/20 via-teal-100/80 to-emerald-100/60 dark:from-primary/30 dark:via-teal-900/50 dark:to-emerald-900/30"
                    : "bg-gradient-to-br from-blue-100 via-blue-50 to-sky-50 dark:from-blue-900 dark:via-blue-800 dark:to-sky-900"
                }`}>
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  )}
                  {msg.role === "assistant" && (
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm transition-all duration-300 hover:shadow-md ${
                  msg.role === "assistant"
                    ? "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-foreground rounded-tr-md hover:border-primary/30"
                    : "bg-gradient-to-br from-primary via-teal-500 to-emerald-400 text-white shadow-md shadow-primary/25 rounded-tl-md hover:shadow-primary/35"
                }`}>
                  {msg.content}
                </div>
              </div>

              {/* Doctor Recommendations */}
              {msg.doctorRecommendation && msg.doctorRecommendation.length > 0 && (
                <div className="mr-8 sm:mr-12 mt-3 sm:mt-4 space-y-2 sm:space-y-3 animate-slide-in-right">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5 sm:gap-2">
                      <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      الأطباء المتاحون:
                    </p>
                    <span className="text-[10px] sm:text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 sm:py-1 rounded-full">
                      {msg.doctorRecommendation.length} طبيب
                    </span>
                  </div>
                  <div className="grid gap-2 sm:gap-3">
                    {msg.doctorRecommendation.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 via-teal-50/80 to-emerald-50/60 dark:from-primary/20 dark:via-teal-900/50 dark:to-emerald-900/30 flex items-center justify-center shadow-sm">
                              <span className="text-xs sm:text-sm font-bold text-primary">{doc.name.charAt(3)}</span>
                            </div>
                            {doc.available && (
                              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate">{doc.name}</p>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">
                              <span className="bg-primary/10 dark:bg-primary/20 text-primary px-1.5 sm:px-2 py-0.5 rounded-full font-medium">{doc.specialty}</span>
                              <span className="hidden sm:flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {doc.location}
                              </span>
                              <span className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 sm:px-2 py-0.5 rounded-full">
                                <span>⭐</span>
                                <span className="font-medium">{doc.rating}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link to={`/reservation?doctor=${doc.id}`}>
                          <Button size="sm" className="rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-teal-500 hover:from-primary/90 hover:to-teal-600 text-white text-[10px] sm:text-xs shadow-sm hover:shadow-md transition-all gap-1 px-2 sm:px-3">
                            <span>حجز</span>
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-2 sm:gap-3 animate-fade-in">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary/20 via-teal-100/80 to-emerald-100/60 dark:from-primary/30 dark:via-teal-900/50 dark:to-emerald-900/30 shadow-md">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <div className="absolute inset-0 rounded-lg sm:rounded-xl border-2 border-primary/20 animate-ping opacity-50" />
              </div>
              <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-xl sm:rounded-2xl rounded-tr-md px-4 sm:px-5 py-3 sm:py-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-bounce" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                    {typingEffect ? "يكتب..." : "يُحلل الأعراض..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 pt-3 sm:pt-4 pb-2">
          <div className="relative">
            <div className={`flex gap-2 sm:gap-3 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl border p-1.5 sm:p-2 shadow-xl transition-all duration-300 ${
              inputError 
                ? "border-red-300 dark:border-red-700 shadow-red-200/30 dark:shadow-red-900/30 hover:shadow-red-300/20" 
                : "border-slate-200 dark:border-slate-700 shadow-slate-300/30 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-primary/10"
            }`}>
              <Input
                placeholder="اكتب أعراضك هنا..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className={`h-10 sm:h-12 border-0 bg-transparent shadow-none focus-visible:ring-0 text-xs sm:text-sm placeholder:text-muted-foreground/60 focus:placeholder:text-transparent ${
                  inputError ? "text-red-600 dark:text-red-400 placeholder:text-red-400/60" : ""
                }`}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary via-teal-500 to-emerald-400 text-white shrink-0 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            <div className={`hidden sm:block absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full blur-sm ${
              inputError 
                ? "bg-gradient-to-r from-red-400/40 to-red-600/40" 
                : "bg-gradient-to-r from-primary/20 to-teal-500/20 dark:from-primary/30 dark:to-teal-500/30"
            }`} />
            
            {/* Error Message */}
            {inputError && (
              <div className="mt-2 animate-fade-in">
                <div className="flex items-center justify-center gap-1.5 text-red-600 dark:text-red-400 text-[10px] sm:text-xs font-medium bg-red-50 dark:bg-red-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{inputError}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-3">
            <p className="text-center text-[9px] sm:text-[11px] text-muted-foreground/70 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              تشخيص أولي لا يغني عن زيارة الطبيب
            </p>
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground/50">
              <Activity className="w-3 h-3" />
              <span>مدعوم بـ Gemini AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultation;
