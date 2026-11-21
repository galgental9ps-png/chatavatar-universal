/* Authenticated writes happen in the editor only. Tokens stay in memory. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api; else root.JimmyGitHub = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const FILE = 'knowledge/jimmys-funpark.json';
  const fromBase64 = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g, '')), c => c.charCodeAt(0)));
  class Publisher {
    constructor({ repo, branch = 'main', token, fetcher = globalThis.fetch.bind(globalThis) }) {
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) throw Error('Repository bitte als Eigentümer/Name angeben.');
      if (!/^[A-Za-z0-9_./-]+$/.test(branch) || branch.includes('..')) throw Error('Ungültiger Branch.');
      if (!token || token.length < 10) throw Error('Bitte einen gültigen GitHub-Zugangstoken eingeben.');
      this.repo = repo; this.branch = branch; this.token = token; this.fetcher = fetcher; this.sha = null;
    }
    disconnect() { this.token = ''; this.sha = null; }
    async api(path, method = 'GET', body) {
      if (!this.token) throw Error('Die GitHub-Verbindung wurde getrennt.');
      const response = await this.fetcher('https://api.github.com/repos/' + this.repo + path, { method, credentials: 'omit', headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + this.token, 'X-GitHub-Api-Version': '2022-11-28', ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
      if (!response.ok) {
        const hints = { 401: 'Zugangstoken ungültig oder abgelaufen.', 403: 'Keine ausreichenden Schreibrechte oder API-Limit erreicht. Contents: Read and write für dieses Repository prüfen.', 404: 'Repository, Branch oder Wissensdatei nicht gefunden. Zugriff und Schreibweise prüfen.', 409: 'Der Stand auf GitHub hat sich verändert. Bitte neu laden und Ihre Änderungen abgleichen.', 422: 'GitHub hat die Änderung abgelehnt. Möglicherweise wurde der Branch inzwischen geändert oder ist geschützt.' };
        throw Error(hints[response.status] || 'GitHub-Anfrage fehlgeschlagen (HTTP ' + response.status + ').');
      }
      return response.status === 204 ? null : response.json();
    }
    async readAt(ref) {
      const file = await this.api('/contents/' + FILE + '?ref=' + encodeURIComponent(ref));
      if (file.encoding !== 'base64' || !file.content) throw Error('GitHub hat keine lesbare Wissensdatei geliefert.');
      return { pack: JSON.parse(fromBase64(file.content)), sha: file.sha };
    }
    async load() { const data = await this.readAt(this.branch); this.sha = data.sha; return data.pack; }
    async publish(pack, offlineBundle) {
      if (!this.sha) throw Error('Bitte zuerst den aktuellen Wissensstand von GitHub laden.');
      const ref = await this.api('/git/ref/heads/' + this.branch.split('/').map(encodeURIComponent).join('/'));
      const head = ref.object.sha;
      const current = await this.readAt(head);
      if (current.sha !== this.sha) throw Error('Die Wissensdatei wurde seit dem Laden geändert. Bitte GitHub neu laden und die Änderungen abgleichen. Ihr Browserentwurf bleibt erhalten.');
      const commit = await this.api('/git/commits/' + head);
      const tree = await this.api('/git/trees', 'POST', { base_tree: commit.tree.sha, tree: [ { path: FILE, mode: '100644', type: 'blob', content: JSON.stringify(pack, null, 2) + '\n' }, { path: 'knowledge/jimmys-funpark.bundle.js', mode: '100644', type: 'blob', content: offlineBundle } ] });
      const next = await this.api('/git/commits', 'POST', { message: 'Update avatar knowledge via Wissensstudio', tree: tree.sha, parents: [head] });
      // Non-forced update rejects a concurrent branch change. Both knowledge files commit together.
      await this.api('/git/refs/heads/' + this.branch.split('/').map(encodeURIComponent).join('/'), 'PATCH', { sha: next.sha, force: false });
      const written = (tree.tree || []).find(e => e.path === FILE);
      this.sha = written?.sha || null;
      if (!this.sha) { try { const latest = await this.readAt(next.sha); this.sha = latest.sha; } catch { /* Commit succeeded; force a reload before another write. */ } }
      return { sha: next.sha, url: 'https://github.com/' + this.repo + '/commit/' + next.sha };
    }
  }
  return { Publisher, FILE };
});

