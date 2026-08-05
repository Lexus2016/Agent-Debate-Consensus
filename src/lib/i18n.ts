import { useChatStore } from "@/store/chatStore";
import type { ThinkingStyle } from "@/types/chat";

export type Locale = "en" | "uk" | "ru";
export const LOCALES: Locale[] = ["en", "uk", "ru"];
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  uk: "UA",
  ru: "RU",
};

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (lang === "uk") return "uk";
  if (lang === "ru") return "ru";
  return "en";
}

type Dict = {
  welcome: {
    masthead: string;
    mastheadAside: string;
    heroTop: string;
    heroMid: string;
    heroBottom: string;
    heroPullquote: string;
    heroBody: string;
    heroBodyTail: string;
    howItWorks: string;
    step01h: string;
    step01b: string;
    step02h: string;
    step02b: string;
    step03h: string;
    step03b: string;
    stepOne: string;
    connectKey1: string;
    connectKey2: string;
    openRouterName: string;
    openRouterBlurb: string;
    getKey: string;
    yourApiKey: string;
    keyPlaceholder: string;
    openTheFloor: string;
    connecting: string;
    errorBadKey: string;
    errorNet: string;
    privacy: string;
    footerName: string;
    footerOpen: string;
  };
  empty: {
    setup: string;
    stateAH1: string;
    stateAH2: string;
    stateABody: string;
    stateABodyMobile: string;
    step1h: string;
    step1b: string;
    step2h: string;
    step2b: string;
    step3h: string;
    step3b: string;
    panelListNudge: string;
    tonightsPanel: string;
    moderator: string;
    stateBH1: string;
    stateBH1Accent: string;
    stateBH1Tail: string;
    stateBBody: string;
    tipLabel: string;
    tipTypeWord: string;
    tipTail: string;
    tipModerator: string;
  };
  input: {
    placeholderDisabled: string;
    placeholderActive: string;
  };
  sidebar: {
    agents: string;
    clickToActivate: string;
    browseModels: string;
    browseTitle: string;
    history: string;
    style: string;
    creative: string;
    balanced: string;
    precise: string;
    exportLabel: string;
    newDebate: string;
    apiKey: string;
    github: string;
    language: string;
  };
  modal: {
    apiKey: {
      titleProactive: string;
      titleRequired: string;
      descProactive: string;
      descPaidModel: (model: string) => string;
      descWebSearch: string;
      connect: string;
      validating: string;
      errorBadKey: string;
      errorNet: string;
      privacy: string;
      getKey: string;
    };
    discover: {
      title: string;
      searchPlaceholder: string;
      freeOnly: string;
      loading: string;
      empty: (query: string) => string;
      priceLegend: string;
      add: string;
      added: string;
      free: string;
      poweredBy: string;
    };
  };
  starterPrompts: string[];
  system: {
    modAssigned: (name: string) => string;
    modChangedToHuman: (prevName: string) => string;
    modChangedBetween: (prevName: string, newName: string) => string;
    modAutoReassigned: (failedName: string, newName: string) => string;
    modRemoved: (failedName: string) => string;
    webSearchUnavailable: string;
  };
  sourcesLabel: string;
  summaryBadge: string;
  roles: Record<ThinkingStyle, string>;
  tooltip: {
    moderatorSet: string;
    moderatorUnset: string;
    attachFile: string;
    webSearchOn: string;
    webSearchOff: string;
    webSearchNeedsKey: string;
    send: string;
    stop: string;
    lightMode: string;
    darkMode: string;
    hideSidebar: string;
    showSidebar: string;
    copyAsMarkdown: string;
    boost: string;
    exportMarkdown: string;
    newDebate: string;
    addKey: string;
    disconnect: string;
    viewGithub: string;
    closeModal: string;
    deleteSession: string;
    paidModel: string;
    browseCatalog: string;
    creativeDesc: string;
    balancedDesc: string;
    preciseDesc: string;
    thinkingStyle: string;
    fontSize: string;
    scrollToBottom: string;
    retryModel: string;
    removeModel: string;
    openLanding: string;
    backToDebate: string;
  };
};

const en: Dict = {
  welcome: {
    masthead: "Agent Debate",
    mastheadAside: "Several AI models, one question",
    heroTop: "Up to eight AI",
    heroMid: "models discuss",
    heroBottom: "your question.",
    heroPullquote:
      "“They read each other's answers, disagree, and correct each other. At the end one of them sums up what was settled and what wasn't.”",
    heroBody:
      "Pick Claude, GPT, Gemini, Grok, or anything else in the OpenRouter catalogue. Ask a question and they answer one after another, each reacting to what the others just said.",
    heroBodyTail: " You watch the reasoning, not just the verdict.",
    howItWorks: "How it works",
    step01h: "Pick the models",
    step01b:
      "Two is enough for an argument, eight is the limit. Models from different companies work better here: Claude and GPT disagree with each other far more often than two versions of the same model do.",
    step02h: "Ask a hard question",
    step02b:
      "Rewrite the old service or keep patching it. Which of two job offers to take. Why the numbers in a report don't add up. Questions where a single opinion leaves you unconvinced.",
    step03h: "Steer the discussion",
    step03b:
      "Type @ and a name to put the question to one model directly. Use the button on any answer to make the group develop that specific point. Stop the round once you've heard enough.",
    stepOne: "Before you start",
    connectKey1: "You need an",
    connectKey2: "OpenRouter key.",
    openRouterName: "OpenRouter",
    openRouterBlurb:
      "sells access to 300+ models from every major provider under one key. You sign up once, copy the key, and pay only for what the models actually spend. Some of them are free.",
    getKey: "Get a key  ·  ~60s",
    yourApiKey: "OpenRouter API key",
    keyPlaceholder: "sk-or-v1-…",
    openTheFloor: "Save and start",
    connecting: "Checking",
    errorBadKey:
      "This key was rejected. Check that it starts with sk-or-v1- and that you copied all of it.",
    errorNet:
      "We couldn't reach OpenRouter to check the key. Try again in a moment.",
    privacy:
      "The key is saved in this browser only. Requests pass through our server on the way to OpenRouter, and the key is not stored or written to any log there.",
    footerName: "Agent Debate",
    footerOpen: "open source · MIT",
  },
  empty: {
    setup: "Setup",
    stateAH1: "First, pick",
    stateAH2: "the models.",
    stateABody:
      "Click any model in the left column to add it to the discussion. One model is enough for a normal chat. The arguing starts at two.",
    stateABodyMobile:
      "Tap ☰ at the top to open the list of models. Add at least two, otherwise there is nobody to argue with.",
    step1h: "Pick 2 to 8 models",
    step1b: "The OpenRouter catalogue has 300+ of them, some free.",
    step2h: "Ask a question",
    step2b: "Something a single answer wouldn't settle for you.",
    step3h: "Watch them argue",
    step3b:
      "Answers arrive one by one, live. You can moderate yourself or hand the role to one of the models.",
    panelListNudge: "the model list is on the left",
    tonightsPanel: "In this discussion",
    moderator: "moderator",
    stateBH1: "What should they",
    stateBH1Accent: "argue about",
    stateBH1Tail: "?",
    stateBBody: "Type your own question, or take one of the ready ones below.",
    tipLabel: "Tip.",
    tipTypeWord: "Type",
    tipTail: "at the start of a message to put the question to that model alone.",
    tipModerator:
      "The moderator keeps the discussion on track and writes the closing summary. Click the star next to a model's name to give it that role.",
  },
  input: {
    placeholderDisabled: "Pick a model on the left to begin…",
    placeholderActive: "Ask a question, or type @ to address one model",
  },
  sidebar: {
    agents: "Models",
    clickToActivate: "Click a model to add it",
    browseModels: "Full catalogue",
    browseTitle: "Find more models in the OpenRouter catalogue",
    history: "History",
    style: "Answer style:",
    creative: "Creative",
    balanced: "Balanced",
    precise: "Precise",
    exportLabel: "Export",
    newDebate: "New discussion",
    apiKey: "Add your key",
    github: "GitHub",
    language: "Language",
  },
  modal: {
    apiKey: {
      titleProactive: "Add API Key",
      titleRequired: "API Key Required",
      descProactive:
        "With your own OpenRouter key you get the paid models and web search, and the free models stop hitting rate limits.",
      descPaidModel: (m) =>
        `${m} is a paid model. To use it, add your OpenRouter key: what it spends will be billed to your OpenRouter balance.`,
      descWebSearch:
        "Web search only works with your own OpenRouter key. Each search costs about $0.02 from your balance.",
      connect: "Connect",
      validating: "Checking…",
      errorBadKey: "This key was rejected. Check it and try again.",
      errorNet: "We couldn't check the key. Try again in a moment.",
      privacy:
        "The key is saved in this browser only and stays there between visits. Nothing is sent anywhere except your requests to OpenRouter.",
      getKey: "Get an API key",
    },
    discover: {
      title: "Model catalogue",
      searchPlaceholder: "Search by name or provider…",
      freeOnly: "Free only",
      loading: "Loading models…",
      empty: (q) => `Nothing found for “${q}”`,
      priceLegend:
        "Prices are per 1M tokens: in is the text you send, out is the answer the model writes. ctx is how much text the model keeps in memory at once.",
      add: "Add",
      added: "Added",
      free: "Free",
      poweredBy: "Catalogue by OpenRouter",
    },
  },
  starterPrompts: [
    "Is remote work better than the office for software engineers?",
    "Should AGI development be regulated by law?",
    "Refactor legacy code or rewrite it from scratch?",
    "Is nuclear energy the fastest path to decarbonization?",
    "Should startups raise VC money or bootstrap?",
    "Is universal basic income a workable economic policy?",
  ],
  system: {
    modAssigned: (n) => `${n} is now the moderator`,
    modChangedToHuman: (p) => `You are the moderator now. ${p} was before.`,
    modChangedBetween: (p, n) => `${n} is the moderator now. ${p} was before.`,
    modAutoReassigned: (f, n) =>
      `${f} stopped responding. ${n} takes over as moderator.`,
    modRemoved: (f) =>
      `${f} stopped responding and there is nobody to replace it. No moderator for now.`,
    webSearchUnavailable:
      "Web search is off. It only works with your own OpenRouter key and costs about $0.02 per search, so free models can't use it.",
  },
  sourcesLabel: "Sources",
  summaryBadge: "summary",
  roles: {
    skeptic: "Skeptic",
    pragmatist: "Pragmatist",
    visionary: "Visionary",
    analyst: "Analyst",
    devils_advocate: "Devil's Advocate",
  },
  tooltip: {
    moderatorSet: "Make this model the moderator",
    moderatorUnset: "Take the moderator role yourself",
    attachFile: "Attach a file (up to 100 KB)",
    webSearchOn: "Web search is on",
    webSearchOff: "Web search is off",
    webSearchNeedsKey: "Web search needs your own key",
    send: "Send",
    stop: "Stop the answers",
    lightMode: "Light theme",
    darkMode: "Dark theme",
    hideSidebar: "Hide the side panel",
    showSidebar: "Show the side panel",
    copyAsMarkdown: "Copy as Markdown",
    boost: "Ask the group to develop this point",
    exportMarkdown: "Save the whole discussion as a Markdown file",
    newDebate: "Clear this and start a new discussion",
    addKey: "Add your key",
    disconnect: "Remove the key from this browser",
    viewGithub: "Source code on GitHub",
    closeModal: "Close",
    deleteSession: "Delete this discussion",
    paidModel: "Paid model, needs your own key",
    browseCatalog: "OpenRouter model catalogue",
    creativeDesc: "More unexpected ideas, less predictable answers",
    balancedDesc: "A middle ground between accuracy and free thinking",
    preciseDesc: "Restrained answers, closer to the facts",
    thinkingStyle: "The angle this model argues from in the discussion",
    fontSize: "Text size",
    scrollToBottom: "Jump to the newest messages",
    retryModel: "Try again",
    removeModel: "Remove from the list",
    openLanding: "About this project",
    backToDebate: "Back to the discussion",
  },
};

const uk: Dict = {
  welcome: {
    masthead: "Agent Debate",
    mastheadAside: "Кілька AI-моделей, одне запитання",
    heroTop: "До восьми AI",
    heroMid: "обговорюють",
    heroBottom: "ваше запитання.",
    heroPullquote:
      "«Вони читають відповіді одна одної, заперечують і виправляють. Наприкінці одна з них підсумовує, у чому зійшлися, а в чому ні.»",
    heroBody:
      "Візьміть Claude, GPT, Gemini, Grok чи будь-що інше з каталогу OpenRouter. Ви ставите запитання, вони відповідають по черзі, і кожна наступна реагує на те, що щойно сказали попередні.",
    heroBodyTail: " Ви бачите хід міркувань, а не готовий вердикт.",
    howItWorks: "Як це працює",
    step01h: "Виберіть моделі",
    step01b:
      "Двох достатньо для суперечки, вісім — максимум. Краще брати моделі різних компаній: Claude і GPT розходяться між собою значно частіше, ніж дві версії однієї моделі.",
    step02h: "Поставте складне запитання",
    step02b:
      "Переписувати старий сервіс чи латати далі. Яку з двох пропозицій роботи прийняти. Чому цифри у звіті не сходяться. Те, де однієї думки вам мало.",
    step03h: "Керуйте обговоренням",
    step03b:
      "Напишіть @ та ім'я моделі, щоб звернутися до неї напряму. Кнопка біля будь-якої відповіді просить решту розвинути саме цю думку. Коли почули достатньо, зупиніть раунд.",
    stepOne: "Перед початком",
    connectKey1: "Потрібен ваш",
    connectKey2: "ключ OpenRouter.",
    openRouterName: "OpenRouter",
    openRouterBlurb:
      "продає доступ до 300+ моделей усіх великих розробників за одним ключем. Реєструєтесь один раз, копіюєте ключ і платите тільки за те, що моделі справді витратили. Частина моделей безкоштовна.",
    getKey: "Створити ключ  ·  ~60 с",
    yourApiKey: "Ключ OpenRouter",
    keyPlaceholder: "sk-or-v1-…",
    openTheFloor: "Зберегти й почати",
    connecting: "Перевіряю",
    errorBadKey:
      "Ключ не підійшов. Перевірте, що він починається з sk-or-v1- і скопійований повністю.",
    errorNet:
      "Не вдалося зв'язатися з OpenRouter, щоб перевірити ключ. Спробуйте ще раз за хвилину.",
    privacy:
      "Ключ зберігається тільки у вашому браузері. Запити йдуть до OpenRouter через наш сервер, але там ключ не зберігається й не потрапляє в жоден лог.",
    footerName: "Agent Debate",
    footerOpen: "відкритий код · MIT",
  },
  empty: {
    setup: "Налаштування",
    stateAH1: "Спершу виберіть",
    stateAH2: "моделі.",
    stateABody:
      "Натисніть будь-яку модель у лівій колонці, щоб додати її до обговорення. З однією можна просто поговорити. Сперечатися починають із двох.",
    stateABodyMobile:
      "Натисніть ☰ угорі, щоб відкрити список моделей. Додайте хоча б дві, інакше сперечатися буде нема кому.",
    step1h: "Виберіть від 2 до 8 моделей",
    step1b: "У каталозі OpenRouter їх понад 300, частина безкоштовна.",
    step2h: "Поставте запитання",
    step2b: "Таке, де одна відповідь вас не переконує.",
    step3h: "Дивіться, як вони сперечаються",
    step3b:
      "Відповіді з'являються по черзі, наживо. Модерувати можете ви або одна з моделей.",
    panelListNudge: "список моделей — ліворуч",
    tonightsPanel: "Учасники обговорення",
    moderator: "модератор",
    stateBH1: "Про що",
    stateBH1Accent: "посперечаємось",
    stateBH1Tail: "?",
    stateBBody:
      "Напишіть своє запитання або візьміть одне з готових нижче.",
    tipLabel: "Підказка.",
    tipTypeWord: "Напишіть",
    tipTail: "на початку повідомлення, щоб звернутися саме до цієї моделі.",
    tipModerator:
      "Модератор стежить за ходом дискусії й наприкінці підбиває підсумок. Щоб віддати цю роль моделі, натисніть зірочку біля її імені.",
  },
  input: {
    placeholderDisabled: "Виберіть модель ліворуч, щоб почати…",
    placeholderActive:
      "Поставте запитання або напишіть @, щоб звернутися до однієї моделі",
  },
  sidebar: {
    agents: "Моделі",
    clickToActivate: "Натисніть, щоб додати модель",
    browseModels: "Увесь каталог",
    browseTitle: "Знайти інші моделі в каталозі OpenRouter",
    history: "Історія",
    style: "Манера відповідей:",
    creative: "Творча",
    balanced: "Помірна",
    precise: "Точна",
    exportLabel: "Експорт",
    newDebate: "Нове обговорення",
    apiKey: "Додати ключ",
    github: "GitHub",
    language: "Мова",
  },
  modal: {
    apiKey: {
      titleProactive: "Додати ключ API",
      titleRequired: "Потрібен ключ API",
      descProactive:
        "З власним ключем OpenRouter відкриваються платні моделі та пошук в інтернеті, а безкоштовні моделі перестають упиратися в ліміти.",
      descPaidModel: (m) =>
        `${m} — платна модель. Щоб нею користуватися, додайте свій ключ OpenRouter: витрати спишуться з вашого балансу.`,
      descWebSearch:
        "Пошук в інтернеті працює тільки з вашим ключем OpenRouter. Кожен пошук коштує близько $0.02 з вашого балансу.",
      connect: "Підключити",
      validating: "Перевіряю…",
      errorBadKey: "Ключ не підійшов. Перевірте його й спробуйте ще раз.",
      errorNet: "Не вдалося перевірити ключ. Спробуйте ще раз за хвилину.",
      privacy:
        "Ключ зберігається тільки у вашому браузері й залишається там між візитами. Нікуди, крім ваших запитів до OpenRouter, він не йде.",
      getKey: "Отримати ключ",
    },
    discover: {
      title: "Каталог моделей",
      searchPlaceholder: "Пошук за назвою або розробником…",
      freeOnly: "Тільки безкоштовні",
      loading: "Завантажую моделі…",
      empty: (q) => `Нічого не знайшлося за запитом «${q}»`,
      priceLegend:
        "Ціни за 1 млн токенів: in — текст, який ви надсилаєте, out — відповідь, яку пише модель. ctx — скільки тексту модель тримає в пам'яті водночас.",
      add: "Додати",
      added: "Додано",
      free: "Безкоштовна",
      poweredBy: "Каталог від OpenRouter",
    },
  },
  starterPrompts: [
    "Що краще для інженерів: віддалена робота чи офіс?",
    "Чи має держава законом регулювати розробку AGI?",
    "Рефакторити старий код чи переписати з нуля?",
    "Чи атомна енергетика — найшвидший шлях до декарбонізації?",
    "Стартапу брати венчурні інвестиції чи рости на власні гроші?",
    "Чи є безумовний базовий дохід життєздатною політикою?",
  ],
  system: {
    modAssigned: (n) => `Модератором стала модель ${n}`,
    modChangedToHuman: (p) => `Тепер модеруєте ви. До цього модерувала ${p}.`,
    modChangedBetween: (p, n) => `Тепер модерує ${n}. До цього модерувала ${p}.`,
    modAutoReassigned: (f, n) =>
      `${f} перестала відповідати. Модератором стала ${n}.`,
    modRemoved: (f) =>
      `${f} перестала відповідати, замінити її нема ким. Наразі модератора немає.`,
    webSearchUnavailable:
      "Пошук в інтернеті вимкнено. Він працює лише з вашим ключем OpenRouter і коштує близько $0.02 за запит, тому безкоштовним моделям недоступний.",
  },
  sourcesLabel: "Джерела",
  summaryBadge: "підсумок",
  roles: {
    skeptic: "Скептик",
    pragmatist: "Практик",
    visionary: "Візіонер",
    analyst: "Аналітик",
    devils_advocate: "Адвокат диявола",
  },
  tooltip: {
    moderatorSet: "Зробити цю модель модератором",
    moderatorUnset: "Взяти роль модератора на себе",
    attachFile: "Прикріпити файл (до 100 КБ)",
    webSearchOn: "Пошук в інтернеті увімкнено",
    webSearchOff: "Пошук в інтернеті вимкнено",
    webSearchNeedsKey: "Для пошуку в інтернеті потрібен ваш ключ",
    send: "Надіслати",
    stop: "Зупинити відповіді",
    lightMode: "Світла тема",
    darkMode: "Темна тема",
    hideSidebar: "Сховати бічну панель",
    showSidebar: "Показати бічну панель",
    copyAsMarkdown: "Скопіювати як Markdown",
    boost: "Попросити решту розвинути цю думку",
    exportMarkdown: "Зберегти все обговорення файлом Markdown",
    newDebate: "Очистити й почати нове обговорення",
    addKey: "Додати ваш ключ",
    disconnect: "Прибрати ключ із цього браузера",
    viewGithub: "Вихідний код на GitHub",
    closeModal: "Закрити",
    deleteSession: "Видалити це обговорення",
    paidModel: "Платна модель, потрібен ваш ключ",
    browseCatalog: "Каталог моделей OpenRouter",
    creativeDesc: "Більше несподіваних ідей, менш передбачувані відповіді",
    balancedDesc: "Середина між точністю і вільними міркуваннями",
    preciseDesc: "Стриманіші відповіді, ближче до фактів",
    thinkingStyle: "Кут, під яким ця модель дивиться на питання в дискусії",
    fontSize: "Розмір тексту",
    scrollToBottom: "Перейти до нових повідомлень",
    retryModel: "Спробувати ще раз",
    removeModel: "Прибрати зі списку",
    openLanding: "Про проєкт",
    backToDebate: "Назад до обговорення",
  },
};

const ru: Dict = {
  welcome: {
    masthead: "Agent Debate",
    mastheadAside: "Несколько AI-моделей, один вопрос",
    heroTop: "До восьми AI",
    heroMid: "обсуждают",
    heroBottom: "ваш вопрос.",
    heroPullquote:
      "«Они читают ответы друг друга, возражают и поправляют. В конце одна из них подводит итог: в чём сошлись, а в чём нет.»",
    heroBody:
      "Возьмите Claude, GPT, Gemini, Grok или что угодно ещё из каталога OpenRouter. Вы задаёте вопрос, они отвечают по очереди, и каждая следующая реагирует на то, что только что сказали остальные.",
    heroBodyTail: " Вы видите ход рассуждений, а не готовый вердикт.",
    howItWorks: "Как это работает",
    step01h: "Выберите модели",
    step01b:
      "Двух хватит для спора, восемь — максимум. Лучше брать модели разных компаний: Claude и GPT расходятся между собой куда чаще, чем две версии одной модели.",
    step02h: "Задайте сложный вопрос",
    step02b:
      "Переписывать старый сервис или латать дальше. Какое из двух предложений о работе принять. Почему цифры в отчёте не сходятся. То, где одного мнения вам мало.",
    step03h: "Управляйте обсуждением",
    step03b:
      "Напишите @ и имя модели, чтобы обратиться к ней напрямую. Кнопка рядом с любым ответом просит остальных развить именно эту мысль. Когда услышали достаточно, остановите раунд.",
    stepOne: "Перед началом",
    connectKey1: "Нужен ваш",
    connectKey2: "ключ OpenRouter.",
    openRouterName: "OpenRouter",
    openRouterBlurb:
      "продаёт доступ к 300+ моделям всех крупных разработчиков по одному ключу. Регистрируетесь один раз, копируете ключ и платите только за то, что модели действительно потратили. Часть моделей бесплатна.",
    getKey: "Создать ключ  ·  ~60 с",
    yourApiKey: "Ключ OpenRouter",
    keyPlaceholder: "sk-or-v1-…",
    openTheFloor: "Сохранить и начать",
    connecting: "Проверяю",
    errorBadKey:
      "Ключ не подошёл. Проверьте, что он начинается с sk-or-v1- и скопирован целиком.",
    errorNet:
      "Не удалось связаться с OpenRouter, чтобы проверить ключ. Попробуйте ещё раз через минуту.",
    privacy:
      "Ключ хранится только в вашем браузере. Запросы идут к OpenRouter через наш сервер, но там ключ не сохраняется и не попадает ни в один лог.",
    footerName: "Agent Debate",
    footerOpen: "открытый код · MIT",
  },
  empty: {
    setup: "Настройка",
    stateAH1: "Сначала выберите",
    stateAH2: "модели.",
    stateABody:
      "Нажмите любую модель в левой колонке, чтобы добавить её в обсуждение. С одной можно просто поговорить. Спорить начинают с двух.",
    stateABodyMobile:
      "Нажмите ☰ вверху, чтобы открыть список моделей. Добавьте хотя бы две, иначе спорить будет некому.",
    step1h: "Выберите от 2 до 8 моделей",
    step1b: "В каталоге OpenRouter их больше 300, часть бесплатна.",
    step2h: "Задайте вопрос",
    step2b: "Такой, где один ответ вас не убеждает.",
    step3h: "Смотрите, как они спорят",
    step3b:
      "Ответы появляются по очереди, вживую. Модерировать можете вы или одна из моделей.",
    panelListNudge: "список моделей — слева",
    tonightsPanel: "Участники обсуждения",
    moderator: "модератор",
    stateBH1: "О чём",
    stateBH1Accent: "поспорим",
    stateBH1Tail: "?",
    stateBBody: "Напишите свой вопрос или возьмите один из готовых ниже.",
    tipLabel: "Подсказка.",
    tipTypeWord: "Напишите",
    tipTail: "в начале сообщения, чтобы обратиться именно к этой модели.",
    tipModerator:
      "Модератор следит за ходом дискуссии и в конце подводит итог. Чтобы отдать эту роль модели, нажмите звёздочку рядом с её именем.",
  },
  input: {
    placeholderDisabled: "Выберите модель слева, чтобы начать…",
    placeholderActive:
      "Задайте вопрос или напишите @, чтобы обратиться к одной модели",
  },
  sidebar: {
    agents: "Модели",
    clickToActivate: "Нажмите, чтобы добавить модель",
    browseModels: "Весь каталог",
    browseTitle: "Найти другие модели в каталоге OpenRouter",
    history: "История",
    style: "Манера ответов:",
    creative: "Творческая",
    balanced: "Умеренная",
    precise: "Точная",
    exportLabel: "Экспорт",
    newDebate: "Новое обсуждение",
    apiKey: "Добавить ключ",
    github: "GitHub",
    language: "Язык",
  },
  modal: {
    apiKey: {
      titleProactive: "Добавить ключ API",
      titleRequired: "Нужен ключ API",
      descProactive:
        "С собственным ключом OpenRouter открываются платные модели и поиск в интернете, а бесплатные модели перестают упираться в лимиты.",
      descPaidModel: (m) =>
        `${m} — платная модель. Чтобы ей пользоваться, добавьте свой ключ OpenRouter: расходы спишутся с вашего баланса.`,
      descWebSearch:
        "Поиск в интернете работает только с вашим ключом OpenRouter. Каждый поиск стоит около $0.02 с вашего баланса.",
      connect: "Подключить",
      validating: "Проверяю…",
      errorBadKey: "Ключ не подошёл. Проверьте его и попробуйте ещё раз.",
      errorNet: "Не удалось проверить ключ. Попробуйте ещё раз через минуту.",
      privacy:
        "Ключ хранится только в вашем браузере и остаётся там между визитами. Никуда, кроме ваших запросов к OpenRouter, он не уходит.",
      getKey: "Получить ключ",
    },
    discover: {
      title: "Каталог моделей",
      searchPlaceholder: "Поиск по названию или разработчику…",
      freeOnly: "Только бесплатные",
      loading: "Загружаю модели…",
      empty: (q) => `Ничего не нашлось по запросу «${q}»`,
      priceLegend:
        "Цены за 1 млн токенов: in — текст, который вы отправляете, out — ответ, который пишет модель. ctx — сколько текста модель держит в памяти одновременно.",
      add: "Добавить",
      added: "Добавлено",
      free: "Бесплатная",
      poweredBy: "Каталог от OpenRouter",
    },
  },
  starterPrompts: [
    "Что лучше для инженеров: удалённая работа или офис?",
    "Должно ли государство регулировать разработку AGI законом?",
    "Рефакторить старый код или переписать с нуля?",
    "Атомная энергетика — кратчайший путь к декарбонизации?",
    "Стартапу брать венчурные инвестиции или расти на свои деньги?",
    "Безусловный базовый доход — жизнеспособная политика?",
  ],
  system: {
    modAssigned: (n) => `Модератором стала модель ${n}`,
    modChangedToHuman: (p) => `Теперь модерируете вы. До этого модерировала ${p}.`,
    modChangedBetween: (p, n) => `Теперь модерирует ${n}. До этого модерировала ${p}.`,
    modAutoReassigned: (f, n) =>
      `${f} перестала отвечать. Модератором стала ${n}.`,
    modRemoved: (f) =>
      `${f} перестала отвечать, заменить её некем. Сейчас модератора нет.`,
    webSearchUnavailable:
      "Поиск в интернете выключен. Он работает только с вашим ключом OpenRouter и стоит около $0.02 за запрос, поэтому бесплатным моделям недоступен.",
  },
  sourcesLabel: "Источники",
  summaryBadge: "итог",
  roles: {
    skeptic: "Скептик",
    pragmatist: "Практик",
    visionary: "Визионер",
    analyst: "Аналитик",
    devils_advocate: "Адвокат дьявола",
  },
  tooltip: {
    moderatorSet: "Сделать эту модель модератором",
    moderatorUnset: "Взять роль модератора на себя",
    attachFile: "Прикрепить файл (до 100 КБ)",
    webSearchOn: "Поиск в интернете включён",
    webSearchOff: "Поиск в интернете выключен",
    webSearchNeedsKey: "Для поиска в интернете нужен ваш ключ",
    send: "Отправить",
    stop: "Остановить ответы",
    lightMode: "Светлая тема",
    darkMode: "Тёмная тема",
    hideSidebar: "Скрыть боковую панель",
    showSidebar: "Показать боковую панель",
    copyAsMarkdown: "Скопировать как Markdown",
    boost: "Попросить остальных развить эту мысль",
    exportMarkdown: "Сохранить всё обсуждение файлом Markdown",
    newDebate: "Очистить и начать новое обсуждение",
    addKey: "Добавить ваш ключ",
    disconnect: "Убрать ключ из этого браузера",
    viewGithub: "Исходный код на GitHub",
    closeModal: "Закрыть",
    deleteSession: "Удалить это обсуждение",
    paidModel: "Платная модель, нужен ваш ключ",
    browseCatalog: "Каталог моделей OpenRouter",
    creativeDesc: "Больше неожиданных идей, менее предсказуемые ответы",
    balancedDesc: "Середина между точностью и свободными рассуждениями",
    preciseDesc: "Более сдержанные ответы, ближе к фактам",
    thinkingStyle: "Угол, под которым эта модель смотрит на вопрос в дискуссии",
    fontSize: "Размер текста",
    scrollToBottom: "Перейти к новым сообщениям",
    retryModel: "Попробовать ещё раз",
    removeModel: "Убрать из списка",
    openLanding: "О проекте",
    backToDebate: "Назад к обсуждению",
  },
};

const DICTS: Record<Locale, Dict> = { en, uk, ru };

export function getDict(locale: Locale | null | undefined): Dict {
  return DICTS[locale ?? "en"] ?? en;
}

export function useT(): Dict {
  const locale = useChatStore((s) => s.locale);
  return getDict(locale);
}
