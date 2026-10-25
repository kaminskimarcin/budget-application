import { useForm } from '../../hooks/useForm';
import { parseAmount, validateBudget } from '../../utils/validation';
import FormActions from './FormActions';
import FormField from './FormField';

function BudgetForm({ budget, existingCategories, onSubmit, onCancel }) {
  const { values, errors, saving, setField, handleSubmit } = useForm({
    initialValues: budget ? { category: budget.category, limit: String(budget.limit) } : { category: '', limit: '' },
    validate: (formValues) => validateBudget(formValues, existingCategories),
    onSubmit: (formValues) =>
      onSubmit({ category: formValues.category.trim(), limit: parseAmount(formValues.limit) }),
    resetOnSuccess: !budget,
  });

  return (
    <form className="row g-3" noValidate onSubmit={handleSubmit}>
      <FormField
        label="Kategoria"
        name="category"
        className="col-12 col-md-6"
        maxLength={100}
        placeholder="np. Zdrowie"
        value={values.category}
        onChange={setField}
        error={errors.category}
        disabled={saving}
      />
      <FormField
        label="Miesięczny limit (PLN)"
        name="limit"
        inputMode="decimal"
        placeholder="np. 400"
        className="col-12 col-md-6"
        value={values.limit}
        onChange={setField}
        error={errors.limit}
        disabled={saving}
      />
      <FormActions saving={saving} editing={Boolean(budget)} onCancel={onCancel} />
    </form>
  );
}

export default BudgetForm;
