import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import DOMPurify from "dompurify";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
  Code,
} from "lucide-react";

const sanitize = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "code",
      "pre",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "hr",
      "figure",
      "figcaption",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/)/i,
  });

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreva o conteúdo...",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg my-4 max-w-full h-auto" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[320px] focus:outline-none p-4 bg-card border border-border rounded-b-xl",
      },
    },
    onUpdate: ({ editor }) => onChange(sanitize(editor.getHTML())),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value || "", { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === ""]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `inline-flex size-8 items-center justify-center rounded-md text-sm transition ${
      active
        ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)]"
        : "hover:bg-muted text-foreground/80"
    }`;

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-muted/50 border-b border-border">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
          title="Negrito"
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
          title="Itálico"
        >
          <Italic className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={btn(editor.isActive("code"))}
          title="Código"
        >
          <Code className="size-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btn(editor.isActive("heading", { level: 2 }))}
          title="Título"
        >
          <Heading2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btn(editor.isActive("heading", { level: 3 }))}
          title="Subtítulo"
        >
          <Heading3 className="size-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
          title="Lista"
        >
          <List className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
          title="Lista numerada"
        >
          <ListOrdered className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
          title="Citação"
        >
          <Quote className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btn(false)}
          title="Divisor"
        >
          <Minus className="size-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt(
              "URL do link (https://...)",
              editor.getAttributes("link").href || "https://",
            );
            if (url === null) return;
            if (url === "") editor.chain().focus().unsetLink().run();
            else if (/^https?:\/\//i.test(url))
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          className={btn(editor.isActive("link"))}
          title="Inserir link"
        >
          <LinkIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL da imagem (https://...)");
            if (url && /^https?:\/\//i.test(url))
              editor.chain().focus().setImage({ src: url }).run();
          }}
          className={btn(false)}
          title="Inserir imagem"
        >
          <ImageIcon className="size-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={btn(false)}
          title="Desfazer"
        >
          <Undo className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={btn(false)}
          title="Refazer"
        >
          <Redo className="size-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
