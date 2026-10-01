/* Port de la Lune — scripts du site (vanilla, sans dépendance)
   Entreprise fictive — site de démonstration */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA_NUMBER = "261381461105";

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector("[data-menu-open]");
  var panel = document.getElementById("menu-mobile");
  var closeBtn = document.querySelector("[data-menu-close]");
  function openMenu() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var first = panel.querySelector("a, button");
    if (first) first.focus();
  }
  function closeMenu(returnFocus) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (returnFocus !== false) toggle.focus();
  }
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener("click", function () { closeMenu(); });
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key !== "Tab") return;
      var f = panel.querySelectorAll("a, button");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1100) closeMenu(false); });
  }

  /* ---------- Année du pied de page ---------- */
  var y = document.querySelectorAll("[data-year]");
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /* ---------- Simulateur de prix ----------
     Données = grille de tarifs.html (prix fixes TTC, 1 à 4 passagers).
     Majorations (non cumulables, la plus élevée s'applique) :
     nuit 22 h–6 h +15 %, dimanche +10 %. */
  var sim = document.getElementById("simulateur");
  if (sim) {
    var PLACES = {
      bod: "Aéroport de Mérignac", stjean: "Gare Saint-Jean", centre: "Centre de Bordeaux",
      chartrons: "Chartrons", arcachon: "Arcachon", capferret: "Cap Ferret", stemilion: "Saint-Émilion"
    };
    var ROUTES = {
      "bod|centre": [55, "25 min"], "bod|chartrons": [58, "30 min"], "bod|stjean": [50, "25 min"],
      "bod|arcachon": [130, "50 min"], "bod|capferret": [190, "1 h 10"],
      "stjean|centre": [22, "10 min"], "stjean|chartrons": [28, "12 min"],
      "centre|arcachon": [145, "55 min"], "chartrons|arcachon": [145, "55 min"], "stjean|arcachon": [145, "55 min"],
      "centre|stemilion": [120, "45 min"], "chartrons|stemilion": [120, "45 min"], "stjean|stemilion": [120, "45 min"]
    };
    var $ = function (id) { return document.getElementById(id); };
    var from = $("sim-depart"), to = $("sim-arrivee"), date = $("sim-date"), time = $("sim-heure"), pax = $("sim-passagers");
    var out = {
      box: $("sim-result"), price: $("sim-price"), meta: $("sim-meta"), note: $("sim-note"), book: $("sim-book")
    };
    if (date) date.min = todayISO();

    function find(a, b) { return ROUTES[a + "|" + b] || ROUTES[b + "|" + a] || null; }
    function chip(txt) { return '<span class="chip">' + txt + "</span>"; }
    function fmtDate(v) {
      if (!v) return "";
      var p = v.split("-");
      return p[2] + "/" + p[1] + "/" + p[0];
    }
    var ICON_CLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

    function update(animate) {
      var a = from.value, b = to.value, n = pax.value;
      var r = a === b ? null : find(a, b);
      var meta = [], note = "", priceHTML, waText;
      var when = (date.value ? "le " + fmtDate(date.value) : "date à préciser") + (time.value ? " à " + time.value.replace(":", " h ") : "");
      var trip = PLACES[a] + " → " + PLACES[b];

      if (a === b) {
        priceHTML = '<span class="sim__price sim__price--quote">Choisissez deux lieux différents</span>';
        note = "Le départ et l'arrivée sont identiques.";
        waText = null;
      } else if (n === "5+") {
        priceHTML = '<span class="sim__price sim__price--quote">Sur devis</span>';
        meta.push(chip("2 véhicules"));
        note = "Au-delà de 4 passagers, je coordonne un second véhicule avec un confrère. Réponse en moins de 30 min.";
        waText = "Bonjour, je souhaite un devis : " + trip + ", " + when + ", 5 passagers ou plus.";
      } else if (!r) {
        priceHTML = '<span class="sim__price sim__price--quote">Sur devis, réponse en moins de 30 min</span>';
        note = "Ce trajet n'est pas dans la grille des prix fixes : envoyez-le, je vous réponds avec un prix ferme.";
        waText = "Bonjour, je souhaite un devis : " + trip + ", " + when + ", " + n + " passager(s).";
      } else {
        var surcharge = 0, label = "";
        if (time.value) {
          var h = parseInt(time.value.split(":")[0], 10);
          if (h >= 22 || h < 6) { surcharge = 0.15; label = "Nuit +15 % incluse"; }
        }
        if (date.value && new Date(date.value + "T12:00:00").getDay() === 0 && surcharge < 0.10) {
          surcharge = 0.10; label = "Dimanche +10 % inclus";
        }
        var price = Math.round(r[0] * (1 + surcharge));
        priceHTML = '<span class="sim__price">' + price + " €<small>TTC, prix fixe</small></span>";
        meta.push('<span class="chip">' + ICON_CLOCK + r[1] + "</span>");
        if (label) meta.push(chip(label));
        note = label
          ? "Majoration déjà comprise : ce prix ne bougera plus, même dans les bouchons."
          : "Bagages inclus. Majoration de nuit (22 h–6 h) : +15 %, dimanche : +10 %, non cumulables.";
        waText = "Bonjour, je souhaite réserver : " + trip + ", " + when + ", " + n + " passager(s). Prix fixe annoncé sur le site : " + price + " €.";
      }
      out.price.innerHTML = priceHTML;
      out.meta.innerHTML = meta.join("");
      out.note.textContent = note;
      if (waText) {
        out.book.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(waText);
        out.book.removeAttribute("aria-disabled");
        out.book.lastChild.textContent = r && n !== "5+" ? "Réserver ce trajet" : "Demander un devis sur WhatsApp";
      } else {
        out.book.removeAttribute("href");
        out.book.setAttribute("aria-disabled", "true");
      }
      if (animate && !reduceMotion) {
        out.box.classList.remove("is-updated"); void out.box.offsetWidth; out.box.classList.add("is-updated");
      }
    }
    [from, to, date, time, pax].forEach(function (el) {
      el.addEventListener("change", function () { update(true); });
      el.addEventListener("input", function () { update(false); });
    });
    $("sim-swap").addEventListener("click", function () {
      var t = from.value; from.value = to.value; to.value = t; update(true);
    });
    sim.addEventListener("submit", function (e) { e.preventDefault(); });
    update(false);

    // Cartes de trajets fréquents : préremplissent le simulateur
    Array.prototype.forEach.call(document.querySelectorAll("[data-route-from]"), function (card) {
      card.addEventListener("click", function (e) {
        e.preventDefault();
        from.value = card.getAttribute("data-route-from");
        to.value = card.getAttribute("data-route-to");
        update(true);
        sim.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        out.box.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Révélations au scroll ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length) {
    if (!reduceMotion && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
      Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------- Formulaire de réservation ----------
     Pas de backend : on valide, puis on propose d'envoyer la demande
     pré-remplie par e-mail (mailto:) ou WhatsApp. */
  var form = document.getElementById("form-reservation");
  if (form) {
    var status = document.getElementById("form-status");
    var dateInput = form.querySelector("#date");
    if (dateInput) dateInput.min = todayISO();
    var messages = {
      depart: "Indiquez l'adresse ou le lieu de prise en charge.",
      arrivee: "Indiquez la destination.",
      date: "Choisissez la date de la course (aujourd'hui ou plus tard).",
      heure: "Indiquez l'heure de prise en charge.",
      passagers: "Précisez le nombre de passagers.",
      nom: "Indiquez votre nom pour la pancarte et la facture.",
      telephone: "Indiquez un numéro de téléphone valide (ex. 06 12 34 56 78).",
      email: "Cette adresse e-mail ne semble pas valide.",
      consentement: "Merci d'accepter l'utilisation de vos données pour traiter la demande."
    };
    function setError(field, msg) {
      var err = document.getElementById(field.id + "-error");
      if (msg) { field.setAttribute("aria-invalid", "true"); if (err) err.textContent = msg; }
      else { field.removeAttribute("aria-invalid"); if (err) err.textContent = ""; }
    }
    function validate(field) {
      var v = field.type === "checkbox" ? field.checked : field.value.trim();
      var ok = true;
      if (field.required && !v) ok = false;
      if (ok && field.id === "telephone" && v) ok = /^(\+|00)?[\d\s.\-()]{9,20}$/.test(v) && v.replace(/\D/g, "").length >= 9;
      if (ok && field.type === "email" && v) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if (ok && field.id === "date" && v && dateInput.min) ok = v >= dateInput.min;
      setError(field, ok ? "" : (messages[field.id] || "Ce champ est requis."));
      return ok;
    }
    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (f) {
      f.addEventListener("blur", function () { if (f.value || f.getAttribute("aria-invalid")) validate(f); });
      f.addEventListener("change", function () { if (f.getAttribute("aria-invalid")) validate(f); });
    });
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (f) {
        if (!validate(f) && !firstBad) firstBad = f;
      });
      if (firstBad) {
        status.hidden = false;
        status.className = "form__status form__status--err";
        status.innerHTML = "<h3>Il manque quelques informations</h3><p>Vérifiez les champs signalés en rouge, puis renvoyez la demande.</p>";
        firstBad.focus();
        return;
      }
      var val = function (id) { var el = form.querySelector("#" + id); return el ? el.value.trim() : ""; };
      var dateFr = val("date").split("-").reverse().join("/");
      var body = [
        "Demande de réservation — Port de la Lune", "",
        "Départ : " + val("depart"),
        "Arrivée : " + val("arrivee"),
        "Date : " + dateFr + " à " + val("heure"),
        "Passagers : " + val("passagers") + " — Bagages : " + val("bagages"),
        "N° de vol / train : " + (val("vol") || "—"),
        "Siège enfant : " + val("siege"), "",
        "Nom : " + val("nom"),
        "Téléphone : " + val("telephone"),
        "E-mail : " + (val("email") || "—"), "",
        "Message : " + (val("message") || "—")
      ].join("\n");
      var mailto = "mailto:contact@portdelalune-vtc.fr?subject=" +
        encodeURIComponent("Réservation " + dateFr + " — " + val("depart") + " → " + val("arrivee")) +
        "&body=" + encodeURIComponent(body);
      var wa = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(body);
      status.hidden = false;
      status.className = "form__status form__status--ok";
      status.innerHTML =
        "<h3>Votre demande est prête</h3>" +
        "<p><strong>Site de démonstration :</strong> rien n'est envoyé automatiquement. Choisissez comment transmettre la demande pré-remplie — Samir confirme le prix fixe par retour, en général sous 30 minutes entre 7 h et 23 h.</p>" +
        "<div class=\"btn-row\"><a class=\"btn btn--primary\" id=\"send-wa\" href=\"#\" target=\"_blank\" rel=\"noopener\">Envoyer sur WhatsApp</a>" +
        "<a class=\"btn\" id=\"send-mail\" href=\"#\">Envoyer par e-mail</a></div>";
      status.querySelector("#send-mail").setAttribute("href", mailto);
      status.querySelector("#send-wa").setAttribute("href", wa);
      status.setAttribute("tabindex", "-1");
      status.focus();
    });
  }
})();
