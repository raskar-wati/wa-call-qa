// ── DOM refs ──
const content          = document.querySelector(".content");
const openBuilder      = document.querySelector("[data-open-builder]");
const closeBuilder     = document.querySelector("[data-close-builder]");
const qaTabs           = document.querySelectorAll("[data-qa-tab]");
const qaPanels         = document.querySelectorAll("[data-qa-panel]");
const createCards      = document.querySelectorAll("[data-create-card]");
const stepItems        = document.querySelectorAll("[data-step]");
const panels           = document.querySelectorAll("[data-builder-panel]");
const selectAllTeams   = document.querySelector("[data-select-all-teams]");
const builderHelp      = document.querySelector("[data-builder-help]");
const testPanel        = document.querySelector("[data-test-panel]");
const directionButtons = document.querySelectorAll(".segmented-control button");
const teamSearch       = document.querySelector(".team-search input");
const sectionList      = document.querySelector("[data-section-list]");
const addSectionButton = document.querySelector("[data-add-section]");
const testTabs         = document.querySelectorAll("[data-test-tab]");
const recentCallControls = document.querySelector("[data-recent-call-controls]");
const pasteCallControls  = document.querySelector("[data-paste-call-controls]");
const callSelect       = document.querySelector("[data-call-select]");
const runButtons       = document.querySelectorAll("[data-run-test], [data-run-paste]");
const exportJsonButton = document.querySelector("[data-export-json]");
const testScore        = document.querySelector("[data-test-score]");
const testPercent      = document.querySelector("[data-test-percent]");
const resultList       = document.querySelector("[data-result-list]");
const resizeHandles    = document.querySelectorAll("[data-resize-panel]");
const templateSelect   = document.querySelector("[data-template-select]");
const templateQuestions= document.querySelector("[data-template-questions]");
const scorecardDetail  = document.querySelector("[data-scorecard-detail]");
const scorecardPanel   = document.querySelector("[data-qa-panel='scorecards']");
const closeScorecard   = document.querySelector("[data-close-scorecard]");
const detailName       = document.querySelector("[data-detail-name]");
const detailStatus     = document.querySelector("[data-detail-status]");
const detailStats      = document.querySelector("[data-detail-stats]");
const detailQuestions  = document.querySelector("[data-detail-questions]");
const detailCalls      = document.querySelector("[data-detail-calls]");
const overviewRange    = document.querySelector("[data-overview-range]");
const ovTotal          = document.querySelector("[data-ov-total]");
const ovScore          = document.querySelector("[data-ov-score]");
const ovScoreNote      = document.querySelector("[data-ov-score-note]");
const ovAtRisk         = document.querySelector("[data-ov-atrisk]");

// ── Builder step constants ──
const STEP_ORDER  = ["create", "configure", "build", "preview"];
const STEP_LABELS = { create: "Create", configure: "Configure", build: "Build", preview: "Preview & Test" };

// ── Inject back/next nav into each builder panel ──
panels.forEach((panel) => {
  const nav = document.createElement("nav");
  nav.className = "builder-nav";
  nav.setAttribute("aria-label", "Builder step navigation");
  nav.innerHTML = `
    <button type="button" class="nav-button nav-back" data-builder-nav="back">
      <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
      <span data-nav-back-label>Back</span>
    </button>
    <button type="button" class="nav-button nav-next" data-builder-nav="next">
      <span data-nav-next-label>Next</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </button>
  `;
  panel.appendChild(nav);
});

document.querySelectorAll("[data-builder-nav]").forEach((button) => {
  button.addEventListener("click", () => {
    const currentStep  = document.querySelector(".builder-panel.active")?.dataset.builderPanel;
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex === -1) return;
    const delta     = button.dataset.builderNav === "next" ? 1 : -1;
    const nextIndex = currentIndex + delta;
    if (nextIndex < 0 || nextIndex >= STEP_ORDER.length) return;
    setBuilderStep(STEP_ORDER[nextIndex]);
  });
});

// ── Builder view ──
let activeTabBeforeBuilder = "scorecards";

function setBuilderView(isOpen) {
  if (isOpen) {
    const currentTab = document.querySelector("[data-qa-tab].current");
    if (currentTab) activeTabBeforeBuilder = currentTab.dataset.qaTab;
    document.querySelectorAll(".list-view, .tabs, .scorecard-panel").forEach(n => n.hidden = true);
  } else {
    document.querySelector(".tabs").hidden = false;
    document.querySelector(".page-header").hidden = false;
    qaPanels.forEach(p => p.hidden = p.dataset.qaPanel !== activeTabBeforeBuilder);
    qaTabs.forEach(t => t.classList.toggle("current", t.dataset.qaTab === activeTabBeforeBuilder));
  }
  document.querySelector(".builder-view").hidden = !isOpen;
  content.classList.toggle("is-building", isOpen);
  if (isOpen) setBuilderStep("create");
}

function setBuilderStep(target) {
  stepItems.forEach(item => item.classList.toggle("active", item.dataset.step === target));
  panels.forEach(panel => {
    panel.hidden = panel.dataset.builderPanel !== target;
    panel.classList.toggle("active", panel.dataset.builderPanel === target);
  });
  builderHelp.hidden = !["configure", "build"].includes(target);
  testPanel.hidden   = target !== "preview";

  const currentIndex = STEP_ORDER.indexOf(target);
  const isFirst = currentIndex <= 0;
  const isLast  = currentIndex >= STEP_ORDER.length - 1;
  document.querySelectorAll(".builder-nav").forEach(nav => {
    const backBtn = nav.querySelector('[data-builder-nav="back"]');
    const nextBtn = nav.querySelector('[data-builder-nav="next"]');
    backBtn.disabled = isFirst;
    nextBtn.disabled = isLast;
    nav.querySelector("[data-nav-back-label]").textContent = isFirst ? "Back" : STEP_LABELS[STEP_ORDER[currentIndex - 1]];
    nav.querySelector("[data-nav-next-label]").textContent = isLast  ? "Finish" : STEP_LABELS[STEP_ORDER[currentIndex + 1]];
  });
}

openBuilder.addEventListener("click", () => setBuilderView(true));
closeBuilder.addEventListener("click", () => setBuilderView(false));

// ── QA tabs ──
qaTabs.forEach(tab => {
  tab.addEventListener("click", e => {
    e.preventDefault();
    const target = tab.dataset.qaTab;
    if (!document.querySelector(`[data-qa-panel="${target}"]`)) return;
    qaTabs.forEach(t => t.classList.toggle("current", t === tab));
    qaPanels.forEach(p => p.hidden = p.dataset.qaPanel !== target);
  });
});

// ── Overview date range ──
if (overviewRange) {
  overviewRange.addEventListener("change", () => {
    const d = overviewByRange[overviewRange.value];
    if (ovTotal)     ovTotal.textContent = d.total;
    if (ovScore)     ovScore.innerHTML   = `${d.score}<small>%</small>`;
    if (ovScoreNote) ovScoreNote.textContent = d.note;
    if (ovAtRisk)    ovAtRisk.textContent = d.atRisk;
  });
}

// ── Builder step sidebar clicks ──
stepItems.forEach(step => {
  step.querySelector("button").addEventListener("click", () => {
    const target = step.dataset.step;
    if (!document.querySelector(`[data-builder-panel="${target}"]`)) return;
    setBuilderStep(target);
  });
});

// ── Create card toggles ──
createCards.forEach(card => {
  const toggle = card.querySelector(".card-toggle");
  toggle.addEventListener("click", () => {
    const shouldExpand = !card.classList.contains("expanded");
    createCards.forEach(item => {
      item.classList.remove("expanded");
      item.querySelector(".card-toggle").setAttribute("aria-expanded", "false");
    });
    if (shouldExpand) {
      card.classList.add("expanded");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
});

// ── Configure: select all teams / direction / team search ──
selectAllTeams.addEventListener("click", () => {
  document.querySelectorAll(".team-row input").forEach(cb => cb.checked = true);
});

directionButtons.forEach(button => {
  button.addEventListener("click", () => {
    directionButtons.forEach(b => b.classList.toggle("selected", b === button));
  });
});

teamSearch.addEventListener("input", () => {
  const query = teamSearch.value.trim().toLowerCase();
  document.querySelectorAll(".team-row").forEach(row => {
    row.hidden = !row.textContent.toLowerCase().includes(query);
  });
});

// ── Question editor ──
function questionBodyTemplate(index) {
  return `
    <div class="editor-card-body">
      <fieldset class="choice-group">
        <legend>Answer type</legend>
        <label><input type="radio" name="answer-type-${index}" value="Binary" checked />Binary</label>
        <label><input type="radio" name="answer-type-${index}" value="Likert" />Likert</label>
      </fieldset>
      <fieldset class="choice-group">
        <legend>Matching method</legend>
        <label><input type="radio" name="matching-method-${index}" value="AI Test" checked />AI Test</label>
        <label><input type="radio" name="matching-method-${index}" value="Keyword Match" />Keyword Match</label>
        <label><input type="radio" name="matching-method-${index}" value="Hybrid" />Hybrid</label>
      </fieldset>
      <label class="field answer-definition">
        <span>Answer definitions</span>
        <textarea data-definition-input placeholder='e.g. "Agent stated their first name and company name within the first 15 seconds."'></textarea>
      </label>
      <div class="definition-helper">
        <p>Yes - what observable behavior qualifies as Yes?</p>
        <p>No - implicit if the Yes criteria are not met, the answer is No.</p>
        <button class="refine-button" type="button" data-refine-answer>+ Refine with AI</button>
      </div>
      <div class="score-assignment">
        <p>Score assignment</p>
        <label>Yes <input type="number" value="5" min="0" data-score-yes /> pts</label>
        <label>No  <input type="number" value="0" min="0" data-score-no  /> pts</label>
      </div>
    </div>
  `;
}

function allQuestionCards() {
  return sectionList.querySelectorAll("[data-question-card]");
}

function ensureQuestionBody(card) {
  if (card.querySelector(".editor-card-body")) return;
  const index = [...allQuestionCards()].indexOf(card) + 1;
  card.querySelector(".editor-card-header").insertAdjacentHTML("afterend", questionBodyTemplate(index));
  bindQuestionInputs(card);
}

function updateQuestionSummary(card) {
  const type   = card.querySelector('input[name^="answer-type"]:checked')?.value    || card.querySelector("[data-summary-type]")?.textContent   || "Binary";
  const method = card.querySelector('input[name^="matching-method"]:checked')?.value || card.querySelector("[data-summary-method]")?.textContent || "AI Test";
  const points = card.querySelector("[data-score-yes]")?.value                       || card.querySelector("[data-summary-points]")?.textContent  || "5";
  card.querySelector("[data-summary-type]").textContent   = type;
  card.querySelector("[data-summary-method]").textContent = method;
  card.querySelector("[data-summary-points]").textContent = points || "0";
}

function renumberQuestions() {
  allQuestionCards().forEach((card, index) => {
    card.querySelector(".question-number").textContent = index + 1;
    card.querySelectorAll('input[type="radio"]').forEach(input => {
      if (input.name.startsWith("answer-type"))     input.name = `answer-type-${index + 1}`;
      if (input.name.startsWith("matching-method")) input.name = `matching-method-${index + 1}`;
    });
  });
}

function expandQuestion(card) {
  ensureQuestionBody(card);
  allQuestionCards().forEach(item => {
    const isTarget = item === card;
    item.classList.toggle("expanded", isTarget);
    item.querySelector(".question-toggle").setAttribute("aria-expanded", String(isTarget));
    if (!isTarget) updateQuestionSummary(item);
  });
}

function bindQuestionInputs(card) {
  card.querySelectorAll('input[type="radio"], [data-score-yes], [data-score-no]').forEach(input => {
    input.addEventListener("input",  () => updateQuestionSummary(card));
    input.addEventListener("change", () => updateQuestionSummary(card));
  });
  card.querySelector("[data-refine-answer]")?.addEventListener("click", () => {
    const definition = card.querySelector("[data-definition-input]");
    const title      = card.querySelector("[data-question-title]").textContent.trim();
    definition.value = `Pass when the transcript clearly shows: ${title.replace(/\?$/, "").toLowerCase()}.`;
  });
}

function bindQuestionCard(card) {
  card.querySelector(".question-toggle").addEventListener("click", () => expandQuestion(card));
  card.querySelector(".delete-question").addEventListener("click", () => {
    if (allQuestionCards().length === 1) return;
    const wasExpanded = card.classList.contains("expanded");
    card.remove();
    renumberQuestions();
    if (wasExpanded) {
      const first = allQuestionCards()[0];
      if (first) expandQuestion(first);
    }
  });
  bindQuestionInputs(card);
}

// ── Question card factory ──
function makeQuestionCard() {
  const next    = allQuestionCards().length + 1;
  const article = document.createElement("article");
  article.className        = "editor-card";
  article.dataset.questionCard = "";
  article.innerHTML = `
    <header class="editor-card-header">
      <button class="question-toggle" type="button" aria-expanded="false">
        <span class="question-number">${next}</span>
        <span class="question-title" data-question-title>New quality check question?</span>
      </button>
      <button class="delete-question" type="button" aria-label="Delete question">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
      </button>
    </header>
    <footer class="editor-card-summary">
      <span data-summary-type>Binary</span>
      <span data-summary-method>AI Test</span>
      <span><strong data-summary-points>5</strong> pts</span>
    </footer>
  `;
  return article;
}

// ── Section binding ──
function bindSection(sectionEl) {
  const addQuestionBtn = sectionEl.querySelector("[data-add-question]");
  const deleteBtn      = sectionEl.querySelector(".delete-section");
  const questionBody   = sectionEl.querySelector("[data-question-list]");

  addQuestionBtn.addEventListener("click", () => {
    const article = makeQuestionCard();
    questionBody.append(article);
    bindQuestionCard(article);
    expandQuestion(article);
  });

  deleteBtn.addEventListener("click", () => {
    if (sectionList.querySelectorAll("[data-question-section]").length === 1) return;
    sectionEl.remove();
    renumberQuestions();
  });
}

// ── Add section button ──
addSectionButton.addEventListener("click", () => {
  const sectionEl = document.createElement("div");
  sectionEl.className = "question-section";
  sectionEl.dataset.questionSection = "";
  sectionEl.innerHTML = `
    <div class="question-section-header">
      <input class="section-name-input" type="text" value="New Section" data-section-name aria-label="Section name" />
      <button class="delete-section" type="button" aria-label="Delete section">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
      </button>
    </div>
    <div class="question-section-body" data-question-list></div>
    <button class="add-question-btn" type="button" data-add-question>+ Add question</button>
  `;
  sectionList.append(sectionEl);
  bindSection(sectionEl);
  sectionEl.querySelector("[data-section-name]").select();
});

// ── Initial bind ──
document.querySelectorAll("[data-question-section]").forEach(bindSection);
document.querySelectorAll("[data-question-card]").forEach(bindQuestionCard);

// ── Template selector ──
function renderTemplate(key) {
  templateQuestions.innerHTML = templates[key].map(s => `
    <section class="question-group">
      <h4>${s.section}</h4>
      <ul>
        ${s.questions.map(q => `
          <li>
            <span class="checkmark" aria-hidden="true">✓</span>
            <div>
              <p>${q.text}</p>
              <div class="question-tags">
                ${q.tags.map(t => `<span${t === "Critical" ? ' class="critical"' : ""}>${t}</span>`).join("")}
              </div>
            </div>
          </li>
        `).join("")}
      </ul>
    </section>
  `).join("");
}

renderTemplate("sales");
templateSelect.addEventListener("change", () => renderTemplate(templateSelect.value));

// ── Test runner ──
function renderTestResults(run) {
  testScore.textContent   = run.score;
  testPercent.textContent = Math.round((run.score / run.total) * 100);
  resultList.innerHTML    = run.results.map(([state, title, score, note, quote]) => `
    <article class="result-item ${state}">
      <span>${state === "pass" ? "✓" : "!"}</span>
      <div>
        <header><strong>${title}</strong><b>${score}</b></header>
        <p>${note}</p>
        <blockquote>${quote}</blockquote>
      </div>
    </article>
  `).join("");
}

testTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    testTabs.forEach(t => t.classList.toggle("active", t === tab));
    const isPaste = tab.dataset.testTab === "paste";
    recentCallControls.hidden = isPaste;
    pasteCallControls.hidden  = !isPaste;
  });
});

runButtons.forEach(button => {
  button.addEventListener("click", () => {
    const activeTab = document.querySelector("[data-test-tab].active").dataset.testTab;
    renderTestResults(testRuns[activeTab === "paste" ? "paste" : callSelect.value]);
  });
});

exportJsonButton.addEventListener("click", () => {
  const payload = {
    scorecard: "Sales Team -- Q2 2026",
    version: "v1",
    questions: [...document.querySelectorAll(".rubric-row p")].map(item => item.textContent),
    latestTest: { score: Number(testScore.textContent), percent: Number(testPercent.textContent) },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "scorecard-preview.json"; link.click();
  URL.revokeObjectURL(url);
});

// ── Resize handles ──
function cssPx(name) {
  return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
}

resizeHandles.forEach(handle => {
  handle.addEventListener("pointerdown", event => {
    if (window.matchMedia("(max-width: 900px)").matches) return;
    const side    = handle.dataset.resizePanel;
    const startX  = event.clientX;
    const styles  = getComputedStyle(document.documentElement);
    const current = Number.parseFloat(styles.getPropertyValue(side === "left" ? "--builder-left-width" : "--builder-right-width"));
    const min     = cssPx(side === "left" ? "--builder-left-min"  : "--builder-right-min");
    const max     = cssPx(side === "left" ? "--builder-left-max"  : "--builder-right-max");

    handle.setPointerCapture(event.pointerId);
    handle.classList.add("is-dragging");
    document.body.classList.add("is-resizing");

    const onMove = e => {
      const next    = side === "left" ? current + (e.clientX - startX) : current - (e.clientX - startX);
      const clamped = Math.min(max, Math.max(min, next));
      document.documentElement.style.setProperty(side === "left" ? "--builder-left-width" : "--builder-right-width", `${clamped}px`);
    };
    const onUp = e => {
      handle.releasePointerCapture(e.pointerId);
      handle.classList.remove("is-dragging");
      document.body.classList.remove("is-resizing");
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup",   onUp);
      handle.removeEventListener("pointercancel", onUp);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup",   onUp);
    handle.addEventListener("pointercancel", onUp);
  });

  handle.addEventListener("dblclick", () => {
    const side = handle.dataset.resizePanel;
    document.documentElement.style.setProperty(side === "left" ? "--builder-left-width" : "--builder-right-width", "260px");
  });
});

// ── Scorecard detail ──
function openScorecard(key) {
  const data = scorecardData[key];
  if (!data) return;

  detailName.textContent  = data.name;
  detailStatus.className  = `status ${data.status}`;
  detailStatus.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);

  detailStats.innerHTML = data.stats.map(s => `
    <div class="detail-stat-card${s.warn ? " warn" : ""}">
      <span>${s.label}</span>
      <strong>${s.value}${s.suffix ? `<small>${s.suffix}</small>` : ""}</strong>
      <p>${s.note}</p>
    </div>
  `).join("");

  detailQuestions.innerHTML = data.questions.map(q => `
    <div class="question-item">
      <div>
        <p>${q.text}</p>
        <div class="question-tags">${q.tags.split(" · ").map(t => `<span${t === "Critical" ? ' class="critical"' : ""}>${t}</span>`).join("")}</div>
      </div>
      <strong>${q.pts}</strong>
    </div>
  `).join("");

  detailCalls.innerHTML = data.calls.length
    ? data.calls.map(c => `
        <div class="call-item">
          <div><p>${c.agent}</p><small>${c.date}</small></div>
          <strong class="score-pill ${c.pill}">${c.score}</strong>
        </div>
      `).join("")
    : `<p style="padding:16px;color:#68716c;font-size:12px;">No calls graded yet.</p>`;

  document.querySelector(".page-header").hidden   = true;
  document.querySelector(".tabs").hidden          = true;
  document.querySelector(".overview-panel").hidden= true;
  document.querySelector(".builder-view").hidden  = true;
  scorecardPanel.hidden  = true;
  scorecardDetail.hidden = false;
}

document.querySelectorAll("[data-open-scorecard]").forEach(row => {
  row.addEventListener("click",   () => openScorecard(row.dataset.openScorecard));
  row.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openScorecard(row.dataset.openScorecard); });
});

closeScorecard.addEventListener("click", () => {
  scorecardDetail.hidden = true;
  scorecardPanel.hidden  = false;
  document.querySelector(".page-header").hidden = false;
  document.querySelector(".tabs").hidden        = false;
});
