import { useState } from 'react';
import { useToast } from './useToast';

export function useForm({ initialValues, validate, onSubmit, resetOnSuccess }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const notify = useToast();

  const setField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await onSubmit(values);
      if (resetOnSuccess) setValues(initialValues);
    } catch (err) {
      setErrors(err.fieldErrors ?? {});
      notify(err.message, 'danger');
    } finally {
      setSaving(false);
    }
  };

  return { values, errors, saving, setField, handleSubmit };
}
