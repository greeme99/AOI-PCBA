import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInspectionStore } from '../stores/useInspectionStore';

export function useSyncUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeLineId = useInspectionStore((s) => s.activeLineId);
  const currentModelKey = useInspectionStore((s) => s.currentModelKey);
  
  const selectLine = useInspectionStore((s) => s.selectLine);
  const selectModel = useInspectionStore((s) => s.selectModel);

  // To prevent unnecessary loops, track initialization
  const isInitialized = useRef(false);

  useEffect(() => {
    const line = searchParams.get('line');
    const model = searchParams.get('model');

    let needsRedirect = false;
    const newParams = new URLSearchParams(searchParams);

    // 1. URL에 파라미터가 없으면 현재 스토어의 값으로 URL을 세팅 (초기 접속 보정)
    if (!line) {
      newParams.set('line', activeLineId);
      needsRedirect = true;
    } else if (line !== activeLineId) {
      // 2. URL 파라미터가 존재하지만 스토어와 다르면 스토어를 URL 기준으로 업데이트 (뒤로가기 등)
      selectLine(line);
    }

    if (!model) {
      newParams.set('model', currentModelKey);
      needsRedirect = true;
    } else if (model !== currentModelKey) {
      selectModel(model);
    }

    if (needsRedirect) {
      // replace: true 옵션으로 불필요한 히스토리 푸시를 방지
      setSearchParams(newParams, { replace: true });
    }

    isInitialized.current = true;
  }, [searchParams, activeLineId, currentModelKey, selectLine, selectModel, setSearchParams]);
}
