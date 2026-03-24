
interface FormHeaderProps {
    title: string;
    onClick: () => void;
}

export default function FormHeader({ onClick, title }:FormHeaderProps) {
  return (
    <div className="px-8 pt-8 pb-4 flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
          {title}
        </h2>
      </div>
      <button
        onClick={() => onClick()}
        className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
      >
        close
      </button>
    </div>
  );
}

