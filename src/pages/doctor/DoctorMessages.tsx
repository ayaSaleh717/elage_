import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, Stethoscope, Clock, MessageSquare, DollarSign, User, Send, Search, Paperclip, Image, Smile, Check, CheckCheck, Phone, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const sidebarItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "الإحصائيات", path: "/doctor" },
  { icon: <Users className="w-4 h-4" />, label: "المرضى", path: "/doctor/patients" },
  { icon: <Stethoscope className="w-4 h-4" />, label: "الاستشارات", path: "/doctor/consultations" },
  { icon: <Clock className="w-4 h-4" />, label: "أوقات العمل", path: "/doctor/schedule" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "الرسائل", path: "/doctor/messages" },
  { icon: <DollarSign className="w-4 h-4" />, label: "الأرباح", path: "/doctor/earnings" },
  { icon: <User className="w-4 h-4" />, label: "الملف الشخصي", path: "/doctor/profile" },
];

interface Message {
  id: number;
  text: string;
  sender: "doctor" | "patient";
  time: string;
  read: boolean;
}

interface Conversation {
  id: number;
  patient: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const conversationsData: Conversation[] = [
  {
    id: 1,
    patient: "محمد سعيد",
    lastMessage: "شكراً دكتور، سأتابع الدواء",
    time: "10:30 ص",
    unread: 2,
    online: true,
    messages: [
      { id: 1, text: "مرحباً دكتور، أريد أن أسأل عن الدواء الجديد", sender: "patient", time: "10:00 ص", read: true },
      { id: 2, text: "أهلاً محمد، تفضل اسأل", sender: "doctor", time: "10:05 ص", read: true },
      { id: 3, text: "هل يمكنني تناوله مع الطعام أم على معدة فارغة؟", sender: "patient", time: "10:10 ص", read: true },
      { id: 4, text: "يفضل تناوله بعد الأكل بنصف ساعة مع كوب ماء كامل. وتجنب الحمضيات بعده بساعة.", sender: "doctor", time: "10:15 ص", read: true },
      { id: 5, text: "شكراً دكتور، سأتابع الدواء", sender: "patient", time: "10:30 ص", read: false },
      { id: 6, text: "وهل هناك أعراض جانبية يجب أن أنتبه لها؟", sender: "patient", time: "10:31 ص", read: false },
    ],
  },
  {
    id: 2,
    patient: "أمل الرشيد",
    lastMessage: "موعدي القادم يوم الأحد صح؟",
    time: "9:45 ص",
    unread: 1,
    online: true,
    messages: [
      { id: 1, text: "صباح الخير دكتور", sender: "patient", time: "9:30 ص", read: true },
      { id: 2, text: "صباح النور أمل", sender: "doctor", time: "9:35 ص", read: true },
      { id: 3, text: "موعدي القادم يوم الأحد صح؟", sender: "patient", time: "9:45 ص", read: false },
    ],
  },
  {
    id: 3,
    patient: "سارة خالد",
    lastMessage: "تم إرسال نتائج التحاليل",
    time: "أمس",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "دكتور، وصلتني نتائج التحاليل", sender: "patient", time: "أمس 4:00 م", read: true },
      { id: 2, text: "ممتاز، أرسليها لي", sender: "doctor", time: "أمس 4:10 م", read: true },
      { id: 3, text: "تم إرسال نتائج التحاليل", sender: "patient", time: "أمس 4:15 م", read: true },
      { id: 4, text: "شكراً سارة، سأراجعها وأرد عليكِ", sender: "doctor", time: "أمس 4:20 م", read: true },
    ],
  },
  {
    id: 4,
    patient: "يوسف أحمد",
    lastMessage: "الحمد لله تحسنت كثيراً",
    time: "أمس",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "مرحباً دكتور، أردت أخبرك أن الحساسية تحسنت", sender: "patient", time: "أمس 2:00 م", read: true },
      { id: 2, text: "الحمد لله، استمر على البخاخ أسبوع إضافي", sender: "doctor", time: "أمس 2:30 م", read: true },
      { id: 3, text: "الحمد لله تحسنت كثيراً", sender: "patient", time: "أمس 2:35 م", read: true },
    ],
  },
  {
    id: 5,
    patient: "خالد الدمشقي",
    lastMessage: "هل يمكنني ممارسة الرياضة؟",
    time: "منذ يومين",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "دكتور، هل يمكنني ممارسة الرياضة مع الانزلاق الغضروفي؟", sender: "patient", time: "منذ يومين 11:00 ص", read: true },
      { id: 2, text: "نعم لكن تجنب رفع الأثقال والحركات المفاجئة. المشي والسباحة ممتازين.", sender: "doctor", time: "منذ يومين 11:30 ص", read: true },
    ],
  },
  {
    id: 6,
    patient: "نورة العلي",
    lastMessage: "سأحجز موعد الأسبوع القادم",
    time: "منذ 3 أيام",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "دكتور، نتيجة فحص الغدة طلعت", sender: "patient", time: "منذ 3 أيام 3:00 م", read: true },
      { id: 2, text: "كم كانت قيمة TSH؟", sender: "doctor", time: "منذ 3 أيام 3:15 م", read: true },
      { id: 3, text: "4.8", sender: "patient", time: "منذ 3 أيام 3:20 م", read: true },
      { id: 4, text: "جيد، تحسنت. نحتاج نراجع الجرعة. احجزي موعد.", sender: "doctor", time: "منذ 3 أيام 3:30 م", read: true },
      { id: 5, text: "سأحجز موعد الأسبوع القادم", sender: "patient", time: "منذ 3 أيام 3:35 م", read: true },
    ],
  },
];

const DoctorMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversationsData[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState(conversationsData);
  const [showConversationList, setShowConversationList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: selectedConversation.messages.length + 1,
      text: newMessage.trim(),
      sender: "doctor",
      time: "الآن",
      read: false,
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConversation.id) {
        return { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, time: "الآن" };
      }
      return c;
    }));

    setSelectedConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter(c =>
    c.patient.includes(searchQuery) || c.lastMessage.includes(searchQuery)
  );

  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowConversationList(false);
    // Mark as read
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c));
  };

  return (
    <DashboardLayout title="الرسائل" items={sidebarItems} role="doctor">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden h-[calc(100vh-160px)] flex">
        {/* Conversations List */}
        <div className={`${showConversationList ? "flex" : "hidden"} md:flex flex-col w-full md:w-[320px] lg:w-[360px] border-l border-slate-100 dark:border-slate-700 shrink-0`}>
          {/* Search */}
          <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في المحادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 h-9 rounded-lg border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-700/50 ${
                  selectedConversation?.id === conv.id
                    ? "bg-primary/5 dark:bg-primary/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{conv.patient.charAt(0)}</span>
                  </div>
                  {conv.online && (
                    <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{conv.patient}</p>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                </div>

                {/* Unread Badge */}
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {conv.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showConversationList ? "flex" : "hidden"} md:flex flex-col flex-1`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {/* Back button on mobile */}
                  <button
                    onClick={() => setShowConversationList(true)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="relative">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{selectedConversation.patient.charAt(0)}</span>
                    </div>
                    {selectedConversation.online && (
                      <div className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">{selectedConversation.patient}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedConversation.online ? "متصل الآن" : "غير متصل"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Video className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {selectedConversation.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "doctor" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] sm:max-w-[70%] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-xs sm:text-sm ${
                      msg.sender === "doctor"
                        ? "bg-gradient-to-br from-primary to-teal-500 text-white rounded-tr-md"
                        : "bg-slate-100 dark:bg-slate-700 text-foreground rounded-tl-md"
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        msg.sender === "doctor" ? "text-white/70" : "text-muted-foreground"
                      }`}>
                        <span className="text-[9px]">{msg.time}</span>
                        {msg.sender === "doctor" && (
                          msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="hidden sm:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Image className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="hidden sm:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Smile className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <Input
                    placeholder="اكتب رسالة..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 h-9 sm:h-10 rounded-xl border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    disabled={!newMessage.trim()}
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">اختر محادثة للبدء</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorMessages;
