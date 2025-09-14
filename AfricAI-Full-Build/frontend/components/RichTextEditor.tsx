import React, { useRef } from 'react';
import { BoldIcon } from './icons/BoldIcon';
import { ItalicIcon } from './icons/ItalicIcon';
import { UnderlineIcon } from './icons/UnderlineIcon';
import { ListIcon } from './icons/ListIcon';
import { ListOrderedIcon } from './icons/ListOrderedIcon';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  const execCmd = (command: string) => {
    document.execCommand(command, false, undefined);
    editorRef.current?.focus();
  };

  const toolbarButtons = [
    { command: 'bold', icon: BoldIcon, label: 'Bold' },
    { command: 'italic', icon: ItalicIcon, label: 'Italic' },
    { command: 'underline', icon: UnderlineIcon, label: 'Underline' },
    { command: 'insertUnorderedList', icon: ListIcon, label: 'Unordered List' },
    { command: 'insertOrderedList', icon: ListOrderedIcon, label: 'Ordered List' },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-md focus-within:ring-2 focus-within:ring-nebula-600">
      <div className="flex items-center p-2 border-b border-white/10 flex-wrap">
        {toolbarButtons.map(({ command, icon: Icon, label }) => (
          <button
            key={command}
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus
            onClick={() => execCmd(command)}
            className="p-2 rounded-md hover:bg-white/10 text-gray-300"
            aria-label={label}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="w-full min-h-[150px] p-3 text-sm focus:outline-none"
        data-placeholder={placeholder}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
};

export default RichTextEditor;
