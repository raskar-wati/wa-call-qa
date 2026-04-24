const overviewByRange = {
  30:  { total: "412",   score: "82.6", note: "+1.2 pts vs previous period", atRisk: "2" },
  90:  { total: "1,104", score: "81.3", note: "+1.8 pts vs previous period", atRisk: "3" },
  180: { total: "2,077", score: "80.4", note: "+2.1 pts vs previous period", atRisk: "3" },
  365: { total: "3,284", score: "78.9", note: "+0.6 pts vs previous period", atRisk: "5" },
};

const scorecardData = {
  apac: {
    name: "Sales Outbound -- APAC", status: "active",
    stats: [
      { label: "Calls Graded", value: "842", note: "Last 6 months" },
      { label: "Avg Score", value: "83", suffix: "%", note: "+2.1 pts vs prev period" },
      { label: "Pass Rate", value: "76", suffix: "%", note: "Score ≥ 70%" },
      { label: "Critical Fails", value: "14", note: "Compliance questions", warn: true },
    ],
    questions: [
      { text: "Did the agent introduce themselves by name and company within the first 15 seconds?", tags: "Binary · AI Test", pts: "5 pts" },
      { text: "Did the agent ask at least one open-ended discovery question?", tags: "Binary · AI Test", pts: "5 pts" },
      { text: "Did the agent tailor the pitch to the customer's stated use case?", tags: "Likert · AI Test", pts: "10 pts" },
      { text: "Did the agent present at least two concrete outcomes (ROI, time saved)?", tags: "Binary · AI Test", pts: "5 pts" },
      { text: "Did the agent obtain verbal consent before sharing pricing?", tags: "Binary · Hybrid · Critical", pts: "10 pts" },
    ],
    calls: [
      { agent: "Priya Shah",    date: "Apr 22, 2026", score: "82%", pill: "high" },
      { agent: "Carlos Mendes", date: "Apr 21, 2026", score: "77%", pill: "mid"  },
      { agent: "Noor Ahmed",    date: "Apr 20, 2026", score: "66%", pill: "low"  },
      { agent: "Ana Rossi",     date: "Apr 19, 2026", score: "71%", pill: "mid"  },
      { agent: "Tom O'Brien",   date: "Apr 18, 2026", score: "75%", pill: "mid"  },
    ],
  },
  emea: {
    name: "Sales Outbound -- EMEA", status: "active",
    stats: [
      { label: "Calls Graded", value: "915", note: "Last 6 months" },
      { label: "Avg Score", value: "79", suffix: "%", note: "+1.4 pts vs prev period" },
      { label: "Pass Rate", value: "71", suffix: "%", note: "Score ≥ 70%" },
      { label: "Critical Fails", value: "22", note: "Compliance questions", warn: true },
    ],
    questions: [
      { text: "Did the agent introduce themselves by name and company within the first 15 seconds?", tags: "Binary · AI Test", pts: "5 pts" },
      { text: "Did the agent confirm the purpose of the call during the first minute?", tags: "Binary · LLM Eval", pts: "5 pts" },
      { text: "Did the agent show empathy toward the customer's issue?", tags: "Binary · AI Test", pts: "5 pts" },
      { text: "Did the agent state the recording disclosure at the start?", tags: "Binary · Keyword · Critical", pts: "10 pts" },
      { text: "Did the agent summarise next steps before ending the call?", tags: "Binary · AI Test", pts: "5 pts" },
    ],
    calls: [
      { agent: "Tom O'Brien",  date: "Apr 22, 2026", score: "75%", pill: "mid"  },
      { agent: "Sara Kim",     date: "Apr 21, 2026", score: "88%", pill: "high" },
      { agent: "Luca Ferrari", date: "Apr 20, 2026", score: "63%", pill: "low"  },
      { agent: "Amara Diallo", date: "Apr 19, 2026", score: "80%", pill: "high" },
      { agent: "Jakob Müller", date: "Apr 18, 2026", score: "72%", pill: "mid"  },
    ],
  },
  na: {
    name: "Sales Inbound -- North America", status: "inactive",
    stats: [
      { label: "Calls Graded", value: "320", note: "All time" },
      { label: "Avg Score", value: "74", suffix: "%", note: "Last active period" },
      { label: "Pass Rate", value: "68", suffix: "%", note: "Score ≥ 70%" },
      { label: "Critical Fails", value: "9", note: "Compliance questions", warn: true },
    ],
    questions: [
      { text: "Did the agent greet the customer and verify their identity within 30 seconds?", tags: "Binary · Keyword", pts: "5 pts" },
      { text: "Did the agent ask at least one open-ended question to understand the customer's need?", tags: "Binary · AI Test", pts: "5 pts" },
      { text: "Did the agent offer a relevant solution within the first 3 minutes?", tags: "Likert · AI Test", pts: "10 pts" },
      { text: "Did the agent obtain verbal consent before sharing pricing?", tags: "Binary · Hybrid · Critical", pts: "10 pts" },
    ],
    calls: [
      { agent: "James Carter", date: "Jan 15, 2026", score: "78%", pill: "mid"  },
      { agent: "Maria Lopez",  date: "Jan 14, 2026", score: "65%", pill: "low"  },
      { agent: "Derek Wu",     date: "Jan 13, 2026", score: "82%", pill: "high" },
    ],
  },
  latam: {
    name: "Support Outbound -- Latin America", status: "draft",
    stats: [
      { label: "Calls Graded", value: "0",  note: "Not yet active" },
      { label: "Avg Score",    value: "--", note: "No data yet" },
      { label: "Pass Rate",    value: "--", note: "No data yet" },
      { label: "Questions",    value: "4",  note: "Draft questions added" },
    ],
    questions: [
      { text: "Did the agent introduce themselves and state the reason for the call?", tags: "Binary · AI Test", pts: "5 pts" },
      { text: "Did the agent confirm the customer's preferred language?", tags: "Binary · Keyword", pts: "5 pts" },
      { text: "Did the agent resolve the issue or set clear follow-up expectations?", tags: "Likert · AI Test", pts: "10 pts" },
      { text: "Did the agent close with a satisfaction check?", tags: "Binary · AI Test", pts: "5 pts" },
    ],
    calls: [],
  },
};

const testRuns = {
  priya: {
    score: 45, total: 70,
    results: [
      ["pass", "Did the agent introduce themselves by name and company within the first 15 seconds?", "5/5", "Agent opened with a clear intro from CloudPeak.", '"Hi, this is Priya from CloudPeak calling about your request."'],
      ["pass", "Did the agent ask at least one open-ended question to understand the customer's need?", "5/5", "Agent asked an open discovery question at 00:42.", '"Tell me a bit about how your team currently handles billing queries?"'],
      ["fail", "Did the agent tailor the pitch to the customer's stated use case?", "0/10", "The pitch stayed generic and did not connect back to the billing workflow.", '"Our platform helps teams respond faster across channels."'],
    ],
  },
  marco: {
    score: 58, total: 70,
    results: [
      ["pass", "Did the agent introduce themselves by name and company within the first 15 seconds?", "5/5", "Agent introduced himself and company immediately.", '"This is Marco from Wati, following up on your demo request."'],
      ["pass", "Did the agent tailor the pitch to the customer's stated use case?", "8/10", "The pitch connected automation to the prospect's support queue.", '"For your support team, the biggest lift is routing repeated questions automatically."'],
      ["pass", "Did the agent obtain verbal consent before sharing pricing?", "10/10", "Consent was captured before pricing details.", '"Would it be okay if I share the pricing bands now?"'],
    ],
  },
  nina: {
    score: 32, total: 70,
    results: [
      ["pass", "Did the agent confirm the purpose of the call during the first minute?", "5/5", "Purpose was confirmed at 00:18.", '"I am calling to understand if WhatsApp automation is still a priority."'],
      ["fail", "Did the agent ask at least one open-ended question to understand the customer's need?", "0/5", "The call used mostly closed questions.", '"Do you need more agents? Is pricing okay?"'],
      ["fail", "Did the agent state the recording disclosure at the start?", "0/10", "No disclosure was found in the first two minutes.", '"Let me quickly show you what the tool can do."'],
    ],
  },
  paste: {
    score: 51, total: 70,
    results: [
      ["pass", "Did the agent introduce themselves by name and company within the first 15 seconds?", "5/5", "The pasted transcript includes an opening introduction.", '"Hi, this is the Wati team calling about your inquiry."'],
      ["pass", "Did the agent present at least two concrete outcomes (ROI, time saved, revenue lift)?", "5/5", "Two outcomes were mentioned: faster first response and lower manual routing.", '"Teams usually see faster replies and fewer manual assignments."'],
      ["fail", "Did the agent obtain verbal consent before sharing pricing?", "0/10", "Pricing was shared without explicit consent.", '"The starter plan begins at this price point."'],
    ],
  },
};

const templates = {
  sales: [
    { section: "Opening & Discovery", questions: [
      { text: "Did the agent introduce themselves by name and company within the first 15 seconds?", tags: ["Binary", "5 pts"] },
      { text: "Did the agent ask at least one open-ended question to understand the customer's need?", tags: ["Binary", "5 pts"] },
    ]},
    { section: "Product & Value", questions: [
      { text: "Did the agent tailor the pitch to the customer's stated use case?", tags: ["Likert", "10 pts"] },
      { text: "Did the agent present at least two concrete outcomes (ROI, time saved, revenue lift)?", tags: ["Binary", "5 pts"] },
    ]},
    { section: "Compliance", questions: [
      { text: "Did the agent obtain verbal consent before sharing pricing?", tags: ["Binary", "10 pts", "Critical"] },
      { text: "Did the agent state the recording disclosure at the start of the call?", tags: ["Binary", "10 pts", "Critical"] },
    ]},
  ],
  support: [
    { section: "Opening", questions: [
      { text: "Did the agent greet the customer and verify their identity within 30 seconds?", tags: ["Binary", "5 pts"] },
      { text: "Did the agent confirm the purpose of the call?", tags: ["Binary", "5 pts"] },
    ]},
    { section: "Resolution", questions: [
      { text: "Did the agent offer a relevant solution within the first 3 minutes?", tags: ["Likert", "10 pts"] },
      { text: "Did the agent confirm the issue was resolved before closing?", tags: ["Binary", "5 pts"] },
    ]},
    { section: "Empathy & Tone", questions: [
      { text: "Did the agent acknowledge the customer's frustration with empathy?", tags: ["Likert", "10 pts"] },
      { text: "Did the agent avoid placing the customer on hold more than once without explanation?", tags: ["Binary", "5 pts"] },
    ]},
    { section: "Compliance", questions: [
      { text: "Did the agent state the recording disclosure at the start of the call?", tags: ["Binary", "10 pts", "Critical"] },
    ]},
  ],
  product: [
    { section: "Discovery", questions: [
      { text: "Did the agent ask about the customer's current workflow before presenting features?", tags: ["Binary", "5 pts"] },
      { text: "Did the agent identify the customer's primary pain point?", tags: ["Likert", "10 pts"] },
    ]},
    { section: "Product Knowledge", questions: [
      { text: "Did the agent accurately describe the product feature being discussed?", tags: ["Binary", "10 pts"] },
      { text: "Did the agent connect at least one feature to the customer's stated need?", tags: ["Binary", "5 pts"] },
    ]},
    { section: "Next Steps", questions: [
      { text: "Did the agent propose a clear next step (demo, trial, follow-up)?", tags: ["Binary", "5 pts"] },
      { text: "Did the agent confirm the customer's availability before closing?", tags: ["Binary", "5 pts"] },
    ]},
  ],
};
