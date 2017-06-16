exports.getQueryString = (query) => {
  return '?' + Object.keys(query)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
    .join("&")
    .replace(/%20/g, "+");
};
