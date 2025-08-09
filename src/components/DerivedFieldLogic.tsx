export function evaluateDerivedField(formula: string, values: Record<string, any>): string {
    try {
      const func = new Function(...Object.keys(values), `return ${formula};`);
      return func(...Object.values(values)).toString();
    } catch {
      return "Error";
    }
  }
  