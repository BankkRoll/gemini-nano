// src/hooks/use-chrome-version.ts

import { useEffect, useState } from "react";

export function useChromeVersion(): [string, number, number[]] {
  const [fullVersion, setFullVersion] = useState<string>("");
  const [majorVersion, setMajorVersion] = useState<number>(0);
  const [versionNumbers, setVersionNumbers] = useState<number[]>([]);

  useEffect(() => {
    const regex = /Chrome\/(\d+)\.(\d+)\.(\d+)\.(\d+)/;
    const match = navigator.userAgent.match(regex);

    if (match && match.length >= 5) {
      const fullVersionStr = `${match[1]}.${match[2]}.${match[3]}.${match[4]}`;
      const majorVersionNum = parseInt(match[1], 10);
      const versionNums = match.slice(1, 5).map((num) => parseInt(num, 10));

      setFullVersion(fullVersionStr);
      setMajorVersion(majorVersionNum);
      setVersionNumbers(versionNums);
    }
  }, []);

  return [fullVersion, majorVersion, versionNumbers];
}
