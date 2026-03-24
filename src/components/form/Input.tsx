import type { Props } from "../../types";

export default function Input({ field }: Props) {
  return (
    <>
      <input
        className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-t-lg text-on-surface placeholder:text-outline-variant transition-all"
        type="text"
        id="title"
        placeholder="New product"
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && (
        <em className="text-xs text-[#93000a]">
          {field.state.meta.errors.join(",")}
        </em>
      )}
    </>
  );
}
