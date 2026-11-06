(function () {
    var T = [
        ["POS", "Point de vente", "Disponible, hors-ligne", "La caisse et tout ce qui l’entoure : vendre, encaisser, gérer le stock, les clients, les dépenses.", ["Sessions de caisse, ventes en attente, retour partiel", "Stock, inventaire, transferts entre dépôts", "Vente à crédit, catégories de prix, ticket et facture", "Une quinzaine de rapports imprimables"], "Emballages consignés, tournées de chauffeurs-vendeurs, remise en nature, caisse qui ne s’arrête jamais."],
        ["SHOP", "Boutique en ligne", "Disponible", "Une vitrine publique pour chaque commerce, à sa propre adresse, et le back-office pour la gérer.", ["Accueil, fiches produits, panier, commande", "Thèmes, bannière, zones de livraison", "Commandes web et messages clients", "Catalogue et photos avec le Shooting Studio"], "Un seul stock avec la caisse, et une vitrine sur votre propre nom de domaine."],
        ["DLV", "Livraisons", "Disponible", "Organiser les livraisons avec vos chauffeurs ou avec des livreurs indépendants.", ["Flotte propre : chauffeurs, véhicules, tournées", "Livreurs indépendants inscrits par lien d’invitation", "Chaque point de vente approuve ceux qu’il accepte", "Espace du livreur : livraisons du jour"], "Un vivier de livreurs propre à chaque entreprise, jamais partagé avec un autre client."],
        ["CRM", "Relation client", "Disponible, hors-ligne", "Suivre les clients et les affaires en cours, au-delà de la fiche de caisse.", ["Contacts et cycle de vie, compte client", "Pipelines par étapes, motif de perte", "Activités : relances, rendez-vous, tâches"], "Un client, une seule fiche, même s’il achète dans plusieurs boutiques. Le CRM ne bloque jamais une vente."],
        ["PROD", "Production", "Disponible, hors-ligne", "Transformer des matières premières en produits finis, et savoir quoi, combien, à quel coût.", ["Nomenclatures et ordres de fabrication", "Lots, traçabilité, contrôles qualité", "Planification, coût de revient réel", "Modules eau conditionnée : forages, film, rapport d’usine"], "L’usine alimente directement la vente, et fonctionne sans réseau."],
        ["ACC", "Comptabilité", "Disponible", "Tenir les livres selon le référentiel SYSCOHADA révisé, sans ressaisir les ventes.", ["Plan de comptes, partie double, lettrage", "Journalisation automatique des Services connectés", "Trésorerie : banque, caisse, mobile money", "Exercices, clôture, verrouillage des périodes"], "États financiers OHADA, mobile money traité en vraie trésorerie, accès pour votre cabinet comptable."],
        ["CHRONO", "Suivi du temps", "Disponible, hors-ligne", "Savoir qui est venu, combien d’heures, et combien on lui doit, selon le Code du travail.", ["Kiosque de pointage sur tablette partagée", "Feuilles de temps, planning, validation mensuelle", "Retards, absences, anomalies", "Photo au pointage et géorepérage"], "Journaliers et tâcherons, barème paramétrable, relevé présentable à l’inspection du travail."],
        ["HIRE", "Recrutement", "Disponible", "Du poste à pourvoir à l’employé qui arrive : publier, trier, évaluer, recruter.", ["Offres, pipeline de candidatures, vivier", "Entretiens avec agendas Google ou Outlook", "Lettres d’offre en PDF", "Protection des données, journal d’audit"], "Portail candidat sans compte et IA d’aide au tri."],
        ["IAM", "Identités et accès", "Toujours inclus", "La tour de contrôle de l’Organisation : qui peut faire quoi, où, et comment les outils se connectent.", ["Membres, invitations, rôles et permissions", "Affectations Service par Service", "Connexions entre outils", "Appareils hors-ligne, journal d’audit"], "Vous décidez, site par site, ce qui se connecte."]];
    var tl = document.getElementById("tl"), pn = document.getElementById("panel");
    function show(i) {
        var t = T[i];[].forEach.call(tl.children, function (b, k) { b.setAttribute("aria-selected", k === i) });
        pn.style.animation = "none"; void pn.offsetWidth; pn.style.animation = "";
        pn.innerHTML = '<span class="code">' + t[0] + '</span><h3>' + t[1] + '</h3><p>' + t[3] + '</p><ul>' + t[4].map(function (x) { return "<li>" + x + "</li>" }).join("") + '</ul><div class="plus"><b>Ce qui le distingue : </b>' + t[5] + '</div>';
    }
    T.forEach(function (t, i) { var b = document.createElement("button"); b.setAttribute("role", "tab"); b.innerHTML = "<span>" + t[0] + "</span><small>" + t[2] + "</small>"; b.onclick = function () { show(i) }; tl.appendChild(b) }); show(0);
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target) } }) }, { threshold: .12 });
    document.querySelectorAll(".rv").forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(el) });
    var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
            if (!e.isIntersecting) return; co.unobserve(e.target); var n = +e.target.dataset.n, s = null;
            function f(ts) { s = s || ts; var p = Math.min((ts - s) / 1100, 1); e.target.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f) } requestAnimationFrame(f)
        })
    }, { threshold: .6 });
    document.querySelectorAll("[data-n]").forEach(function (el) { if (el.tagName === "B") co.observe(el) });
    var hd = document.getElementById("hd"); addEventListener("scroll", function () { hd.classList.toggle("s", scrollY > 20) }, { passive: true });
    var on = true, q = 0, tot = 0, cnt = 0, pos = document.getElementById("pos"), $ = function (i) { return document.getElementById(i) };
    function fmt(n) { return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " F CFA" }
    function bump() { var b = $("qn"); b.classList.add("bump"); setTimeout(function () { b.classList.remove("bump") }, 250) }
    function render() { $("qn").textContent = q; $("qt").textContent = q ? (on ? "Synchronisation en cours…" : "En attente du réseau") : "Rien en attente"; $("tot").textContent = fmt(tot); $("cnt").textContent = cnt }
    function sync() { if (!q) return; var t = setInterval(function () { if (!on) { clearInterval(t); return } q--; bump(); render(); if (!q) { clearInterval(t); render() } }, 450) }
    $("sw").onclick = function () { on = !on; pos.classList.toggle("off", !on); $("sw").setAttribute("aria-pressed", on); $("st").textContent = on ? "En ligne" : "Hors-ligne"; $("swt").textContent = on ? "Réseau actif" : "Réseau coupé"; render(); if (on) sync() };
    $("sell").onclick = function () { tot += 2500; cnt++; if (!on) { q++; bump() } render() };
})();

(function () {
    var d = document.getElementById("cf"), f = document.getElementById("cform"), ok = document.getElementById("cok");
    function open(e) { e.preventDefault(); d.showModal() }
    document.querySelectorAll(".open-contact,a.btn[href='#contact']").forEach(function (b) { b.addEventListener("click", open) });
    d.querySelector(".cf-x").onclick = function () { d.close() };
    d.addEventListener("click", function (e) { if (e.target === d) d.close() });
    d.addEventListener("close", function () { f.hidden = false; ok.hidden = true; f.reset() });
    function msg() {
        var v = function (n) { return (f.elements[n].value || "").trim() };
        var o = [].map.call(f.querySelectorAll("input[name=outils]:checked"), function (c) { return c.value }).join(", ");
        return "Demande de démonstration Manu\n\nNom : " + v("nom") + "\nEntreprise : " + v("entreprise") + "\nTéléphone / WhatsApp : " + v("tel") + "\nE-mail : " + (v("email") || "non précisé") + "\nActivité : " + v("secteur") + "\nOutils : " + (o || "non précisé") + "\n\nMessage :\n" + (v("message") || "-");
    }
    function done() { f.hidden = true; ok.hidden = false }
    f.addEventListener("submit", function (e) {
        e.preventDefault();
        location.href = "mailto:contact@erpmanu.com?subject=" + encodeURIComponent("Demande de démonstration Manu – " + f.elements.entreprise.value.trim()) + "&body=" + encodeURIComponent(msg());
        done();
    });
    document.getElementById("cwa").onclick = function () {
        if (!f.reportValidity()) return;
        window.open("https://wa.me/22666693644?text=" + encodeURIComponent(msg()), "_blank", "noopener");
        done();
    };
})();

(function () {
    var app = document.getElementById("dvApp"), vp = app.parentNode, cur = document.getElementById("dvCur"),
        V = app.querySelectorAll(".dv-v"), N = app.querySelectorAll(".dv-n"),
        reduce = matchMedia("(prefers-reduced-motion:reduce)").matches, i = 0, tm = [];
    function fit() { app.style.setProperty("--s", vp.clientWidth / 800) }
    fit(); new ResizeObserver(fit).observe(vp);
    function fmt(n) { return Math.round(n).toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ") }
    function count(el) {
        var t = +el.dataset.v, suf = el.dataset.s || "", s = null;
        function f(ts) { s = s || ts; var p = Math.min((ts - s) / 1200, 1); el.textContent = fmt(t * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f) }
        requestAnimationFrame(f);
    }
    function show(k) {
        i = k;
        V.forEach(function (v, j) { v.classList.toggle("on", j === k) });
        N.forEach(function (n, j) { n.classList.toggle("on", j === k) });
        if (k === 0) V[0].querySelectorAll("[data-v]").forEach(count);
    }
    function later(fn, ms) { tm.push(setTimeout(fn, ms)) }
    function step() {
        var k = (i + 1) % V.length, y = 48 + 12 + k * 36 + 16;
        cur.style.opacity = 1; cur.style.transform = "translate(60px," + y + "px)";
        later(function () { show(k) }, 1000);
        later(function () { cur.style.transform = "translate(520px,340px)" }, 1500);
        later(function () { cur.style.opacity = 0 }, 2400);
        later(step, 6500);
    }
    function stop() { tm.forEach(clearTimeout); tm = [] }
    if (reduce) return;
    new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { if (!tm.length) { show(0); later(step, 3500) } } else stop();
    }, { threshold: .35 }).observe(vp);
})();

(function () {
    var r = document.querySelector(".lgs"), tr = r.querySelector(".lgs-tr"), it = tr.children, dots = r.querySelector(".lgs-dots"),
        reduce = matchMedia("(prefers-reduced-motion:reduce)").matches, p = 0, n = 6, tm, paused = false;
    function count() { var w = innerWidth; return w < 560 ? 2 : w < 900 ? 3 : 6 }
    function pages() { return Math.ceil(it.length / n) }
    function go(k) {
        p = k; var off = Math.min(k * n, it.length - n);
        tr.style.transform = "translateX(-" + (off * 100 / n) + "%)";
        [].forEach.call(dots.children, function (d, j) { d.setAttribute("aria-current", j === k) });
    }
    function restart() { clearInterval(tm); if (!reduce && !paused) tm = setInterval(function () { go((p + 1) % pages()) }, 3000) }
    function build() {
        n = count(); r.style.setProperty("--n", n); dots.innerHTML = "";
        for (var k = 0; k < pages(); k++) {
            var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Groupe " + (k + 1));
            (function (k) { b.onclick = function () { go(k); restart() } })(k); dots.appendChild(b);
        }
        go(Math.min(p, pages() - 1)); restart();
    }
    r.addEventListener("mouseenter", function () { paused = true; restart() });
    r.addEventListener("mouseleave", function () { paused = false; restart() });
    var t; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(build, 150) });
    build();
})();