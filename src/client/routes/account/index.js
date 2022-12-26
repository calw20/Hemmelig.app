import React, { useEffect, useState } from 'react';
import { Container, Stack, Text, Button, Group, Tabs } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconUser, IconAt, IconLock, IconTrash, IconSettings, IconEdit } from '@tabler/icons';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getToken, hasToken, removeToken } from '../../helpers/token';
import { userLoginChanged } from '../../actions';

import Spinner from '../../components/spinner';
import Error from '../../components/info/error';

import { getUser, updateUser, deleteUser } from '../../api/account';

import { useTranslation } from 'react-i18next';

const Account = () => {
    const { t } = useTranslation();

    const [token, setToken] = useState(hasToken() ? getToken() : '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('account');

    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            return;
        }

        (async () => {
            try {
                setLoading(true);
                const response = await getUser(token);

                if (response.statusCode === 401 || response.statusCode === 500) {
                    setError('Not logged in');

                    return;
                }

                dispatch(userLoginChanged(true));
                setLoading(false);

                const { user } = response;

                setUser(user);

                setError(null);
            } catch (e) {
                setError(e);
            }
        })();

        // eslint-disable-next-line
    }, [token, dispatch]);

    if (error) {
        return <Error>{error.error}</Error>;
    }

    if (!token) {
        return <Redirect to="/" />;
    }

    if (loading) {
        return <Spinner />;
    }

    const onDeleteUser = async () => {
        try {
            const response = await deleteUser(token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                setError('Could not delete the user');

                return;
            }
        } catch (e) {
            setError(e);
        }

        removeToken();

        setToken('');
    };

    const openDeleteModal = () =>
        openConfirmModal({
            title: 'Delete your profile',
            centered: true,
            children: <Text size="sm">Are you sure you want to delete your profile?</Text>,
            labels: { confirm: 'Delete account', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onConfirm: () => onDeleteUser(),
        });

    return (
        <Container>
            <Tabs color="orange" defaultValue={activeTab}>
                <Tabs.List>
                    <Tabs.Tab value="account" icon={<IconUser size={14} />}>
                        {t('account')}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="account" pt="xs">
                    <Stack>
                        <Text size="sm">
                            Hi, <strong>{user.username}</strong> (
                            <a href={'mailto:' + user.email}>{user.email}</a>)
                        </Text>

                        <Text size="sm">
                            We are glad you logged in. Here is the list of features signed in users
                            get:
                            <ul>
                                <li>Upload files</li>
                                <li>Expire time of 14 and 28 days for secrets</li>
                            </ul>
                            More features are coming! Thanks for joining Hemmelig.app!
                            <span role="img" aria-label="celebration icon">
                                🎉 🎉 🎉 🎉
                            </span>
                        </Text>

                        <Text size="sm">
                            If you do not feel to be part of the Hemmelig.app journey anymore. Feel
                            free to delete your profile. Hemmelig will remove all the information
                            connected to your account! Do note however that if you login again, a
                            new account will be generated in Hemmelig with the SSO detailed
                            provided.
                        </Text>

                        <Group position="right">
                            <Button
                                variant="gradient"
                                gradient={{ from: 'orange', to: 'red' }}
                                onClick={openDeleteModal}
                                leftIcon={<IconTrash size={14} />}
                            >
                                Delete profile
                            </Button>
                        </Group>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};

export default Account;
