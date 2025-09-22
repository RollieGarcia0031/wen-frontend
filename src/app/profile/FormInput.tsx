export default function FormInput({type, label, value, onChange, defaultValue}: {
  type: string,
  label: string,
  value?: string,
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <>
    <label className="font-semibold">
      {label}:
    </label>
    <input type={type}
      value={value}
      defaultValue={defaultValue}
      name={label}
      onChange={onChange}
      required
    />
    </>
  );
}