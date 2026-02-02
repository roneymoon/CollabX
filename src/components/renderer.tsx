import DOMPurify from "dompurify";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  if (!value || value.trim().length === 0) return null;

  return (
    <div
      className="ql-editor ql-renderer"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(value),
      }}
    />
  );
};

export default Renderer;
