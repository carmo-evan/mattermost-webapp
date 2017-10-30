// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import AbstractIncomingWebhook from 'components/integrations/components/abstract_incoming_webhook.jsx';

describe('components/integrations/AbstractIncomingWebhook', () => {
    const team = {name: 'team_name'};
    const header = {id: 'header_id', defaultMessage: 'Header'};
    const footer = {id: 'footer_id', defaultMessage: 'Footer'};
    const serverError = '';
    const initialHook = {
        display_name: 'testIncomingWebhook',
        channel_id: '88cxd9wpzpbpfp8pad78xj75pr',
        description: 'testing'
    };

    const action = jest.genMockFunction().mockImplementation(
        () => {
            return new Promise((resolve) => {
                process.nextTick(() => resolve());
            });
        }
    );

    const requiredProps = {
        team,
        header,
        footer,
        serverError,
        initialHook,
        action
    };

    test('should match snapshot', () => {
        const wrapper = shallow(<AbstractIncomingWebhook {...requiredProps}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, on serverError', () => {
        const newServerError = 'serverError';
        const props = {...requiredProps, serverError: newServerError};
        const wrapper = shallow(<AbstractIncomingWebhook {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, displays client error when no initial hook', () => {
        const newInitialHook = {};
        const props = {...requiredProps, initialHook: newInitialHook};
        const wrapper = shallow(<AbstractIncomingWebhook {...props}/>);

        wrapper.find('.btn-primary').simulate('click', {preventDefault() {
            return jest.fn();
        }});

        expect(action).not.toBeCalled();
        expect(wrapper).toMatchSnapshot();
    });

    test('should call action function', () => {
        const wrapper = shallow(<AbstractIncomingWebhook {...requiredProps}/>);
        expect(wrapper).toMatchSnapshot();

        wrapper.find('#displayName').simulate('change', {target: {value: 'name'}});
        wrapper.find('.btn-primary').simulate('click', {preventDefault() {
            return jest.fn();
        }});

        expect(action).toBeCalled();
        expect(action).toHaveBeenCalledTimes(1);
    });

    test('should update state.channelId when on channel change', () => {
        const newChannelId = 'new_channel_id';
        const evt = {
            preventDefault: jest.fn(),
            target: {value: newChannelId}
        };

        const wrapper = shallow(<AbstractIncomingWebhook {...requiredProps}/>);
        wrapper.find('#channelId').simulate('change', evt);

        expect(wrapper.state('channelId')).toBe(newChannelId);
    });

    test('should update state.description when on description change', () => {
        const newDescription = 'new_description';
        const evt = {
            preventDefault: jest.fn(),
            target: {value: newDescription}
        };

        const wrapper = shallow(<AbstractIncomingWebhook {...requiredProps}/>);
        wrapper.find('#description').simulate('change', evt);

        expect(wrapper.state('description')).toBe(newDescription);
    });
});