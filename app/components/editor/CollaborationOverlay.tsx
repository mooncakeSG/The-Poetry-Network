import { useEffect, useRef } from 'react';

interface Cursor {
  position: number;
  userId: string;
  userName: string;
  color: string;
}

interface Selection {
  start: number;
  end: number;
  userId: string;
  userName: string;
  color: string;
}

interface CollaborationOverlayProps {
  editorRef: React.RefObject<HTMLTextAreaElement>;
  cursors: Cursor[];
  selections: Selection[];
  isMobile: boolean;
}

export function CollaborationOverlay({
  editorRef,
  cursors,
  selections,
  isMobile,
}: CollaborationOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current || !overlayRef.current) return;

    const editor = editorRef.current;
    const overlay = overlayRef.current;

    // Update overlay dimensions to match editor
    const updateOverlayDimensions = () => {
      const { width, height, top, left, padding } = window.getComputedStyle(editor);
      overlay.style.width = width;
      overlay.style.height = height;
      overlay.style.top = `${top}px`;
      overlay.style.left = `${left}px`;
      overlay.style.padding = padding;
    };

    // Update dimensions on resize and orientation change
    window.addEventListener('resize', updateOverlayDimensions);
    window.addEventListener('orientationchange', updateOverlayDimensions);
    updateOverlayDimensions();

    return () => {
      window.removeEventListener('resize', updateOverlayDimensions);
      window.removeEventListener('orientationchange', updateOverlayDimensions);
    };
  }, [editorRef]);

  const getTextPosition = (position: number) => {
    if (!editorRef.current) return { top: 0, left: 0 };

    const editor = editorRef.current;
    const text = editor.value.substring(0, position);
    const lines = text.split('\n');
    const currentLine = lines.length - 1;
    const currentColumn = lines[currentLine].length;

    // Create a temporary element to measure text dimensions
    const temp = document.createElement('div');
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    temp.style.whiteSpace = 'pre-wrap';
    temp.style.wordWrap = 'break-word';
    temp.style.width = `${editor.clientWidth}px`;
    temp.style.font = window.getComputedStyle(editor).font;
    temp.style.padding = window.getComputedStyle(editor).padding;
    temp.style.lineHeight = window.getComputedStyle(editor).lineHeight;
    temp.style.border = window.getComputedStyle(editor).border;
    temp.style.boxSizing = window.getComputedStyle(editor).boxSizing;

    // Create text content with cursor position
    const textContent = lines.slice(0, currentLine).join('\n') + '\n';
    const currentLineContent = lines[currentLine].substring(0, currentColumn);
    temp.textContent = textContent + currentLineContent;

    document.body.appendChild(temp);
    const { offsetHeight, offsetWidth } = temp;
    document.body.removeChild(temp);

    return {
      top: offsetHeight,
      left: offsetWidth,
    };
  };

  return (
    <div
      ref={overlayRef}
      className="absolute pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {/* Render cursors */}
      {cursors.map((cursor) => {
        const { top, left } = getTextPosition(cursor.position);
        return (
          <div
            key={`cursor-${cursor.userId}`}
            className={`absolute ${isMobile ? 'w-3 h-6' : 'w-2 h-5'}`}
            style={{
              top: `${top}px`,
              left: `${left}px`,
              backgroundColor: cursor.color,
            }}
          >
            <div
              className={`absolute -top-6 left-0 px-2 py-1 text-white rounded
                ${isMobile ? 'text-sm' : 'text-xs'}
                whitespace-nowrap
                transform -translate-x-1/2
                pointer-events-auto`}
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.userName}
            </div>
          </div>
        );
      })}

      {/* Render selections */}
      {selections.map((selection) => {
        const start = getTextPosition(selection.start);
        const end = getTextPosition(selection.end);
        const width = end.left - start.left;
        const height = end.top - start.top;

        return (
          <div
            key={`selection-${selection.userId}`}
            className="absolute"
            style={{
              top: `${start.top}px`,
              left: `${start.left}px`,
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: `${selection.color}33`,
              border: `1px solid ${selection.color}`,
            }}
          >
            <div
              className={`absolute -top-6 left-0 px-2 py-1 text-white rounded
                ${isMobile ? 'text-sm' : 'text-xs'}
                whitespace-nowrap
                transform -translate-x-1/2
                pointer-events-auto`}
              style={{ backgroundColor: selection.color }}
            >
              {selection.userName}
            </div>
          </div>
        );
      })}
    </div>
  );
} 