import { useForm } from '../../hooks/useForm';
import { parseAmount, today, validateTransaction } from '../../utils/validation';
import FormActions from './FormActions';
import FormField from './FormField';

function toFormValues(transaction) {
  if (!transaction) {
    return { date: today(), description: '', category: '', amount: '', type: 'EXPENSE' };
  }
  return {
    date: transaction.date,
    description: transaction.description,
    category: transaction.category,
    amount: String(Math.abs(transaction.amount)),
    type: transaction.type,
  };
}

function toRequest(values) {
  const amount = Math.abs(parseAmount(values.amount));
  return {
    date: values.date,
    description: values.description.trim(),
    category: values.category.trim(),
    amount: values.type === 'EXPENSE' ? -amount : amount,
    type: values.type,
  };
}

function TransactionForm({ transaction, categories, onSubmit, onCancel }) {
  const { values, errors, saving, setField, handleSubmit } = useForm({
    initialValues: toFormValues(transaction),
    validate: validateTransaction,
    onSubmit: (formValues) => onSubmit(toRequest(formValues)),
    resetOnSuccess: !transaction,
  });

  return (
    <form className="row g-3" noValidate onSubmit={handleSubmit}>
      <FormField
        label="Typ"
        name="type"
        as="select"
        className="col-12 col-md-3"
        value={values.type}
        onChange={setField}
        error={errors.type}
        disabled={saving}
      >
        <option value="EXPENSE">Wydatek</option>
        <option value="INCOME">Przychód</option>
      </FormField>
      <FormField
        label="Data"
        name="date"
        type="date"
        className="col-12 col-md-3"
        max={today()}
        value={values.date}
        onChange={setField}
        error={errors.date}
        disabled={saving}
      />
      <FormField
        label="Kwota (PLN)"
        name="amount"
        inputMode="decimal"
        placeholder="np. 120,50"
        className="col-12 col-md-3"
        value={values.amount}
        onChange={setField}
        error={errors.amount}
        disabled={saving}
      />
      <FormField
        label="Kategoria"
        name="category"
        list="transaction-categories"
        className="col-12 col-md-3"
        maxLength={100}
        value={values.category}
        onChange={setField}
        error={errors.category}
        disabled={saving}
      />
      <datalist id="transaction-categories">
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <FormField
        label="Opis"
        name="description"
        maxLength={255}
        placeholder="np. Zakupy spożywcze"
        value={values.description}
        onChange={setField}
        error={errors.description}
        disabled={saving}
      />
      <FormActions saving={saving} editing={Boolean(transaction)} onCancel={onCancel} />
    </form>
  );
}

export default TransactionForm;
