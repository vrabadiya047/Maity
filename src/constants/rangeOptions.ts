const generateRange = (start: number, end: number, step: number): number[] => {
    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
      result.push(parseFloat(i.toFixed(3)));
    }
    return result;
  };
  
  export const rangeMap: Record<string, number[]> = {
    mass: generateRange(0, 500, 10),
    depth: generateRange(0, 5, 0.1),
    height: generateRange(0, 5, 0.1),
    width: generateRange(0, 10, 0.1),
    span: generateRange(0, 20, 0.5),
    xSectMin: generateRange(0, 5, 0.1),
    xSectMax: generateRange(0, 50, 1),
  };
  