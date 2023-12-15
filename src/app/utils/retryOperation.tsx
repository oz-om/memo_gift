export const retry = async (fn: () => void, maxAttempts: number, delay: number): Promise<any> => {
  const execute = async (attempt: number): Promise<void> => {
    try {
      return fn();
    } catch (err) {
      if (attempt <= maxAttempts) {
        const nextAttempt = attempt + 1;
        const nextDelay = delay * 2;
        console.log(`can't complete operation, Retrying after ${nextDelay} : error => `, err);
        return new Promise((resolve) => setTimeout(() => resolve(execute(nextAttempt)), nextDelay));
      } else {
        throw err;
      }
    }
  };
  return execute(1);
};
