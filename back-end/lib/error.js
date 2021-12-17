

module.exports = class StatusError extends Error {
  constructor(status, ...params) {
    // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
    super(...params);

    // Maintenir dans la pile une trace adéquate de l'endroit où l'erreur a été déclenchée (disponible seulement en V8)
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, StatusError);
    }
    this.name = 'StatusError';
    // Informations de déboguage personnalisées
    this.status = status;
    this.date = new Date();
  }
}
