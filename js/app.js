// Small slide engine: 1600x900 stage scaled to the screen, GSAP for every transition.
const STAGE_W = 1600;
const STAGE_H = 900;
const stage = document.getElementById("stage");
const slides = [...document.querySelectorAll(".slide")];
let current = -1;
let step = 0;
let busy = false;

function fitStage() {
  const s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}
window.addEventListener("resize", fitStage);
fitStage();

// Wrap every word of .split elements so each one can rise out of a mask.
document.querySelectorAll(".split").forEach((el) => {
  el.innerHTML = el.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="w"><span>${w}</span></span>`)
    .join(" ");
});

function maxSteps(slide) {
  if (slide.dataset.kind === "timeline") return TIMELINE.length - 1;
  const steps = [...slide.querySelectorAll("[data-step]")].map((e) => Number(e.dataset.step));
  return steps.length ? Math.max(...steps) : 0;
}

function runCounters(scope) {
  scope.querySelectorAll("[data-count]").forEach((el) => {
    const obj = { v: 0 };
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: "power3.out",
      onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString("en-US") + suffix),
    });
  });
}

function revealSteps(slide, upTo, instant) {
  slide.querySelectorAll("[data-step]").forEach((el) => {
    const show = Number(el.dataset.step) <= upTo;
    if (show && !el.classList.contains("shown")) {
      el.classList.add("shown");
      gsap.fromTo(el, { autoAlpha: 0, y: 50, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: instant ? 0 : 0.8, ease: "power3.out" });
      runCounters(el);
    } else if (!show) {
      el.classList.remove("shown");
      gsap.set(el, { autoAlpha: 0 });
    }
  });
  if (slide.dataset.kind === "timeline") setYear(upTo);
}

function animateIn(slide) {
  const img = slide.querySelector(":scope > .bg img");
  if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1.05, duration: 14, ease: "power1.out" });
  gsap.fromTo(slide.querySelectorAll(".w > span"), { yPercent: 110 },
    { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.06, delay: 0.25 });
  gsap.fromTo(slide.querySelectorAll("[data-a]"), { autoAlpha: 0, y: 40 },
    { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.45 });
  runCounters(slide.querySelector(".content") || slide);
}

function go(index, startStep = 0) {
  if (busy || index < 0 || index >= slides.length || index === current) return;
  const dir = index > current ? 1 : -1;
  const prev = slides[current];
  const next = slides[index];
  busy = true;

  if (prev) {
    gsap.to(prev,{ autoAlpha: 0, scale: 0.94, duration: 0.7, ease: "power3.inOut" });
  }
  gsap.set(next, { autoAlpha: 1, scale: 1, zIndex: 2 });
  if (prev) gsap.set(prev, { zIndex: 1 });
  gsap.fromTo(next,
    { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: prev ? 0.9 : 0, ease: "power4.inOut",
      onComplete: () => (busy = false) });

  current = index;
  step = Math.min(startStep, maxSteps(next));
  next.querySelectorAll("[data-step]").forEach((el) => {
    el.classList.remove("shown");
    gsap.set(el, { autoAlpha: 0 });
  });
  animateIn(next);
  revealSteps(next, step, true);
  updateHud();
}

function nextStep() {
  if (step < maxSteps(slides[current])) {
    step++;
    revealSteps(slides[current], step);
    updateHud();
  } else go(current + 1);
}
function prevStep() {
  if (step > 0) {
    step--;
    revealSteps(slides[current], step);
    updateHud();
  } else go(current - 1);
}

function updateHud() {
  const slide = slides[current];
  document.getElementById("chapter").innerHTML = slide.dataset.chapter || "";
  document.getElementById("count").textContent =
    `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  gsap.to("#progress", { scaleX: (current + 1) / slides.length, duration: 0.6, ease: "power3.out" });
  history.replaceState(null, "", `#${current}.${step}`);
}

// Input: keyboard, presenter clickers (PageUp/PageDown), on-screen buttons, swipe.
document.addEventListener("keydown", (e) => {
  if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); nextStep(); }
  if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); prevStep(); }
  if (e.key === "Home") go(0);
  if (e.key === "End") go(slides.length - 1);
  if (e.key.toLowerCase() === "f") toggleFullscreen();
});
document.getElementById("next").addEventListener("click", nextStep);
document.getElementById("prev").addEventListener("click", prevStep);
document.getElementById("fs").addEventListener("click", toggleFullscreen);
function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
}
let touchX = null;
document.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX));
document.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) (dx < 0 ? nextStep : prevStep)();
  touchX = null;
});

// ---------- Timeline ----------
const tl = document.querySelector("[data-kind='timeline']");
const tlBgs = tl.querySelector(".tl-bgs");
const tlDots = tl.querySelector(".tl-dots");
TIMELINE.forEach((item, i) => {
  tlBgs.insertAdjacentHTML("beforeend", `<img src="${item.img}" alt="">`);
  tlDots.insertAdjacentHTML("beforeend", `<button data-i="${i}"><span>${item.year}</span></button>`);
});
tlDots.querySelectorAll("button").forEach((b) =>
  b.addEventListener("click", () => {
    step = Number(b.dataset.i);
    revealSteps(tl, step);
    updateHud();
  })
);
let shownYear = -1;
function setYear(i) {
  if (i === shownYear) return;
  const item = TIMELINE[i];
  const dir = i > shownYear ? 1 : -1;
  shownYear = i;
  tlBgs.querySelectorAll("img").forEach((img, j) =>
    gsap.to(img, { autoAlpha: j === i ? 1 : 0, scale: j === i ? 1.08 : 1.2, duration: 1.2, ease: "power2.out" })
  );
  const yearEl = tl.querySelector(".tl-year span");
  const title = tl.querySelector(".tl-title");
  const kw = tl.querySelector(".tl-kw");
  const frame = tl.querySelector(".tl-frame img");
  gsap.timeline()
    .to([yearEl, title, kw], { yPercent: -60 * dir, autoAlpha: 0, duration: 0.25, ease: "power2.in" })
    .add(() => {
      yearEl.textContent = item.year;
      title.textContent = item.title;
      kw.textContent = item.kw;
      frame.src = item.img;
    })
    .fromTo([yearEl, title, kw], { yPercent: 60 * dir, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.06 });
  gsap.fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 },
    { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1, ease: "power4.out", delay: 0.2 });
  tlDots.querySelectorAll("button").forEach((b, j) => {
    b.classList.toggle("active", j === i);
    b.classList.toggle("past", j < i);
  });
}

// ---------- Voices: subtle 3D tilt ----------
document.querySelectorAll(".voice").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotationY: x * 14, rotationX: -y * 14, transformPerspective: 900, duration: 0.4 });
  });
  card.addEventListener("mouseleave", () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6 }));
});

// ---------- Poll ----------
const votes = [0, 0, 0];
document.querySelectorAll(".poll-opt").forEach((btn) =>
  btn.addEventListener("click", () => {
    votes[Number(btn.dataset.vote)]++;
    const total = votes.reduce((a, b) => a + b, 0);
    document.querySelectorAll(".poll-opt").forEach((b, i) => {
      b.querySelector(".poll-n").textContent = votes[i];
      gsap.to(b.querySelector(".poll-bar i"), { scaleX: votes[i] / total, duration: 0.6, ease: "power3.out" });
    });
    gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
  })
);

// ---------- Quiz ----------
const quiz = document.querySelector(".quiz-wrap");
let qIndex = 0;
function renderQuestion() {
  const item = QUIZ[qIndex];
  quiz.querySelector(".q-count").textContent = `${qIndex + 1} / ${QUIZ.length}`;
  quiz.querySelector(".q-text").textContent = item.q;
  const opts = quiz.querySelector(".q-options");
  opts.innerHTML = "";
  item.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<span class="letter">${"ABCD"[i]}</span><span>${text}</span>`;
    btn.addEventListener("click", () => {
      if (opts.classList.contains("answered")) return;
      opts.classList.add("answered");
      opts.querySelectorAll("button").forEach((b, j) => b.classList.add(j === item.answer ? "correct" : "dim"));
      if (i !== item.answer) {
        btn.classList.add("wrong");
        gsap.fromTo(btn, { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      } else {
        gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
      }
    });
    opts.appendChild(btn);
  });
  gsap.fromTo(opts.children, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.5 });
}
quiz.querySelector("[data-qnext]").addEventListener("click", () => {
  qIndex = (qIndex + 1) % QUIZ.length;
  renderQuestion();
});
quiz.querySelector("[data-qprev]").addEventListener("click", () => {
  qIndex = (qIndex - 1 + QUIZ.length) % QUIZ.length;
  renderQuestion();
});
renderQuestion();
quiz.querySelectorAll(".team").forEach((t) =>
  t.addEventListener("click", () => {
    const b = t.querySelector("b");
    b.textContent = Number(b.textContent) + 1;
    gsap.fromTo(b, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
  })
);

// ---------- Reported speech flip cards ----------
document.querySelector("[data-reported]").innerHTML = REPORTED.map(
  (r) => `<button class="flip"><div class="flip-inner">
      <div class="face front"><p>${r.direct}</p><small>${r.who}</small></div>
      <div class="face back"><p>${r.reported}</p></div>
    </div></button>`
).join("");
document.querySelectorAll(".flip").forEach((f) => f.addEventListener("click", () => f.classList.toggle("flipped")));

// ---------- References ----------
document.querySelector("[data-refs]").innerHTML = REFERENCES.map(
  (r) => `<li class="${r.pending ? "todo" : ""}">${r.text}${r.url ? ` <a href="${r.url}" target="_blank" rel="noopener">${r.url}</a>` : ""}</li>`
).join("");
document.querySelector("[data-credits]").textContent = CREDITS;

// Start where the URL says (e.g. #4.2 = slide 4, step 2), so a reload keeps your place.
const [hSlide, hStep] = location.hash.slice(1).split(".").map(Number);
go(Number.isFinite(hSlide) ? hSlide : 0, Number.isFinite(hStep) ? hStep : 0);

// ?shot jumps every animation to its end, for static screenshots.
if (location.search.includes("shot")) setTimeout(() => gsap.exportRoot().progress(1), 300);
