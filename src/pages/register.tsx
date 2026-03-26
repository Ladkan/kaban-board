import { useForm } from "@tanstack/react-form";
import { useAuthStore } from "../stores/useAuthStore";
import { Link, Navigate } from "react-router-dom";

export default function Register() {
  const { isAuthenticated } = useAuthStore();

  const regex = RegExp(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/);

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
    onSubmit: async ({ value }) => {
      //await register(value.name, value.email, value.password);
      console.log(value);
      alert("This is a demo, use the provided credentials");
    },
  });

  if (isAuthenticated) return <Navigate to="/kanban-board" replace />;

  return (
    <div className="w-full max-w-110 rounded-xl p-10 z-10 border border-[#c3c6d6]/15 tonal-depth glass-panel">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-[#191c1e]">
          Create your account
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        noValidate
        className="space-y-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-xs font-bold uppercase tracking-widest text-[#424654] ml-1"
          >
            Username
          </label>
          <div className="relative">
            <form.Field
              name="name"
              validators={{
                onBlur: ({ value }) =>
                  value.length >= 1 ? undefined : "Enter username",
              }}
            >
              {(field) => (
                <>
                  <input
                    className="w-full bg-[#e6e8ea] border-none rounded-lg px-4 py-3 text-[#191c1e] transition-all placeholder:text-[#737785] focus:ring-0 focus:border-2 focus:border-[#0040a1]"
                    id="name"
                    type="text"
                    placeholder="John Doe"
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
              )}
            </form.Field>
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-bold uppercase tracking-widest text-[#424654] ml-1"
          >
            Email Addrtess
          </label>
          <div className="relative">
            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) =>
                  regex.test(value) ? undefined : "Enter valid email",
              }}
            >
              {(field) => (
                <>
                  <input
                    className="w-full bg-[#e6e8ea] border-none rounded-lg px-4 py-3 text-[#191c1e] transition-all placeholder:text-[#737785] focus:ring-0 focus:border-2 focus:border-[#0040a1]"
                    id="email"
                    type="email"
                    placeholder="name@company.com"
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
              )}
            </form.Field>
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-xs font-bold uppercase tracking-widest text-[#424654] ml-1"
          >
            Password
          </label>
          <div className="relative">
            <form.Field
              name="password"
              validators={{
                onBlur: ({ value }) =>
                  value.length >= 8
                    ? undefined
                    : "The password must be at least 8 characters long",
              }}
            >
              {(field) => (
                <>
                  <input
                    className="w-full bg-[#e6e8ea] border-none rounded-lg px-4 py-3 text-[#191c1e] transition-all placeholder:text-[#737785] focus:ring-0 focus:border-2 focus:border-[#0040a1]"
                    id="password"
                    type="password"
                    placeholder="••••••••"
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
              )}
            </form.Field>
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-xs font-bold uppercase tracking-widest text-[#424654] ml-1"
          >
            Password Confirm
          </label>
          <div className="relative">
            <form.Field
              name="passwordConfirm"
              validators={{
                onBlurListenTo: ["password"],
                onBlur: ({ value, fieldApi }) => {
                  const password = fieldApi.form.getFieldValue("password");
                  if (value !== password) return "Password dont match";
                },
              }}
            >
              {(field) => (
                <>
                  <input
                    className="w-full bg-[#e6e8ea] border-none rounded-lg px-4 py-3 text-[#191c1e] transition-all placeholder:text-[#737785] focus:ring-0 focus:border-2 focus:border-[#0040a1]"
                    id="passwordConfirm"
                    type="password"
                    placeholder="••••••••"
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
              )}
            </form.Field>
          </div>
        </div>
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              disabled={!canSubmit || isSubmitting}
              className="cursor-pointer primary-gradient w-full text-white font-bold py-4 rounded-full tonal-depth hover:opacity-95 active:scale-[0.98] transition-all fley justify-center items-center gap-2"
            >
              Register
            </button>
          )}
        </form.Subscribe>
      </form>
      <p className="mt-8 text-center text-sm text-[#424654]">
        Already have an account?{" "}
        <Link
          className="text-[#0040a1] font-bold hover:underline"
          to="/kanban-board/login"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
