const blockedElements = "script,iframe,object,embed,base,form,meta[http-equiv],link[rel='import']";

export function sanitizeGeneratedHtml(html: string): string {
  const documentValue = new DOMParser().parseFromString(html, "text/html");
  documentValue.querySelectorAll(blockedElements).forEach((element) => element.remove());
  documentValue.querySelectorAll("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on")) element.removeAttribute(attribute.name);
      if ((name === "href" || name === "src") && value.startsWith("javascript:")) {
        element.removeAttribute(attribute.name);
      }
      if (name === "src" && value.startsWith("data:") && !value.startsWith("data:image/")) {
        element.removeAttribute(attribute.name);
      }
    }
  });
  return `<!doctype html>${documentValue.documentElement.outerHTML}`;
}
