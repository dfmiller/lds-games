(() => {
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  if (localStorage.getItem("va-disable") !== null) {
    return;
  }

  const analyticsScript = document.createElement("script");
  analyticsScript.defer = true;
  analyticsScript.src = "/_vercel/insights/script.js";
  document.head.append(analyticsScript);
})();
