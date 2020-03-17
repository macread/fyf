import React from 'react';

import ReactDOM from 'react-dom';

import SignUp from './SignUp';

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(
        <SignUp
            dialogProps={
                {
                    open: true,

                    onClose: () => { }
                }
            }

            content={<div></div>}
        />,
        div
    );

    ReactDOM.unmountComponentAtNode(div);
});