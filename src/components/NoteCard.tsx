import cross from '../img/circle-cross.png';
import React, {useRef, useEffect} from 'react'

interface NoteCardProps {
  text: string;
  id: string;
  deleteFunction: (e: Event) => Promise<void>;
}

const NoteCard = ({ text, id, deleteFunction }: NoteCardProps): JSX.Element => {

  const refImgNote = useRef<HTMLImageElement>(null);

  useEffect (() => {
    const element = refImgNote.current as HTMLImageElement;
    if (element) {
        element.addEventListener('click', deleteFunction);
    }
    return () => {
        element?.removeEventListener('click', deleteFunction);
    };
}, [deleteFunction])

  return (
  <>
    <div id={id} className="note-card">
      <p className="note-card_text">{text}</p>
      <img src={cross} alt="cross" className="note-card_img" ref={refImgNote}/>
    </div>
    
  </>
  )
}

export default NoteCard