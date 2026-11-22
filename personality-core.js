/* Jimmy's short, playful asides. Park facts remain in the knowledge package. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.JimmyPersonality = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const quips = Object.freeze({
    idle: Object.freeze([
      'Mein Schwanz ist mein eingebautes Fragezeichen.',
      'Ich wollte ernst bleiben. Hat drei Sekunden geklappt.',
      'Heute bin ich affenstark aufgelegt!',
      'Mein innerer Schweinehund ist übrigens auch ein Affe.',
      'Ich habe einen Plan. Er beginnt mit einem breiten Grinsen.',
      'Wenn gute Laune Taschen hätte, wären meine randvoll.',
      'Ein kleiner Affe, ein großer Vorrat an Quatsch.',
      'Ich zähle keine Schäfchen. Ich zähle Bananen.',
      'Meine Mütze sitzt rückwärts. Meine Ideen vorwärts.',
      'Pssst! Ich übe gerade mein unschuldigstes Affengesicht.',
      'Ich bin klein, aber meine Vorfreude braucht einen eigenen Sitzplatz.',
      'Mein Lieblingsfach? Unfug mit Auszeichnung.',
      'Mein Schwanz hat sich wieder kringelig gelacht.',
      'Ich habe gerade nichts angestellt. Verdächtig, oder?',
      'Mein Kopf hat heute Konfetti statt Gedanken.',
      'Ich bin bereit. Die Frisur war es schon vor mir.',
      'Ein Lächeln steht dir. Meins trage ich jeden Tag.',
      'Mein Tagesziel: mindestens ein Grinsen verteilen.',
      'Ich wollte cool gucken. Dann kam mir ein Witz dazwischen.',
      'Wenn Vorfreude ein Geräusch hätte: Uuuh-uuuh!',
      'Große Ohren, kleines Geheimnis: Ich mag Geburtstage.',
      'Ich passe in keine Schublade. Mein Schwanz steht über.',
      'Mein Ernst macht gerade Pause. Mein Quatsch übernimmt.',
      'Eine Banane wäre jetzt praktisch. Zum Nachdenken natürlich.',
      'Ich bin der Beweis: Gute Laune braucht keine langen Beine.',
      'Meine Hosenträger halten die Hose. Mein Grinsen hält den Tag.',
      'Falls du dich fragst: Ja, diese Frisur ist Absicht.',
      'Ich habe einen Ohrwurm. Er trägt eine kleine Affenmütze.',
      'Meine Superkraft? Begeisterung im Taschenformat.',
      'Ich wollte nur kurz winken. Jetzt freut sich die ganze Pfote.',
      'Mein bester Witz? Ich suche noch. Mein Schwanz hilft beim Grübeln.',
      'Ein bisschen Quatsch passt immer noch zwischen zwei Gedanken.'
    ]),
    walk: Object.freeze([
      'Achtung, Affe auf kleiner Weltreise!',
      'Ich vertrete mir kurz die Pfoten.',
      'Links, rechts, links … der Schwanz kommt von allein mit.',
      'Mein Schrittzähler zählt in Bananenlängen.',
      'Ich gehe nur kurz gucken, ob dort auch gute Laune ist.',
      'Diese Pfoten haben heute noch etwas vor.',
      'Kleine Schritte, große Affenpläne.',
      'Nicht wundern. Ich patrouilliere für die gute Laune.',
      'Ich nehme die landschaftlich schöne Route über deinen Bildschirm.',
      'Mein Schwanz hat keinen Führerschein. Er läuft einfach hinterher.',
      'Bin gleich wieder da. Ich muss meinen Pfoten Auslauf geben.',
      'Ich habe keinen Kompass, aber eine sehr entschlossene Mütze.',
      'Einmal hin, einmal her: Das ist Affenverkehr.',
      'Mein Ziel? Erst mal ein kleines Stück weiter.',
      'Ich laufe gerade einem guten Gedanken hinterher.',
      'Die Pfoten bewegen sich. Der Kopf plant schon den nächsten Quatsch.'
    ]),
    jump: Object.freeze([
      'Hüpf! Die gute Laune musste kurz raus.',
      'Ein kleiner Sprung für mich, ein großes Grinsen für dich!',
      'Ich prüfe nur, ob die Schwerkraft noch da ist.',
      'Hops! Meine Pfoten hatten eine spontane Idee.',
      'Und hoch! Meine Mütze kommt natürlich mit.',
      'Boden, Luft, Boden. Alles noch an seinem Platz!',
      'Mein Schwanz nennt das einen Freudensprung.',
      'Kurz abgehoben. Weiterhin ganz Affe.',
      'Da war noch ein Hüpfer in meinen Socken!',
      'Ich bin kein Flummi. Ich mache nur eine überzeugende Probe.',
      'So fühlt sich Vorfreude mit Pfoten an!',
      'Hüpf! Mein bester Gedanke hatte gerade Auftrieb.'
    ])
  });
  function createDeck(random = Math.random) {
    const queues = new Map(), last = new Map();
    return {
      next(kind = 'idle') {
        const key = Object.hasOwn(quips, kind) ? kind : 'idle';
        if (!queues.get(key)?.length) {
          const deck = [...quips[key]];
          for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.min(i, Math.max(0, Math.floor(random() * (i + 1))));
            [deck[i], deck[j]] = [deck[j], deck[i]];
          }
          if (deck[0] === last.get(key)) [deck[0], deck[1]] = [deck[1], deck[0]];
          queues.set(key, deck);
        }
        const line = queues.get(key).shift(); last.set(key, line); return line;
      }
    };
  }
  return { quips, createDeck };
});
