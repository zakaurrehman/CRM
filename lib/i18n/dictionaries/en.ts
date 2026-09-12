/**
 * English — the source dictionary.
 *
 * Every other locale is typed against this object, so a missing or misspelled
 * key is a build error rather than a blank label discovered in production.
 *
 * Values with {braces} take substitutions; keep the placeholder names identical
 * across locales. Word order around them may change freely — that is the point
 * of using named placeholders rather than concatenation.
 */
export const en = {
  language: {
    label: "Language",
    change: "Change language",
    current: "Current language",
  },

  nav: {
    about: "About",
    portfolio: "Portfolio",
    whatWeDo: "What we do",
    insights: "Insights",
    contact: "Contact",
    search: "Search",
    openSearch: "Open search",
    closeSearch: "Close search",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    siteMenu: "Site menu",
    talkToIms: "Talk to IMS",
    tools: "Tools",
    skipToContent: "Skip to content",
    home: "Home",
  },

  common: {
    reset: "Reset",
    clear: "Clear",
    clearAll: "Clear all",
    remove: "Remove",
    save: "Save",
    saved: "Saved",
    close: "Close",
    exportCsv: "Export CSV",
    printPdf: "Print / PDF",
    showMore: "Show {count} more",
    loading: "Loading…",
    grades: "grades",
    grade: "grade",
    category: "category",
    categories: "categories",
    of: "of",
    optional: "optional",
    required: "Required",
    previous: "Previous",
    next: "Next",
    viewComposition: "View composition",
    fullComposition: "Full composition",
    requestQuotation: "Request a quotation",
    browseCategories: "Browse categories",
    openFinder: "Open the alloy finder",
  },

  finder: {
    title: "Alloy finder",
    describe: "Describe what you need",
    hint: "Plain English or symbols — “cobalt free, chromium above 20” and “Cr >= 20 no Co” are read the same way.",
    placeholder: "e.g. high nickel corrosion resistant, cobalt free",
    try: "Try:",
    readingAs: "Reading your query as",
    nameContains: "name contains “{term}”",
    compositionFilters: "Composition filters",
    addElement: "Add element",
    noFilter: "No composition filter set. Add one to bound an element by percentage.",
    element: "Element",
    comparison: "Comparison",
    percentage: "Percentage",
    materialGroup: "Material group",
    filterByGroup: "Filter by material group",
    inCatalogue: "in the catalogue",
    matchYourFilter: "match your filter",
    matchedOn: "Matched on {reasons}",
    loadingCatalogue: "Loading the catalogue…",
    noMatch: "No grade in the catalogue meets every condition.",
    noMatchHint: "Try relaxing one of the filters above, or",
    askUsDirectly: "ask us directly",
    beyondPublished: "— we handle material beyond what is published here.",
    dataError: "The material data could not be loaded. Please reload the page.",
  },

  compare: {
    title: "Comparison",
    region: "Material comparison",
    comparing: "Comparing {count}",
    comparingOf: "Comparing {count} of {max} grades",
    acrossElements: "across {count} elements",
    compareCount: "Compare {count}",
    addToComparison: "Add {name} to comparison",
    removeFromComparison: "Remove {name} from comparison",
    inComparison: "In comparison",
    addToComparisonShort: "Add to comparison",
    full: "Comparison holds {max} grades. Remove one to add another.",
    emptyTitle: "Nothing selected yet",
    emptyBody: "Add up to four grades from any category or from the alloy finder, and their compositions will line up here for comparison.",
    elementColumn: "Element",
    compounds: "Compounds",
    loadingData: "Loading composition data…",
    footnote: "Percentage by weight. “max” is an upper limit rather than a nominal figure, and “Bal.” is the balance of the alloy. A dash means the source table did not specify that element. Rows shaded grey are identical across every grade shown. Confirm the specification against your own requirement before ordering.",
    readyTitle: "Ready to price these?",
    readyBody: "Send the selection straight through as a quotation request — the grades below travel with it, so nobody has to retype a composition.",
  },

  savedList: {
    title: "Saved materials",
    subtitle: "Your shortlist",
    emptyTitle: "No saved materials yet",
    emptyBody: "Save a grade from any composition table or from the alloy finder and it will be kept here, ready to compare or send through as a quotation request.",
    savedInBrowser: "{count} saved in this browser",
    saveName: "Save {name}",
    removeName: "Remove {name} from saved materials",
    localOnly: "Saved materials are stored in this browser only. They are not sent to IMS and will not follow you to another device — export the list or send it as a quotation request to keep it.",
  },

  table: {
    heading: "Chemical composition",
    countLine: "{count} grades · percentage by weight",
    gradeColumn: "Grade",
    filterGrades: "Filter grades",
    filterLabel: "Filter {category} grades by name",
    view: "Composition view",
    viewTable: "Table",
    viewCards: "Cards",
    noGradeMatch: "No grade matches “{query}”.",
    clearFilter: "Clear filter",
    shownCount: "{shown} of {total} grades shown",
    notSpecified: "not specified",
    selectHint: "Select grades to compare them side by side, or save them to a shortlist.",
    scrollHint: "Scroll the table sideways to see all elements, or switch to cards above.",
    disclaimer: "Values are reproduced from IMS technical data and are provided for identification purposes; confirm the specification against your own requirement before ordering.",
  },

  rfq: {
    title: "Quotation request",
    materialsToQuote: "Materials to quote",
    addFrom: "Add from",
    line: "Line {number}",
    materialOrGrade: "Material or grade",
    materialPlaceholder: "e.g. Inconel 718, or describe the stream",
    fromCatalogue: "From the catalogue",
    quantity: "Quantity",
    quantityPlaceholder: "e.g. 500",
    unit: "Unit",
    condition: "Condition",
    specNotes: "Specification notes",
    specPlaceholder: "Form, size, certification, delivery point",
    addAnother: "Add another material",
    maxLines: "That is the maximum of {max} lines. Put anything further in the notes below.",
    yourDetails: "Your details",
    name: "Name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    country: "Country",
    timescale: "Timescale",
    select: "Select…",
    direction: "Which way round is this?",
    anythingElse: "Anything else",
    anythingElsePlaceholder: "Packaging, delivery terms, certification requirements, recurring volumes",
    submit: "Request quotation for {count}",
    submitting: "Sending…",
    privacy: "Required. We use your details only to respond to this request.",
    sentTitle: "Quotation request received",
    sentBody: "Thank you — your request is with our team, with all {count} lines attached. We will come back to you with pricing and availability.",
    startAnother: "Start another request",
    emailInstead: "Send it by email instead — your details are already filled in",
  },

  inquiry: {
    yourDetails: "Your details",
    requirement: "What do you need?",
    industry: "Industry",
    material: "Material / alloy",
    quantity: "Quantity",
    message: "Your message",
    submit: "Send inquiry",
    submitting: "Sending…",
    sentTitle: "Inquiry received",
    sentBody: "Thank you — your inquiry is with our team. We will come back to you with a route for your material.",
    sendAnother: "Send another inquiry",
    privacy: "Required. We use your details only to respond to this inquiry.",
  },

  errors: {
    formHasErrors: "The form has errors. Please review the fields.",
    generic: "Something went wrong. Please try again.",
    network: "We could not reach the server. Please check your connection and try again.",
    nameRequired: "Please enter your name.",
    companyRequired: "Please enter your company.",
    emailRequired: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
    directionRequired: "Please tell us which way round this is.",
    materialRequired: "Name the material or grade.",
    messageRequired: "Please tell us about your requirement.",
    tooLong: "Please keep this under {max} characters.",
    tooManyRequests: "Too many submissions. Please try again shortly.",
    notConnected: "The quotation form is not connected yet. Please email us directly and we will pick it up straight away.",
  },

  footer: {
    headOffice: "Head office",
    company: "Company",
    materials: "Materials",
    recycling: "Recycling",
    industries: "Industries",
    rights: "All rights reserved.",
    onLinkedIn: "IMS on LinkedIn",
  },

  notice: {
    /* Shown once, under the switcher, so a reader is not left wondering why the
       composition tables and articles are still in English. */
    uiOnly: "The interface is translated. Alloy designations, element symbols and composition data are international notation and stay unchanged; technical descriptions remain in English.",
  },
} as const;

/**
 * Every namespace and key of `en`, with plain `string` values.
 *
 * `as const` above gives literal types, which a translation could never satisfy;
 * widening the leaves keeps the *shape* enforced while letting the words differ.
 * A locale missing a key, or inventing one, fails the build.
 */
export type Dictionary = {
  [Namespace in keyof typeof en]: {
    [Key in keyof (typeof en)[Namespace]]: string;
  };
};
