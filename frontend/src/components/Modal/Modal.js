import React from 'react';
import './Modal.css';

const modal = props => (
    <div className="modal">
        <header className="modal__header">
            {props.title}
        </header>
        <section className="modal__content">
            {props.children}
        </section>
        <section className="modal__actions">
            {props.canCancel && <button className="btn" onClick={props.cancel}>Cancel</button>}
            {props.canConfirm && <button className="btn" onClick={props.confirm}>Confirm</button>}
        </section>
    </div>
)

export default modal;