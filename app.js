/* 포트폴리오 — portfolio.json 을 읽어 그린다. 매주 카드 한 칸을 JSON 에 더하면 사이트가 자란다. */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const WEEKS = 8;

  fetch("portfolio.json").then(r => r.json()).then(P => {
    $("#owner").textContent = P.owner;
    $("#headline").textContent = P.headline;
    $("#headline-em").textContent = P.headline_em || "";
    $("#intro").textContent = P.intro;

    // 숫자 요약: 첫 칸은 완성한 도구 수, 나머지는 JSON 의 stats
    const done = P.cards.filter(c => c.url).length;
    const stats = [{ num: done, unit: `/ ${WEEKS}`, label: "완성한 도구" }, ...(P.stats || [])];
    $("#stats").innerHTML = stats.map(s =>
      `<div class="stat"><b>${esc(s.num)}<small>${esc(s.unit)}</small></b><span>${esc(s.label)}</span></div>`).join("");

    // 채운 카드 + 다음 주차 한 칸
    const cards = [...P.cards].sort((a, b) => a.week - b.week);
    const next = cards.length ? cards[cards.length - 1].week + 1 : 1;
    $("#cards").innerHTML = cards.map(c => `
      <article class="card">
        <div class="pic">${c.img ? `<img src="${esc(c.img)}" alt="${esc(c.title)} 화면" loading="lazy">` : ""}<span class="pill">${c.week}주차</span></div>
        <div class="body">
          <div class="chips">${(c.tags || []).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
          <h3>${esc(c.title)}</h3>
          <p class="line">${esc(c.line)}</p>
          <div class="judge"><span class="ic">✓</span><div><b>내가 내린 판단</b>${esc(c.judgment)}</div></div>
          <div class="foot-row"><span class="ai">${(c.ai || []).map(esc).join(" · ")}</span>
            ${c.url ? `<a class="go" href="${esc(c.url)}" target="_blank" rel="noopener">써 보기 →</a>`
                    : `<span class="go off">링크를 넣으십시오</span>`}</div>
        </div>
      </article>`).join("") + (next <= WEEKS ? `
      <div class="card empty">
        <span class="pill2">${next}주차</span>
        <b>다음 HR 도구를 준비 중입니다</b>
        <div class="roadmap">${(P.roadmap || []).map(r => `<span>${esc(r)}</span>`).join("")}</div>
      </div>` : "");

    if (P.values && P.values.length) {
      $("#values-title").hidden = false;
      $("#values").innerHTML = P.values.map(v =>
        `<div class="value"><div class="circ">${esc(v.icon)}</div><h4>${esc(v.title)}</h4><p>${esc(v.line)}</p></div>`).join("");
    }

    const p = P.proposal;
    if (p) {
      $("#proposal").hidden = false;
      $("#to-proposal").hidden = false;
      $("#p-title").textContent = p.title;
      $("#p-ask").textContent = p.ask;
      $("#p-evidence").innerHTML = p.evidence.map(x => `<li>${esc(x)}</li>`).join("");
      $("#p-wrong").innerHTML = p.if_wrong.map(x => `<li>${esc(x)}</li>`).join("");
      $("#p-dont").textContent = p.dont;
    }
    document.body.dataset.ready = "1";
  });
})();
