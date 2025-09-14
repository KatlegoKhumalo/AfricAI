// hooks/useForm.ts
import { useState, useCallback, FormEvent } from 'react';

// FIX: Updated Validator type to accept all form values for cross-field validation.
type Validator<V, T> = (value: V, allValues: T) => string | null;

type ValidationRules<T> = {
  [K in keyof T]?: Validator<T[K], T>;
};

interface UseFormOptions<T> {
  initialValues: T;
  validationRules: ValidationRules<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    for (const key in validationRules) {
      const rule = validationRules[key];
      if (rule) {
        // FIX: Pass all form values to the validator function to enable cross-field validation.
        const error = rule(values[key], values);
        if (error) {
          newErrors[key] = error;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let processedValue: string | boolean = value;

    if (type === 'checkbox') {
        processedValue = (e.target as HTMLInputElement).checked;
    }

    setValues(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      await onSubmit(values);
      setIsSubmitting(false);
    }
  };
  
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    setValues,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
};