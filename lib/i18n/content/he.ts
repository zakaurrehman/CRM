import type { ContentPack } from "./types";

/**
 * Hebrew content. Right-to-left.
 *
 * NEEDS NATIVE REVIEW, and this locale most of all — see docs item 21. Hebrew
 * metallurgical vocabulary is far less settled than the European languages, and
 * several terms below are descriptive rather than established trade usage.
 *
 * Latin-script designations (Hastelloy, Inconel, Stellite, Invar, A286, AOD)
 * stay as published and sit inside Hebrew sentences. The bidirectional algorithm
 * orders them correctly without directional marks, and adding marks tends to
 * cause more mis-ordering than it prevents.
 */
export const heContent: ContentPack = {
  categories: {
    "nickel-alloys": {
      name: "סגסוגות ניקל",
      summary:
        "סגסוגות על בסיס ניקל, עמידות בפני קורוזיה וחום, ובהן משפחות Hastelloy, Inconel, Incoloy ו‑Nimonic, המשמשות היכן שתקיפה כימית וטמפרטורה גבוהה פועלות יחד.",
      properties: ["עמידות בחום", "עמידות בקורוזיה", "עמידות בחומצות"],
      applications: ["תעשייה כימית ותעשיית המזון", "חלקי מנועי מטוסים"],
    },
    "tungsten-alloys": {
      name: "סגסוגות טונגסטן",
      summary:
        "טונגסטן וקרביד טונגסטן בעלי קשיות וצפיפות גבוהות במיוחד, המשמשים בכלי חיתוך, חלקי שחיקה ומתכות כבדות.",
      properties: ["קשיות גבוהה", "צפיפות גבוהה"],
      applications: ["כלי חיתוך"],
    },
    "stainless-steel": {
      name: "פלדת אל‑חלד",
      summary:
        "סגסוגות אל‑חלד אוסטניטיות, פריטיות, מרטנזיטיות ודופלקס, המכסות את מלוא הטווח שבין שימוש כללי לפלדות עמידות קורוזיה ייעודיות.",
      properties: ["עמידות בקורוזיה"],
      applications: ["שימוש ביתי", "תעשיות המזון והחלב", "עיצוב ובנייה"],
    },
    "complex-nickel-alloys": {
      name: "סופר‑סגסוגות ניקל",
      summary:
        "סופר‑סגסוגות ניקל מוקשות‑שיקוע ויצוקות, שתוכננו לעמידות בזחילה בחלק החם של טורבינות גז ומנועי מטוסים.",
      properties: ["סגסוגות טמפרטורה גבוהה", "עמידות בחום", "עמידות בקורוזיה", "עמידות בזחילה"],
      applications: ["חלקי מנועי מטוסים"],
    },
    "nickel-copper": {
      name: "ניקל‑נחושת (Monel)",
      summary:
        "סגסוגות ניקל‑נחושת מסוג Monel, המשלבות עמידות בקורוזיית מי‑ים עם חוזק טוב ליישומים ימיים וכימיים.",
      properties: ["עמידות בחום", "עמידות בקורוזיה"],
      applications: ["יציקות ימיות"],
    },
    "high-speed-steels": {
      name: "פלדות מהירות",
      summary:
        "פלדות מהירות על בסיס טונגסטן ומוליבדן השומרות על קשיותן בטמפרטורת החיתוך, כולל סדרות M ו‑T.",
      properties: ["עמידות בשחיקה", "קשיות גבוהה בחום"],
      applications: ["חיתוך מתכות (קצבי חיתוך גבוהים)"],
    },
    "cobalt-alloys": {
      name: "סגסוגות קובלט",
      summary:
        "סגסוגות על בסיס קובלט העמידות בשחיקה, בחום ובקורוזיה — משפחות Stellite ו‑MAR‑M — לריתוך ציפוי קשה ולרכיבי החלק החם בטורבינות.",
      properties: ["עמידות בחום", "עמידות בקורוזיה", "עמידות בשחיקה"],
      applications: ["חלקי מנועי מטוסים"],
    },
    "copper-nickel-alloys": {
      name: "סגסוגות נחושת‑ניקל",
      summary:
        "קופרוניקל וכסף ניקל המשמשים לצנרת מי‑ים, מחליפי חום, מעבים ויישומים דקורטיביים.",
      properties: ["עמידות בקורוזיה"],
      applications: ["עיצוב", "העברת מים וחום"],
    },
    "tool-steels": {
      name: "פלדות כלים",
      summary:
        "פלדות כלים לעיבוד קר, לעיבוד חם ועמידות הלם, הנבחרות לפי קשיות, חוזק ויציבות מידותית בכלים ובתבניות.",
      properties: ["עמידות בשחיקה", "קשיות גבוהה"],
      applications: ["כלים ותבניות (עיבוד קר)", "תבניות לעיבוד חם"],
    },
    "cobalt-iron-alloys": {
      name: "סגסוגות קובלט‑ברזל",
      summary:
        "סגסוגות קובלט‑ברזל וקובלט‑ונדיום בעלות חדירות מגנטית גבוהה, המשמשות בלמינציות שנאים, ליבות מגנטיות ומכלולים אלקטרוניים.",
      properties: ["תכונות מגנטיות (חדירות גבוהה)"],
      applications: ["תעשיית האלקטרוניקה"],
    },
    "alloy-irons": {
      name: "יציקות ברזל מסוגסגות",
      summary:
        "יציקות ברזל מסוגסגות גבוה ויציקות מסוג Ni‑Resist, המספקות עמידות בקורוזיה ובחום בציוד כימי, משאבות וציוד תהליכי.",
      properties: ["עמידות בחום", "עמידות בקורוזיה", "עמידות בחומצות"],
      applications: ["תעשייה כימית ותעשיית המזון", "חלקי מנועי מטוסים"],
    },
    "titanium-alloys": {
      name: "סגסוגות טיטניום",
      summary:
        "טיטניום טהור מסחרית וסגסוגות אלפא, אלפא‑בטא ובטא, המציעות יחס חוזק‑למשקל יוצא דופן לצד עמידות קורוזיה גבוהה.",
      properties: ["יחס חוזק‑למשקל גבוה", "עמידות קורוזיה טובה"],
      applications: ["תעופה וחלל", "ייצור חשמל"],
    },
    "nickel-iron-alloys": {
      name: "סגסוגות ניקל‑ברזל",
      summary:
        "סגסוגות ניקל‑ברזל בעלות התפשטות מבוקרת ומגנטיות רכה — Invar, Nilo ו‑Mumetal — לצד סופר‑סגסוגות על בסיס ברזל ובהן A286.",
      properties: ["עמידות בחום", "עמידות בקורוזיה", "עמידות בחומצות"],
      applications: ["תעשייה כימית ותעשיית המזון", "חלקי מנועי מטוסים"],
    },
    "magnet-alloys": {
      name: "סגסוגות מגנטיות",
      summary:
        "Alnico וסגסוגות מגנטים קבועים קרובות, על בסיס אלומיניום, ניקל, קובלט וברזל, לביצועים מגנטיים יציבים.",
      properties: ["תכונות מגנטיות"],
      applications: ["מגנטים קבועים"],
    },
    "zirconium-alloys": {
      name: "סגסוגות זירקוניום",
      summary:
        "Zircaloy וסגסוגות זירקוניום קרובות, המוערכות בזכות בליעת נייטרונים נמוכה ועמידות בקורוזיה במתקנים גרעיניים וכימיים.",
      properties: ["עמידות בקורוזיה"],
      applications: ["התעשייה הגרעינית"],
    },
  },



  tungstenForms: {
    "drills-end-mills": {
      name: "מקדחים וכרסומים",
      note: "כלי סיבוב מקרביד מלא, שחוקים או בתום חייהם.",
    },
    "mining-bits": {
      name: "ראשי כרייה",
      note: "ראשי קידוח וחיתוך מצופי קרביד מכרייה ומבנייה.",
    },
    densalloy: {
      name: "Densalloy",
      note: "סגסוגות טונגסטן כבדות מוצקות לנטל, למיגון ולמשקלי נגד.",
    },
    "cc-inserts": { name: "להבי קרביד", note: "להבי חיתוך מתחלפים מקרביד מסונטר." },
    sludge: { name: "בוצה", note: "בוצת השחזה נושאת טונגסטן מייצור כלים." },
    swarf: { name: "שבבים", note: "שבבי עיבוד שבבי הנושאים טונגסטן בר‑השבה." },
    "morgan-rolls": { name: "גלילי Morgan", note: "גלילי קרביד וטבעות גליל ממפעלי מוט ומוטות." },
    "w-crucibles": {
      name: "כורי טונגסטן",
      note: "כורים ורכיבי תנור מטונגסטן ממתקני תהליך בטמפרטורה גבוהה.",
    },
    "swarf-bulk": { name: "שבבים (בתפזורת)", note: "שבבים בתפזורת המתקבלים למיון ולניתוח." },
  },


  articles: {
    "the-essential-role-of-metals-in-modern-industries": {
      title: "תפקידן החיוני של המתכות בתעשייה המודרנית",
      standfirst: "מדוע IMS Metals & Alloys OÜ נמצאת בלב שרשראות האספקה העולמיות של מתכות",
      description: "מדוע IMS Metals & Alloys OÜ נמצאת בלב שרשראות האספקה העולמיות של מתכות",
    },
    "sustainable-metal-recovery-turning-waste-into-value": {
      title: "השבת מתכות בת‑קיימא: הפיכת פסולת לערך",
      standfirst: "כיצד IMS Metals & Alloys OÜ מובילה במיחזור מתכות",
      description: "כיצד IMS Metals & Alloys OÜ מובילה במיחזור מתכות",
    },
    "meeting-industry-standards-with-ims-metals-alloys-ou": {
      title: "עמידה בתקני התעשייה עם IMS Metals & Alloys OÜ",
      standfirst: "כיצד אנו מספקים איכות ועמידה בדרישות בתעשייה העולמית",
      description: "כיצד אנו מספקים איכות ועמידה בדרישות בתעשייה העולמית",
    },
  },
};
