import Quill from "quill";
import { useEffect, useRef } from "react";
import 'quill/dist/quill.snow.css'

interface UseQuillOptions {
  placeholder?: string;
  onChange?: (html: string, text: string) => void;
}

export default function useQuill({ onChange, placeholder }: UseQuillOptions){
    const containerRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)
    const onChangeRef = useRef(onChange)

    useEffect(() => { onChangeRef.current = onChange }, [onChange])

    useEffect(() => {
        if(!containerRef.current || quillRef.current) return

        quillRef.current = new Quill(containerRef.current, {
            theme: 'snow',
            placeholder: placeholder ?? 'Add description...',
            modules: {
                toolbar: [
                    ['bold','italic','underline','strike'],
                    [{list: 'orderd'},{list: 'bullet'}],
                    ['blockquote','code-block'],
                    ['link'],
                    ['clean']
                ],
            },
        })

        quillRef.current.on('text-change', () => {
            const html = quillRef.current!.getSemanticHTML()
            const text = quillRef.current!.getText()
            onChangeRef.current?.(html, text)
        })

        return () => {
            quillRef.current = null
        }

    }, [])

    function setContent(html: string) {
        if(!quillRef.current) return

        const delta = quillRef.current.clipboard.convert({ html })
        quillRef.current.setContents(delta, 'silent')
    }

    function clearContent(){
        quillRef.current?.setContents([],'silent')
    }

    return { containerRef, quillRef, setContent, clearContent }

}