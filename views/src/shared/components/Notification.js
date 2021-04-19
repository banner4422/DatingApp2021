import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './Notification.css';

{/*
reusable notification component

A YouTube tutorial was for this
May not be used

*/}
const NotificationOverlay = props => {
    const content = (
        <div className={`Notification ${props.className}`} style={props.style}>
            <header className={`Notification__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
            }
            >
                {/*content*/}
                <div className={`Notification__content ${props.contentClass}`}>
                    {props.children}
                </div>
                {/*for buttons*/}
                <footer className={`Notification__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById("noti-hook"));
};

{/*renders the reusable notification*/}
const Notification = props => {
    return (
    <React.Fragment>
        {props.show}
        <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        classNames='notification'
        >
        <NotificationOverlay {...props} />
        </CSSTransition>
    </React.Fragment>
    );
};

export default Notification