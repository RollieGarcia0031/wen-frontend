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

  type InputName = keyof T;

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> &
      { target: { name: InputName; value: any } }
  ) => {
    const { name, value } = e.target;

    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  /**
   * tracks the fields that have been changed
   */
  const dirtyFields = Object.keys(values).reduce((acc, key) => {
    const typedKey = key as keyof T;
    if (values[typedKey] !== initialValues[typedKey]) {
      acc[typedKey] = values[typedKey];
    }
    return acc;
  }, {} as Partial<T>);

  const isDirty = Object.keys(dirtyFields).length > 0;

  /** reset the form back to the initial state */
  const resetForm = () => {
    setValues(initialValues);
  };

  return {
    values,
    onChange,
    dirtyFields,
    isDirty,
    resetForm
  };
}

