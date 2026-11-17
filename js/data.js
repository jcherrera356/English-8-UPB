// Content that changes often lives here, so the slides in index.html stay clean.

const TIMELINE = [
  { year: "1917", title: "Balfour Declaration", kw: "A \"national home\" for the Jewish people", img: "img/balfour.jpg" },
  { year: "1947", title: "UN Partition Plan", kw: "Two states · Arab nations say no", img: "img/partition.jpg" },
  { year: "1948", title: "Israel · the Nakba", kw: "750,000 Palestinian refugees", img: "img/nakba.jpg" },
  { year: "1967", title: "Six-Day War", kw: "West Bank · East Jerusalem · Gaza occupied", img: "img/sixday.jpg" },
  { year: "1993", title: "Oslo Accords", kw: "Rabin · Arafat · hope of two states", img: "img/oslo.jpg" },
  { year: "2005", title: "Gaza withdrawal", kw: "Settlers leave · Hamas takes control (2007)", img: "img/disengagement.jpg" },
  { year: "2023", title: "October 7 · War", kw: "1,200 killed in Israel · 251 hostages", img: "img/gaza-damage.jpg" },
  { year: "2025", title: "Ceasefire", kw: "October 10 · hostages and prisoners released", img: "img/ceasefire.jpg" },
];

// Each answer is backed by one of our sources; "why" appears after answering, in reported speech.
const QUIZ = [
  {
    q: "How old is the conflict between Israel and Palestine?",
    options: ["10 years", "50 years", "More than 100 years", "1,000 years"],
    answer: 2,
    source: "BBC News",
    why: "The answer is C, because the BBC explained that the origins of the conflict went back more than a century.",
  },
  {
    q: "Which city is holy for three religions and is the heart of the conflict?",
    options: ["Bogotá", "Jerusalem", "Paris", "New York"],
    answer: 1,
    source: "DW Documentary",
    why: "The answer is B, because the DW documentary said that Jerusalem was holy for Jews, Christians and Muslims, and that both peoples claimed it as their capital.",
  },
  {
    q: "How big is historic Palestine?",
    options: ["Bigger than Colombia", "As big as Brazil", "Smaller than Antioquia", "Bigger than Europe"],
    answer: 2,
    source: "El Orden Mundial",
    why: "The answer is C, because El Orden Mundial reported that historic Palestine covered only 27,500 square kilometres.",
  },
  {
    q: "Did people stop dying in Gaza after the ceasefire?",
    options: ["Yes, completely", "No, people continued dying", "There was never a ceasefire", "The war ended in 1948"],
    answer: 1,
    source: "DW",
    why: "The answer is B, because DW reported that more than 1,600 Palestinians had died since the ceasefire began.",
  },
];

const REPORTED = [
  {
    direct: "“Peace is more than the absence of war.”",
    who: "Galtung",
    reported: "Galtung explained that peace was more than the absence of war.",
  },
  {
    direct: "“The time for peace has come.”",
    who: "Emmanuel Macron",
    reported: "Macron said that the time for peace had come.",
  },
  {
    direct: "“Every day there are shootings.”",
    who: "Ahed, Gaza",
    reported: "Ahed said that every day there were shootings.",
  },
  {
    direct: "“We are suffering.”",
    who: "Amal, Gaza",
    reported: "Amal said that they were suffering.",
  },
  {
    direct: "“The two-state solution is less and less viable.”",
    who: "de Argüelles",
    reported: "He argued that the two-state solution was less and less viable.",
  },
  {
    direct: "“To accept that, I need the signature of a billion Muslims.”",
    who: "Yasser Arafat, 2000",
    reported: "Arafat said that, to accept that, he needed the signature of a billion Muslims.",
  },
];

// pending: true = still missing data; shown in orange so nobody presents it by accident.
const REFERENCES = [
  {
    text: "BBC News. (2025, October 14). Israel and the Palestinians: History of the conflict explained. <i>BBC News</i>.",
    url: "https://www.bbc.com/news/articles/ckgr71z0jp4o",
  },
  {
    text: "de Argüelles, Á. (2025, October 5). La solución en Israel y Palestina es un nuevo Estado plurinacional. <i>El Orden Mundial</i>.",
    url: "https://elordenmundial.com/palestina-plurinacional-solucion-dos-estados-israel/",
  },
  {
    text: "DW. (2026, November 6). Cinco palestinos mueren en ataques de Israel en Gaza. <i>Deutsche Welle</i>.",
    url: "https://www.dw.com/es/cinco-palestinos-mueren-en-ataques-de-israel-en-gaza/a-79871408",
  },
  {
    text: "DW Documental. (n.d.). <i>Jerusalén - La eterna disputa por la Ciudad Santa</i> [Video]. YouTube.",
    url: "https://www.youtube.com/watch?v=J1Yi1YbX07c",
  },
  {
    text: "Limaye, Y. (2026, October 12). \"Cada día muere gente\": las familias en Gaza que siguen bajo los ataques israelíes pese al alto el fuego, mientras el acuerdo de paz se estanca. <i>BBC News Mundo</i>.",
    url: "https://www.bbc.com/mundo/articles/c95ynxjmp253o",
  },
];

const CREDITS =
  "Images: Wikimedia Commons — Adam Jones (CC BY-SA 2.0); British Library (PD); United Nations (PD); UNRWA (PD; CC BY-SA 3.0 IGO); " +
  "David Rubinger / GPO (CC BY-SA 4.0); White House Photo Office (PD); IDF (CC BY-SA 2.0); WAFA / APAimages (CC BY-SA 3.0); " +
  "Justin McIntosh (CC BY 2.0); Thomas Good (CC BY-SA 4.0); Girrit (CC0); Jarvin (CC BY 3.0).";
