const encode = (pswd: string): Promise<string> => {
  return crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(pswd))
    .then(buf => {
      return Array.prototype.map
        .call(new Uint8Array(buf), x => ('00' + x.toString(16)).slice(-2))
        .join('');
    });
};

const decode = (pswd: string): Promise<string> => {
  return crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(pswd))
    .then(buf => {
      return Array.prototype.map
        .call(new Uint8Array(buf), x => ('00' + x.toString(16)).slice(-2))
        .join('');
    });
};

export { encode, decode };
