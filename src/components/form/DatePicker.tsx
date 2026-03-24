import { format } from "date-fns";
import type { Props } from "../../types";

export default function DatePicker({ field }: Props) {

    const date = field.state.value ? format(new Date(field.state.value as string), "yyyy-MM-dd") : ""

  return (
    <>
      <input
        id="duedate"
        className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-t-lg text-on-surface transition-all"
        type="date"
        name={field.name}
        value={date}
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
