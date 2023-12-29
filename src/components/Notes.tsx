import { useRef, useEffect, useState, useCallback} from 'react';
import enter from '../img/enter_icon.png';
import arrows from '../img/two_arrows.png';
import NoteCard from './NoteCard';

const Notes = () => {
  const refEnter = useRef<HTMLImageElement>(null);
  const refCross = useRef<HTMLImageElement>(null);
  const refNotes = useRef<HTMLDivElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const refArrows = useRef<HTMLImageElement>(null);
  const notesLink = 'http://localhost:3001/notes';
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(notesLink);
      if (response.status === 200) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error('Error fetching notes:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, []);

  const addNote = useCallback(async (e: Event) => {
    const elementInput = refInput.current as HTMLInputElement;
    e.preventDefault();
    if (elementInput.value.trim() === '') {
      return;
    }
    try {
      const response = await fetch(notesLink, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 0, content: elementInput.value }),
      });
      if (response.status === 204) {
        fetchNotes();
        setContent('');
      } else {
        console.error('Error adding note:', response.status);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }, [fetchNotes]);

  const deleteNote = useCallback(async (e: Event) => {
    e.preventDefault();
    const id = (e.currentTarget as HTMLImageElement).parentElement?.getAttribute('id');  
    console.log((e.currentTarget as HTMLImageElement).parentElement?.getAttribute('id'))
    try {
      const response = await fetch(notesLink + `/${id}`, { method: 'DELETE' });
      if (response.status === 204) {
        fetchNotes();
      } else {
        console.error('Error deleting note:', response.status);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, [fetchNotes]);

  const getInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value) 
  }
  
  useEffect(() => {
    const elementEnter = refEnter.current as HTMLImageElement;
    const elementCross = refCross.current as HTMLImageElement;
    const elementArrows = refArrows.current as HTMLImageElement;
    fetchNotes();
    if (elementEnter) {
      elementEnter.addEventListener('click', addNote);
    }
    if (elementCross) {
      elementCross.addEventListener('click', deleteNote);
    }
    if (elementArrows) {
      elementArrows.addEventListener('click', fetchNotes);
    }
    return () => {
      elementEnter?.removeEventListener('click', addNote);
      elementCross?.removeEventListener('click', deleteNote);
      elementArrows?.removeEventListener('click', fetchNotes);
    };
    }, [addNote, deleteNote, fetchNotes]);

  return (
    <div className='notes' ref={refNotes}>
      <div className='notes_title'>
        <h3>Notes</h3>
        <img src={arrows} alt='arrows' className='notes_title-img' ref={refArrows}/>
      </div>
      <div className='notes_list'>
        {notes.map((note: any) => (
          <NoteCard key={note.id} id={note.id} text={note.content} deleteFunction={deleteNote} />
        ))}
      </div>
      <div className='notes_input'>
        <input type='textarea' value={content} className='notes_input-field' ref={refInput} onChange={getInput}/>
        <img src={enter} alt='enter' className='notes_input-img' ref={refEnter} />
      </div>
    </div>
  );
};

export default Notes;
