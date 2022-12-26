import validator from 'validator';
import emailValidator from 'email-validator';
import { hash, compare } from '../helpers/password.js';
import * as redis from '../services/redis.js';

const PASSWORD_LENGTH = 5;

async function account(fastify) {
    fastify.get(
        '/',
        {
            preValidation: [fastify.authenticate],
        },
        async (request) => {
            const user = await redis.getUser(validator.escape(request.user.username));

            return {
                user: {
                    username: user.username,
                    email: user.email,
                },
            };
        }
    );

    /* SSO Has no use for updating info
    fastify.put(
        '/update',
        {
            preValidation: [fastify.authenticate],
        },
        async (request, reply) => {
            const {
                currentPassword = '',
                newPassword = '',
                email = '',
                confirmNewPassword = '',
            } = request.body;

            const data = {};

            const user = await redis.getUser(validator.escape(request.user.username));

            if (
                !currentPassword ||
                !user ||
                !(await compare(validator.escape(currentPassword), user.password))
            ) {
                return reply
                    .code(401)
                    .send({ type: 'currentPassword', error: 'Incorrect password' });
            }
            
            //Password updating not a thing
            if (newPassword && false) {
                if (newPassword.length < PASSWORD_LENGTH) {
                    return reply.code(403).send({
                        type: 'newPassword',
                        error: `Password has to be longer than ${PASSWORD_LENGTH} characters`,
                    });
                }

                data.password = await hash(validator.escape(newPassword));
            }

            if (email) {
                if (!emailValidator.validate(email)) {
                    return reply.code(403).send({
                        type: 'email',
                        error: `Your email: "${email}" is not valid.`,
                    });
                }

                data.email = email;
            }

            if (!email && !newPassword) {
                return reply.code(412).send({
                    type: 'no-data',
                    error: `Could not update your profile. Please set the fields you want to update.`,
                });
            }

            if (newPassword !== confirmNewPassword) {
                return reply.code(400).send({
                    type: 'confirmNewPassword',
                    error: `The password and confirmation password do not match.`,
                });
            }

            const userData = await redis.updateUser(validator.escape(request.user.username), data);

            return {
                user: {
                    username: userData.username,
                    email: userData.email,
                    action: 'updated',
                },
            };
        }
    );*/

    fastify.post(
        '/delete',
        {
            preValidation: [fastify.authenticate],
        },
        async (request) => {
            const user = await redis.getUser(validator.escape(request.user.username));

            await redis.deleteUser(validator.escape(request.user.username));

            return {
                user: {
                    username: user.username,
                    action: 'deleted',
                },
            };
        }
    );
}

export default account;
