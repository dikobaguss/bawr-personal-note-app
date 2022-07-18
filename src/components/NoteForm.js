import { useEffect, useState } from 'react';
import FormControl from './FormControl';
import FormInput from './FormInput';
import FormTextArea from './FormTextArea';

export default function NoteForm({
  activeTabContent, setNotes, notes, setNotification,
}) {
  const initialFormError = { title: '', body: '' };
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [formError, setFormError] = useState(initialFormError);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [titleLength, setTitleLength] = useState(0);

  const handleTitleChange = (value) => {
    setTitle(value);
    setTitleLength(value.length);
  };

  const onAddNote = (e) => {
    e.preventDefault();
    setFormError(initialFormError);

    if (!title.trim()) {
      setFormError((prevErrorState) => ({ ...prevErrorState, title: 'Judul tidak boleh kosong' }));
    }
    if (!body.trim()) {
      setFormError((prevErrorState) => ({
        ...prevErrorState,
        body: 'Isi catatan tidak boleh kosong',
      }));
    }
    if (title.trim() !== '' && body.trim() !== '') {
      setFormError(initialFormError);
      setTitle('');
      setBody('');
      setTitleLength(0);
      const note = {
        id: +new Date(),
        title: title.trim(),
        body: body.trim(),
        archived: false,
        createdAt: new Date(),
      };
      setNotes([...notes, note]);
      setNotification('Catatan berhasil ditambahkan');
    }
  };

  useEffect(() => {
    if (!title.trim()) {
      setFormError((prevErrorState) => ({ ...prevErrorState, title: '' }));
    }
    if (!body.trim()) {
      setFormError((prevErrorState) => ({ ...prevErrorState, body: '' }));
    }
    setFormError((prevState) => ({
      ...prevState,
      title: titleLength > 50 ? 'Judul tidak boleh lebih dari 50 karakter' : '',
    }));
    setButtonDisabled(!(title.trim() !== '' && body.trim() !== '' && titleLength <= 50));
  }, [title, body, titleLength]);

  return (
    <form
      action="#"
      method="post"
      className={`${activeTabContent === 'form' ? 'space-y-5' : 'hidden'}`}
      id="form"
      data-action="add"
      aria-labelledby="tab-form"
      role="tabpanel"
      tabIndex="0"
      onSubmit={(e) => onAddNote(e)}
    >
      <h2 className="text-xl font-bold tracking-wide text-primary">Tambah Catatan Baru</h2>
      <div className="flex flex-col space-y-3">
        <FormControl label="title" title="Judul">
          <FormInput
            value={title}
            onInput={handleTitleChange}
            isError={!!formError.title}
            label="title"
          />
          {titleLength > 0 && titleLength <= 50 && (
            <p className={`${titleLength < 40 ? 'text-green-500' : 'text-yellow-500'} text-xs`}>
              Judul bersisa
              {' '}
              {50 - titleLength}
              {' '}
              karakter lagi
            </p>
          )}
          {formError.title && <p className="text-xs text-red-500">{formError.title}</p>}
        </FormControl>
      </div>
      <div className="flex flex-col space-y-3">
        <FormControl label="body" title="Isi Catatan">
          <FormTextArea
            value={body}
            rows={5}
            onInput={setBody}
            isError={!!formError.body}
            label="body"
          />
          {formError.body && <p className="text-xs text-red-500">{formError.body}</p>}
        </FormControl>
      </div>
      <div className="py-3">
        <button
          type="submit"
          className="w-full rounded-md bg-primary py-3 px-5 text-white"
          disabled={buttonDisabled}
        >
          Tambahkan Catatan
        </button>
      </div>
    </form>
  );
}
