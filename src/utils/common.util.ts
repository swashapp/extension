const commonUtils = (function () {
  async function dlJson<Type>(url: string): Promise<Type> {
    return await (await fetch(url, { cache: 'no-store' })).json();
  }

  return {
    dlJson,
  };
})();

export { commonUtils };
