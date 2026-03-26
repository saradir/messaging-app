import { useEffect } from "react";
import { createPortal } from "react-dom";

import "../styles/Modal.css"

export function Modal({children, onClose}){
    


    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = prev;
        }
    }, [onClose]);

    return(
        createPortal(
            <div className="backdrop" onClick={onClose}>
                <div className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
                    
                    {children}

                    <div className="modal-controls">
                        <button onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>,
            document.body
        )
    );
}


