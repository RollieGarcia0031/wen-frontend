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
  const [initialValues, setInitialValues] = useState<T>(initial);
  const [values, setValues] = useState<T>(initial);

  type InputName = keyof T;

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const dirtyFields = Object.keys(values).reduce((acc, key) => {
    const typedKey = key as keyof T;
    if (values[typedKey] !== initialValues[typedKey]) {
      acc[typedKey] = values[typedKey];
    }
    return acc;
  }, {} as Partial<T>);

  const isDirty = Object.keys(dirtyFields).length > 0;

  const resetForm = () => {
    setValues(initialValues);
  };

  /** explicitly update the baseline and current values */
  const setInitial = (newInitial: T) => {
    setInitialValues(newInitial);
    setValues(newInitial);
  };

  return {
    values,
    onChange,
    dirtyFields,
    isDirty,
    resetForm,
    setInitial
  };
}
