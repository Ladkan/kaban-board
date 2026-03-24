import { useEffect } from "react";
import useQuill from "../../hooks/useQuill";

interface QuillEditorProps {
  value?:       string;
  onChange?:    (html: string) => void;
  placeholder?: string;
  className?:   string;
}

export default function QuillEditor({
    value,
    onChange,
    placeholder,
    className = '',
}: QuillEditorProps) {
    const { containerRef, setContent } = useQuill({ placeholder, onChange: (html) => onChange?.(html) })

    useEffect(() => {
        if(value) setContent(value)
    },[value])

    return(
        <div className={`quill-wrapper ${className}`}>
            <div ref={containerRef} />
        </div>
    )

}