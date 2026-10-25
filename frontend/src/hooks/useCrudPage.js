import { useState } from 'react';
import { useToast } from './useToast';

export function useCrudPage(api, reload, labels) {
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const notify = useToast();

  const openCreate = () => setForm({ item: null });
  const openEdit = (item) => setForm({ item });
  const closeForm = () => setForm(null);

  const save = async (body) => {
    if (form?.item) {
      await api.update(form.item.id, body);
      notify(labels.updated);
      setForm(null);
    } else {
      await api.create(body);
      notify(labels.created);
    }
    await reload();
  };

  const confirmDelete = async () => {
    try {
      await api.remove(toDelete.id);
      notify(labels.deleted);
      setToDelete(null);
      await reload();
    } catch (err) {
      notify(err.message, 'danger');
    }
  };

  return {
    form,
    openCreate,
    openEdit,
    closeForm,
    save,
    toDelete,
    askDelete: setToDelete,
    cancelDelete: () => setToDelete(null),
    confirmDelete,
  };
}
