import { useForm } from '../../hooks/useForm';
import { parseAmount, validateGoal } from '../../utils/validation';
import FormActions from './FormActions';
import FormField from './FormField';

function toFormValues(goal) {
  if (!goal) {
    return { name: '', targetAmount: '', savedAmount: '0', deadline: '' };
  }
  return {
    name: goal.name,
    targetAmount: String(goal.targetAmount),
    savedAmount: String(goal.savedAmount),
    deadline: goal.deadline,
  };
}

function GoalForm({ goal, onSubmit, onCancel }) {
  const { values, errors, saving, setField, handleSubmit } = useForm({
    initialValues: toFormValues(goal),
    validate: validateGoal,
    onSubmit: (formValues) =>
      onSubmit({
        name: formValues.name.trim(),
        targetAmount: parseAmount(formValues.targetAmount),
        savedAmount: parseAmount(formValues.savedAmount),
        deadline: formValues.deadline,
      }),
    resetOnSuccess: !goal,
  });

  return (
    <form className="row g-3" noValidate onSubmit={handleSubmit}>
      <FormField
        label="Nazwa celu"
        name="name"
        className="col-12 col-md-6"
        maxLength={150}
        placeholder="np. Nowy rower"
        value={values.name}
        onChange={setField}
        error={errors.name}
        disabled={saving}
      />
      <FormField
        label="Termin realizacji"
        name="deadline"
        type="date"
        className="col-12 col-md-6"
        value={values.deadline}
        onChange={setField}
        error={errors.deadline}
        disabled={saving}
      />
      <FormField
        label="Kwota docelowa (PLN)"
        name="targetAmount"
        inputMode="decimal"
        className="col-12 col-md-6"
        value={values.targetAmount}
        onChange={setField}
        error={errors.targetAmount}
        disabled={saving}
      />
      <FormField
        label="Odłożona kwota (PLN)"
        name="savedAmount"
        inputMode="decimal"
        className="col-12 col-md-6"
        value={values.savedAmount}
        onChange={setField}
        error={errors.savedAmount}
        disabled={saving}
      />
      <FormActions saving={saving} editing={Boolean(goal)} onCancel={onCancel} />
    </form>
  );
}

export default GoalForm;
