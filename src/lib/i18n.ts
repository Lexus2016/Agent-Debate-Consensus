import { useChatStore } from "@/store/chatStore";

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
  };
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
    masthead: "Agent Debate · vol. 1",
    mastheadAside: "A panel, not a chat",
    heroTop: "Up to eight",
    heroMid: "AI minds",
    heroBottom: "in one room.",
    heroPullquote:
      "“Throw in a question. They argue with each other, push back, narrow it down — live. You moderate, or one of them does.”",
    heroBody:
      "Pick Claude, GPT, Gemini, Grok — any combination of up to eight — and let them go at it. Not a chat where you talk to one model.",
    heroBodyTail: " A room where they talk to each other.",
    howItWorks: "How it works",
    step01h: "Assemble the panel",
    step01b:
      "Pick two to eight models. Mix Claude with Llama, GPT with Gemini, Mistral with Grok — anything OpenRouter exposes.",
    step02h: "Open with a question",
    step02b:
      "An architecture call you keep flip-flopping on. A tricky hire. A bug nobody can reproduce. The kind of thing where one opinion isn’t enough.",
    step03h: "Steer the floor",
    step03b:
      "@mention to put one of them on the spot. Boost the arguments you actually buy. Cut things off when you’ve heard enough.",
    stepOne: "Step One",
    connectKey1: "Connect your",
    connectKey2: "OpenRouter key.",
    openRouterName: "OpenRouter",
    openRouterBlurb:
      "is one API key that gets you 300+ models — every major provider, with free ones in the mix.",
    getKey: "Get a key  ·  ~60s",
    yourApiKey: "OpenRouter API key",
    keyPlaceholder: "sk-or-v1-…",
    openTheFloor: "Open the floor",
    connecting: "Connecting",
    errorBadKey: "That key didn’t work. Double-check the prefix sk-or-v1-…",
    errorNet: "Couldn’t reach our validator — try again in a sec.",
    privacy:
      "Your key never leaves this browser. We don’t store it, log it, or see it. Every request is signed on your machine and goes straight to OpenRouter through our proxy.",
    footerName: "Agent Debate",
    footerOpen: "open source · MIT",
  },
  empty: {
    setup: "Setup",
    stateAH1: "First, assemble",
    stateAH2: "your panel.",
    stateABody:
      "Click any agent in the sidebar to add them to the debate. You need at least one — though two is where the arguing starts.",
    stateABodyMobile:
      "Tap ☰ to open the panel list. You need at least one — though two is where the arguing starts.",
    step1h: "Pick 2–8 agents",
    step1b: "From 300+ models across every major provider.",
    step2h: "Pose a question",
    step2b: "Anything you couldn’t settle yourself.",
    step3h: "Watch them argue",
    step3b: "Real time. You moderate — or one of the agents does.",
    panelListNudge: "the panel list lives over there",
    tonightsPanel: "Tonight’s panel",
    moderator: "moderator",
    stateBH1: "What shall they",
    stateBH1Accent: "debate",
    stateBH1Tail: " tonight?",
    stateBBody:
      "Ask your own question — or pick one below to get the room talking.",
    tipLabel: "Tip.",
    tipTypeWord: "Type",
    tipTail: "to put a question to a specific agent.",
    tipModerator:
      "Any agent can lead the discussion — click the star next to its name to make them the moderator.",
  },
  input: {
    placeholderDisabled: "Pick an agent from the panel to begin…",
    placeholderActive: "Open the floor — type a question, or @mention an agent",
  },
  sidebar: {
    agents: "Agents",
    clickToActivate: "Click an agent to activate it",
    browseModels: "Browse 400+",
    browseTitle: "Discover more agents from the OpenRouter catalog",
    history: "History",
    style: "Style:",
    creative: "Creative",
    balanced: "Balanced",
    precise: "Precise",
    exportLabel: "Export",
    newDebate: "New Debate",
    apiKey: "Add your key",
    github: "GitHub",
    language: "Language",
  },
  modal: {
    apiKey: {
      titleProactive: "Add API Key",
      titleRequired: "API Key Required",
      descProactive:
        "Add your OpenRouter API key to unlock all models, web search, and avoid rate limits on free models.",
      descPaidModel: (m) =>
        `${m} is a paid model. Enter your OpenRouter API key to unlock paid models, web search, and unlimited access.`,
      descWebSearch:
        "Web search requires an API key. Enter your OpenRouter key to enable web search, paid models, and unlimited access.",
      connect: "Connect",
      validating: "Validating…",
      errorBadKey: "Invalid API key. Please check and try again.",
      errorNet: "Failed to validate key. Please try again.",
      privacy:
        "Your key is stored locally in your browser and persists between sessions.",
      getKey: "Get an API key",
    },
    discover: {
      title: "Discover Agents",
      searchPlaceholder: "Search by name or provider…",
      freeOnly: "Free only",
      loading: "Loading agents…",
      empty: (q) => `No results for “${q}”`,
      add: "Add",
      added: "Added",
      free: "Free",
      poweredBy: "Powered by OpenRouter",
    },
  },
  starterPrompts: [
    "Is remote work better than office for software engineers?",
    "Should AGI development be regulated by law?",
    "Refactor legacy code or rewrite it from scratch?",
    "Is nuclear energy the fastest path to decarbonization?",
    "Should startups raise VC or bootstrap?",
    "Is universal basic income a viable economic policy?",
  ],
  system: {
    modAssigned: (n) => `Moderator assigned: ${n}`,
    modChangedToHuman: (p) => `Moderator changed: ${p} → You (human)`,
    modChangedBetween: (p, n) => `Moderator changed: ${p} → ${n}`,
    modAutoReassigned: (f, n) => `Moderator auto-reassigned: ${f} (failed) → ${n}`,
    modRemoved: (f) => `Moderator removed: ${f} failed, no candidates available`,
  },
  tooltip: {
    moderatorSet: "Make moderator",
    moderatorUnset: "Take moderator role yourself",
    attachFile: "Attach file · max 100 KB",
    webSearchOn: "Search the web · on",
    webSearchOff: "Search the web · off",
    webSearchNeedsKey: "Search the web · needs your key",
    send: "Send",
    stop: "Stop generating",
    lightMode: "Light · e-paper",
    darkMode: "Dark · ink",
    hideSidebar: "Hide panel",
    showSidebar: "Show panel",
    copyAsMarkdown: "Copy as Markdown",
    boost: "Develop this further",
    exportMarkdown: "Export as Markdown",
    newDebate: "Start over",
    addKey: "Add your key",
    disconnect: "Disconnect key",
    viewGithub: "Source on GitHub",
    closeModal: "Close",
    deleteSession: "Delete this debate",
    paidModel: "Paid model · needs your key",
    browseCatalog: "Catalog of 400+ models",
    creativeDesc: "Adventurous, divergent answers",
    balancedDesc: "Even-handed middle ground",
    preciseDesc: "Focused, consistent answers",
    thinkingStyle: "Cognitive style — how this agent approaches debate",
    fontSize: "Reading font size",
    scrollToBottom: "Latest messages",
    retryModel: "Retry — clear error",
    removeModel: "Remove from list",
    openLanding: "About this project",
    backToDebate: "Back to debate",
  },
};

const uk: Dict = {
  welcome: {
    masthead: "Agent Debate · вип. 1",
    mastheadAside: "Це дискусія, не чат",
    heroTop: "До восьми",
    heroMid: "AI в одній",
    heroBottom: "кімнаті.",
    heroPullquote:
      "«Кидаєте запитання — і вони сперечаються між собою, шукають спільну відповідь у вас на очах. Модерує хтось із них або ви самі.»",
    heroBody:
      "Виберіть Claude, GPT, Gemini, Grok — будь-яку команду до восьми моделей — і подивіться, що з цього вийде. Це не чат з однією моделлю.",
    heroBodyTail: " Це кімната, де вони говорять одна з одною.",
    howItWorks: "Як це працює",
    step01h: "Зберіть учасників",
    step01b:
      "Візьміть від двох до восьми моделей. Можна Claude з Llama, можна GPT з Gemini — усе, що є в OpenRouter.",
    step02h: "Поставте запитання",
    step02b:
      "Архітектурне рішення, від якого вже місяць метаєтесь. Складна гіпотеза. Питання, де однієї думки замало, бо самі собі заперечуєте через день.",
    step03h: "Скеровуйте обговорення",
    step03b:
      "Поставте @ перед іменем — і моделі доведеться відповісти прямо. Підсилюйте аргументи, які вам зайшли. Закривайте розмову, коли почули досить.",
    stepOne: "Перший крок",
    connectKey1: "Підключіть ваш",
    connectKey2: "ключ OpenRouter.",
    openRouterName: "OpenRouter",
    openRouterBlurb:
      "— це один ключ, що відкриває 300+ моделей від усіх великих провайдерів. Безкоштовні теж є.",
    getKey: "Створити ключ  ·  ~60с",
    yourApiKey: "Ключ OpenRouter",
    keyPlaceholder: "sk-or-v1-…",
    openTheFloor: "Відкрити обговорення",
    connecting: "Перевіряю",
    errorBadKey: "Ключ не приймається. Він має починатися з sk-or-v1-…",
    errorNet: "Не вдалось дістати валідатор — спробуйте ще раз за мить.",
    privacy:
      "Ключ залишається у вас у браузері. Ми його не зберігаємо, не логуємо, не бачимо. Кожен запит підписується на вашому пристрої й через наш проксі йде прямо в OpenRouter.",
    footerName: "Agent Debate",
    footerOpen: "відкритий код · MIT",
  },
  empty: {
    setup: "Налаштування",
    stateAH1: "Спершу зберіть",
    stateAH2: "своїх учасників.",
    stateABody:
      "Натисніть будь-якого агента ліворуч, щоб додати його до дискусії. Потрібен хоча б один — хоч сперечатися починають із двох.",
    stateABodyMobile:
      "Натисніть ☰, щоб відкрити список агентів. Додайте хоча б одного — хоч сперечатися починають із двох.",
    step1h: "Виберіть 2–8 агентів",
    step1b: "З 300+ моделей від усіх провайдерів.",
    step2h: "Поставте запитання",
    step2b: "Те, що самотужки не вирішили.",
    step3h: "Дивіться, як сперечаються",
    step3b: "Наживо. Модерує один із агентів або ви.",
    panelListNudge: "список агентів — онде",
    tonightsPanel: "Сьогоднішні учасники",
    moderator: "модератор",
    stateBH1: "Про що",
    stateBH1Accent: "посперечаємось",
    stateBH1Tail: " сьогодні?",
    stateBBody:
      "Поставте власне запитання — або візьміть готове нижче, щоб дискусія почалась.",
    tipLabel: "Підказка.",
    tipTypeWord: "Напишіть",
    tipTail: "щоб звернутися до конкретного агента.",
    tipModerator:
      "Будь-якого агента можна зробити модератором — натисніть зірочку біля його імені у списку зліва.",
  },
  input: {
    placeholderDisabled: "Виберіть агента, щоб почати…",
    placeholderActive: "Поставте запитання — або зверніться до агента через @",
  },
  sidebar: {
    agents: "Агенти",
    clickToActivate: "Натисніть, щоб додати агента",
    browseModels: "Огляд 400+",
    browseTitle: "Каталог OpenRouter — знайти ще агентів",
    history: "Історія",
    style: "Стиль:",
    creative: "Творчий",
    balanced: "Помірний",
    precise: "Точний",
    exportLabel: "Експорт",
    newDebate: "Нові дебати",
    apiKey: "Додати ключ",
    github: "GitHub",
    language: "Мова",
  },
  modal: {
    apiKey: {
      titleProactive: "Додати ключ API",
      titleRequired: "Потрібен ключ API",
      descProactive:
        "Додайте свій ключ OpenRouter, щоб відкрити всі моделі, веб-пошук та зняти обмеження для безкоштовних моделей.",
      descPaidModel: (m) =>
        `${m} — платна модель. Введіть свій ключ OpenRouter, щоб користуватися платними моделями, веб-пошуком і без лімітів.`,
      descWebSearch:
        "Веб-пошук потребує ключа. Введіть свій ключ OpenRouter, щоб увімкнути веб-пошук, платні моделі й безлімітний доступ.",
      connect: "Підключити",
      validating: "Перевіряю…",
      errorBadKey: "Невірний ключ. Перевірте й спробуйте ще раз.",
      errorNet: "Не вдалось перевірити ключ. Спробуйте ще раз.",
      privacy:
        "Ваш ключ зберігається лише у вашому браузері й залишається між сесіями.",
      getKey: "Отримати ключ",
    },
    discover: {
      title: "Каталог агентів",
      searchPlaceholder: "Пошук за назвою або провайдером…",
      freeOnly: "Тільки безкоштовні",
      loading: "Завантажую агентів…",
      empty: (q) => `Нічого не знайшлось для «${q}»`,
      add: "Додати",
      added: "Додано",
      free: "Безкоштовно",
      poweredBy: "Працює на OpenRouter",
    },
  },
  starterPrompts: [
    "Що краще для інженерів — віддалена робота чи офіс?",
    "Чи має держава законом регулювати розробку AGI?",
    "Рефакторити старий код чи переписати з нуля?",
    "Чи атомна енергетика — найшвидший шлях до декарбонізації?",
    "Стартапу — брати венчурні інвестиції чи рости на власні?",
    "Чи безумовний базовий дохід — життєздатна політика?",
  ],
  system: {
    modAssigned: (n) => `Модератора призначено: ${n}`,
    modChangedToHuman: (p) => `Модератора змінено: ${p} → Ви (людина)`,
    modChangedBetween: (p, n) => `Модератора змінено: ${p} → ${n}`,
    modAutoReassigned: (f, n) => `Модератора авто-замінено: ${f} (помилка) → ${n}`,
    modRemoved: (f) => `Модератора знято: ${f} зазнав помилки, кандидатів немає`,
  },
  tooltip: {
    moderatorSet: "Зробити модератором",
    moderatorUnset: "Стати модератором самому",
    attachFile: "Прикріпити файл · до 100 КБ",
    webSearchOn: "Пошук в інтернеті · увімкнено",
    webSearchOff: "Пошук в інтернеті · вимкнено",
    webSearchNeedsKey: "Пошук в інтернеті · потрібен ваш ключ",
    send: "Надіслати",
    stop: "Зупинити генерацію",
    lightMode: "Світла · e-папір",
    darkMode: "Темна · чорнило",
    hideSidebar: "Сховати панель",
    showSidebar: "Показати панель",
    copyAsMarkdown: "Скопіювати як Markdown",
    boost: "Розвинути далі",
    exportMarkdown: "Експортувати у Markdown",
    newDebate: "Почати спочатку",
    addKey: "Додати ваш ключ",
    disconnect: "Відключити ключ",
    viewGithub: "Код на GitHub",
    closeModal: "Закрити",
    deleteSession: "Видалити обговорення",
    paidModel: "Платна модель · потрібен ваш ключ",
    browseCatalog: "Каталог 400+ моделей",
    creativeDesc: "Сміливі, нестандартні відповіді",
    balancedDesc: "Збалансовано — посередині",
    preciseDesc: "Сфокусовані, точні відповіді",
    thinkingStyle: "Когнітивний стиль — як агент підходить до дебатів",
    fontSize: "Розмір шрифта",
    scrollToBottom: "До нових повідомлень",
    retryModel: "Спробувати ще — скинути помилку",
    removeModel: "Прибрати зі списку",
    openLanding: "Про проєкт",
    backToDebate: "Назад до дебатів",
  },
};

const ru: Dict = {
  welcome: {
    masthead: "Agent Debate · вып. 1",
    mastheadAside: "Это обсуждение, не чат",
    heroTop: "До восьми",
    heroMid: "AI в одной",
    heroBottom: "комнате.",
    heroPullquote:
      "«Бросаете вопрос — и они спорят между собой, ищут общий ответ прямо у вас на глазах. Модерирует кто-то из них или вы сами.»",
    heroBody:
      "Соберите Claude, GPT, Gemini, Grok — любую команду до восьми моделей — и посмотрите, что выйдет. Это не чат с одной моделью.",
    heroBodyTail: " Это комната, где они разговаривают друг с другом.",
    howItWorks: "Как это работает",
    step01h: "Соберите участников",
    step01b:
      "Возьмите от двух до восьми моделей. Можно Claude с Llama, можно GPT с Gemini — всё, что есть в OpenRouter.",
    step02h: "Задайте вопрос",
    step02b:
      "Архитектурное решение, от которого уже месяц мечетесь. Сложная гипотеза. Вопрос, где одного мнения мало, потому что сами себе возражаете через день.",
    step03h: "Управляйте обсуждением",
    step03b:
      "Поставьте @ перед именем — и модели придётся ответить прямо. Усиливайте аргументы, которые зашли. Закрывайте разговор, когда наслушались.",
    stepOne: "Первый шаг",
    connectKey1: "Подключите ваш",
    connectKey2: "ключ OpenRouter.",
    openRouterName: "OpenRouter",
    openRouterBlurb:
      "— это один ключ, который открывает 300+ моделей от всех крупных провайдеров. Бесплатные тоже есть.",
    getKey: "Создать ключ  ·  ~60с",
    yourApiKey: "Ключ OpenRouter",
    keyPlaceholder: "sk-or-v1-…",
    openTheFloor: "Открыть обсуждение",
    connecting: "Проверяю",
    errorBadKey: "Ключ не принимается. Он должен начинаться с sk-or-v1-…",
    errorNet: "Не дотянулись до валидатора — попробуйте ещё раз через секунду.",
    privacy:
      "Ключ остаётся у вас в браузере. Мы его не храним, не логируем, не видим. Каждый запрос подписывается у вас на устройстве и через наш прокси идёт прямо в OpenRouter.",
    footerName: "Agent Debate",
    footerOpen: "открытый код · MIT",
  },
  empty: {
    setup: "Настройка",
    stateAH1: "Сначала соберите",
    stateAH2: "ваших участников.",
    stateABody:
      "Кликните любого агента слева, чтобы добавить его в дискуссию. Нужен хотя бы один — хотя спорить начинают с двух.",
    stateABodyMobile:
      "Нажмите ☰, чтобы открыть список агентов. Добавьте хотя бы одного — хотя спорить начинают с двух.",
    step1h: "Выберите 2–8 агентов",
    step1b: "Из 300+ моделей от всех провайдеров.",
    step2h: "Задайте вопрос",
    step2b: "То, что в одиночку не решить.",
    step3h: "Смотрите, как спорят",
    step3b: "В реальном времени. Модерирует один из агентов или вы.",
    panelListNudge: "список агентов — там",
    tonightsPanel: "Сегодняшние участники",
    moderator: "модератор",
    stateBH1: "О чём",
    stateBH1Accent: "поспорим",
    stateBH1Tail: " сегодня?",
    stateBBody:
      "Задайте свой вопрос — или возьмите готовый ниже, чтобы дискуссия пошла.",
    tipLabel: "Подсказка.",
    tipTypeWord: "Напишите",
    tipTail: "чтобы задать вопрос конкретному агенту.",
    tipModerator:
      "Любого агента можно сделать модератором — кликните звёздочку рядом с его именем в списке слева.",
  },
  input: {
    placeholderDisabled: "Выберите агента, чтобы начать…",
    placeholderActive: "Задайте вопрос — или обратитесь к агенту через @",
  },
  sidebar: {
    agents: "Агенты",
    clickToActivate: "Кликните, чтобы активировать агента",
    browseModels: "Обзор 400+",
    browseTitle: "Обзор каталога OpenRouter — найти ещё агентов",
    history: "История",
    style: "Стиль:",
    creative: "Креативный",
    balanced: "Средний",
    precise: "Точный",
    exportLabel: "Экспорт",
    newDebate: "Новые дебаты",
    apiKey: "Добавить ключ",
    github: "GitHub",
    language: "Язык",
  },
  modal: {
    apiKey: {
      titleProactive: "Добавить ключ API",
      titleRequired: "Нужен ключ API",
      descProactive:
        "Добавьте свой ключ OpenRouter, чтобы открыть все модели, веб-поиск и снять ограничения с бесплатных моделей.",
      descPaidModel: (m) =>
        `${m} — платная модель. Введите свой ключ OpenRouter, чтобы пользоваться платными моделями, веб-поиском и без лимитов.`,
      descWebSearch:
        "Веб-поиск требует ключ. Введите свой ключ OpenRouter, чтобы включить веб-поиск, платные модели и безлимитный доступ.",
      connect: "Подключить",
      validating: "Проверяю…",
      errorBadKey: "Неверный ключ. Проверьте и попробуйте ещё раз.",
      errorNet: "Не удалось проверить ключ. Попробуйте ещё раз.",
      privacy:
        "Ваш ключ хранится только в вашем браузере и сохраняется между сессиями.",
      getKey: "Получить ключ",
    },
    discover: {
      title: "Каталог агентов",
      searchPlaceholder: "Поиск по названию или провайдеру…",
      freeOnly: "Только бесплатные",
      loading: "Загружаю агентов…",
      empty: (q) => `Ничего не найдено для «${q}»`,
      add: "Добавить",
      added: "Добавлено",
      free: "Бесплатно",
      poweredBy: "Работает на OpenRouter",
    },
  },
  starterPrompts: [
    "Что лучше для инженеров — удалёнка или офис?",
    "Должно ли государство регулировать разработку AGI законом?",
    "Рефакторить старый код или переписать с нуля?",
    "Атомная энергетика — кратчайший путь к декарбонизации?",
    "Стартапу — брать венчурные инвестиции или расти на свои?",
    "Безусловный базовый доход — жизнеспособная политика?",
  ],
  system: {
    modAssigned: (n) => `Модератор назначен: ${n}`,
    modChangedToHuman: (p) => `Модератор изменён: ${p} → Вы (человек)`,
    modChangedBetween: (p, n) => `Модератор изменён: ${p} → ${n}`,
    modAutoReassigned: (f, n) => `Модератор авто-заменён: ${f} (ошибка) → ${n}`,
    modRemoved: (f) => `Модератор снят: ${f} дал ошибку, кандидатов нет`,
  },
  tooltip: {
    moderatorSet: "Сделать модератором",
    moderatorUnset: "Стать модератором самому",
    attachFile: "Прикрепить файл · до 100 КБ",
    webSearchOn: "Поиск в интернете · включён",
    webSearchOff: "Поиск в интернете · выключен",
    webSearchNeedsKey: "Поиск в интернете · нужен ваш ключ",
    send: "Отправить",
    stop: "Остановить генерацию",
    lightMode: "Светлая · e-paper",
    darkMode: "Тёмная · чернила",
    hideSidebar: "Скрыть панель",
    showSidebar: "Показать панель",
    copyAsMarkdown: "Скопировать как Markdown",
    boost: "Развить дальше",
    exportMarkdown: "Экспортировать в Markdown",
    newDebate: "Начать заново",
    addKey: "Добавить ваш ключ",
    disconnect: "Отключить ключ",
    viewGithub: "Код на GitHub",
    closeModal: "Закрыть",
    deleteSession: "Удалить обсуждение",
    paidModel: "Платная модель · нужен ваш ключ",
    browseCatalog: "Каталог 400+ моделей",
    creativeDesc: "Смелые, нестандартные ответы",
    balancedDesc: "Сбалансировано — посередине",
    preciseDesc: "Сфокусированные, точные ответы",
    thinkingStyle: "Когнитивный стиль — как агент подходит к дебатам",
    fontSize: "Размер шрифта",
    scrollToBottom: "К новым сообщениям",
    retryModel: "Попробовать снова — сбросить ошибку",
    removeModel: "Убрать из списка",
    openLanding: "О проекте",
    backToDebate: "Назад к дебатам",
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
