export default function fetchJson(jsonURL) {
    return fetch(jsonURL)
      .then(response => response.json())
      .catch(error => {
        let err = new Error(`Error fetching ${jsonURL}: ${error.message}`);
        err.cause = error;
        throw err;
      });
}