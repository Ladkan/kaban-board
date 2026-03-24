import type { Props } from "../../types";

export default function Select({ field }: Props) {
  return (
    <div className="w-full gap-2 flex border-none px-4 py-3 rounded-t-lg text-on-surface appearance-none transition-all">
      {(["low", "medium", "high"] as const).map((p) => {
        const styles = {
          low: "bg-secondary-container text-on-secondary-fixed-variant",
          medium: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
          high: "bg-error-container text-on-error-container",
        };

        const isActive = field.state.value === p;

        return (
          <button
            key={p}
            type="button"
            onClick={() => field.handleChange(isActive ? undefined : p)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isActive ? styles[p] + " ring-2 ring-offset-1 ring-current" : "bg-surface-container-high text-on-surface-variant opacity-60 hover:opacity-100"}`}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
