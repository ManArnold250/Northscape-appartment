import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, ArrowRight, Bot, ExternalLink } from "lucide-react";
import { getRoomsWithLiveStatus, getInitialRooms } from "@/lib/bookingStore";
import type { Room } from "@/data/rooms";
import { useLanguage, LANGUAGES, type LanguageCode } from "@/lib/i18nStore";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickAction?: { label: string; url: string };
};

// Language specific suggested question chips
const QUESTIONS_BY_LANG: Record<LanguageCode, string[]> = {
  en: [
    "Does the apartment have Wi-Fi?",
    "Are there available rooms right now?",
    "Is there a full kitchen?",
    "Where is NorthScape located?",
    "What are the daily room rates?",
  ],
  rw: [
    "Ese mu nzu harimo Wi-Fi?",
    "Ese hari inzu ziboneka ubu?",
    "Ese harimo igikoni cyuzuye?",
    "NorthScape iherereye he?",
    "Ibiciro bya buri munsi ni bingahe?",
  ],
  fr: [
    "L'appartement dispose-t-il du Wi-Fi ?",
    "Y a-t-il des chambres disponibles actuellement ?",
    "Y a-t-il une cuisine équipée ?",
    "Où se trouve NorthScape ?",
    "Quels sont les tarifs journaliers ?",
  ],
  sw: [
    "Je, kuna Wi-Fi kwenye fleti?",
    "Je, kuna vyumba vinavyopatikana sasa?",
    "Je, kuna jiko kamili?",
    "NorthScape ipo wapi?",
    "Bei za kila siku ni kiasi gani?",
  ],
  de: [
    "Gibt es im Apartment WLAN?",
    "Sind derzeit Zimmer verfügbar?",
    "Gibt es eine voll ausgestattete Küche?",
    "Wo befindet sich NorthScape?",
    "Wie hoch sind die Tagespreise?",
  ],
  es: [
    "¿El apartamento tiene Wi-Fi?",
    "¿Hay habitaciones disponibles ahora?",
    "¿Hay una cocina completa?",
    "¿Dónde está ubicado NorthScape?",
    "¿Cuáles son las tarifas diarias?",
  ],
  zh: [
    "公寓有 Wi-Fi 吗？",
    "现在有空房吗？",
    "有完整的厨房吗？",
    "NorthScape 在哪里？",
    "每天的价格是多少？",
  ],
};

// Smart Multi-Lingual Response Generator for NorthScape Apartment
function getBotResponse(input: string, activeLang: LanguageCode, liveRooms: Room[]): { text: string; quickAction?: { label: string; url: string } } {
  const query = input.toLowerCase().trim();

  // Detect language if user typed in a specific language
  let lang = activeLang;
  if (query.includes("kinyarwanda") || query.includes("yego") || query.includes("muraho") || query.includes("inzu") || query.includes("ibiciro") || query.includes("igikoni")) lang = "rw";
  else if (query.includes("bonjour") || query.includes("est-ce") || query.includes("combien") || query.includes("cuisine") || query.includes("chambre") || query.includes("tarif")) lang = "fr";
  else if (query.includes("jambo") || query.includes("karibu") || query.includes("vyumba") || query.includes("jiko") || query.includes("bei")) lang = "sw";
  else if (query.includes("hallo") || query.includes("zimmer") || query.includes("küche") || query.includes("preis") || query.includes("wlan")) lang = "de";
  else if (query.includes("hola") || query.includes("habitacion") || query.includes("cocina") || query.includes("precio")) lang = "es";
  else if (query.includes("你好") || query.includes("房间") || query.includes("厨房") || query.includes("价格")) lang = "zh";

  // 1. Wi-Fi / Internet
  if (query.includes("wifi") || query.includes("wi-fi") || query.includes("internet") || query.includes("speed") || query.includes("wlan") || query.includes("网络")) {
    const responses: Record<LanguageCode, string> = {
      en: "Yes, absolutely! All NorthScape apartments feature free, high-speed fiber Wi-Fi throughout the residence. Fast & reliable for working remotely or streaming.",
      rw: "Yego rwose! Inzu zose z'i NorthScape zifite Wi-Fi y'umuvuduko wo hejuru ku buntu. Ni byiza cyane ku bakozi bakorera kuri internet.",
      fr: "Oui, absolument ! Tous les appartements NorthScape disposent d'un Wi-Fi haut débit gratuit par fibre optique dans toute la résidence.",
      sw: "Ndio kabisa! Vyumba vyote vya NorthScape vina Wi-Fi ya bure ya kasi ya juu kupitia fibre. Ni nzuri sana kwa kazi za mtandaoni.",
      de: "Ja, absolut! Alle NorthScape Apartments bieten kostenloses Highspeed-Glasfaser-WLAN in der gesamten Unterkunft.",
      es: "¡Sí, absolutamente! Todos los apartamentos NorthScape cuentan con Wi-Fi gratuito de alta velocidad por fibra óptica en toda la residencia.",
      zh: "是的，当然！ NorthScape 的所有公寓均提供免费高速光纤 Wi-Fi，网络稳定快速。",
    };
    return {
      text: responses[lang] || responses.en,
      quickAction: { label: "View Rooms", url: "/rooms" },
    };
  }

  // 2. Kitchen & Cooking
  if (
    query.includes("kitchen") || query.includes("cook") || query.includes("stove") || query.includes("oven") ||
    query.includes("igikoni") || query.includes("cuisine") || query.includes("jiko") || query.includes("küche") ||
    query.includes("cocina") || query.includes("厨房")
  ) {
    const responses: Record<LanguageCode, string> = {
      en: "Yes! Every NorthScape apartment includes a fully equipped private kitchen featuring a gas stove, oven, microwave, blender, kettle, refrigerator, and complete cookware.",
      rw: "Yego! Buri nzu ya NorthScape ifite igikoni cyuzuye kirimo gaze, cuisinière, microwave, blender, frigo n'ibikoresho byose byo guteka.",
      fr: "Oui ! Chaque appartement NorthScape comprend une cuisine privée entièrement équipée avec cuisinière à gaz, four, micro-ondes, blender, bouilloire et réfrigérateur.",
      sw: "Ndio! Kila fleti ya NorthScape ina jiko kamili la kibinafsi lenye jiko la gesi, hobi, hita ya maji, blender na vyombo vyote vya kupikia.",
      de: "Ja! Jedes NorthScape Apartment verfügt über eine voll ausgestattete private Küche mit Gasherd, Backofen, Mikrowelle, Mixer, Wasserkocher und Kühlschrank.",
      es: "¡Sí! Cada apartamento NorthScape incluye una cocina privada totalmente equipada con estufa de gas, horno, microondas, licuadora, tetera y refrigerador.",
      zh: "是的！每间 NorthScape 公寓都配有设施齐全的私人厨房，包括燃气灶、烤箱、微波炉、搅拌机、电热水壶和冰箱。",
    };
    return {
      text: responses[lang] || responses.en,
      quickAction: { label: "View Photos", url: "/gallery" },
    };
  }

  // 3. Hot Water / Shower
  if (
    query.includes("shower") || query.includes("hot water") || query.includes("bath") || query.includes("water") ||
    query.includes("amazi") || query.includes("eau chaude") || query.includes("maji") || query.includes("wasser") || query.includes("agua") || query.includes("热水")
  ) {
    const responses: Record<LanguageCode, string> = {
      en: "Yes, continuous hot water showers and clean private bathrooms with fresh towels and essential toiletries are provided in all our suites.",
      rw: "Yego, amazi ashyushye ahora ahari mu rwogero no mu bwiherero buri nzu ifite bwite hamwe n'isabune n'ibitambaro bisukuye.",
      fr: "Oui, des douches à eau chaude continue et des salles de bains privées propres avec serviettes fraîches sont fournies dans toutes nos suites.",
      sw: "Ndio, bafu za maji ya moto yanayopatikana muda wote na taulo safi zinapatikana katika vyumba vyetu vyote.",
      de: "Ja, kontinuierliche Warmwasserduschen und saubere private Badezimmer mit frischen Handtüchern sind in allen Suiten vorhanden.",
      es: "Sí, en todas nuestras suites se ofrecen duchas con agua caliente continua y baños privados limpios con toallas frescas.",
      zh: "是的，所有套房均提供连续热水淋浴和清洁的私人浴室，并配备干净的毛巾。",
    };
    return {
      text: responses[lang] || responses.en,
      quickAction: { label: "Book Stay", url: "/book" },
    };
  }

  // 4. Live Availability & Rooms
  if (
    query.includes("availab") || query.includes("vacan") || query.includes("room") || query.includes("inzu") ||
    query.includes("chambre") || query.includes("vyumba") || query.includes("zimmer") || query.includes("habitacion") || query.includes("房间") || query.includes("空房")
  ) {
    const rooms = liveRooms;
    const available = rooms.filter((r) => !r.isBooked);

    if (available.length === 0) {
      return {
        text: lang === "rw" ? "Inzu zose zarakodishijwe muri iki gihe. Nyamuneka reba italiki zitaha!" : "All our rooms are currently reserved today. Please check upcoming calendar dates!",
        quickAction: { label: "Check Calendar", url: "/book" },
      };
    }

    let text = `We currently have **${available.length} unit(s) available** today:\n\n`;
    available.forEach((r) => {
      const priceText = r.priceRWF ? `${r.priceRWF.toLocaleString()} RWF` : `$${r.price}`;
      text += `• **${r.name}** (${r.type})\n  Rate: ${priceText}/day | Max: ${r.capacity} Guests\n\n`;
    });
    text += "Click below to reserve your room with instant confirmation!";

    return {
      text: text.trim(),
      quickAction: { label: "Book Available Room", url: "/book" },
    };
  }

  // 5. Rates & Pricing
  if (
    query.includes("rate") || query.includes("price") || query.includes("cost") || query.includes("rwf") ||
    query.includes("ibiciro") || query.includes("tarif") || query.includes("bei") || query.includes("preis") || query.includes("precio") || query.includes("价格")
  ) {
    const responses: Record<LanguageCode, string> = {
      en: "Our official daily accommodation rates:\n\n• **Executive Guest Room**: 20,000 RWF (~$15 USD) / day\n• **Full 3-Bedroom Residence**: 100,000 RWF (~$75 USD) / day\n\nWeekly (500k RWF) & monthly (1.5M RWF) discount rates available!",
      rw: "Ibiciro byacu ku munsi:\n\n• **Chambre Executive**: 20,000 RWF ku munsi\n• **Inzu Yose (3 Bedrooms)**: 100,000 RWF ku munsi\n\nUfite n'igabanuka iyo ukodesheje icyumweru (500k RWF) cyangwa ukwezi (1.5M RWF)!",
      fr: "Nos tarifs journaliers officiels :\n\n• **Chambre Exécutive** : 20 000 RWF (~15 $ US) / jour\n• **Résidence complète (3 ch.)** : 100 000 RWF (~75 $ US) / jour\n\nRemises pour séjours hebdomadaires et mensuels !",
      sw: "Bei zetu rasmi za kila siku:\n\n• **Chambre Executive**: 20,000 RWF kwa siku\n• **Fleti Nzima (Vyumba 3)**: 100,000 RWF kwa siku\n\nPunguzo linapatikana kwa wiki au mwezi!",
      de: "Unsere offiziellen Tagespreise:\n\n• **Executive Zimmer**: 20.000 RWF (~15 USD) / Tag\n• **Gesamte Residenz (3 Schlafzimmer)**: 100.000 RWF (~75 USD) / Tag",
      es: "Nuestras tarifas diarias oficiales:\n\n• **Habitación Ejecutiva**: 20,000 RWF (~$15 USD) / día\n• **Residencia Completa (3 hab.)**: 100,000 RWF (~$75 USD) / día",
      zh: "我们的官方每日房价：\n\n• **行政客房**：每天 20,000 RWF（约 15 美元）\n• **整套 3 居室公寓**：每天 100,000 RWF（约 75 美元）",
    };
    return {
      text: responses[lang] || responses.en,
      quickAction: { label: "Book Residence", url: "/book" },
    };
  }

  // 6. Location & Maps
  if (
    query.includes("location") || query.includes("where") || query.includes("address") || query.includes("map") ||
    query.includes("musanze") || query.includes("iherereye") || query.includes("où") || query.includes("wapi") || query.includes("wo") || query.includes("donde") || query.includes("位置")
  ) {
    return {
      text: "NorthScape Apartment is located in **Musanze, Northern Province, Rwanda** — right near Volcanoes National Park!\n\n📍 Open exact location: [Open Google Maps Location](https://maps.app.goo.gl/eVKydymUJHXkZDFW9?g_st=aw)",
      quickAction: { label: "Open Google Maps", url: "https://maps.app.goo.gl/eVKydymUJHXkZDFW9?g_st=aw" },
    };
  }

  // 7. Contact Host & WhatsApp
  if (
    query.includes("contact") || query.includes("phone") || query.includes("whatsapp") || query.includes("call") ||
    query.includes("tuvugishe") || query.includes("appeler") || query.includes("piga") || query.includes("anrufen") || query.includes("llamar") || query.includes("联系")
  ) {
    return {
      text: "You can reach our host team directly:\n\n• Phone: **+250 788 764 000**\n• Email: **northscape.musanze@gmail.com**\n• WhatsApp: Instant messaging 24/7!",
      quickAction: { label: "Chat on WhatsApp (+250 788 764 000)", url: "https://wa.me/250788764000" },
    };
  }

  // 8. Out-of-context Fallback
  const fallbacks: Record<LanguageCode, string> = {
    en: "I am trained specifically to help with questions about NorthScape Apartment, rooms, location, amenities, and bookings in Musanze.\n\nFor custom inquiries, contact our host at +250 788 764 000 or email northscape.musanze@gmail.com.",
    rw: "Nshingiye ku kuguha amakuru kuri NorthScape Apartment i Musanze. Niba ukeneye ubundi bufasha buhebuje, hamagara +250 788 764 000 cyangwa twandikire kuri WhatsApp.",
    fr: "Je suis spécifiquement formé pour répondre aux questions sur NorthScape Apartment à Musanze. Pour d'autres demandes, contactez notre équipe au +250 788 764 000.",
    sw: "Nimefunzwa kusaidia na maswali kuhusu NorthScape Apartment mjini Musanze. Kwa msaada zaidi, piga simu +250 788 764 000.",
    de: "Ich bin speziell darauf geschult, Fragen zu NorthScape Apartment in Musanze zu beantworten. Für weitere Anfragen kontaktieren Sie bitte +250 788 764 000.",
    es: "Estoy capacitado para responder preguntas sobre NorthScape Apartment en Musanze. Para más consultas, contacte al +250 788 764 000.",
    zh: "我专门负责解答关于姆桑泽 NorthScape 公寓的问题。如需其他帮助，请致电 +250 788 764 000。",
  };

  return {
    text: fallbacks[lang] || fallbacks.en,
    quickAction: { label: "Chat on WhatsApp", url: "https://wa.me/250788764000" },
  };
}

// Clean Formatted Message Renderer (formats markdown links, bold text, and linebreaks)
function FormattedText({ text }: { text: string }) {
  const linkRegex = /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g;
  const parts = text.split(linkRegex);

  return (
    <div className="space-y-1.5 leading-relaxed">
      {text.split("\n\n").map((paragraph, pIdx) => (
        <p key={pIdx}>
          {paragraph.split("\n").map((line, lIdx) => (
            <span key={lIdx} className="block">
              {line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g).map((segment, sIdx) => {
                const mdMatch = segment.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (mdMatch) {
                  return (
                    <a
                      key={sIdx}
                      href={mdMatch[2]}
                      target={mdMatch[2].startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
                    >
                      <span>{mdMatch[1]}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  );
                }

                if (segment.match(/^https?:\/\/[^\s]+$/)) {
                  const displayUrl = segment.includes("maps.app.goo.gl")
                    ? "Open Google Maps 📍"
                    : segment;
                  return (
                    <a
                      key={sIdx}
                      href={segment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-accent underline underline-offset-2 hover:opacity-80 transition-opacity break-all"
                    >
                      <span>{displayUrl}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  );
                }

                if (segment.startsWith("**") && segment.endsWith("**")) {
                  return <strong key={sIdx} className="font-bold text-foreground">{segment.slice(2, -2)}</strong>;
                }

                return <span key={sIdx}>{segment}</span>;
              })}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export function ChatBot() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [liveRooms, setLiveRooms] = useState<Room[]>(() => getInitialRooms());

  useEffect(() => {
    let active = true;
    getRoomsWithLiveStatus().then((r) => {
      if (active) setLiveRooms(r);
    });
    const handleUpdate = () => {
      getRoomsWithLiveStatus().then((r) => {
        if (active) setLiveRooms(r);
      });
    };
    window.addEventListener("northscape_booking_updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("northscape_booking_updated", handleUpdate);
    };
  }, []);

  // Initialize welcome message based on active language
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${lang}`,
        sender: "bot",
        text: t("bot_welcome"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const resp = getBotResponse(query, lang, liveRooms);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: resp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickAction: resp.quickAction,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 550);
  };

  const currentQuestions = QUESTIONS_BY_LANG[lang] || QUESTIONS_BY_LANG.en;

  return (
    <div className="fixed bottom-6 right-6 z-[99] flex flex-col items-end pointer-events-none">
      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto w-[92vw] sm:w-[380px] h-[520px] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Chat Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="size-10 rounded-full bg-accent text-accent-foreground grid place-items-center font-bold text-sm">
                    <Bot className="size-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm">NorthScape Concierge</div>
                  <div className="text-[11px] opacity-80 flex items-center gap-1">
                    <Sparkles className="size-3 text-accent" /> Virtual Assistant · Online
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full hover:bg-white/10 grid place-items-center transition-colors"
                aria-label="Close Chat"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm bg-secondary/20">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card border border-border text-foreground rounded-tl-none"
                    }`}
                  >
                    {m.sender === "user" ? (
                      <div>{m.text}</div>
                    ) : (
                      <FormattedText text={m.text} />
                    )}
                  </div>

                  {m.quickAction && (
                    <a
                      href={m.quickAction.url}
                      target={m.quickAction.url.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-3.5 py-1.5 text-xs font-bold shadow-sm hover:opacity-90 transition-all"
                    >
                      <span>{m.quickAction.label}</span>
                      <ArrowRight className="size-3" />
                    </a>
                  )}

                  <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="rounded-2xl rounded-tl-none bg-card border border-border p-3 text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-accent animate-bounce" />
                    <span className="size-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                    <span className="size-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Question Chips */}
            <div className="p-2 border-t border-border/60 bg-card flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {currentQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="rounded-full bg-secondary hover:bg-accent/15 hover:text-accent border border-border px-3 py-1 text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-border bg-card flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("bot_placeholder")}
                className="flex-1 rounded-full bg-background border border-border px-4 py-2.5 text-xs sm:text-sm focus:ring-focus min-h-[40px]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="size-10 rounded-full bg-primary text-primary-foreground grid place-items-center hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="group relative flex items-center justify-center size-14 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-accent/40 pointer-events-auto"
        aria-label="Toggle Assistant Chat"
        title="NorthScape AI Concierge"
      >
        <span className="absolute -top-1 -right-1 flex size-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full size-4 bg-accent" />
        </span>
        {isOpen ? <X className="size-6" /> : <MessageSquare className="size-6 text-accent" />}
      </button>
    </div>
  );
}
