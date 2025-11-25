import { useState, ChangeEvent } from "react";

/**
 * Used to track changes within multiple forms
 *
 * example:
 * const { values, onChange, dirtyFields } = useDirtyForm({name: "Roy", age: 12});
 *
 * <input onChange={onChange} value={values.name} />
 */
export function useDirtyForm<T extends Record<string, any>>(initial: T) {
  const [initialValues] = useState<T>(initial);
  const [values, setValues] = useState<T>(initial);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Ensure name is a valid key of T
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Build diff-like dirtyFields object
  const dirtyFields: Partial<T> = {};
  for (const key in values) {
    if (values[key] !== initialValues[key]) {
      dirtyFields[key] = values[key];
    }
  }

  return { values, onChange, dirtyFields };
}

